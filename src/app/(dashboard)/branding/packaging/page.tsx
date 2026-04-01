'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PackagingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/branding');
  }, [router]);

  return null;
}
