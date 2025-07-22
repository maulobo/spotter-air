export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  fullName: string;
  skyId?: string;
  entityId?: string;
}

// Respuesta de la API de SkyScanner para búsqueda de aeropuertos
interface SkyApiAirportResponse {
  status: boolean;
  timestamp: number;
  data: Array<{
    skyId: string;
    entityId: string;
    presentation: {
      title: string;
      suggestionTitle: string;
      subtitle: string;
    };
    navigation: {
      entityId: string;
      entityType: string;
      localizedName: string;
      relevantFlightParams: {
        skyId: string;
        entityId: string;
        flightPlaceType: string;
        localizedName: string;
      };
    };
  }>;
}

// Cache para evitar llamadas repetitivas a la API
const airportCache = new Map<string, Airport[]>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos (más tiempo)
const cacheTimestamps = new Map<string, number>();

// Control de rate limiting más agresivo
let lastApiCall = 0;
const MIN_API_INTERVAL = 2000; // 2 segundos entre llamadas
let apiCallCount = 0;
const MAX_API_CALLS_PER_HOUR = 50; // Límite conservador
let hourlyResetTime = Date.now() + 60 * 60 * 1000;

// Datos locales de aeropuertos principales (fallback)
const AIRPORTS_DATA: Airport[] = [
  {
    code: "EZE",
    name: "Aeropuerto Internacional Ezeiza",
    city: "Buenos Aires",
    country: "Argentina",
    fullName: "Aeropuerto Internacional Ministro Pistarini",
    skyId: "EZE",
    entityId: "95565041",
  },
  {
    code: "AEP",
    name: "Aeropuerto Jorge Newbery",
    city: "Buenos Aires",
    country: "Argentina",
    fullName: "Aeropuerto Jorge Newbery Airfield",
    skyId: "AEP",
    entityId: "95565042",
  },
  {
    code: "COR",
    name: "Aeropuerto Córdoba",
    city: "Córdoba",
    country: "Argentina",
    fullName:
      "Aeropuerto Internacional Ingeniero Aeronáutico Ambrosio Taravella",
    skyId: "COR",
    entityId: "95565043",
  },
  {
    code: "MDZ",
    name: "Aeropuerto Mendoza",
    city: "Mendoza",
    country: "Argentina",
    fullName: "Aeropuerto Internacional Governor Francisco Gabrielli",
    skyId: "MDZ",
    entityId: "95565044",
  },
  {
    code: "BRC",
    name: "Aeropuerto Bariloche",
    city: "Bariloche",
    country: "Argentina",
    fullName: "Aeropuerto Teniente Luis Candelaria",
    skyId: "BRC",
    entityId: "95565045",
  },
  {
    code: "SLA",
    name: "Aeropuerto Salta",
    city: "Salta",
    country: "Argentina",
    fullName: "Aeropuerto Internacional Martín Miguel de Güemes",
    skyId: "SLA",
    entityId: "95565046",
  },
  {
    code: "IGU",
    name: "Aeropuerto Iguazú",
    city: "Iguazú",
    country: "Argentina",
    fullName: "Aeropuerto Internacional Cataratas del Iguazú",
    skyId: "IGU",
    entityId: "95565047",
  },
  {
    code: "USH",
    name: "Aeropuerto Ushuaia",
    city: "Ushuaia",
    country: "Argentina",
    fullName: "Aeropuerto Internacional Malvinas Argentinas",
    skyId: "USH",
    entityId: "95565048",
  },

  // Brasil
  {
    code: "GRU",
    name: "Aeroporto de Guarulhos",
    city: "São Paulo",
    country: "Brasil",
    fullName: "Aeroporto Internacional de São Paulo-Guarulhos",
    skyId: "GRU",
    entityId: "95673406",
  },
  {
    code: "CGH",
    name: "Aeroporto de Congonhas",
    city: "São Paulo",
    country: "Brasil",
    fullName: "Aeroporto de São Paulo-Congonhas",
    skyId: "CGH",
    entityId: "95673407",
  },
  {
    code: "GIG",
    name: "Aeroporto do Galeão",
    city: "Rio de Janeiro",
    country: "Brasil",
    fullName: "Aeroporto Internacional do Rio de Janeiro-Galeão",
    skyId: "GIG",
    entityId: "95673408",
  },
  {
    code: "SDU",
    name: "Aeroporto Santos Dumont",
    city: "Rio de Janeiro",
    country: "Brasil",
    fullName: "Aeroporto Santos Dumont",
    skyId: "SDU",
    entityId: "95673409",
  },
  {
    code: "BSB",
    name: "Aeroporto de Brasília",
    city: "Brasília",
    country: "Brasil",
    fullName: "Aeroporto Internacional de Brasília",
    skyId: "BSB",
    entityId: "95673410",
  },

  // Chile
  {
    code: "SCL",
    name: "Aeropuerto de Santiago",
    city: "Santiago",
    country: "Chile",
    fullName: "Aeropuerto Internacional Arturo Merino Benítez",
    skyId: "SCL",
    entityId: "95565049",
  },

  // Estados Unidos
  {
    code: "LAX",
    name: "Los Angeles International",
    city: "Los Angeles",
    country: "Estados Unidos",
    fullName: "Los Angeles International Airport",
    skyId: "LAX",
    entityId: "95565050",
  },
  {
    code: "JFK",
    name: "John F. Kennedy International",
    city: "New York",
    country: "Estados Unidos",
    fullName: "John F. Kennedy International Airport",
    skyId: "JFK",
    entityId: "95565051",
  },
  {
    code: "MIA",
    name: "Miami International",
    city: "Miami",
    country: "Estados Unidos",
    fullName: "Miami International Airport",
    skyId: "MIA",
    entityId: "95565052",
  },

  // España
  {
    code: "MAD",
    name: "Aeropuerto de Madrid-Barajas",
    city: "Madrid",
    country: "España",
    fullName: "Aeropuerto Adolfo Suárez Madrid-Barajas",
    skyId: "MAD",
    entityId: "95565077",
  },
  {
    code: "BCN",
    name: "Aeropuerto de Barcelona-El Prat",
    city: "Barcelona",
    country: "España",
    fullName: "Aeropuerto Josep Tarradellas Barcelona-El Prat",
    skyId: "BCN",
    entityId: "95565078",
  },

  // Francia
  {
    code: "CDG",
    name: "Aéroport Paris-Charles de Gaulle",
    city: "París",
    country: "Francia",
    fullName: "Aéroport Paris-Charles de Gaulle",
    skyId: "CDG",
    entityId: "95565079",
  },
  {
    code: "ORY",
    name: "Aéroport Paris-Orly",
    city: "París",
    country: "Francia",
    fullName: "Aéroport Paris-Orly",
    skyId: "ORY",
    entityId: "95565080",
  },

  // Reino Unido
  {
    code: "LHR",
    name: "London Heathrow",
    city: "Londres",
    country: "Reino Unido",
    fullName: "London Heathrow Airport",
    skyId: "LHR",
    entityId: "95565081",
  },
  {
    code: "LGW",
    name: "London Gatwick",
    city: "Londres",
    country: "Reino Unido",
    fullName: "London Gatwick Airport",
    skyId: "LGW",
    entityId: "95565082",
  },
];

export class AirportService {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
  private static readonly BASE_URL = "https://sky-scrapper.p.rapidapi.com";
  private static readonly FORCE_LOCAL_ONLY =
    process.env.NEXT_PUBLIC_FORCE_LOCAL_ONLY === "true" || true;

  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "");
  }

  // Buscar aeropuertos usando la API de SkyScanner
  private static async searchAirportsAPI(query: string): Promise<Airport[]> {
    const now = Date.now();

    // Reset del contador cada hora
    if (now > hourlyResetTime) {
      apiCallCount = 0;
      hourlyResetTime = now + 60 * 60 * 1000;
    }

    if (now - lastApiCall < MIN_API_INTERVAL) {
      console.warn("⚠️ Llamada muy frecuente, usando datos locales");
      return this.searchAirportsLocal(query);
    }

    if (!this.API_KEY || this.API_KEY === "your_rapidapi_key_here") {
      console.warn("⚠️ RapidAPI key no configurada, usando datos locales");
      return this.searchAirportsLocal(query);
    }

    try {
      lastApiCall = now;
      apiCallCount++;

      const response = await fetch(
        `${
          this.BASE_URL
        }/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": this.API_KEY,
            "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          console.warn("⚠️ Rate limit alcanzado (429), usando datos locales");
          // Aumentar el intervalo para la próxima llamada
          lastApiCall = now + 10000; // 10 segundos extra
          return this.searchAirportsLocal(query);
        }
        if (response.status === 403) {
          console.warn(
            "⚠️ API key inválida o sin permisos, usando datos locales"
          );
          return this.searchAirportsLocal(query);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SkyApiAirportResponse = await response.json();

      if (!data.status || !data.data) {
        throw new Error("Respuesta inválida de la API");
      }

      // Convertir datos de SkyScanner al formato Airport
      const airports: Airport[] = data.data
        .filter((item) => item.navigation.entityType === "AIRPORT")
        .map((item) => ({
          code: item.skyId,
          name: item.navigation.localizedName,
          city: item.presentation.title,
          country: item.presentation.subtitle,
          fullName: item.presentation.suggestionTitle,
          skyId: item.skyId,
          entityId: item.entityId,
        }))
        .slice(0, 8); // Limitar a 8 resultados

      console.log(
        `✅ API call successful (${apiCallCount}/${MAX_API_CALLS_PER_HOUR} used)`
      );
      return airports;
    } catch (error) {
      console.error("Error en la API de SkyScanner:", error);
      // Penalizar con un delay más largo
      lastApiCall = now + 5000; // 5 segundos extra
      // Fallback a datos locales
      return this.searchAirportsLocal(query);
    }
  }

  // Búsqueda local (fallback)
  private static searchAirportsLocal(query: string): Airport[] {
    if (!query || query.length < 2) {
      return [];
    }

    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery
      .split(" ")
      .filter((word) => word.length > 0);

    return AIRPORTS_DATA.filter((airport) => {
      const normalizedCity = this.normalizeText(airport.city);
      const normalizedName = this.normalizeText(airport.name);
      const normalizedCountry = this.normalizeText(airport.country);
      const normalizedCode = this.normalizeText(airport.code);
      const normalizedFullName = this.normalizeText(airport.fullName);

      // Búsqueda por código exacto (prioritaria)
      if (normalizedCode.includes(normalizedQuery)) {
        return true;
      }

      // Búsqueda por ciudad
      if (normalizedCity.includes(normalizedQuery)) {
        return true;
      }

      // Búsqueda por nombre del aeropuerto
      if (
        normalizedName.includes(normalizedQuery) ||
        normalizedFullName.includes(normalizedQuery)
      ) {
        return true;
      }

      // Búsqueda por país
      if (normalizedCountry.includes(normalizedQuery)) {
        return true;
      }

      // Búsqueda por palabras individuales
      return queryWords.some(
        (word) =>
          normalizedCity.includes(word) ||
          normalizedName.includes(word) ||
          normalizedCountry.includes(word) ||
          normalizedCode.includes(word) ||
          normalizedFullName.includes(word)
      );
    }).slice(0, 8);
  }

  // Método principal con cache inteligente
  static async searchAirports(query: string): Promise<Airport[]> {
    if (!query || query.length < 3) {
      // Cambiamos a 3 caracteres mínimo
      return [];
    }

    const cacheKey = this.normalizeText(query);
    const now = Date.now();

    // Verificar si tenemos datos en cache y son recientes
    if (airportCache.has(cacheKey)) {
      const cacheTime = cacheTimestamps.get(cacheKey) || 0;
      if (now - cacheTime < CACHE_DURATION) {
        return airportCache.get(cacheKey) || [];
      }
    }

    // Si está en modo solo local, usar solo datos locales
    if (this.FORCE_LOCAL_ONLY) {
      console.log("🔧 Modo solo local activado, usando datos locales");
      const results = this.searchAirportsLocal(query);
      // Guardar en cache
      airportCache.set(cacheKey, results);
      cacheTimestamps.set(cacheKey, now);
      return results;
    }

    try {
      // Intentar API solo si no está forzado el modo local
      const results = await this.searchAirportsAPI(query);

      // Guardar en cache
      airportCache.set(cacheKey, results);
      cacheTimestamps.set(cacheKey, now);

      return results;
    } catch (error) {
      console.error("Error en búsqueda de aeropuertos:", error);
      // Fallback final a datos locales
      const results = this.searchAirportsLocal(query);
      airportCache.set(cacheKey, results);
      cacheTimestamps.set(cacheKey, now);
      return results;
    }
  }

  static getAirportByCode(code: string): Airport | undefined {
    return AIRPORTS_DATA.find(
      (airport) => airport.code.toLowerCase() === code.toLowerCase()
    );
  }

  static getAllAirports(): Airport[] {
    return [...AIRPORTS_DATA];
  }

  static clearCache(): void {
    airportCache.clear();
    cacheTimestamps.clear();
  }
}
