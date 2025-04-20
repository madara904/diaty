"use client"
import { useSession } from "next-auth/react"
import { BookAIcon, LayoutDashboard, Search, ChevronUp, User, Settings, LogOut, User2, Moon, Sun } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/app/components/ui/sidebar"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Diaty",
    url: "/dashboard/diaty",
    icon: BookAIcon,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User2,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]
 
export function AppSidebar() {
  const { data: session } = useSession()
  const { state } = useSidebar()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Only show theme toggle after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const userInitials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : "U"
  
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    size={"default"}
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link href={item.url}>
                      <div className="flex items-center gap-2">
                        <item.icon size={22} className="text-muted-foreground" />
                        <span className="text-base font-medium">{item.title}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {mounted && (
            <SidebarMenuItem>
              <SidebarMenuButton
                size="default"
                tooltip={state === "collapsed" ? "Toggle Theme" : undefined}
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              >
                <div className="flex items-center gap-2">
                  {resolvedTheme === 'dark' ? 
                    <Sun size={22} className="text-muted-foreground" /> : 
                    <Moon size={22} className="text-muted-foreground" />
                  }
                  <span className="text-base font-medium">Toggle Theme</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={state === "collapsed" ? "Account" : undefined}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={session?.user?.image || "/placeholder.svg?height=32&width=32"} 
                      alt={session?.user?.name || "User"} 
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">{session?.user?.name || "Guest User"}</span>
                    <span className="text-xs text-muted-foreground">{session?.user?.email || ""}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}