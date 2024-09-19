'use client'

import { useRef } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { changePassword } from "../actions/actions"
import { Button } from "@/app/components/ui/Button" 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { toast } from "@/app/components/hooks/use-toast"
import { Session } from "next-auth"


interface ProfileSectionProps { 
    user: Session["user"];
    }


function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Changing...' : 'Change Password'}
    </Button>
  )
}

export default function ProfileSection( { user } : ProfileSectionProps ) {
  const [state, formAction] = useFormState(changePassword, null)
  const formRef = useRef<HTMLFormElement>(null)

  if (state?.message) {
    toast({
      title: state.message,
      description: state.errors ? "Please correct the errors and try again." : "Your password has been updated.",
    })
    if (!state.errors) {
      formRef.current?.reset()
    }
  }

  return (
    <Card className="w-full max-w-2xl mt-4">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your account settings and change your password</CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={user?.name || ""} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
              />
              {state?.errors?.currentPassword && (
                <p className="text-sm text-red-500">{state.errors.currentPassword[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
              />
              {state?.errors?.newPassword && (
                <p className="text-sm text-red-500">{state.errors.newPassword[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
              />
              {state?.errors?.confirmPassword && (
                <p className="text-sm text-red-500">{state.errors.confirmPassword[0]}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  )
}