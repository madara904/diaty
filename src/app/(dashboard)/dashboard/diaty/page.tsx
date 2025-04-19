import React from 'react'
import DiatySearch from './products/components/DiatySearch'
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardWrapper from '../components/DashboardWrapper';

const DiatyHome = async ()  => {

  const session = await auth();
  const user = session?.user || null;

  if (!user || !session){
  redirect("/sign-in")
  } 
  
  return (
    <DashboardWrapper title="Diaty Search">
      <DiatySearch />
    </DashboardWrapper>
  )
}

export default DiatyHome