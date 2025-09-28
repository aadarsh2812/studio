'use client';

import AthleteRiskTable from '@/components/team/athlete-risk-table';
import { useAuth } from '@/lib/hooks';
import { mockTeams, mockUsers, mockAnalysisResults } from '@/lib/mock-data';
import { User, AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamMember {
  user: User;
  analysis: AnalysisResult | undefined;
}

export default function PhysiotherapistDashboard() {
  const { user } = useAuth();
  
  if (!user || user.role !== 'physiotherapist') {
    return <div>Access Denied.</div>;
  }

  // A physio can see all athletes from all teams for simplicity
  const allAthletes: TeamMember[] = mockUsers
    .filter(u => u.role === 'athlete')
    .map(athleteUser => {
      const athleteAnalysis = mockAnalysisResults.find(a => a.athleteId === athleteUser.uid);
      return { user: athleteUser, analysis: athleteAnalysis };
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Athletes Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Monitoring all athletes for injury risk and performance.</p>
        </CardHeader>
        <CardContent>
          <AthleteRiskTable teamMembers={allAthletes} />
        </CardContent>
      </Card>
    </div>
  );
}
