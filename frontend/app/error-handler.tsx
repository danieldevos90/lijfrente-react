'use client';

import { useEffect } from 'react';

export function ErrorHandler() {
  useEffect(() => {
    // Suppress unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress 401-related errors
      if (event.reason?.message?.includes('401') || 
          event.reason?.status === 401 ||
          event.reason?.response?.status === 401) {
        event.preventDefault();
        return;
      }
    };

    // Suppress console errors for 401s
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (message.includes('401') || message.includes('Unauthorized')) {
        return; // Suppress 401 errors
      }
      originalError.apply(console, args);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.error = originalError;
    };
  }, []);

  return null;
}
