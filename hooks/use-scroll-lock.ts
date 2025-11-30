import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * @param isLocked - Boolean value to determine if scroll should be locked
 */
export const useScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (!isLocked) {
      // Restore scroll
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
      return;
    }

    // Get the current scroll position before locking
    const scrollY = window.scrollY;
    
    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Cleanup function
    return () => {
      // Restore scroll position and styles
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.top = 'unset';
      document.body.style.width = 'unset';
      document.body.style.paddingRight = '0px';
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
};
