import { Button } from '@/app/components/ui/Button';
import { FC } from 'react';
import { UseFormWatch } from 'react-hook-form';

interface ConfirmationStepProps {
    watch: UseFormWatch<any>;
    onConfirm: () => void; // Add this prop for confirmation
}

const ConfirmationStep: FC<ConfirmationStepProps> = ({ watch }) => {
    const data = watch(); // Get the current form data

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Confirm your details</h2>
            <div>
                <p><strong>Weight:</strong> {data.weight} kg</p>
                <p><strong>Height:</strong> {data.height} cm</p>
                <p><strong>Age:</strong> {data.age} years</p>
                <p><strong>Gender:</strong> {data.gender}</p>
                <p><strong>Selected Plan:</strong> {data.plan}</p>
            </div>
        </div>
    );
};

export default ConfirmationStep;
