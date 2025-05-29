interface CalorieGaugeProps {
  consumed: number
  target: number
  gaugeColor: string
  remainingCalories: number
}

export function CalorieGauge({ consumed, target, gaugeColor, remainingCalories }: CalorieGaugeProps) {
  const percentage = Math.min((consumed / target) * 100, 100)
  return (
    <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-54 lg:w-54">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray="282.7"
          strokeDashoffset={282.7 - (282.7 * percentage) / 100}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className={`transition-all duration-1000 ease-in-out ${gaugeColor}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{Math.abs(Math.round(remainingCalories))}</div>
        <div className="text-sm sm:text-base text-muted-foreground">
          {remainingCalories >= 0 ? "remaining" : "over"}
        </div>
      </div>
    </div>
  )
} 