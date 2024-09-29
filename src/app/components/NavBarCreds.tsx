"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/app/components/ui/Button";
import UserButton from "./UserButton";
import { User } from "next-auth";
import NotificationIcon from "./NotificationIcon";
import { useSideBarContext } from "../../lib/context/SideBarContext";

interface NavBarCredsProps {
  user: User | null | undefined,
  session: any
}


export default function NavBarCreds( {user, session} : NavBarCredsProps  ) {
  
    const { isCollapsed } = useSideBarContext(); 

    return(
      <>
            <div className={cn("flex container h-[65px] items-center justify-between", !isCollapsed ? "max-w-7xl" : "max-w-8xl")}>
        <Link
          href="/"
          className={cn("text-3xl sm:text-4xl text-foreground hover:opacity-80 font-normal ml-4 mb-2 md:ml-0")}
        >
          diaty
        </Link>
        <div className="flex justify-center items-center gap-3 m-3">
            {user && <><UserButton user={user} /><NotificationIcon /></>}
            {!user && session?.status !== "loading" && <SignInButton />}
        </div>
        </div>
      </>
    );
    
}

function SignInButton () {
  return (
    <Link href={"/sign-in"} className={cn(buttonVariants(), "bg-gray-800 text-primary hover:bg-gray-600")}>Sign in</Link>
  )
}
