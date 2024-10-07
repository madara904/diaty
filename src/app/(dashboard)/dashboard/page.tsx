import { auth } from "@/auth"
import fetchPlan from "@/lib/fetch-user-plan";
import Overview from "./components/overview/Overview";
import checkFlag from "@/lib/check-completion-flag";
import { redirect } from "next/navigation";
import React from "react";
import { fetchNutritionData } from "@/lib/fetch-nutrition.data";

const Dashboard = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user || !session) {
    redirect("/sign-in")
  }
  
  const plan = await fetchPlan(user);
  const profileCompleted = await checkFlag(user)

  if (!profileCompleted) {
    redirect("/onboarding")
  }

  const today = new Date();
  const nutritionData = await fetchNutritionData(today);

  return (
    <>
      <Overview user={user} plan={plan} initialNutritionData={nutritionData} />
    </>
  )
}

export default Dashboard