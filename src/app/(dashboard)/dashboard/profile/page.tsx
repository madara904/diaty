"use server"

import { auth } from "@/auth"
import ProfileSection from "./components/ProfileSection"
import { redirect } from "next/navigation"

export default async function Profile () {

  const session = await auth()
 
  if (!session || !session.user) {
    redirect("/sign-in")
  }

  return (
    <>
    <div className='mt-24 font-medium'>
      <h1 className='text-4xl'>Profile</h1>
    </div>
        <ProfileSection user={session.user}/>
    </>
  )
}
