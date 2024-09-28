import { signIn, auth, providerMap } from "@/auth"
import fetchPlan from "@/lib/fetch-user-plan";
import Overview from "./components/overview/Overview";
import checkFlag from "@/lib/check-completion-flag";
import { redirect } from "next/navigation";


const Dashboard = async () => {

  const session = await auth();
  const user = session?.user;


  const plan = await fetchPlan(user);

  const profileCompleted = await checkFlag(user)

  if (!profileCompleted) {
    redirect("/onboarding")
  }

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <>
      <Overview user={user} plan={plan} />
    </>
  )
}

export default Dashboard
