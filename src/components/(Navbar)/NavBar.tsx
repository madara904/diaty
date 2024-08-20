"use client"

import Link from "next/link";
import { Ephesis, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import NavBarCreds from "./NavBarCreds";

const ephesis = Ephesis({
  weight: "400",
  subsets: ["latin"]
})

export const inter = Inter({
  weight: "200",
  subsets: ["latin"],
  style: "normal"
})


export default function NavBar() {

    const [showBackground, setShowBackground] = useState(false)

    const TOP_OFFSET = 5;

  
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY >= TOP_OFFSET) {
          setShowBackground(true)
        } else {
          setShowBackground(false)
        }
      }
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      }
    }, []);

    return (
        <>
        <div className={`fixed top-0 inset-x-0 w-screen ${!showBackground ? "bg-white"  : "backdrop-blur bg-white/90"} border-b border-zinc-300 z-[10] shadow-sm`}>
          <div className="container h-[75px] mx-auto flex items-center justify-between gap-2">
         <Link href={"/"} className={cn("text-4xl text-foreground hover:opacity-80 font-normal ml-4 mb-2 md:ml-0", inter.className)}>diaty</Link>
        <NavBarCreds />
      </div>
        </div>
        </>
    );
  }