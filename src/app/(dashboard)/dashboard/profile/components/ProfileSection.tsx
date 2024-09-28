"use client"

import { Button } from "@/app/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Progress } from "@/app/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { BarChart, Activity, Target, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface ProfileData {
  name: string;
  email: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  plan: 'Fitness' | 'Weight Gainer' | 'Weight Loss';
}

export default function ProfilePage( { user }: { user: any }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        if (!user.session || !user || !user.session.id) {
          throw new Error('User not authenticated');
        }

        const userId = user.id;
        const response = await fetch(`/api/profile?=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data: ProfileData = await response.json();
        setProfileData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!profileData) return null;

  const { name, email, weight, height, age, gender, plan } = profileData;

  const getBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const bmi = getBMI(weight, height);
  return (

        <div className="bg-white border shadow-xl rounded-lg overflow-hidden mt-4">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="flex-shrink-0">
                  <Avatar className="mx-auto h-20 w-20">
                    <AvatarImage src="/placeholder.svg" alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">{name}</p>
                  <p className="text-sm font-medium text-gray-600">{email}</p>
                  <p className="text-sm font-medium text-[#00FFA3]">{plan} Plan</p>
                </div>
              </div>
              <div className="mt-5 flex justify-center sm:mt-0">
                <Button className="bg-[#00FFA3] hover:bg-[#00CC82]">Edit Profile</Button>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">BMI</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bmi}</div>
                  <Progress 
                    value={Number(bmi) / 0.4} 
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {Number(bmi) < 18.5 ? 'Underweight' :
                     Number(bmi) < 25 ? 'Normal weight' :
                     Number(bmi) < 30 ? 'Overweight' : 'Obese'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weight</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weight} kg</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Height</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{height} cm</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 bg-gray-50 shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                    <dd className="mt-1 text-sm text-gray-900">{age} years</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    <dd className="mt-1 text-sm text-gray-900">{gender}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Plan</dt>
                    <dd className="mt-1 text-sm text-gray-900">{plan}</dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Your Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Target className="h-10 w-10 text-[#00FFA3]" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Goal</p>
                      <p className="text-lg font-semibold text-gray-900">{plan}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Based on your selected plan, we've customized your experience to help you achieve your goals. 
                    Keep tracking your progress and stay motivated!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
  )
}