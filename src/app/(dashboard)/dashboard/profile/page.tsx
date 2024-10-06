"use server"
import { auth } from "@/auth";
import ProfileSection from "./components/ProfileSection"
import { getUserData } from "@/lib/getUserData"
import { redirect } from "next/navigation";
import React from "react"

export default async function Profile () {
  
  const session = await auth();
  const user = await getUserData();

  if (!user || !session){
    redirect("/sign-in")
}

  return (
    <>
    <div className='mt-24 font-medium justify-center min-h-screen'>
      <ProfileSection user={user}/>
    </div>

    </>
  )
}
