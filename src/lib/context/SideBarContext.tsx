"use client";

import { createContext, useState, useContext, ReactNode } from "react";


const SideBarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
} | null>(null);


export const SideBarProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SideBarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SideBarContext.Provider>
  );
};


export const useSideBarContext = () => {
  const context = useContext(SideBarContext);
  if (!context) {
    throw new Error("useSideBarContext must be used within a SideBarProvider");
  }
  return context;
};
