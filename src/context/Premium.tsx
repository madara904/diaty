"use client"

import { createContext, useContext, useState, ReactNode } from 'react';


interface PremiumContextProps {
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
}


const PremiumContext = createContext<PremiumContextProps | undefined>(undefined);


export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);

  return (
    <PremiumContext.Provider value={{ isPremium, setIsPremium }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};