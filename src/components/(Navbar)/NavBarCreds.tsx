import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/Button";
import { auth, signIn } from "@/auth";
import UserButton from "./UserButton";
import { useSession } from "next-auth/react";



export default function NavBarCreds() {

  const session = useSession();
  const user = session.data?.user;

    return(
      <>
        <div className="pt-2 m-2">
            {user && <UserButton user={user} />}
            {!user && session.status !== "loading" && <SignInButton />}
        </div>
      </>
    );
    
}

function SignInButton () {
  return (
    <Link href={"/sign-in"} className={cn(buttonVariants(), "bg-gray-800 text-primary hover:bg-gray-600")}>Sign in</Link>
  )
}
