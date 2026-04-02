'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BrandingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/branding/packaging');
  }, [router]);

  return null;
}
