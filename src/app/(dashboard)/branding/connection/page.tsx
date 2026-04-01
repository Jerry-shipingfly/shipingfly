'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectionRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/branding');
  }, [router]);

  return null;
}
