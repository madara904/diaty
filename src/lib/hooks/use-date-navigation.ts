import { useEffect, useCallback } from 'react'

type Direction = -1 | 1

export function useKeyboardNavigation(onNavigate: (direction: Direction) => void) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      onNavigate(-1)
    } else if (e.key === 'ArrowRight') {
      onNavigate(1)
    }
  }, [onNavigate])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}