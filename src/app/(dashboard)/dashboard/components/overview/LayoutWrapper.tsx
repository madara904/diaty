"use client";

import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import { useSideBarContext } from "@/lib/context/SideBarContext";
import React from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isCollapsed, setIsCollapsed } = useSideBarContext(); 

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        toggleCollapse={toggleCollapse}
      />
      <div
        className={cn(
          "max-w-7xl p-0",
          isCollapsed ? "max-w-full w-full" : "container mx-auto"
        )}
      >
        {children}
      </div>
    </>
  );
}
