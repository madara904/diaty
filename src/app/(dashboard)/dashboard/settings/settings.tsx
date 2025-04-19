'use client';

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { PlanTemplate } from "@prisma/client";
import { User } from "next-auth";
import { useToast } from "@/app/components/hooks/use-toast";

interface SettingsProps {
  plan: PlanTemplate | null;
  user: User | null;
  availablePlans: PlanTemplate[];
}

const Settings = ({ plan, user, availablePlans }: SettingsProps) => {
  const [currentPlan, setCurrentPlan] = useState(plan?.name || ""); // Track plan name only
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog state
  const { toast } = useToast();

  // Handle the form submission and plan change
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state when submitting

    const formData = new FormData(e.currentTarget);
    const selectedPlan = formData.get("plan");

    try {
      const response = await fetch("/api/change-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Correct content type
        },
        body: JSON.stringify({ plan: selectedPlan }), // Send JSON object
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentPlan(selectedPlan as string); // Update current plan state
        setIsDialogOpen(false);

        toast({
          title: "Success",
          description: `You have successfully changed to the ${selectedPlan} plan.`,
          variant: "default",
          duration: 2000
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "An error occurred while changing your plan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while changing your plan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Reset loading state after the request is done
    }
  };

  return (
    <Card className="shadow-md mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Current Plan: <span className="text-purple-700">{currentPlan}</span></CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>Change my Plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Your Plan</DialogTitle>
              <DialogDescription>
                Select a plan and click "Save" to change your plan.
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4 mt-4">
                    <Select name="plan" defaultValue={currentPlan}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availablePlans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.name}>
                              {plan.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Settings;
