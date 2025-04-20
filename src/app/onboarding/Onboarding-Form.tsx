"use client"

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { calculateTargetCalories } from '@/lib/calculateCalories';

// Define the schema for validation
const onboardingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  weight: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { 
    message: 'Valid weight is required' 
  }).optional().or(z.literal('')), 
  height: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { 
    message: 'Valid height is required' 
  }).optional().or(z.literal('')), 
  age: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, { 
    message: 'Valid age is required' 
  }).optional().or(z.literal('')), 
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  activityLevel: z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE']),
  goal: z.enum(['WEIGHT_LOSS', 'WEIGHT_GAIN', 'MAINTENANCE', 'MUSCLE_GAIN']),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingForm({ plans }: { plans: { id: string, name: string }[] }) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    weight: '',
    height: '',
    age: '',
    gender: 'PREFER_NOT_TO_SAY',
    activityLevel: 'SEDENTARY',
    goal: 'MAINTENANCE',
  });

  // Steps configuration
  const steps = [
    { 
      id: 1, 
      title: 'Personal Information',
      fields: ['name', 'weight', 'height', 'age', 'gender'] 
    },
    { 
      id: 2, 
      title: 'Lifestyle & Goals',
      fields: ['activityLevel', 'goal'] 
    },
    { 
      id: 3, 
      title: 'Review & Confirm',
      fields: [] 
    },
  ];

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate current step
  const validateStep = (stepIndex: number) => {
    const currentStepFields = steps[stepIndex - 1].fields;
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Only validate fields in the current step
    currentStepFields.forEach(field => {
      try {
        // Create a partial schema with just this field
        const fieldSchema = z.object({ 
          [field]: onboardingSchema.shape[field as keyof typeof onboardingSchema.shape] 
        });
        
        // Validate just this field
        fieldSchema.parse({ [field]: formData[field as keyof OnboardingFormData] });
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach(err => {
            const fieldName = err.path[0].toString();
            newErrors[fieldName] = err.message;
          });
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle next button click
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Handle back button click
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    try {
      setSubmitError(null); // Clear any previous errors
      
      // Validate all fields before submission
      onboardingSchema.parse(formData);
      
      if (!session?.user) {
        console.error("Session user is missing:", session);
        setSubmitError("Session information is missing. Please refresh the page.");
        return;
      }
      
      setIsLoading(true);

      // Calculate target calories
      let targetCalories = null;
      if (formData.weight && formData.height && formData.age && formData.gender && formData.activityLevel) {
        targetCalories = calculateTargetCalories({
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          age: parseInt(formData.age),
          gender: formData.gender,
          activityLevel: formData.activityLevel,
          goal: formData.goal
        });
      }

      // Prepare payload for API
      const payload = {
        name: formData.name,
        email: session.user.email || '',
        weight: formData.weight,
        height: formData.height,
        age: formData.age,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        targetCalories: targetCalories,
        completeFlag: true, // Set the completion flag to true
      };

      console.log("Submitting payload:", payload);

      // Send data to API
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store', // Prevent caching
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Failed to parse server response");
      }
      
      console.log("API response:", responseData);
      
      if (!response.ok) {
        console.error("API error:", responseData);
        throw new Error(responseData.error || 'Failed to save onboarding data');
      }

      // Update the session
      try {
        await update();
        console.log("Session updated successfully");
      } catch (updateError) {
        console.error("Failed to update session:", updateError);
        // Continue anyway, as the data is saved to the database
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error("Form submission error:", error);
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const fieldName = err.path[0].toString();
          newErrors[fieldName] = err.message;
        });
        setErrors(newErrors);
      } else {
        // Handle other errors
        setSubmitError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress percentage
  const progressValue = (currentStep / steps.length) * 100;

  // Render form fields based on current step
  const renderStepFields = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Your name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="weight" className="block text-sm font-medium">
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Your weight in kg"
                step="0.1"
              />
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="height" className="block text-sm font-medium">
                Height (cm)
              </label>
              <input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Your height in cm"
                step="0.1"
              />
              {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Your age"
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="activityLevel" className="block text-sm font-medium">
                Activity Level
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="SEDENTARY">Sedentary (little or no exercise)</option>
                <option value="LIGHTLY_ACTIVE">Lightly active (light exercise 1-3 days/week)</option>
                <option value="MODERATELY_ACTIVE">Moderately active (moderate exercise 3-5 days/week)</option>
                <option value="VERY_ACTIVE">Very active (hard exercise 6-7 days/week)</option>
                <option value="EXTRA_ACTIVE">Extra active (very hard exercise & physical job)</option>
              </select>
              {errors.activityLevel && <p className="text-red-500 text-sm">{errors.activityLevel}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="goal" className="block text-sm font-medium">
                Your Goal
              </label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="WEIGHT_LOSS">Weight Loss</option>
                <option value="WEIGHT_GAIN">Weight Gain</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="MUSCLE_GAIN">Muscle Gain</option>
              </select>
              {errors.goal && <p className="text-red-500 text-sm">{errors.goal}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Please review your information</h3>
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Weight:</strong> {formData.weight ? `${formData.weight} kg` : 'Not provided'}</p>
              <p><strong>Height:</strong> {formData.height ? `${formData.height} cm` : 'Not provided'}</p>
              <p><strong>Age:</strong> {formData.age || 'Not provided'}</p>
              <p><strong>Gender:</strong> {formData.gender.replace('_', ' ').toLowerCase()}</p>
              <p><strong>Activity Level:</strong> {formData.activityLevel.replace('_', ' ').toLowerCase()}</p>
              <p><strong>Goal:</strong> {formData.goal.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-blue-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome! Let's get you set up.</h2>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
          
          <p className="text-center text-sm text-gray-500 mb-6">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </p>
          
          {/* Form fields */}
          <div className="mb-8">
            {renderStepFields()}
          </div>
          
          {/* Display submit error if any */}
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {submitError}
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50"
            >
              Back
            </button>
            
            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : currentStep === steps.length ? 'Finish Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
