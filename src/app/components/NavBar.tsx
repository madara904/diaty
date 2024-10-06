import NavBarCreds from "./NavBarCreds";
import { auth } from "@/auth";

export default async function NavBar() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="fixed top-0 inset-x-0 bg-background/90 backdrop-blur border-b border-border shadow-sm w-screen h-[65px] z-20">
        <NavBarCreds user={user} session={session} />
    </div>
  );
}