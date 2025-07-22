import { SKYSCANNER_CONFIG } from "./skyscanner-api";
import { AirportService } from "./airport-service";

type FullSearchParams = {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
  cabinClass: string;
  adults: number;
  sortBy: string;
  currency: string;
  market: string;
  countryCode: string;
  sessionId?: string;
};

const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${SKYSCANNER_CONFIG.baseURL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...SKYSCANNER_CONFIG.headers, ...options.headers },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("SkyScanner API Error:", error);
    throw error;
  }
};

const searchAirports = (query: string) => {
  return AirportService.searchAirports(query);
};

const fetchFlights = async (params: FullSearchParams) => {
  const sessionParams = new URLSearchParams({
    originSkyId: params.originSkyId,
    destinationSkyId: params.destinationSkyId,
    originEntityId: params.originEntityId,
    destinationEntityId: params.destinationEntityId,
    date: params.date,
    cabinClass: params.cabinClass,
    adults: params.adults.toString(),
    sortBy: params.sortBy,
    currency: params.currency,
    market: params.market,
    countryCode: params.countryCode,
  });

  if (params.returnDate) {
    sessionParams.append("returnDate", params.returnDate);
  }

  if (params.sessionId) {
    sessionParams.append("sessionId", params.sessionId);
  }

  try {
    const response = await makeRequest(
      `/api/v2/flights/searchFlights?${sessionParams.toString()}`,
      { method: "GET" }
    );
    return response;
  } catch (error) {
    console.error("❌ Error en performSearch:", error);
    throw error;
  }
};

const searchFlights = async (searchParams: {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
}) => {
  try {
    const fullParams: Omit<FullSearchParams, "sessionId"> = {
      originSkyId: "LOND",
      destinationSkyId: "NYCA",
      originEntityId: "27544008",
      destinationEntityId: "27537542",
      date: "2025-07-23",
      returnDate: "2025-07-27",
      cabinClass: "economy",
      adults: 1,
      sortBy: "best",
      currency: "USD",
      market: "en-US",
      countryCode: "US",
    };

    const initialResponse = await fetchFlights(fullParams);

    const sessionId = initialResponse?.data?.context?.sessionId;

    if (!sessionId) {
      console.error(JSON.stringify(initialResponse, null, 2));
      throw new Error("No API response or sessionId not found.");
    }
    console.log(` SessionId ${sessionId}`);

    console.log("Step 2, get results with sessionId");
    const finalResults = await fetchFlights({
      ...fullParams,
      sessionId,
    });

    return {
      status: true,
      data: finalResults.data,
    };
  } catch (error) {
    return { status: false, error: (error as Error).message };
  }
};

export const skyScanner = {
  searchAirports,
  searchFlights,
  fetchFlights,
};
