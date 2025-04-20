'use client';

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { PlanTemplate } from "@prisma/client";
import { User } from "next-auth";
import { useToast } from "@/app/components/hooks/use-toast";
import { Switch } from "@/app/components/ui/switch";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { AlertTriangle, Download, FileDown, FileText, Save, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

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

  // Handle account deletion request
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const requestAccountDeletion = async () => {
    if (deleteConfirmText !== user?.email) {
      toast({
        title: "Confirmation Failed",
        description: "Please enter your email correctly to confirm deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/request-account-deletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        toast({
          title: "Request Submitted",
          description: "Your account deletion request has been submitted. You'll receive an email with further instructions.",
          variant: "default",
          duration: 5000
        });
        setShowDeleteConfirm(false);
        setDeleteConfirmText('');
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="plan" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="plan">Plan</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>

      {/* Plan Settings Tab */}
      <TabsContent value="plan">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Current Plan: <span className="text-purple-700">{currentPlan}</span></CardTitle>
            <CardDescription>Manage your subscription plan and preferences</CardDescription>
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
      </TabsContent>

      {/* Account Tab */}
      <TabsContent value="account">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account details and security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="account-email">Email</Label>
                  <Input id="account-email" value={user?.email || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="account-created">Account Created</Label>
                  <Input id="account-created" value={new Date().toLocaleDateString()} disabled />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Security</h3>
              <Button variant="outline" className="w-full sm:w-auto">
                Change Password
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
              {!showDeleteConfirm ? (
                <Button 
                  variant="destructive" 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      This action cannot be undone. All your data will be permanently deleted.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-delete">Type your email to confirm</Label>
                    <Input 
                      id="confirm-delete" 
                      value={deleteConfirmText} 
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder={user?.email || 'your email'}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={requestAccountDeletion}
                      disabled={isLoading || deleteConfirmText !== user?.email}
                    >
                      Confirm Deletion
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Settings;
