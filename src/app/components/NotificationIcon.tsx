"use client"

import { Bell } from "lucide-react"
import { Button } from "./ui/Button"

const NotificationIcon = () => {
  return (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <Bell size={16} className="text-muted-foreground"/>
      <span className="absolute top-0 right-0 h-3 w-3 bg-destructive rounded-full flex items-center justify-center text-[10px] text-destructive-foreground">3</span>
    </Button>
  )
}

export default NotificationIcon