"use client"

import { useState } from "react";
import { Overview } from "./components/Overview";
import Sidebar from "./components/Sidebar";
import Profile from "./profile/page";
import { usePathname } from "next/navigation";

const DashboardLayout: React.FC = () => {

  return (
  <>
  <Overview />
  </>
  );
};

export default DashboardLayout;

