"use client";
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

export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
