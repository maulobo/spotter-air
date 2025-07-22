"use client";

import { Box, Container } from "@mui/material";

import { FeaturedDeals } from "../components/home/FeaturedDeals";
import { FlightResults } from "../components/FlightResults";
import { useFlightSearchContext } from "../contexts/FlightSearchContext";
import { FlightSearchForm } from "@/components/home/FlightSearchForm";

export default function Home() {
  const { loading, results, searchParams } = useFlightSearchContext();

  return (
    <Box component="main" sx={{ flex: 1 }}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <FlightSearchForm />
        <FlightResults
          flights={results}
          loading={loading}
          searchParams={searchParams}
        />

        {/* Show featured deals only if no results */}
        {!results.length && !loading && <FeaturedDeals />}
      </Container>
    </Box>
  );
}
