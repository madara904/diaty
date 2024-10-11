import { useQuery } from '@tanstack/react-query'
import { fetchNutritionData } from '../fetch-nutrition.data'


export function useNutritionData(date: Date) {
  return useQuery({
    queryKey: ['nutritionData', date.toISOString().split('T')[0]],
    queryFn: () => fetchNutritionData(date),
  })
}