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
      <div className="flex max-w-7xl container h-[75px] items-center justify-between gap-2">
        <Link
          href="/"
          className={cn("text-4xl text-foreground hover:opacity-80 font-normal ml-4 mb-2 md:ml-0")}
        >
          diaty
        </Link>
        <NavBarCreds user={user} session={session}/>
      </div>
    </div>
  );
}
