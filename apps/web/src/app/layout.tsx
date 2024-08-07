import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/Metadata";
import { globalFont } from "@/fonts/font";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import Footer from "@/components/Footer";

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${globalFont}`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
