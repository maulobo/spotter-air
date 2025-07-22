"use client";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { FlightTakeoff, LocalOffer } from "@mui/icons-material";

const featuredDeals = [
  {
    id: 1,
    destination: "Barcelona",
    country: "Spain",
    price: "€89",
    originalPrice: "€159",
    discount: "44%",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80",
    airline: "Vueling",
    duration: "2h 15m",
  },
  {
    id: 2,
    destination: "Paris",
    country: "France",
    price: "€124",
    originalPrice: "€189",
    discount: "34%",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    airline: "Air France",
    duration: "2h 45m",
  },
  {
    id: 3,
    destination: "London",
    country: "United Kingdom",
    price: "€98",
    originalPrice: "€145",
    discount: "32%",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80",
    airline: "British Airways",
    duration: "2h 30m",
  },
  {
    id: 4,
    destination: "Amsterdam",
    country: "Netherlands",
    price: "€79",
    originalPrice: "€129",
    discount: "39%",
    image:
      "https://images.unsplash.com/photo-1459679749680-18eb1eb37418?auto=format&fit=crop&w=400&q=80",
    airline: "KLM",
    duration: "2h 20m",
  },
];

export function FeaturedDeals() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6, mb: 4, px: 2 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Featured Deals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover the best prices for popular destinations
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {featuredDeals.map((deal) => (
          <Card
            key={deal.id}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={deal.image}
              alt={deal.destination}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 600 }}
                  >
                    {deal.destination}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {deal.country}
                  </Typography>
                </Box>
                <Chip
                  label={`-${deal.discount}`}
                  color="error"
                  size="small"
                  icon={<LocalOffer />}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {deal.airline} • {deal.duration}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h5"
                    component="span"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {deal.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary",
                    }}
                  >
                    {deal.originalPrice}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={<FlightTakeoff />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            textTransform: "none",
            px: 4,
            py: 1.5,
          }}
        >
          Get All Deals
        </Button>
      </Box>
    </Box>
  );
}
