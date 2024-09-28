export interface Plan {
    id: string;
    name: string;
    dailyCalories: number;
    dailyCarbs: number;
    dailyProteins: number;
    dailyFats: number;
    createdAt?: Date;
    carbPercentage?: number;
    proteinPercentage?: number;
    fatPercentage?: number;
  }