"use server";

import { auth } from "@/auth";
import fetchPlan from "@/lib/fetch-user-plan";
import Settings from "./settings";
import fetchAvailablePlans from "@/lib/available-plans";
import { redirect } from "next/navigation";

const SettingsHome = async () => {

  const session = await auth();
  const user = session?.user || null;

  if (!user || !session){
    redirect("/sign-in")
}

  const plan = await fetchPlan(user) || null;
  const availablePlans = await fetchAvailablePlans();

  return (
    <>
      <h1 className="mt-24 text-4xl font-medium">Settings</h1>
      <Settings user={user} plan={plan} availablePlans={availablePlans} />
    </>
  );
};

export default SettingsHome;