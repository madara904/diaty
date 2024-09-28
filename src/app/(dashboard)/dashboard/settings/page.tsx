"use server";

import { auth } from "@/auth";
import fetchPlan from "@/lib/fetch-user-plan";
import Settings from "./settings";
import fetchAvailablePlans from "@/lib/available-plans";

const SettingsHome = async () => {
  // Fetch session user
  const session = await auth();
  const user = session?.user || null;

  // Fetch current user plan and available plans
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