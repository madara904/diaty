import { useEffect, useRef, useCallback } from 'react';

// Custom hook to handle keyboard and swipe actions
const useDateNavigation = (onNext: () => void, onPrev: () => void) => {
  const touchStartX = useRef<number | null>(null);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        onNext(); // Move to the next day
      } else if (event.key === 'ArrowLeft') {
        onPrev(); // Move to the previous day
      }
    },
    [onNext, onPrev]
  );

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (touchStartX.current === null) return;

      const touchEndX = event.changedTouches[0].clientX;
      const swipeDistance = touchStartX.current - touchEndX;

      if (swipeDistance > 50) {
        onNext(); // Swipe left, go to the next day
      } else if (swipeDistance < -50) {
        onPrev(); // Swipe right, go to the previous day
      }

      touchStartX.current = null; // Reset the ref after handling the swipe
    },
    [onNext, onPrev]
  );

  useEffect(() => {
    // Listen for keypresses
    window.addEventListener('keydown', handleKeyPress);

    // Listen for touch events for mobile
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyPress, handleTouchStart, handleTouchEnd]);
};

export default useDateNavigation;
