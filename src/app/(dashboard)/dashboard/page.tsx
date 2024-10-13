import { Suspense } from 'react'
import { auth } from "@/auth"
import fetchPlan from "@/lib/fetch-user-plan"
import Overview from "./components/overview/Overview"
import checkFlag from "@/lib/check-completion-flag"
import { redirect } from "next/navigation"
import { fetchNutritionData } from "@/lib/actions/actions"
import { Plan } from '@/types/plan'
import { User } from '.prisma/client'

interface NutritionDataLoaderProps {
  user: User
  plan: Plan | null | undefined
  date: Date
}

async function NutritionDataLoader({ user, plan, date }: NutritionDataLoaderProps) {
  const nutritionData = await fetchNutritionData(date)
  return <Overview user={user} plan={plan} initialNutritionData={nutritionData} />
}

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user as User 

  if (!user || !session) {
    redirect("/sign-in")
  }
  
  const plan = await fetchPlan(user)
  const profileCompleted = await checkFlag(user)

  if (!profileCompleted) {
    redirect("/onboarding")
  }

  const today = new Date()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NutritionDataLoader user={user} plan={plan} date={today} />
    </Suspense>
  )
}