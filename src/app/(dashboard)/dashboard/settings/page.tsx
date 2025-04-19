"use server";

import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardWrapper from '../components/DashboardWrapper'
import Settings from './settings'
import fetchPlan from '@/lib/fetch-user-plan'
import fetchAvailablePlans from '@/lib/available-plans'

const SettingsPage = async () => {
  const session = await auth()
  const user = session?.user

  if (!user || !session) {
    redirect("/sign-in")
  }

  const fetchedPlan = await fetchPlan(user)
  const plan = fetchedPlan || null
  const availablePlans = await fetchAvailablePlans()

  return (
    <DashboardWrapper title="Settings">
      <Settings user={user} plan={plan} availablePlans={availablePlans} />
    </DashboardWrapper>
  )
}

export default SettingsPage