'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, AnalysisResult } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';

interface TeamMember {
  user: User;
  analysis: AnalysisResult | undefined;
}

interface AthleteRiskTableProps {
  teamMembers: TeamMember[];
}

type SortKey = 'name' | 'fitness' | 'risk';
type SortDirection = 'asc' | 'desc';

export default function AthleteRiskTable({ teamMembers }: AthleteRiskTableProps) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'risk', direction: 'desc' });

  const getRiskVariant = (risk: number): 'destructive' | 'secondary' | 'default' => {
    if (risk > 60) return 'destructive';
    if (risk > 30) return 'secondary';
    return 'default';
  };

  const sortedMembers = [...teamMembers].sort((a, b) => {
    let aValue, bValue;

    switch (sortConfig.key) {
      case 'name':
        aValue = a.user.displayName;
        bValue = b.user.displayName;
        break;
      case 'fitness':
        aValue = a.analysis?.fitnessScore ?? -1;
        bValue = b.analysis?.fitnessScore ?? -1;
        break;
      case 'risk':
        aValue = a.analysis?.injuryRiskPercent ?? -1;
        bValue = b.analysis?.injuryRiskPercent ?? -1;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUpDown className="ml-2 h-4 w-4" /> : 
      <ArrowUpDown className="ml-2 h-4 w-4" />; // Simplified for UI clarity
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" onClick={() => requestSort('name')} className="px-0">
              Athlete
              {getSortIndicator('name')}
            </Button>
          </TableHead>
          <TableHead className="text-center">
             <Button variant="ghost" onClick={() => requestSort('fitness')} className="px-0">
              Fitness Score
              {getSortIndicator('fitness')}
            </Button>
          </TableHead>
          <TableHead className="text-right">
            <Button variant="ghost" onClick={() => requestSort('risk')} className="px-0">
              Injury Risk
              {getSortIndicator('risk')}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedMembers.map(({ user, analysis }) => (
          <TableRow key={user.uid} onClick={() => router.push(`/athlete/${user.uid}`)} className="cursor-pointer">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.photoURL} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.displayName}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center font-medium">
              {analysis ? `${analysis.fitnessScore}` : 'N/A'}
            </TableCell>
            <TableCell className="text-right">
              {analysis ? (
                <Badge variant={getRiskVariant(analysis.injuryRiskPercent)} className="text-base">
                  {analysis.injuryRiskPercent}%
                </Badge>
              ) : (
                'N/A'
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
