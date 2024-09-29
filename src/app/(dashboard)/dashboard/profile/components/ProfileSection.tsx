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

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  weight: z.number().min(20, "Weight must be at least 20 kg").max(300, "Weight must be less than 300 kg").nullable(),
  height: z.number().min(100, "Height must be at least 100 cm").max(250, "Height must be less than 250 cm").nullable(),
  age: z.number().min(18, "Age must be at least 18").max(120, "Age must be less than 120").nullable(),
  gender: z.enum(["male", "female", "other"]).nullable(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfilePageProps {
  user: {
    name: string | null
    email: string | null
    weight: number | null
    height: number | null
    age: number | null
    gender: "male" | "female" | "other" | null
    image?: string | null;
  } | null
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [userData, setUserData] = useState<ProfileFormData | null>(null);
  const router = useRouter();
  const { toast } = useToast(); 

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      weight: user?.weight ?? null,
      height: user?.height ?? null,
      age: user?.age ?? null,
      gender: user?.gender ?? null,
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? '',
        email: user.email ?? '',
        weight: user.weight,
        height: user.height,
        age: user.age,
        gender: user.gender,
      })
      setUserData(user as ProfileFormData)
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        toast({
          title: "Success",
          description: `You have successfully changed your profile`,
          variant: "default",
        })
        setUserData(updatedUser)
        reset(updatedUser)

        router.refresh()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData || "An error occurred while changing your profile.",
          variant: "destructive",
        });
     
      }
    } catch (error) {
      console.error("Error updating profile:", error)

    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center sm:justify-start my-8">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-gray-200">
            <Image
            src={user?.image || (userData?.name ? userData.name.split(" ").map((n) => n[0]).join("") : user?.image!)}
            alt="User profile picture"
            width={78}
            height={78}
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
                      <SelectValue>{field.value ? field.value : 'Select gender'}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">male</SelectItem>
                      <SelectItem value="female">female</SelectItem>
                      <SelectItem value="other">other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-min">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  )
}