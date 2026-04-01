import { redirect } from 'next/navigation';

export default function LinksRedirectPage() {
  redirect('/affiliate?tab=links');
}
