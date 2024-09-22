import { signIn, auth, providerMap } from "@/auth"
import  fetchPlan  from "@/lib/fetch-user-plan";
import  Overview  from "./components/overview/Overview";



const Dashboard = async () => {
  
  const session = await auth();
  const user =  session?.user;


  const plan = await fetchPlan(user);

 /* if (!user) {
    redirect("/sign-in")
  } 
*/
  return (
    <>
    <Overview user={user} plan={plan}/>
    </> 
  )
}

export default Dashboard
