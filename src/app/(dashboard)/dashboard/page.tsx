"use client"

import Overview from "./components/overview/Overview"
import React, { useEffect, useState } from "react"
import DashboardWrapper from "./components/DashboardWrapper"
import { useSession } from "next-auth/react"
import { User } from "next-auth"
import { useRouter } from "next/navigation"

// Define the Plan type
interface Plan {
  id: string
  name: string
  dailyCalories: number
  dailyCarbs: number
  dailyProteins: number
  dailyFats: number
}

// Define the NutritionData type
interface NutritionData {
  date: Date
  totalNutrition: {
    calories: number
    carbs: number
    proteins: number
    fats: number
  }
  meals: Record<string, any[]> | undefined
}

// Loading component specific to Dashboard
function DashboardLoadingState() {
  return (
    <div className="space-y-6">
      <div className="w-full h-24 rounded-lg bg-muted animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-[400px] rounded-lg bg-muted animate-pulse"></div>
        <div className="h-[400px] rounded-lg bg-muted animate-pulse"></div>
      </div>
      <div className="h-40 rounded-lg bg-muted animate-pulse"></div>
    </div>
  );
}

// Main Dashboard component
export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState({
    userData: undefined as User | undefined,
    plan: null as Plan | null,
    nutritionData: null as NutritionData | null
  })
  const [loading, setLoading] = useState(true)
  
  // New useEffect to fetch data when session is available
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const profileStatusRes = await fetch('/api/user/profile-status');
          if (!profileStatusRes.ok) {
            console.error("Failed to fetch profile status");
            setLoading(false);
            return;
          }
          
          const profileStatus = await profileStatusRes.json();
          if (!profileStatus.completed) {
            router.push('/onboarding');
            return;
          }
          
          const today = new Date().toISOString().split('T')[0];
          const [planRes, nutritionDataRes] = await Promise.all([
            fetch('/api/user/plan'),
            fetch(`/api/nutrition-data?date=${today}`)
          ]);
          
          const planData = planRes.ok ? await planRes.json() : null;
          const nutritionData = nutritionDataRes.ok ? await nutritionDataRes.json() : null;

          setData({
            userData: session.user,
            plan: planData,
            nutritionData: nutritionData
          });
          
        } catch (err) {
          console.error("Error loading dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    } else if (status === 'unauthenticated') {
       // This client component handles redirect for unauthenticated users
      router.push('/sign-in');
    }
  }, [status, session, router]); // Dependencies for the effect

  // Render based on session status and loading state
  if (status === 'loading' || loading) {
     // Show loading state while NextAuth is determining session status
    return <DashboardLoadingState />;
  }

  if (!session?.user) {
     // If not authenticated after loading, the useEffect will redirect
     // We can return null or a minimal loading state here while redirect happens
    return null; // Or <DashboardLoadingState /> if you prefer
  }
  
  // If authenticated and data is loaded, render the Overview
  // Ensure essential data (nutritionData) is available before rendering Overview
  if (data.userData && data.nutritionData) {
    return (
      <DashboardWrapper title="Dashboard">
          <Overview 
            user={data.userData} 
            plan={data.plan} 
            initialNutritionData={data.nutritionData}
          />
      </DashboardWrapper>
    );
  }

  // Fallback if authenticated but essential data is somehow missing after loading
   return (
     <DashboardWrapper title="Dashboard">
        <div className="flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-semibold mb-2">Unable to load dashboard data</h2>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
     </DashboardWrapper>
   );
}