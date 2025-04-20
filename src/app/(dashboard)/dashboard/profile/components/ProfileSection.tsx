"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/hooks/use-toast";
import Image from "next/image";
import { Progress } from "@/app/components/ui/progress";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  weight: z.coerce.number().min(20, "Weight must be at least 20 kg").max(300, "Weight must be less than 300 kg").nullable(),
  height: z.coerce.number().min(100, "Height must be at least 100 cm").max(250, "Height must be less than 250 cm").nullable(),
  age: z.coerce.number().min(18, "Age must be at least 18").max(120, "Age must be less than 120").nullable(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).nullable(),
  activityLevel: z.enum(["SEDENTARY", "LIGHTLY_ACTIVE", "MODERATELY_ACTIVE", "VERY_ACTIVE", "EXTRA_ACTIVE"]).nullable(),
  goal: z.enum(["WEIGHT_LOSS", "WEIGHT_GAIN", "MAINTENANCE", "MUSCLE_GAIN"]).nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfilePageProps {
  user: {
    name: string | null;
    email: string | null;
    weight: number | null;
    height: number | null;
    age: number | null;
    gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;
    image?: string | null;
    activityLevel: "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE" | "EXTRA_ACTIVE" | null;
    goal?: "WEIGHT_LOSS" | "WEIGHT_GAIN" | "MAINTENANCE" | "MUSCLE_GAIN" | null;
  } | null;
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [userData, setUserData] = useState<ProfileFormData | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      weight: user?.weight ?? null,
      height: user?.height ?? null,
      age: user?.age ?? null,
      gender: user?.gender ?? null,
      activityLevel: user?.activityLevel ?? null,
      goal: user?.goal ?? null,
    },
  });

  const weight = user?.weight ?? 0;
  const height = user?.height ?? 0;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        toast({
          title: "Success",
          description: `You have successfully updated your profile`,
          variant: "default",
          duration: 2000,
        });
        setUserData(updatedUser);
        reset(updatedUser);

        router.refresh();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update profile",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Calculate BMI if weight and height are available
  const bmi = weight && height ? (weight / Math.pow(height / 100, 2)).toFixed(1) : null;

  // Determine BMI category
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { category: "Normal", color: "text-green-500" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" };
    return { category: "Obese", color: "text-red-500" };
  };

  const bmiInfo = bmi ? getBmiCategory(parseFloat(bmi)) : null;

  // Activity level display text
  const getActivityLevelText = (level: string | null) => {
    if (!level) return "";
    const activityMap: Record<string, string> = {
      SEDENTARY: "Sedentary (little or no exercise)",
      LIGHTLY_ACTIVE: "Lightly Active (light exercise/sports 1-3 days/week)",
      MODERATELY_ACTIVE: "Moderately Active (moderate exercise/sports 3-5 days/week)",
      VERY_ACTIVE: "Very Active (hard exercise/sports 6-7 days a week)",
      EXTRA_ACTIVE: "Extra Active (very hard exercise/sports & physical job or 2x training)",
    };
    return activityMap[level] || level;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={96}
                        height={96}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                        disabled
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        {...register("weight", { valueAsNumber: true })}
                        className={errors.weight ? "border-red-500" : ""}
                      />
                      {errors.weight && (
                        <p className="text-red-500 text-xs">{errors.weight.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        {...register("height", { valueAsNumber: true })}
                        className={errors.height ? "border-red-500" : ""}
                      />
                      {errors.height && (
                        <p className="text-red-500 text-xs">{errors.height.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        {...register("age", { valueAsNumber: true })}
                        className={errors.age ? "border-red-500" : ""}
                      />
                      {errors.age && (
                        <p className="text-red-500 text-xs">{errors.age.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Controller
                        control={control}
                        name="gender"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || undefined}
                          >
                            <SelectTrigger
                              className={errors.gender ? "border-red-500" : ""}
                            >
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                              <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.gender && (
                        <p className="text-red-500 text-xs">{errors.gender.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activityLevel">Activity Level</Label>
                      <Controller
                        control={control}
                        name="activityLevel"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || undefined}
                          >
                            <SelectTrigger
                              className={errors.activityLevel ? "border-red-500" : ""}
                            >
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SEDENTARY">Sedentary (little or no exercise)</SelectItem>
                              <SelectItem value="LIGHTLY_ACTIVE">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                              <SelectItem value="MODERATELY_ACTIVE">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                              <SelectItem value="VERY_ACTIVE">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
                              <SelectItem value="EXTRA_ACTIVE">Extra Active (very hard exercise/sports & physical job or 2x training)</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.activityLevel && (
                        <p className="text-red-500 text-xs">{errors.activityLevel.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal">Goal</Label>
                      <Controller
                        control={control}
                        name="goal"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || undefined}
                          >
                            <SelectTrigger
                              className={errors.goal ? "border-red-500" : ""}
                            >
                              <SelectValue placeholder="Select goal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WEIGHT_LOSS">Weight Loss</SelectItem>
                              <SelectItem value="WEIGHT_GAIN">Weight Gain</SelectItem>
                              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                              <SelectItem value="MUSCLE_GAIN">Muscle Gain</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.goal && (
                        <p className="text-red-500 text-xs">{errors.goal.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={!isDirty}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Health Metrics Card */}
        <Card className="w-full md:w-80">
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* BMI Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">BMI (Body Mass Index)</h3>
                {bmi && (
                  <span className={`text-lg font-bold ${bmiInfo?.color}`}>
                    {bmi}
                  </span>
                )}
              </div>
              {bmi ? (
                <>
                  <Progress
                    value={Math.min(parseFloat(bmi) * 2.5, 100)}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                  <p className="text-sm mt-2">
                    Your BMI is <span className={bmiInfo?.color}>{bmi}</span>, which is considered{" "}
                    <span className={bmiInfo?.color}>{bmiInfo?.category}</span>.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enter your weight and height to calculate your BMI.
                </p>
              )}
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Activity Level</h3>
              {user?.activityLevel ? (
                <p className="text-sm">{getActivityLevelText(user.activityLevel)}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No activity level set. Update your profile to set your activity level.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
