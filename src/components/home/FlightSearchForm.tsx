"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Search, SwapHoriz } from "@mui/icons-material";
import { AirportAutocomplete } from "../AirportAutocomplete";
import { useFlightSearchContext } from "../../contexts/FlightSearchContext";

export function FlightSearchForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { searchFlights, loading } = useFlightSearchContext();

  const [tripType, setTripType] = useState("round-trip");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [selectedFromAirport, setSelectedFromAirport] = useState<any>(null);
  const [selectedToAirport, setSelectedToAirport] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState<
    "economy" | "premium_economy" | "business" | "first"
  >("economy");
  const [directFlights, setDirectFlights] = useState(false);

  const swapCities = () => {
    const tempCity = fromCity;
    const tempAirport = selectedFromAirport;

    setFromCity(toCity);
    setToCity(tempCity);
    setSelectedFromAirport(selectedToAirport);
    setSelectedToAirport(tempAirport);
  };

  const handleFromChange = (value: string, airport?: any) => {
    setFromCity(value);
    setSelectedFromAirport(airport);
  };

  const handleToChange = (value: string, airport?: any) => {
    setToCity(value);
    setSelectedToAirport(airport);
  };

  // Function to handle search
  const handleSearch = () => {
    if (!fromCity) {
      alert("Please enter the origin city");
      return;
    }
    if (!toCity) {
      alert("Please enter the destination city");
      return;
    }
    if (!departureDate) {
      alert("Please select the departure date");
      return;
    }
    if (tripType === "round-trip" && !returnDate) {
      alert("Please select the return date");
      return;
    }

    const searchParams = {
      from: selectedFromAirport?.code || fromCity,
      to: selectedToAirport?.code || toCity,
      departureDate,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      passengers,
      cabinClass: travelClass,
    };

    searchFlights(searchParams);
  };

  return (
    <Card
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: -6,
        mb: 4,
        zIndex: 10,
        position: "relative",
        boxShadow: theme.shadows[8],
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
        {/* Trip Type Selector */}
        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={tripType}
            exclusive
            onChange={(_, value) => value && setTripType(value)}
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="one-way">One Way</ToggleButton>
            <ToggleButton value="round-trip">Round Trip</ToggleButton>
            <ToggleButton value="multi-city">Multi-City</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
          }}
        >
          {/* Row 1: From and To */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr auto 1fr" },
              gap: 2,
              alignItems: "end",
            }}
          >
            <AirportAutocomplete
              label="From"
              value={fromCity}
              onChange={handleFromChange}
              placeholder="Origin city"
            />

            <Button
              onClick={swapCities}
              sx={{
                minWidth: 48,
                height: 48,
                borderRadius: "50%",
                alignSelf: "center",
              }}
            >
              <SwapHoriz />
            </Button>

            <AirportAutocomplete
              label="To"
              value={toCity}
              onChange={handleToChange}
              placeholder="Destination city"
            />
          </Box>

          {/* Row 2: Dates */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Departure Date"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            {tripType === "round-trip" && (
              <TextField
                label="Return Date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            )}
          </Box>

          {/* Row 3: Passengers and Class */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Passengers</InputLabel>
              <Select
                value={passengers}
                label="Passengers"
                onChange={(e) => setPassengers(e.target.value as number)}
              >
                <MenuItem value={1}>1 passenger</MenuItem>
                <MenuItem value={2}>2 passengers</MenuItem>
                <MenuItem value={3}>3 passengers</MenuItem>
                <MenuItem value={4}>4 passengers</MenuItem>
                <MenuItem value={5}>5 passengers</MenuItem>
                <MenuItem value={6}>6+ passengers</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Class</InputLabel>
              <Select
                value={travelClass}
                label="Class"
                onChange={(e) => setTravelClass(e.target.value)}
              >
                <MenuItem value="economy">Economy</MenuItem>
                <MenuItem value="premium_economy">Premium Economy</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="first">First Class</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Additional Options and Search Button */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={directFlights}
                onChange={(e) => setDirectFlights(e.target.checked)}
              />
            }
            label="Direct flights only"
          />

          <Button
            variant="contained"
            size="large"
            startIcon={<Search />}
            onClick={handleSearch}
            disabled={loading}
            sx={{
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            {loading ? "Searching..." : "Search Flights"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
