'use client';

import { useState } from 'react';
import { Button } from "@/app/components/ui/Button";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../components/hooks/use-toast';
import { z } from 'zod';
import PersonalInfoStep from './components/PersonalInfoStep';
import PlanSelectionStep from './components/PlanSelectionStep';
import ConfirmationStep from './components/ConfirmationStep';
import { useRouter } from 'next/navigation';

const steps = ['Personal Info', 'Plan Selection', 'Confirmation'];

const personalInfoSchema = z.object({
    weight: z.string().min(1, "Weight is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, "Weight must be a positive number"),
    height: z.string().min(1, "Height is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, "Height must be a positive number"),
    age: z.string().min(1, "Age is required").refine(val => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120, "Age must be between 1 and 120"),
    gender: z.enum(['male', 'female', 'other'], { required_error: "Gender is required" }),
});

const planSchema = z.object({
    plan: z.enum(['Fitness', 'Weight Gainer', 'Weight Loss'], { required_error: "Plan selection is required" }),
});

const formSchema = personalInfoSchema.merge(planSchema);

type FormData = z.infer<typeof formSchema>;

interface OnboardingFormProps {
    plans: { id: string; name: string }[];
}

export default function OnboardingForm({ plans }: OnboardingFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            weight: '',
            height: '',
            age: '',
            gender: undefined,
            plan: undefined,
        },
    });

    const { handleSubmit, trigger, watch } = form;

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const requestData = { ...data, completeFlag: true };

        try {
            const response = await fetch('/api/submit-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) throw new Error('Failed to submit the profile');
            toast({ title: "Profile Completed", description: "Your diet profile has been successfully created!" });
            router.push('/dashboard');
        } catch (error) {
            toast({ title: "Submission Error", description: "There was a problem submitting your profile.", variant: "destructive" });
        }
    };

    const handleNext = async () => {
        const fieldsToValidate = currentStep === 0 ? ['weight', 'height', 'age', 'gender'] : ['plan'];
        const isStepValid = await trigger(fieldsToValidate as any);

        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        } else {
            toast({ title: "Validation Error", description: "Please fill out all required fields correctly.", variant: "destructive" });
        }
    };

    const handlePrev = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    return (
<div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    <span className="text-gray-900">Complete your </span>
                    <span className="text-[#00FFA3]">diaty</span>
                    <span className="text-gray-900"> profile</span>
                </h1>
                <div className="mb-12">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step} className="flex flex-col items-center">
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        index <= currentStep ? 'bg-[#00FFA3] text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-1 w-28 mx-2 ${
                                            index < currentStep ? 'bg-[#00FFA3]' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <form className="space-y-6">
                    {currentStep === 0 && <PersonalInfoStep form={form} />}
                    {currentStep === 1 && <PlanSelectionStep form={form} plans={plans} />}
                    {currentStep === 2 && <ConfirmationStep watch={watch} onConfirm={handleSubmit(onSubmit)} />}
                    <div className="flex justify-between">
                        {currentStep > 0 && <Button type="button" onClick={handlePrev} variant="outline">Previous</Button>}
                        {currentStep < steps.length - 1 ? (
                            <Button type="button" onClick={handleNext} className="bg-[#00FFA3] text-white hover:bg-[#00CC82]">Next</Button>
                        ) : (
                            <Button type="button" onClick={handleSubmit(onSubmit)} className="bg-[#00FFA3] text-white hover:bg-[#00CC82]">Confirm and Complete</Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
