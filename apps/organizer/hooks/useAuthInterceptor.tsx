// hooks/useAuthInterceptor.ts
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export function useAuthInterceptor() {
  useEffect(() => {
    // Store original fetch
    const originalFetch = window.fetch;

    // Override fetch
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Check for 401
      if (response.status === 401) {
        // Clone response before consuming it
        const clonedResponse = response.clone();
        
        // Sign out and redirect
        await signOut({ 
          callbackUrl: '/auth/login',
          redirect: true 
        });
        
        return clonedResponse;
      }

      return response;
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
}

// Usage in your root layout or provider:
// 'use client'
// export default function RootProvider({ children }) {
//   useAuthInterceptor();
//   return <>{children}</>;
// }