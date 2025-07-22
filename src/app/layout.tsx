import type { Metadata } from "next";
import ThemeRegistry from "../theme/ThemeRegistry";
import { FlightSearchProvider } from "../contexts/FlightSearchContext";
import "./globals.css";
import { Header } from "../components/home/Header";
import { Footer } from "../components/home/Footer";

export const metadata: Metadata = {
  title: "SpotterAir - Find your perfect flight",
  description: "Compare flight prices and find the best deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ThemeRegistry>
          <FlightSearchProvider>
            <Header />
            {children}
            <Footer />
          </FlightSearchProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
