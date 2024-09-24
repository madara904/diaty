import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/(index)/globals.css";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { SideBarProvider } from "@/lib/context/SideBarContext";

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
      <body className={cn("flex flex-col min-h-screen", inter.className)}>
        <SessionProvider>
          <SideBarProvider>
          <NavBar />
          <main className="flex-1 container max-w-7xl mx-auto pt-24 antialiased light">
            {children}
          </main>
          <Footer />
          </SideBarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
