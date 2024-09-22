"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/app/components/ui/Button";
import UserButton from "./UserButton";
import { User } from "next-auth";

interface NavBarCredsProps {
  user: User | null | undefined,
  session: any
}


export default function NavBarCreds( {user, session} : NavBarCredsProps  ) {


    return(
      <>
        <div className="m-3">
            {user && <UserButton user={user} />}
            {!user && session?.status !== "loading" && <SignInButton />}
        </div>
      </>
    );
    
}

function SignInButton () {
  return (
    <Link href={"/sign-in"} className={cn(buttonVariants(), "bg-gray-800 text-primary hover:bg-gray-600")}>Sign in</Link>
  )
}
