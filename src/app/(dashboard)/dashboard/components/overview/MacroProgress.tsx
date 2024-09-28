import { Progress } from "@/app/components/ui/progress";

interface MacroProgressProps {
  label: string;
  consumed: number;
  total: number;
}

const MacroProgress: React.FC<MacroProgressProps> = ({ label, consumed, total }) => {
  const percentage = Math.min((consumed / total) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {consumed}g / {total}g
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default MacroProgress;