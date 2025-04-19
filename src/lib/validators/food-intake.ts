import { z } from "zod";

export const foodIntakeSchema = z.object({
  name: z.string().min(1, "Food name is required"),
  calories: z.coerce.number().min(0, "Calories cannot be negative"),
  carbs: z.coerce.number().min(0, "Carbs cannot be negative"),
  proteins: z.coerce.number().min(0, "Proteins cannot be negative"),
  fats: z.coerce.number().min(0, "Fats cannot be negative"),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"], {
    required_error: "Meal type is required",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export const searchFoodSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  page: z.number().optional().default(1),
});

export type FoodIntakeFormData = z.infer<typeof foodIntakeSchema>;
export type SearchFoodFormData = z.infer<typeof searchFoodSchema>; 