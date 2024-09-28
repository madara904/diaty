"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/app/components/ui/Button"
import { cn } from "@/lib/utils"
import { Home, User, Settings, BookCheck, Menu, X, ArrowLeftToLine, ArrowRightToLine } from "lucide-react"

interface SidebarItem {
  id: string
  label: string
  link: string
  icon: JSX.Element
}

export default function Sidebar( { isCollapsed, setIsCollapsed, toggleCollapse }: { isCollapsed: boolean, setIsCollapsed: (value: boolean) => void , toggleCollapse: () => void }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      setIsOpen(!isMobileView)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const sidebarItems: SidebarItem[] = [
    { id: "overview", label: "Overview", link: "/dashboard", icon: <Home className="w-6 h-6" /> },
    { id: "diary", label: "Diary", link: "", icon: <BookCheck className="w-6 h-6" /> },
    { id: "profile", label: "Profile", link: "/dashboard/profile", icon: <User className="w-6 h-6" /> },
    { id: "settings", label: "Settings", link: "/dashboard/settings", icon: <Settings className="w-6 h-6" /> },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Blurred overlay when mobile sidebar is open */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-300" />
      )}
      
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-gray-800 text-primary transform transition-all duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          width: isCollapsed ? "85px" : "250px",
        }}
      >
        <div className="p-4">
          {isMobile && (
            <Button
              onClick={toggleSidebar}
              className="md:hidden text-white focus:outline-none mb-4 hover:bg-tra"
              variant="ghost"
            >
              <X size={21} className="text-destructive" />
            </Button>
          )}

          <div className="mb-10">
            {!isMobile && (
              <Button
                onClick={toggleCollapse}
                className="p-2 bg-gray-700 text-white hover:bg-gray-600 mx-1"
                variant="ghost"
              >
                {isCollapsed ? (
                  <ArrowRightToLine className="w-6 h-6 transition-all" />
                ) : (
                  <ArrowLeftToLine className="w-6 h-6 transition-all" />
                )}
              </Button>
            )}
          </div>

          <ul className={cn("space-y-2", isCollapsed && "mt-8")}>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <Link href={item.link}>
                  <span
                    className={cn(
                      "flex items-center justify-start space-x-3 cursor-pointer p-2 rounded-md transition-all duration-200",
                      isActive(item.link) ? "bg-primary text-black" : "hover:bg-gray-700 hover:text-white",
                      "w-full"
                    )}
                  >
                    <div className="p-1 border-2 border-transparent rounded-full">
                      {item.icon}
                    </div>
                    {!isCollapsed && <span>{item.label}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {isMobile && !isOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed top-4 left-1 z-50 md:hidden focus:outline-none hover:bg-transparent"
          variant="ghost"
        >
          <Menu size={21} />
        </Button>
      )}
    </>
  )
}