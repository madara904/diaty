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
        <div className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-[#f3fff6] to-[#e9f7ff] shadow-md">
            <h2 className="text-2xl font-bold text-center mb-2 text-primary">Let's Personalize Your Journey</h2>
            <p className="text-muted-foreground text-center mb-6">Enter your details to tailor your nutrition plan.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center bg-white rounded-xl p-5 shadow group focus-within:ring-2 focus-within:ring-primary/40">
                    <span className="mb-2 text-primary"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 28c6 0 10-4 10-10s-4-10-10-10-10 4-10 10 4 10 10 10z" /><path d="M16 18v-6" /><circle cx="16" cy="22" r="1.5" /></svg></span>
                    <Label htmlFor="weight" className="mb-1">Weight (kg)</Label>
                    <Input id="weight" {...register('weight')} type="number" inputMode="decimal" className={errors.weight ? "border-red-500" : ""} />
                    {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                </div>
                <div className="flex flex-col items-center bg-white rounded-xl p-5 shadow group focus-within:ring-2 focus-within:ring-primary/40">
                    <span className="mb-2 text-primary"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="16" height="16" rx="4" /><path d="M16 12v8M12 16h8" /></svg></span>
                    <Label htmlFor="height" className="mb-1">Height (cm)</Label>
                    <Input id="height" {...register('height')} type="number" inputMode="decimal" className={errors.height ? "border-red-500" : ""} />
                    {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
                </div>
                <div className="flex flex-col items-center bg-white rounded-xl p-5 shadow group focus-within:ring-2 focus-within:ring-primary/40">
                    <span className="mb-2 text-primary"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="16" cy="16" r="12" /><path d="M16 10v6" /><circle cx="16" cy="22" r="1.5" /></svg></span>
                    <Label htmlFor="age" className="mb-1">Age</Label>
                    <Input id="age" {...register('age')} type="number" inputMode="numeric" className={errors.age ? "border-red-500" : ""} />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                </div>
            </div>
            <div className="mt-8">
                <Label className="block mb-3 text-lg text-center">Gender</Label>
                <RadioGroup
                    onValueChange={(value) => form.setValue('gender', value as 'male' | 'female' | 'other')}
                    className="flex justify-center gap-6"
                    value={form.getValues('gender')}
                >
                    {[{ value: 'male', icon: (<svg width='28' height='28' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='14' cy='14' r='12'/><path d='M14 10v4l3 3'/></svg>) }, { value: 'female', icon: (<svg width='28' height='28' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='14' cy='14' r='12'/><path d='M14 10v8M10 18h8'/></svg>) }, { value: 'other', icon: (<svg width='28' height='28' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='14' cy='14' r='12'/><path d='M10 14h8M14 10v8'/></svg>) }].map(g => (
                        <label
                            key={g.value}
                            htmlFor={g.value}
                            className={`flex flex-col items-center px-6 py-3 rounded-xl border border-border bg-white shadow-sm cursor-pointer transition-all duration-150 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/40 ${form.getValues('gender') === g.value ? 'border-primary ring-2 ring-primary/60 bg-primary/5' : ''}`}
                            tabIndex={0}
                        >
                            <RadioGroupItem value={g.value} id={g.value} className="sr-only" />
                            <span className="mb-2 text-primary">{g.icon}</span>
                            <span className="capitalize text-base font-medium">{g.value}</span>
                        </label>
                    ))}
                </RadioGroup>
                {errors.gender && <p className="text-red-500 text-xs mt-1 text-center">{errors.gender.message}</p>}
            </div>
        </div>
    );
};

export default PersonalInfoStep;
