"use client"

import Overview from "./components/overview/Overview"
import React, { useEffect, useState, useCallback } from "react"
import DashboardWrapper from "./components/DashboardWrapper"
import { ErrorBoundary } from "react-error-boundary" 
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

// Fallback component for error states
interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  console.error("Dashboard error:", error);
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">We couldn't load your dashboard data</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Try again
      </button>
    </div>
  )
}

// Cache for API responses to reduce duplicate requests
const apiCache = new Map();

// Fetch with cache to prevent duplicate requests
const fetchWithCache = async (url: string) => {
  if (apiCache.has(url)) {
    return apiCache.get(url);
  }

  const response = await fetch(url);
  const data = await response.json();
  apiCache.set(url, data);
  return data;
};

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
  
  // Clear cache when component is unmounted
  useEffect(() => {
    return () => {
      apiCache.clear();
    };
  }, []);
  
  const fetchDashboardData = useCallback(async () => {
    if (!session?.user) return;
    
    try {
      // Check if user has completed onboarding (using cache)
      const profileStatus = await fetchWithCache('/api/user/profile-status');
      
      if (!profileStatus.completed) {
        router.push('/onboarding');
        return;
      }
      
      // Fetch plan and nutrition data in parallel (using cache)
      const today = new Date().toISOString().split('T')[0];
      const [planData, nutritionData] = await Promise.all([
        fetchWithCache('/api/user/plan'),
        fetchWithCache(`/api/nutrition-data?date=${today}`)
      ]);
      
      setData({
        userData: session.user,
        plan: planData,
        nutritionData: nutritionData
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setLoading(false);
    }
  }, [session, router]);
  
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchDashboardData();
    } else if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, session, router, fetchDashboardData]);

  return (
    <DashboardWrapper title="Dashboard">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {loading ? (
          <DashboardLoadingState />
        ) : (
          data.userData && data.nutritionData && (
            <Overview 
              user={data.userData} 
              plan={data.plan} 
              initialNutritionData={data.nutritionData}
            />
          )
        )}
      </ErrorBoundary>
    </DashboardWrapper>
  )
}