"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Home, User, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const Sidebar: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 md:w-72 bg-gray-800 text-primary transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300`}
            >
                <div className="p-6">
                    <Button
                        onClick={toggleSidebar}
                        className="md:hidden text-white focus:outline-none mb-6"
                        variant={"ghost"}
                        size={"icon"}
                    >
                        <X size={21} />
                    </Button>
                    <h2 className="text-2xl mb-6 text-white">Dashboard</h2>
                    <ul>
                        <li className="mb-4 flex items-center space-x-3">
                            <Home className="w-5 h-5 text-white" />
                            <a href="#" className="hover:text-white">Overview</a>
                        </li>
                        <li className="mb-4 flex items-center space-x-3">
                            <User className="w-5 h-5 text-white" />
                            <a href="#" className="hover:text-white">Profile</a>
                        </li>
                        <li className="mb-4 flex items-center space-x-3">
                            <Settings className="w-5 h-5 text-white" />
                            <a href="#" className="hover:text-white">Settings</a>
                        </li>
                        <li className="mb-4 flex items-center space-x-3">
                            <LogOut className="w-5 h-5 text-white" />
                            <a href="#" className="hover:text-white">Logout</a>
                        </li>
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

            {!isSidebarOpen && (
                <div className="md:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="fixed top-8 left-3 z-50 text-gray-800 focus:outline-none"
                    >
                        <Menu size={21} />
                    </button>
                </div>
            )}
        </>
    );
};

export default Sidebar;