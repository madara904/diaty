import NavBarCreds from "./NavBarCreds";
import { auth } from "@/auth";

export default async function NavBar() {
  const session = await auth();
  const user = session?.user;

  return (
        <NavBarCreds user={user} session={session} />
  );
}