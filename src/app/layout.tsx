import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import NavBar from "@/components/(Navbar)/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "diaty - proper tracking your intakes!",
  description: "For those who want to make a change!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("bg-back", inter.className)}>
      {/* Need to apply styles for body in a child div to avoid shifting of layout
       cuz shadcn is ein hurensohn amk*/}
       <SessionProvider>
        <NavBar />
        <div className="container max-w-7xl mx-auto pt-32 min-h-96 sm:min-h-screen antialiased light">
          {children}
        </div>
      <Footer />
      </SessionProvider>
      </body>
    </html>
  );
}
