"use client"

import React, { useState } from "react";
import { Home, User, Settings, LogOut } from 'lucide-react'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Overview } from "./Overview";

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex text-sm min-h-[600px] gap-3">
      <aside
        className={`fixed inset-y-0 left-0 bg-gray-800 text-primary transform ${
          isSidebarOpen ? "translate-x-0 pt-20  " : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 w-64 md:w-72`}
      >
        <div className="p-6">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white focus:outline-none"
          >
          </button>
          <h2 className="text-2xl mb-6">Dashboard</h2>
          <ul>
            <li className="mb-4 flex items-center space-x-3">
              <Home className="w-5 h-5" />
              <a href="#" className="hover:text-white">Overview</a>
            </li>
            <li className="mb-4 flex items-center space-x-3">
              <User className="w-5 h-5" />
              <a href="#" className="hover:text-white">Profile</a>
            </li>
            <li className="mb-4 flex items-center space-x-3">
              <Settings className="w-5 h-5" />
              <a href="#" className="hover:text-white">Settings</a>
            </li>
            <li className="mb-4 flex items-center space-x-3">
              <LogOut className="w-5 h-5" />
              <a href="#" className="hover:text-white">Logout</a>
            </li>
          </ul>
          <Card className="mt-96 md:mt-36">
            <CardHeader className="p-4 md:p-5">
            <CardTitle>Upgrade to Pro</CardTitle>
            <CardDescription>
            Unlock all features and get unlimited access to our support team.
            </CardDescription>
            </CardHeader>
    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
      <Button size="sm" className="w-full group">
        Upgrade <span className="ml-2 rotate-[320deg] -translate-y-0.5 group-hover:translate- group-hover:text-white group-hover:rotate-[360deg] transition-all text-sm">&rarr;</span>
      </Button>
    </CardContent>
  </Card>
        </div>
      </aside>

      <main
        className={`flex-1 p-6  transition-all duration-300 ${
          isSidebarOpen ? "ml-56 min-h-[560px]" : "ml-0"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="md:hidden mb-4 text-gray-800"
        >
          &#9776;
        </button>
        <h1 className="text-3xl font-bold mb-6">Overview</h1>

        <Overview />

      </main>
    </div>
  );
};

export default DashboardLayout;

