import { FlightSearchForm } from "@/components/home/FlightSearchForm";
import { Header } from "@/components/home/Header";
import { Box, Container } from "@mui/material";
import React from "react";

export default function page() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <FlightSearchForm />
        </Container>
      </Box>
    </Box>
  );
}
