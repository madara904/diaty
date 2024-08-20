"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { usePremium } from "@/context/Premium"



const SettingsPlan = () => {
    const { isPremium, setIsPremium} = usePremium();
  
    return (

      <>
      <Card className="sm:col-span-2 mt-4">
        <CardHeader className="flex flex-row justify-between">
        <div>
        <CardTitle>Your Plan</CardTitle>
        <CardDescription className="pt-2">
        Change your Plan here
        </CardDescription>
        </div>
        <CardContent className="p-0">
        {isPremium ? 
        <Badge variant={"badge_premium"} className="bg-violet-500">Premium</Badge> 
        : 
        <Badge variant={"destructive"} className="hover:bg-destructive/100">Free</Badge>
        }

        </CardContent>
        </CardHeader>
        </Card>
        <div className="w-full flex md:justify-end mt-5">
        <Button className="w-full sm:w-min" variant={isPremium ? "default" : "default"} onClick={() => {setIsPremium(!isPremium)}}>{!isPremium ? "Upgrade" :  "Free Plan"}</Button>
        </div>

      </>
    )
  }
  
  export default SettingsPlan