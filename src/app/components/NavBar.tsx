import Link from "next/link";
import { cn } from "@/lib/utils";
import NavBarCreds from "./NavBarCreds";
import { auth } from "@/auth";


export default async function NavBar() {
  const session = await auth();
  const user = session?.user;

  return (
    <div
      className="fixed top-0 inset-x-0 bg-white backdrop-blur bg-white/90 border-b border-zinc-300 z-[10] shadow-sm w-screen"
    >

        <div className="flex items-center">
        <NavBarCreds user={user} session={session}/>
        </div>
      </div>
  );
}
