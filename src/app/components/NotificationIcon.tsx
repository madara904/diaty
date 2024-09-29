"use client"

import { Bell } from "lucide-react"
import { Button } from "./ui/Button"

const NotificationIcon = () => {
  return (
    <Button variant="ghost" size="icon" className="relative rounded-full">
    <Bell size={25} className="text-gray-500"/>
    <span className="absolute top-0 right-0 h-4 w-4 bg-destructive rounded-full flex items-center justify-center text-xs text-destructive-foreground">3</span>
  </Button>
  )
}

export default NotificationIcon