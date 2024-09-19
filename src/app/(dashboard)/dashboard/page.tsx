import { signIn, auth, providerMap } from "@/auth"
import Home from ".";
import { Overview } from "./components/Overview";


const Dashboard = async () => {
  

  const session = await auth();
  const user =  session?.user;

 /* if (!user) {
    redirect("/sign-in")
  } 
*/
  return (
    <>
    <Overview />
    </> 
  )
}

export default Dashboard
