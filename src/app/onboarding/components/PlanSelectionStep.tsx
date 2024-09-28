import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";

interface PlanSelectionStepProps {
    form: UseFormReturn<{
        weight: string;
        height: string;
        age: string;
        gender: 'male' | 'female' | 'other';
        plan: 'Fitness' | 'Weight Gainer' | 'Weight Loss';
    }>;
    plans: { id: string; name: string }[];
}

const PlanSelectionStep: FC<PlanSelectionStepProps> = ({ form, plans }) => {
    const { register, formState: { errors } } = form;

    return (
        <div className="space-y-4">
            <Label>Select your preferred plan</Label>
            <RadioGroup
                onValueChange={(value) => form.setValue('plan', value as 'Fitness' | 'Weight Gainer' | 'Weight Loss')}
                className={errors.plan ? "border border-red-500 rounded-md p-2" : ""}
            >
                {plans.map(plan => (
                    <div key={plan.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={plan.name} id={plan.id} />
                        <Label htmlFor={plan.id}>{plan.name}</Label>
                    </div>
                ))}
            </RadioGroup>
            {errors.plan && <p className="text-red-500 text-sm mt-1">{errors.plan.message}</p>}
        </div>
    );
};

export default PlanSelectionStep;
