'use client';

import AthleteRiskTable from '@/components/team/athlete-risk-table';
import { useAuth } from '@/lib/hooks';
import { mockTeams, mockUsers, mockAnalysisResults } from '@/lib/mock-data';
import { User, AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShieldAlert, BarChart } from 'lucide-react';

interface TeamMember {
  user: User;
  analysis: AnalysisResult | undefined;
}

export default function CoachDashboard() {
  const { user } = useAuth();
  
  if (!user || user.role !== 'coach' || !user.teamIds) {
    return <div>Access Denied or No Team Assigned.</div>;
  }

  const team = mockTeams.find(t => user.teamIds?.includes(t.id));
  
  if (!team) {
    return <div>No team data found.</div>;
  }

  const teamMembers: TeamMember[] = team.athleteIds
    .map(athleteId => {
      const athleteUser = mockUsers.find(u => u.uid === athleteId);
      const athleteAnalysis = mockAnalysisResults.find(a => a.athleteId === athleteId);
      return athleteUser ? { user: athleteUser, analysis: athleteAnalysis } : null;
    })
    .filter((member): member is TeamMember => member !== null);

  const highRiskCount = teamMembers.filter(m => m.analysis && m.analysis.injuryRiskPercent > 50).length;
  const averageFitness = teamMembers.reduce((acc, m) => acc + (m.analysis?.fitnessScore || 0), 0) / (teamMembers.length || 1);

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">on team {team.teamName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Risk Athletes</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskCount}</div>
            <p className="text-xs text-muted-foreground">Injury risk over 50%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Fitness Score</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageFitness.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Team-wide average</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <AthleteRiskTable teamMembers={teamMembers} />
        </CardContent>
      </Card>
    </div>
  );
}
