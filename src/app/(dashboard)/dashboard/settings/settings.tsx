"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { usePremium } from "@/context/Premium"
import Dialog from "../components/ui/Dialog"
import { Button, buttonVariants } from "@/components/ui/Button"


const SettingsPlan = () => {
    const { isPremium, setIsPremium} = usePremium();


    const handleAction = (actionType: "confirm" | "cancel") => {
      if (actionType === 'confirm') {
        setIsPremium(!isPremium);
      } else if (actionType === 'cancel') {
      }
    };

    return (
      <>
        <Card className="sm:col-span-2 mt-4">
          <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Your Plan</CardTitle>
              <CardDescription className="pt-2 pb-2">Change your Plan here</CardDescription>
              <CardContent className="p-0 pb-2">
            {isPremium ? 
            <Badge 
            variant={"badge_premium"} 
            className="bg-violet-500">Premium</Badge> 
            : 
            <Badge 
            variant={"destructive"} 
            className="hover:bg-destructive/100">Free</Badge>
            }
            </CardContent>
          </div>
          <div className="pt-5">
            <Dialog
              trigger=
              {<Button className="md:w-min" 
              >Change</Button>}
              title="Upgrade"
              description="Are you sure you want to change your current Plan?"
              cancel="No, Keep Current Plan"
              action="Yes, Change Plan"
              onConfirm={() => handleAction('confirm')}
              onCancel={() => handleAction('cancel')}
              cancelButtonClass={buttonVariants({ variant: "outline" })} 
              actionButtonClass={buttonVariants({ variant: "destructive" })}
            />
          </div>
          </CardHeader>
        </Card>
      </>
    )
  }
  
  export default SettingsPlan
