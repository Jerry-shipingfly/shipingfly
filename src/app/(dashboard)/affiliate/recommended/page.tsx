import { redirect } from 'next/navigation';

export default function RecommendedRedirectPage() {
  redirect('/affiliate?tab=recommended');
}
