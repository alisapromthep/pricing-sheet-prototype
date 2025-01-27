import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GoogleSheetsProvider } from "@/lib/context/GoogleSheetsContext";
import { PricingProvider } from "@/lib/context/PricingContext";
import { AllProductsProvider } from "@/lib/context/AllProductsContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pricing Tool",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleSheetsProvider>
        <PricingProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </body>
        </PricingProvider>
      </GoogleSheetsProvider>
    </html>
  );
}
