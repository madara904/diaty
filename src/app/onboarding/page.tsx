import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OnboardingForm from "./Onboarding-Form";
import fetchAvailablePlans from "@/lib/available-plans";
import checkFlag from "@/lib/check-completion-flag";


const Onboarding = async () => {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        redirect("/sign-in");
    }

    const profileCompleted = await checkFlag(user)

    if (profileCompleted) {
      redirect("/dashboard/profile")
    }
    

    const plans = await fetchAvailablePlans();
    const planNames = plans.map(plan => ({ id: plan.id, name: plan.name }));

    return (
        <>
            <OnboardingForm plans={planNames} />
        </>
    );
};

export default Onboarding;