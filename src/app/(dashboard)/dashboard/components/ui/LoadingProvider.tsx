"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const LoadingContext = createContext({ loading: false, startLoading: () => {} })

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startLoading = useCallback(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1)
  }, [])

  const stopLoading = useCallback(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    stopLoading()
  }, [pathname, searchParams, stopLoading])

  return (
    <LoadingContext.Provider value={{ loading, startLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)