"use server";

import { auth } from "@/auth";
import fetchPlan from "@/lib/fetch-user-plan";
import Settings from "./settings";
import fetchAvailablePlans from "@/lib/available-plans";
import { redirect } from "next/navigation";
import React from "react";

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
      <div className="mt-24">
      <Settings user={user} plan={plan} availablePlans={availablePlans} />
      </div>
    </>
  );
};

export default SettingsHome;