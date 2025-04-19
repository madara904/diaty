import { Button } from '@/app/components/ui/Button';
import { FC } from 'react';

interface ConfirmationStepProps {
    formData: any;
    onConfirm?: () => void; // Optional prop for confirmation
}

const ConfirmationStep: FC<ConfirmationStepProps> = ({ formData }) => {
    const data = formData; // Use the provided form data directly

    return (
        <div className="w-full bg-card rounded-xl shadow-sm p-8 space-y-8">
            <div className="flex flex-col items-center">
                <div className="bg-emerald-600/10 rounded-full p-5 mb-6 text-emerald-600">
                    <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="28" cy="28" r="24"/><polyline points="18 30 26 38 40 22" strokeWidth="3"/></svg>
                </div>
                <h2 className="text-3xl font-bold text-center text-emerald-600 mb-3">Review Your Profile</h2>
                <p className="text-muted-foreground text-center text-lg max-w-md mb-6">Double check your information before starting your nutrition journey!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 bg-background rounded-xl p-5 shadow-sm border border-border hover:border-emerald-600/40 transition-colors">
                    <div className="bg-emerald-600/10 p-3 rounded-full">
                        <span className="text-emerald-600"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 28c6 0 10-4 10-10s-4-10-10-10-10 4-10 10 4 10 10 10z" /><path d="M16 18v-6" /><circle cx="16" cy="22" r="1.5" /></svg></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Weight</span>
                        <span className="text-lg font-semibold">{data.weight} kg</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-background rounded-xl p-5 shadow-sm border border-border hover:border-emerald-600/40 transition-colors">
                    <div className="bg-emerald-600/10 p-3 rounded-full">
                        <span className="text-emerald-600"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="16" height="16" rx="4" /><path d="M16 12v8M12 16h8" /></svg></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Height</span>
                        <span className="text-lg font-semibold">{data.height} cm</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-background rounded-xl p-5 shadow-sm border border-border hover:border-emerald-600/40 transition-colors">
                    <div className="bg-emerald-600/10 p-3 rounded-full">
                        <span className="text-emerald-600"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="16" cy="16" r="12" /><path d="M16 10v8" /><circle cx="16" cy="22" r="1.5" /></svg></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Age</span>
                        <span className="text-lg font-semibold">{data.age} years</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-background rounded-xl p-5 shadow-sm border border-border hover:border-emerald-600/40 transition-colors">
                    <div className="bg-emerald-600/10 p-3 rounded-full">
                        <span className="text-emerald-600"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="16" cy="16" r="12" /><path d="M12 16h8M16 12v8" /></svg></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Gender</span>
                        <span className="text-lg font-semibold capitalize">{data.gender}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-background rounded-xl p-5 shadow-sm border border-border hover:border-emerald-600/40 transition-colors md:col-span-2">
                    <div className="bg-emerald-600/10 p-3 rounded-full">
                        <span className="text-emerald-600"><svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="16" height="16" rx="6" /><path d="M16 12v8M12 16h8" /></svg></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Selected Plan</span>
                        <span className="text-lg font-semibold capitalize">{data.plan}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationStep;
