"use client";

import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Popper,
  ClickAwayListener,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { FlightTakeoff, FlightLand } from "@mui/icons-material";
import { AirportService, Airport } from "../lib/airport-service";

interface AirportAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string, airport?: Airport) => void;
  icon?: "takeoff" | "landing";
  sx?: any;
}

export function AirportAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  icon,
  sx,
}: AirportAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Función debounced para buscar aeropuertos (asíncrona) - Más conservadora
  const debouncedSearch = debounce(async (query: string) => {
    if (query.length >= 3) {
      // Aumentamos a 3 caracteres mínimo
      setLoading(true);
      try {
        const results = await AirportService.searchAirports(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error searching airports:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }
  }, 800); // Aumentamos a 800ms para ser más conservadores

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setAnchorEl(event.target);

    // Llamar al debounced search solo si hay contenido
    if (newValue.trim()) {
      debouncedSearch(newValue.trim());
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
    }

    onChange(newValue);
  };

  const handleSuggestionClick = (airport: Airport) => {
    const displayValue = `${airport.city} (${airport.code})`;
    setInputValue(displayValue);
    onChange(displayValue, airport);
    setShowSuggestions(false);
    setSuggestions([]);
    setLoading(false);
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.target);
    // Si ya hay contenido, buscar automáticamente - pero solo si tiene 3+ caracteres
    if (inputValue.trim() && inputValue.length >= 3) {
      debouncedSearch(inputValue.trim());
    }
  };

  const getIcon = () => {
    if (icon === "takeoff")
      return <FlightTakeoff sx={{ color: "text.secondary" }} />;
    if (icon === "landing")
      return <FlightLand sx={{ color: "text.secondary" }} />;
    return null;
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative", ...sx }}>
        <TextField
          ref={inputRef}
          fullWidth
          label={label}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          InputProps={{
            startAdornment: getIcon() ? (
              <InputAdornment position="start">{getIcon()}</InputAdornment>
            ) : undefined,
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : undefined,
          }}
        />

        <Popper
          open={showSuggestions && suggestions.length > 0}
          anchorEl={anchorEl}
          placement="bottom-start"
          style={{ width: anchorEl?.clientWidth || "auto", zIndex: 1300 }}
        >
          <Paper elevation={3} sx={{ maxHeight: 300, overflow: "auto" }}>
            <List dense>
              {suggestions.map((airport) => (
                <ListItem
                  key={airport.code}
                  onClick={() => handleSuggestionClick(airport)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {airport.city}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          ({airport.code})
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {airport.name}
                        {airport.country && `, ${airport.country}`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Popper>

        {/* Loading indicator para mostrar que está buscando */}
        {loading && suggestions.length === 0 && showSuggestions && (
          <Popper
            open={true}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{ width: anchorEl?.clientWidth || "auto", zIndex: 1300 }}
          >
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Buscando aeropuertos...
                </Typography>
              </Box>
            </Paper>
          </Popper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
