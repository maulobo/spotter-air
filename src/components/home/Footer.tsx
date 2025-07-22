"use client";

import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  useTheme,
} from "@mui/material";
import { FlightTakeoff } from "@mui/icons-material";

export function Footer() {
  return (
    <Box sx={{ bgcolor: "grey.100", mt: 8, py: 6 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FlightTakeoff sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                SpotterAir
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your go-to platform for flight deals and travel insights.
            </Typography>
          </Box>

          {/* Enlaces rápidos */}
          <Box sx={{ flex: 1, display: "flex", gap: 4 }}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Services
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Link href="#" color="text.secondary" underline="hover">
                  Search flights
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Special offers
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Last minute
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Groups
                </Link>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Ayuda
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Link href="#" color="text.secondary" underline="hover">
                  help center
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Contact
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  FAQs
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Policies
                </Link>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Link href="#" color="text.secondary" underline="hover">
                  About us
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Press
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Careers
                </Link>
                <Link href="#" color="text.secondary" underline="hover">
                  Investors
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 SpotterAir. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="#" color="text.secondary" underline="hover">
              Privacy
            </Link>
            <Link href="#" color="text.secondary" underline="hover">
              Terms
            </Link>
            <Link href="#" color="text.secondary" underline="hover">
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
