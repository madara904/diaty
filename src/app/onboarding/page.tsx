import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OnboardingForm from "./Onboarding-Form";
import fetchAvailablePlans from "@/lib/available-plans";

const Onboarding = async () => {
    const session = await auth();
    const user = session?.user;

    /*if (!user) {
        redirect("/sign-in");
    }
    */
    const plans = await fetchAvailablePlans();
    const planNames = plans.map(plan => ({ id: plan.id, name: plan.name }));

    return (
        <>
            <OnboardingForm plans={planNames} />
        </>
    );
};

export default Onboarding;