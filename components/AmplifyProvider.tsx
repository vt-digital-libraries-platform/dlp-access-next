'use client';

import { useEffect } from 'react';
import { initAmplify } from '@/lib/amplifyClient';

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAmplify();
  }, []);

  return <>{children}</>;
}
