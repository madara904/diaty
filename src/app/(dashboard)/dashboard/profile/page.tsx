"use server"
import ProfileSection from "./components/ProfileSection"
import { getUserData } from "@/lib/getUserData"
import React from "react"

export default async function Profile () {
 
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
