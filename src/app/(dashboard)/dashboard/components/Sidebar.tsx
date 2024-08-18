"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Home, User, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";
import { link } from "fs";


interface SidebarItem {
    id: string;
    label: string;
    link: string
    icon: JSX.Element,
  }

const Sidebar: React.FC = (  ) => {

    const pathname = usePathname()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const sidebarItems: SidebarItem[] = [
        { id: "overview", label: "Overview", link: "/dashboard", icon: <Home className="w-5 h-5 " /> },
        { id: "profile", label: "Profile", link: "/dashboard/profile", icon: <User className="w-5 h-5 " /> },
        { id: "settings", label: "Settings", link: "/dashboard/", icon: <Settings className="w-5 h-5"  /> },
        { id: "logout", label: "Logout", link: "/dashboard/", icon: <LogOut className="w-5 h-5 " /> }
      ];
    const isActive = (path: string) => pathname === path;

    return (
        <>


            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-primary transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300`}
            >
                <div className="p-4">
                    <Button
                        onClick={toggleSidebar}
                        className="md:hidden text-white focus:outline-none mb-4 p-0 m-0"
                        variant={null}
                    >
                        <X size={21} className="mt-1" />
                    </Button>
                    <h2 className={"text-3xl mt-2 mb-10 text-primary"}>Dashboard </h2>
            <ul>
            {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className={`mb-4 flex items-center space-x-3 cursor-pointer p-2 rounded-md 
                ${isActive(item.link) ? 'bg-primary text-black hover:text-black' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
                      ))}
                    </ul>

                    <Card className="absolute bottom-20 right-2 left-2">
                        <CardHeader className="p-4 md:p-5">
                            <CardTitle>Upgrade to Pro</CardTitle>
                            <CardDescription>
                                Unlock all features and get unlimited access to our support team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                            <Button size="sm" className="w-full group">
                                Upgrade <span className="ml-2 rotate-[320deg] -translate-y-0.5 group-hover:translate-y-0 group-hover:text-white group-hover:rotate-[360deg] transition-all text-sm">&rarr;</span>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </aside>

            {!isSidebarOpen}

            {!isSidebarOpen && (
                <div className="md:hidden">
                    <Button
                        onClick={toggleSidebar}
                        className="fixed top-5 left-3 z-50 text-gray-800 focus:outline-none m-0 p-0"
                        variant={null}
                    >
                        <Menu size={21} />
                    </Button>
                </div>
            )}
        </>
    );
};

export default Sidebar;