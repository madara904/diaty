"use client";

import { useLoading } from "./LoadingProvider";
import { useEffect, useState } from "react";

export default function LoadingBar() {
  const { loading } = useLoading();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (loading) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{
          width: loading ? "90%" : "100%",
          transition: loading ? "width 10s cubic-bezier(0.1, 0.05, 0, 1)" : "width 0.1s ease-out",
        }}
      />
    </div>
  );
}