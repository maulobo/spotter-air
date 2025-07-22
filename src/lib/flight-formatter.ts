// Utilidades para formatear los datos de vuelos de SkyScanner

export interface FormattedFlight {
  id: string;
  price: {
    amount: number;
    formatted: string;
  };
  outbound: FormattedLeg;
  return?: FormattedLeg;
  totalDuration: string;
  airline: {
    name: string;
    logo: string;
    code: string;
  };
  stops: number;
  tags: string[];
}

export interface FormattedLeg {
  departure: {
    airport: string;
    city: string;
    code: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    code: string;
    time: string;
    date: string;
  };
  duration: string;
  flightNumber: string;
  airline: {
    name: string;
    code: string;
  };
  stops: number;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatDateTime(isoString: string): { time: string; date: string } {
  const date = new Date(isoString);
  const time = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
  });
  return { time, date: dateStr };
}

// Función para formatear un leg individual
function formatLeg(leg: any): FormattedLeg {
  const departure = formatDateTime(leg.departure);
  const arrival = formatDateTime(leg.arrival);

  return {
    departure: {
      airport: leg.origin.name,
      city: leg.origin.city,
      code: leg.origin.displayCode,
      time: departure.time,
      date: departure.date,
    },
    arrival: {
      airport: leg.destination.name,
      city: leg.destination.city,
      code: leg.destination.displayCode,
      time: arrival.time,
      date: arrival.date,
    },
    duration: formatDuration(leg.durationInMinutes),
    flightNumber: leg.segments[0]?.flightNumber || "",
    airline: {
      name: leg.carriers.marketing[0]?.name || "",
      code: leg.carriers.marketing[0]?.alternateId || "",
    },
    stops: leg.stopCount,
  };
}

// Función principal para formatear resultados de vuelos
export function formatFlightResults(apiResponse: any): FormattedFlight[] {
  if (!apiResponse?.data?.itineraries) {
    return [];
  }

  return apiResponse.data.itineraries.map((itinerary: any) => {
    const outbound = formatLeg(itinerary.legs[0]);
    const returnLeg = itinerary.legs[1]
      ? formatLeg(itinerary.legs[1])
      : undefined;

    const totalMinutes = itinerary.legs.reduce(
      (total: number, leg: any) => total + leg.durationInMinutes,
      0
    );

    // Obtener información de la aerolínea principal
    const mainCarrier = itinerary.legs[0].carriers.marketing[0];

    return {
      id: itinerary.id,
      price: {
        amount: itinerary.price.raw,
        formatted: itinerary.price.formatted,
      },
      outbound,
      return: returnLeg,
      totalDuration: formatDuration(totalMinutes),
      airline: {
        name: mainCarrier?.name || "",
        logo: mainCarrier?.logoUrl || "",
        code: mainCarrier?.alternateId || "",
      },
      stops: Math.max(...itinerary.legs.map((leg: any) => leg.stopCount)),
      tags: itinerary.tags || [],
    };
  });
}

export function getFlightStats(apiResponse: any) {
  if (!apiResponse?.data?.filterStats) {
    return null;
  }

  const stats = apiResponse.data.filterStats;
  return {
    totalResults: stats.total,
    priceRange: {
      min: stats.stopPrices?.direct?.rawPrice || 0,
      minFormatted: stats.stopPrices?.direct?.formattedPrice || "",
    },
    durationRange: {
      min: formatDuration(stats.duration.min),
      max: formatDuration(stats.duration.max),
    },
    airlines:
      stats.carriers?.map((carrier: any) => ({
        name: carrier.name,
        code: carrier.alternateId,
        logo: carrier.logoUrl,
        minPrice: carrier.minPrice,
      })) || [],
    airports: {
      origin: stats.airports[0],
      destination: stats.airports[1],
    },
  };
}
