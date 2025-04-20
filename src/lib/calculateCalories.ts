// Utility function to calculate target calories based on user data

type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
type ActivityLevel = 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';
type Goal = 'WEIGHT_LOSS' | 'WEIGHT_GAIN' | 'MAINTENANCE' | 'MUSCLE_GAIN';

interface CalorieCalculationParams {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal?: Goal; // Optional goal parameter
}

/**
 * Calculate target calories based on user metrics
 * Uses the Mifflin-St Jeor Equation for BMR calculation
 */
export function calculateTargetCalories({
  weight,
  height,
  age,
  gender,
  activityLevel,
  goal = 'MAINTENANCE' // Default to maintenance if no goal provided
}: CalorieCalculationParams): number {
  // BMR calculation using Mifflin-St Jeor Equation
  let bmr = 0;
  if (gender === 'MALE') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    // For female or other genders, use the female formula as a baseline
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multiplier
  let activityMultiplier = 1.2; // Default: Sedentary
  switch (activityLevel) {
    case 'SEDENTARY':
      activityMultiplier = 1.2;
      break;
    case 'LIGHTLY_ACTIVE':
      activityMultiplier = 1.375;
      break;
    case 'MODERATELY_ACTIVE':
      activityMultiplier = 1.55;
      break;
    case 'VERY_ACTIVE':
      activityMultiplier = 1.725;
      break;
    case 'EXTRA_ACTIVE':
      activityMultiplier = 1.9;
      break;
  }
  
  // TDEE (Total Daily Energy Expenditure)
  let tdee = bmr * activityMultiplier;
  
  // Adjust based on goal
  let targetCalories = tdee;
  switch (goal) {
    case 'WEIGHT_LOSS':
      targetCalories = tdee * 0.8; // 20% deficit
      break;
    case 'WEIGHT_GAIN':
      targetCalories = tdee * 1.15; // 15% surplus
      break;
    case 'MUSCLE_GAIN':
      targetCalories = tdee * 1.1; // 10% surplus
      break;
    // MAINTENANCE stays at TDEE
  }
  
  return Math.round(targetCalories);
}
