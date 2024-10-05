"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, User, Settings, BookCheck, Menu, X, ArrowLeftToLine, ArrowRightToLine, PlusIcon, Plus } from "lucide-react"
import { Button } from "@/app/components/ui/Button"
import Link from "next/link"
import React from "react"
import { useLoading } from "../ui/LoadingProvider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip"

interface SidebarItem {
  id: string
  label: string
  link: string
  icon: JSX.Element
}

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  toggleCollapse: () => void
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { startLoading } = useLoading()

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Close mobile sidebar on route change
    setIsMobileMenuOpen(false)
  }, [pathname])

  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      { id: "overview", label: "Overview", link: "/dashboard", icon: <Home className="w-6 h-6" /> },
      { id: "diaty", label: "Diaty", link: "/dashboard/diaty", icon: <BookCheck className="w-6 h-6" /> },
      { id: "profile", label: "Profile", link: "/dashboard/profile", icon: <User className="w-6 h-6" /> },
      { id: "settings", label: "Settings", link: "/dashboard/settings", icon: <Settings className="w-6 h-6" /> },
    ],
    []
  )

  const isActive = (path: string) => pathname === path

  const handleItemClick = useCallback((link: string) => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false)
    }
    startLoading()
    router.push(link)
  }, [router, startLoading])

  const SidebarContent = useMemo(
    () => () => (
      <div className="p-4">
        <div className="mb-10">
          {!isMobileMenuOpen && (
            <Button
              onClick={toggleCollapse}
              className="p-2 bg-gray-700 text-white hover:bg-gray-600 mx-1"
              variant="ghost"
            >
              {isCollapsed ? (
                <ArrowRightToLine className="transition-all" />
              ) : (
                <ArrowLeftToLine className="transition-all" />
              )}
            </Button>
          )}
        </div>
        <ul className={cn("space-y-2", isCollapsed && "mt-8")}>
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.link}
                      onClick={(e) => {
                        e.preventDefault()
                        handleItemClick(item.link)
                      }}
                      className={cn(
                        "flex items-center justify-start space-x-3 cursor-pointer p-2 rounded-md transition-all duration-200 w-full",
                        isActive(item.link) ? "bg-primary text-black" : "hover:bg-gray-700 hover:text-white"
                      )}
                    >
                      <div className="p-1 border-2 border-transparent rounded-full">
                        {item.icon}
                      </div>
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </div>
    ),
    [isCollapsed, sidebarItems, isMobileMenuOpen, pathname, handleItemClick]
  )

  return (
    <>
      <Button
        onClick={toggleMobileMenu}
        className="fixed top-3 left-1 z-50 md:hidden focus:outline-none hover:bg-transparent"
        variant="ghost"
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-opacity duration-200 ease-in-out",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div 
          className={cn(
            "fixed inset-0 bg-black transition-opacity duration-200 ease-in-out",
            isMobileMenuOpen ? "opacity-50" : "opacity-0"
          )}
          onClick={toggleMobileMenu}
        />

        <aside 
          className={cn(
            "fixed inset-y-0 left-0 w-64 bg-gray-800 text-primary overflow-y-auto transition-transform duration-200 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent />
        </aside>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 bg-gray-800 text-primary transform transition-all duration-300 ease-in-out hidden md:block",
          isCollapsed ? "w-[85px]" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}