export interface OpenFoodProduct {
  code: string;
  product_name: string;
  image_url?: string;
  brand?: string;
  nutriments: {
    "energy-kcal_100g"?: number;
    "energy-kcal"?: number;
    energy?: number;
    carbohydrates_100g?: number;
    carbohydrates?: number;
    proteins_100g?: number;
    proteins?: number;
    fat_100g?: number;
    fat?: number;
  };
}

export interface SavedFoodItem {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  mealType: string;
  date: string;
  createdAt: string;
  isVerified: boolean;
  isUserData: boolean;
  isOtherUserData: boolean;
}

export type FoodItem = OpenFoodProduct | SavedFoodItem;

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";

export type ViewType = "search" | "detail" | "custom" | "edit";

export interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  onFoodAdded: () => void;
  defaultMealType?: MealType;
  mealItems: SavedFoodItem[] | undefined;
} 