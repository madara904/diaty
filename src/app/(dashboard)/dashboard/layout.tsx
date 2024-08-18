import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { cn } from "@/lib/utils";
import NavBar from "@/components/(Navbar)/NavBar";
import Sidebar from "./components/Sidebar";

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
      <body className={cn("absolute inset-0 -z-10 size-full bg-white-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" ,inter.className)}>
      <SessionProvider>
      <NavBar />
      <div className="container mx-auto">
      <Sidebar />
          {children}
      </div>
      </SessionProvider>
      </body>
    </html>
  );
}

