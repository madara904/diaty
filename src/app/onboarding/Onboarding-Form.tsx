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
import { motion, AnimatePresence } from 'framer-motion';

// Define the steps for the onboarding process
const steps = ['Personal Info', 'Plan Selection', 'Confirmation'];

// Validation schemas
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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* App logo */}
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">D</span>
                    </div>
                </div>
                
                {/* Main card */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Header with progress indicator */}
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
                        <h1 className="text-white text-2xl font-bold mb-2">Complete Your Profile</h1>
                        <p className="text-emerald-100 text-sm mb-4">
                            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
                        </p>
                        
                        {/* Progress bar */}
                        <div className="h-1.5 bg-emerald-300/30 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white transition-all duration-300 ease-out"
                                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    {/* Form content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                                className="min-h-[300px]"
                            >
                                {currentStep === 0 && <PersonalInfoStep form={form} />}
                                {currentStep === 1 && <PlanSelectionStep form={form} plans={plans} />}
                                {currentStep === 2 && <ConfirmationStep formData={form.getValues()} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    
                    {/* Navigation buttons */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className="text-gray-600"
                        >
                            {currentStep > 0 && (
                                <div className="flex items-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                        <path d="m15 18-6-6 6-6"/>
                                    </svg>
                                    Back
                                </div>
                            )}
                        </Button>
                        
                        {currentStep === steps.length - 1 ? (
                            <Button 
                                type="button" 
                                onClick={handleSubmit(onSubmit)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                            >
                                Complete Profile
                            </Button>
                        ) : (
                            <Button 
                                type="button" 
                                onClick={handleNext}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                            >
                                Continue
                            </Button>
                        )}
                    </div>
                </motion.div>
                
                {/* Footer text */}
                <p className="text-center text-gray-500 text-xs mt-4">
                    Your data is securely stored and will only be used to personalize your experience
                </p>
            </div>
        </div>
    );
}
