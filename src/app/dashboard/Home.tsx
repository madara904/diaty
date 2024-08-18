"use client"

import React, { useState } from "react";
import { Overview } from "./Overview";
import Sidebar from "./components/Sidebar";

const DashboardLayout: React.FC = () => {

  return (

  <>
  <Sidebar />
  <Overview />
  </>



  );
};

export default DashboardLayout;

