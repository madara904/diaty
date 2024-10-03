import React from 'react'
import DiatySearch from './products/components/DiatySearch'
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const DiatyHome = async ()  => {

  const session = await auth();
  const user = session?.user || null;

  if (!user || !session){
  redirect("/sign-in")
  } 
  
  return (
    <DiatySearch />
  )
}

export default DiatyHome