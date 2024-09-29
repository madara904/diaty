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
  gender: z.enum(["male", "female", "other"]).nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfilePageProps {
  user: {
    name: string | null;
    email: string | null;
    weight: number | null;
    height: number | null;
    age: number | null;
    gender: "male" | "female" | "other" | null;
    image?: string | null;
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
          description: errorData || "An error occurred while updating your profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateBMI = (weight: number | null, height: number | null) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const bmi = calculateBMI(weight, height);
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return "text-blue-500";
    if (bmi < 25) return "text-green-500";
    if (bmi < 30) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col-reverse sm:block min-h-screen mb-12 sm:mb-0">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center sm:justify-start my-6">
            <Avatar className="h-24 w-24 sm:ml-10">
              <AvatarFallback className="bg-gray-200">
                <Image
                  src={user?.image || "/placeholder.svg"}
                  alt="User profile picture"
                  width={96}
                  height={96}
                  className="aspect-square rounded-full bg-background object-cover"
                />
              </AvatarFallback>
            </Avatar>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 w-full gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} disabled />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" {...register("weight", { valueAsNumber: true })} />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" {...register("height", { valueAsNumber: true })} />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" {...register("age", { valueAsNumber: true })} />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                      <SelectTrigger id="gender">
                        <SelectValue>{field.value ? field.value : "Select gender"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={!isDirty}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
      <div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Health Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex">
                <span>BMI (Body Mass Index):</span>
                <span className={`font-bold ${getBMIColor(parseFloat(bmi!))}`}>{bmi}</span>
              </div>
              <div className="flex">
                <span>Category:</span>
                <span className="font-bold">{bmiCategory}</span>
              </div>
              {bmi && (
                <Progress value={(parseFloat(bmi) / 30) * 100} className="w-full"/>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
