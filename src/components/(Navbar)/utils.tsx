"use client"

import { useEffect, useState } from "react";



export default function Utils () {

    

const [quickLogin, setquickLogin] = useState(false)
const [showBackground, setShowBackground] = useState(false)

const TOP_OFFSET = 5;

  
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY >= TOP_OFFSET) {
      setShowBackground(true)
    } else {
      setShowBackground(false)
    }
  }

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  }
}, []);




const quickLoginFC = () => {
  !quickLogin ? setquickLogin(true) : setquickLogin(false)

    return(<></>);

  }
}