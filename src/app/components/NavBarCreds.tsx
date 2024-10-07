"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/app/components/ui/Button";
import UserButton from "./UserButton";
import { User } from "next-auth";
import { useSideBarContext } from "../../lib/context/SideBarContext";
import React, { useEffect, useState } from "react"; // Import useEffect and useState
import { ModeToggle } from "./theme-toggle";

interface NavBarCredsProps {
  user: User | null | undefined;
  session: any;
}

export default function NavBarCreds({ user, session }: NavBarCredsProps) {
  const { isCollapsed } = useSideBarContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); 
    };

    window.addEventListener("scroll", handleScroll); 

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={cn("fixed top-0 inset-x-0 bg-background z-20 border-b h-16 w-screen overflow-x-hidden",{ "backdrop-blur bg-background/80": isScrolled })}>
    <div
      className={cn(
        "flex container justify-between h-full items-center pb-1",
        !isCollapsed ? "max-w-7xl" : "max-w-8xl",
      )}
    >
      <div className="flex justify-center ml-8 sm:m-0">
        <Link
          href="/"
          className={cn("text-3xl sm:text-3xl text-foreground hover:opacity-80 font-light")}
        >
          diaty
        </Link>
      </div>
      <div className="flex justify-center items-center space-x-2">
        {user && (
          <>
            <UserButton user={user} />
          </>
        )}
        {!user && session?.status !== "loading" && <SignInButton />}
        <ModeToggle />
      </div>
    </div>
    </div>
  );
}

function SignInButton() {
  return (
    <Link href={"/sign-in"} className={cn(buttonVariants(), "bg-primary text-primary-foreground hover:bg-primary/90")}>
      Sign in
    </Link>
  );
}
