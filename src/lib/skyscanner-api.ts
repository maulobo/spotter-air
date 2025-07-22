// SkyScanner API Configuration
export const SKYSCANNER_CONFIG = {
  baseURL: "https://sky-scrapper.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
    "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
    "Content-Type": "application/json",
  },
};

// Tipos para la API
export interface SearchParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  cabinClass: "economy" | "premium_economy" | "business" | "first";
  adults: number;
  sortBy:
    | "best"
    | "price_high"
    | "fastest"
    | "outbound_take_off_time"
    | "outbound_landing_time"
    | "return_take_off_time"
    | "return_landing_time";
  currency: string;
  market: string;
  countryCode: string;
}

export interface FlightOffer {
  id: string;
  price: {
    raw: number;
    formatted: string;
  };
  legs: Array<{
    origin: {
      name: string;
      displayCode: string;
    };
    destination: {
      name: string;
      displayCode: string;
    };
    departure: string;
    arrival: string;
    durationInMinutes: number;
    carriers: Array<{
      name: string;
      imageUrl: string;
    }>;
  }>;
}

export interface SearchResponse {
  status: boolean;
  data: {
    itineraries: FlightOffer[];
    filterStats: any;
  };
}
