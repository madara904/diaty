import { Progress } from "@/app/components/ui/progress"

interface MacroProgressProps {
  label: string
  consumed: number
  total: number
}

export function MacroProgress({ label, consumed, total }: MacroProgressProps) {
  const percentage = Math.min((consumed / total) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {Math.round(consumed)}g / {Math.round(total)}g
        </span>
      </div>
      <Progress value={percentage} className="h-2 bg-secondary" />
    </div>
  )
} 