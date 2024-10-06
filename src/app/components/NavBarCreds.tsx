"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/app/components/ui/Button";
import UserButton from "./UserButton";
import { User } from "next-auth";
import NotificationIcon from "./NotificationIcon";
import { useSideBarContext } from "../../lib/context/SideBarContext";
import React from "react";
import { ModeToggle } from "./theme-toggle";

interface NavBarCredsProps {
  user: User | null | undefined,
  session: any
}

export default function NavBarCreds({ user, session }: NavBarCredsProps) {
  const { isCollapsed } = useSideBarContext(); 

  return (
    <>
      <div className={cn("flex container h-16 items-center justify-between", !isCollapsed ? "max-w-7xl" : "max-w-8xl")}>
        <div className="flex justify-center w-full sm:block">
        <Link
          href="/"
          className={cn("text-4xl sm:text-4xl text-foreground hover:opacity-80 font-light")}
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
          <ModeToggle/>
        </div>
      </div>
    </>
  );
}

function SignInButton() {
  return (
    <Link href={"/sign-in"} className={cn(buttonVariants(), "bg-primary text-primary-foreground hover:bg-primary/90")}>Sign in</Link>
  )
}