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

    // If plans array is empty or not passed, show a fallback dropdown
    const showDropdown = !plans || plans.length === 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-2">Choose Your Nutrition Plan</h2>
            <p className="text-muted-foreground text-center mb-6">Select a plan that fits your lifestyle and goals. You can always change it later.</p>
            {showDropdown ? (
                <div className="flex flex-col items-center">
                    <Label htmlFor="plan-select" className="mb-2">Plan</Label>
                    <select
                        id="plan-select"
                        className="w-full px-4 py-3 rounded-xl border border-border shadow focus:ring-2 focus:ring-primary/40"
                        value={form.getValues('plan') || ''}
                        onChange={e => form.setValue('plan', e.target.value as 'Fitness' | 'Weight Gainer' | 'Weight Loss')}
                    >
                        <option value="" disabled>Select a plan</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Weight Gainer">Weight Gainer</option>
                        <option value="Weight Loss">Weight Loss</option>
                    </select>
                </div>
            ) : (
                <RadioGroup
                    onValueChange={(value) => form.setValue('plan', value as 'Fitness' | 'Weight Gainer' | 'Weight Loss')}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    value={form.getValues('plan')}
                >
                    {plans.map(plan => (
                        <label
                            key={plan.id}
                            htmlFor={plan.id}
                            className={`
                                group relative cursor-pointer rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col items-center transition-all duration-150
                                hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/40
                                ${form.getValues('plan') === plan.name ? 'border-primary ring-2 ring-primary/60 bg-primary/5' : ''}
                            `}
                            tabIndex={0}
                        >
                            <RadioGroupItem value={plan.name} id={plan.id} className="sr-only" />
                            <div className="flex flex-col items-center space-y-3">
                                {/* Example icons - replace with your own or use lucide-react */}
                                {plan.name === 'Fitness' && (
                                    <span className="bg-primary/10 rounded-full p-3 mb-2"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="16" cy="16" r="12" /><path d="M12 20l8-8M12 12h8v8" /></svg></span>
                                )}
                                {plan.name === 'Weight Gainer' && (
                                    <span className="bg-green-200/40 rounded-full p-3 mb-2"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="16" height="16" rx="4" /><path d="M16 12v8M12 16h8" /></svg></span>
                                )}
                                {plan.name === 'Weight Loss' && (
                                    <span className="bg-red-200/40 rounded-full p-3 mb-2"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="16" cy="16" rx="12" ry="8" /><path d="M16 8v16" /></svg></span>
                                )}
                                <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{plan.name}</span>
                            </div>
                            {form.getValues('plan') === plan.name && (
                                <span className="absolute top-3 right-3 bg-primary text-white rounded-full p-1">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="5 11 9 15 15 7" /></svg>
                                </span>
                            )}
                        </label>
                    ))}
                </RadioGroup>
            )}
            {errors.plan && <p className="text-red-500 text-sm mt-1 text-center">{errors.plan.message}</p>}
        </div>
    );
};

export default PlanSelectionStep;
