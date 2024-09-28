import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";

interface PersonalInfoStepProps {
    form: UseFormReturn<{ 
        weight: string; 
        height: string; 
        age: string; 
        gender: 'male' | 'female' | 'other'; 
        plan: 'Fitness' | 'Weight Gainer' | 'Weight Loss';
    }>;
}

const PersonalInfoStep: FC<PersonalInfoStepProps> = ({ form }) => {
    const { register, formState: { errors } } = form;

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" {...register('weight')} type="number" className={errors.weight ? "border-red-500" : ""} />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
            </div>
            <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" {...register('height')} type="number" className={errors.height ? "border-red-500" : ""} />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
            </div>
            <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" {...register('age')} type="number" className={errors.age ? "border-red-500" : ""} />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
            </div>
            <div>
                <Label>Gender</Label>
                <RadioGroup
                    onValueChange={(value) => form.setValue('gender', value as 'male' | 'female' | 'other')}
                    className={errors.gender ? "border border-red-500 rounded-md p-2" : ""}
                >
                    {['male', 'female', 'other'].map(gender => (
                        <div key={gender} className="flex items-center space-x-2">
                            <RadioGroupItem value={gender} id={gender} />
                            <Label htmlFor={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</Label>
                        </div>
                    ))}
                </RadioGroup>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>
        </div>
    );
};

export default PersonalInfoStep;
