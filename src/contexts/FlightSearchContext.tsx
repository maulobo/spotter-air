"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { skyScanner } from "../lib/skyscanner-client";
import {
  formatFlightResults,
  getFlightStats,
  FormattedFlight,
} from "../lib/flight-formatter";

interface FlightSearchParams {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
}

interface FlightSearchState {
  loading: boolean;
  results: FormattedFlight[];
  rawResults: any; // Para debug
  stats: any;
  error: string | null;
  searchParams: FlightSearchParams | null;
}

interface FlightSearchContextType extends FlightSearchState {
  searchFlights: (params: FlightSearchParams) => Promise<void>;
  clearResults: () => void;
}

const FlightSearchContext = createContext<FlightSearchContextType | undefined>(
  undefined
);

interface FlightSearchProviderProps {
  children: ReactNode;
}

export function FlightSearchProvider({ children }: FlightSearchProviderProps) {
  const [state, setState] = useState<FlightSearchState>({
    loading: false,
    results: [],
    rawResults: null,
    stats: null,
    error: null,
    searchParams: null,
  });

  const searchFlights = useCallback(async (params: FlightSearchParams) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      searchParams: params,
    }));

    try {
      const result = await skyScanner.searchFlights(params);
      console.log("result context", result);

      if (result.status) {
        // Formatear los resultados usando nuestras utilidades
        const formattedResults = formatFlightResults(result);
        const stats = getFlightStats(result);

        setState((prev) => ({
          ...prev,
          loading: false,
          results: formattedResults,
          rawResults: result, // Mantener datos raw para debug
          stats: stats,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          results: [],
          rawResults: null,
          stats: null,
          error: "Error en la búsqueda",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        results: [],
        rawResults: null,
        stats: null,
        error: error instanceof Error ? error.message : "Error desconocido",
      }));
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({
      loading: false,
      results: [],
      rawResults: null,
      stats: null,
      error: null,
      searchParams: null,
    });
  }, []);

  const value: FlightSearchContextType = {
    ...state,
    searchFlights,
    clearResults,
  };

  return (
    <FlightSearchContext.Provider value={value}>
      {children}
    </FlightSearchContext.Provider>
  );
}

export function useFlightSearchContext() {
  const context = useContext(FlightSearchContext);
  if (context === undefined) {
    throw new Error(
      "useFlightSearchContext must be used within a FlightSearchProvider"
    );
  }
  return context;
}
