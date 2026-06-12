import { redirect } from 'next/navigation';
import { auth } from '@/modules/auth/lib/auth';
import { LandingPage } from '@/modules/landing/components/landing-page';

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect('/startups');
  }

  return <LandingPage />;
}
