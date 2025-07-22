import { AirportService } from "./airport-service";
import { SKYSCANNER_CONFIG } from "./skyscanner-api";

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

class SkyScanner {
  private async makerequest(endpoint: string, options: RequestInit = {}) {
    const url = `${SKYSCANNER_CONFIG.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        ...options,
        headers: { ...SKYSCANNER_CONFIG.headers, ...options.headers },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  async serchAirports(query: string) {
    return AirportService.searchAirports(query);
  }

  async fetchFlyghts(params: FullSearchParams) {
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
      const resp = await this.makerequest(
        `/api/v2/flights/searchFlights?${sessionParams.toString()}`
      );
      return resp;
    } catch (error) {
      console.error(`error to fetch flights: ${error}`);
    }
  }
}
