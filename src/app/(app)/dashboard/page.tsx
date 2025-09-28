'use client';

import { useAuth } from '@/lib/hooks';
import AthleteDashboard from '@/components/dashboard/athlete-dashboard';
import CoachDashboard from '@/components/dashboard/coach-dashboard';
import PhysiotherapistDashboard from '@/components/dashboard/physiotherapist-dashboard';

function DashboardView() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'athlete':
      return <AthleteDashboard />;
    case 'coach':
      return <CoachDashboard />;
    case 'physiotherapist':
      return <PhysiotherapistDashboard />;
    default:
      return <div>Invalid user role.</div>;
  }
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Welcome back, {user?.displayName?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here's your performance overview for today.</p>
      </div>
      <DashboardView />
    </div>
  );
}
