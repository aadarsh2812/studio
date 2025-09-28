'use client';

import AthleteRiskTable from '@/components/team/athlete-risk-table';
import { useAuth } from '@/lib/hooks';
import { mockTeams, mockUsers, mockAnalysisResults } from '@/lib/mock-data';
import { User, AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserRole } from '@/lib/types';

interface TeamMember {
  user: User;
  analysis: AnalysisResult | undefined;
}

export default function TeamPage() {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'coach' && user.role !== 'physiotherapist')) {
    return <p>You do not have permission to view this page.</p>;
  }

  const getTeamMembers = (role: UserRole, user: User): TeamMember[] => {
    if (role === 'physiotherapist') {
       return mockUsers
        .filter(u => u.role === 'athlete')
        .map(athleteUser => ({
          user: athleteUser,
          analysis: mockAnalysisResults.find(a => a.athleteId === athleteUser.uid),
        }));
    }

    if (role === 'coach' && user.teamIds) {
      const team = mockTeams.find(t => user.teamIds?.includes(t.id));
      if (!team) return [];
      
      return team.athleteIds
        .map(athleteId => {
          const athleteUser = mockUsers.find(u => u.uid === athleteId);
          return athleteUser ? {
            user: athleteUser,
            analysis: mockAnalysisResults.find(a => a.athleteId === athleteId),
          } : null;
        })
        .filter((member): member is TeamMember => member !== null);
    }

    return [];
  };

  const teamMembers = getTeamMembers(user.role, user);
  const title = user.role === 'coach' ? "My Team" : "All Athletes";
  const description = user.role === 'coach' ? "An overview of your team's current status." : "An overview of all athletes' status.";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <AthleteRiskTable teamMembers={teamMembers} />
        </CardContent>
      </Card>
    </div>
  );
}
