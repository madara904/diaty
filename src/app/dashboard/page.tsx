import { signIn, auth, providerMap } from "@/auth"
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();
  const user =  session?.user;

  if (!user) {
    redirect("/sign-in")
  } 

  return (
    <div className="mt-12 text-3xl font-medium">Dashboard</div>
  )
}

export default Dashboard