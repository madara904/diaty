"use server"

import { auth } from "@/auth"
import ProfileSection from "./components/ProfileSection"
import { redirect } from "next/navigation"
import { getUserData } from "@/lib/getUserData"

export default async function Profile () {

  const session = await auth()
 
  if (!session || !session.user) {
    redirect("/sign-in")
  }

  const user = await getUserData();

  return (
    <>
    <div className='mt-24 font-medium justify-center min-h-screen'>
      <h1 className='text-4xl'>Profile</h1>
      <ProfileSection user={user}/>
    </div>

    </>
  )
}
