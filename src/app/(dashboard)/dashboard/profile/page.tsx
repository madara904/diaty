"use server"
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardWrapper from '../components/DashboardWrapper'
import ProfileSection from './components/ProfileSection'
import { getUserData } from '@/lib/getUserData'

const ProfilePage = async () => {
  const session = await auth()
  const user = await getUserData()

  if (!user || !session) {
    redirect("/sign-in")
  }

  return (
    <DashboardWrapper title="Profile">
      <ProfileSection user={user} />
    </DashboardWrapper>
  )
}

export default ProfilePage
