import { Plan } from "@/types/plan";

interface GaugeProps {
  remainingCalories: number;
  data: {
    caloriesConsumed: number;
    carbsConsumed: number;
    proteinsConsumed: number;
    fatsConsumed: number;
  };
  gaugeColor: string;
  percentage: number;
  plan: Plan | undefined | null;
}

const Gauge = ({ remainingCalories, data, gaugeColor, percentage, plan } : GaugeProps) => (
  <div className="relative w-64 h-32 mx-auto">
    <svg className="w-full h-full" viewBox="0 0 100 50">
      <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <path
        d="M5 50 A45 45 0 0 1 95 50"
        fill="none"
        stroke={gaugeColor}
        strokeWidth="10"
        strokeDasharray="141.37"
        strokeDashoffset={141.37 - (141.37 * percentage) / 100}
        className="transition-all duration-1000 ease-in-out"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center mt-12">
        <div className="w-[75px]">
          <span className='text-2xl font-medium'>{Math.abs(remainingCalories)} </span>
          <span className='text-gray-500'>{data.caloriesConsumed > (plan?.dailyCalories ?? 0) ? "exceeding" : "left"}</span>
        </div>
      </div>
    </div>
  </div>
);

export default Gauge;