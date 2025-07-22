"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  FlightTakeoff,
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: "white", color: "text.primary" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FlightTakeoff sx={{ color: "primary.main", fontSize: 32 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            SpotterAir
          </Typography>
        </Box>

        {!isMobile ? (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button color="inherit" sx={{ textTransform: "none" }}>
              Flights
            </Button>

            <Button
              variant="outlined"
              startIcon={<AccountCircle />}
              sx={{ textTransform: "none", ml: 2 }}
            >
              Log In
            </Button>
          </Box>
        ) : (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Button
                  variant="outlined"
                  startIcon={<AccountCircle />}
                  sx={{ textTransform: "none", width: "100%" }}
                  fullWidth
                >
                  Log In
                </Button>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
