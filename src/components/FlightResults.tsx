"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import {
  FlightTakeoff,
  FlightLand,
  AccessTime,
  Euro,
  Business,
} from "@mui/icons-material";
import { FormattedFlight } from "../lib/flight-formatter";

interface FlightResultProps {
  flight: FormattedFlight;
}

function FlightCard({ flight }: FlightResultProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Card
      sx={{
        mb: 2,
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with price and airline */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {flight.airline.logo && (
              <Avatar
                src={flight.airline.logo}
                alt={flight.airline.name}
                sx={{ width: 32, height: 32 }}
              />
            )}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {flight.airline.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.airline.code}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {flight.price.formatted}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {flight.totalDuration}
            </Typography>
          </Box>
        </Box>

        {/* Outbound flight */}
        <Box sx={{ mb: flight.return ? 2 : 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {flight.outbound.departure.city} → {flight.outbound.arrival.city}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {flight.outbound.stops === 0 ? (
                <Chip label="Direct" size="small" color="success" />
              ) : (
                <Chip label={`${flight.outbound.stops} stop(s)`} size="small" />
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Departure */}
            <Box sx={{ textAlign: "center", minWidth: 100 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {flight.outbound.departure.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.outbound.departure.code}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {flight.outbound.departure.date}
              </Typography>
            </Box>

            {/* Flight line */}
            <Box sx={{ flex: 1, textAlign: "center", px: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <FlightTakeoff sx={{ color: "text.secondary", fontSize: 16 }} />
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    bgcolor: "divider",
                    position: "relative",
                    mx: 1,
                  }}
                >
                  {flight.outbound.stops > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 6,
                        height: 6,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </Box>
                <FlightLand sx={{ color: "text.secondary", fontSize: 16 }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {flight.outbound.duration}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {flight.outbound.flightNumber}
              </Typography>
            </Box>

            {/* Arrival */}
            <Box sx={{ textAlign: "center", minWidth: 100 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {flight.outbound.arrival.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.outbound.arrival.code}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {flight.outbound.arrival.date}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Return flight */}
        {flight.return && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {flight.return.departure.city} → {flight.return.arrival.city}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {flight.return.stops === 0 ? (
                    <Chip label="Direct" size="small" color="success" />
                  ) : (
                    <Chip
                      label={`${flight.return.stops} stop(s)`}
                      size="small"
                    />
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {/* Departure */}
                <Box sx={{ textAlign: "center", minWidth: 100 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {flight.return.departure.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.return.departure.code}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {flight.return.departure.date}
                  </Typography>
                </Box>

                {/* Flight line */}
                <Box sx={{ flex: 1, textAlign: "center", px: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    <FlightTakeoff
                      sx={{ color: "text.secondary", fontSize: 16 }}
                    />
                    <Box
                      sx={{
                        flex: 1,
                        height: 2,
                        bgcolor: "divider",
                        position: "relative",
                        mx: 1,
                      }}
                    >
                      {flight.return.stops > 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 6,
                            height: 6,
                            bgcolor: "primary.main",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </Box>
                    <FlightLand
                      sx={{ color: "text.secondary", fontSize: 16 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {flight.return.duration}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {flight.return.flightNumber}
                  </Typography>
                </Box>

                {/* Arrival */}
                <Box sx={{ textAlign: "center", minWidth: 100 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {flight.return.arrival.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.return.arrival.code}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {flight.return.arrival.date}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        )}

        {/* Tags and buttons */}
        <Box sx={{ mt: 3 }}>
          {flight.tags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {flight.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.replace("_", " ")}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                  color={
                    tag.includes("cheapest")
                      ? "success"
                      : tag.includes("shortest")
                      ? "info"
                      : "default"
                  }
                />
              ))}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outlined" size="small">
              View Details
            </Button>
            <Button variant="contained" size="small">
              Select
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

interface FlightResultsProps {
  flights: FormattedFlight[];
  loading: boolean;
  searchParams: any;
  stats?: {
    cheapest: number;
    shortest: number;
    total: number;
  };
}

export function FlightResults({
  flights,
  loading,
  searchParams,
  stats,
}: FlightResultsProps) {
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6">Searching flights...</Typography>
      </Box>
    );
  }

  if (!flights.length) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Search Results
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {searchParams && (
              <>
                {searchParams.from} → {searchParams.to} •{" "}
                {searchParams.passengers} passenger(s)
              </>
            )}
          </Typography>

          {stats && (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip
                label={`${stats.total} flights found`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`From ${stats.cheapest.toLocaleString("en-US", {
                  style: "currency",
                  currency: "EUR",
                })}`}
                size="small"
                color="success"
              />
              <Chip
                label={`Shortest: ${Math.floor(stats.shortest / 60)}h ${
                  stats.shortest % 60
                }m`}
                size="small"
                color="info"
              />
            </Box>
          )}
        </Box>
      </Box>

      {flights.map((flight, index) => (
        <FlightCard key={flight.id || index} flight={flight} />
      ))}
    </Box>
  );
}
