'use client';

import { useParams } from 'next/navigation';
import { mockUsers, mockAnalysisResults } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReadinessRadarChart from '@/components/charts/readiness-radar-chart';
import HistoricalDataChart from '@/components/charts/historical-data-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ReportGeneratorButton from '@/components/athlete/report-generator-button';

const generateRandomData = (base: number, range: number) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.round(base + (Math.random() - 0.5) * range),
  }));
};

export default function AthleteDetailPage() {
  const params = useParams();
  const { athleteId } = params;

  const athlete = mockUsers.find(u => u.uid === athleteId);
  const analysis = mockAnalysisResults.find(a => a.athleteId === athleteId);

  if (!athlete || !analysis) {
    return <div>Athlete data not found.</div>;
  }

  const readinessData = [
    { subject: 'Fitness', score: analysis.fitnessScore, fullMark: 100 },
    { subject: 'Stamina', score: analysis.staminaScore, fullMark: 100 },
    { subject: 'Strength', score: analysis.strengthScore, fullMark: 100 },
    { subject: 'Reflex', score: analysis.reflexScore, fullMark: 100 },
    { subject: 'Neural', score: analysis.neuralScore, fullMark: 100 },
    { subject: 'Stress', score: analysis.stressScore, fullMark: 100 },
  ];
  
  const heartRateData = generateRandomData(70, 40);
  const energyData = generateRandomData(80, 20);
  const emgData = generateRandomData(500, 300);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={athlete.photoURL} alt={athlete.displayName} />
            <AvatarFallback className="text-3xl">{athlete.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-headline text-3xl font-bold">{athlete.displayName}</h1>
            <p className="text-muted-foreground">{athlete.email}</p>
          </div>
        </div>
        <ReportGeneratorButton athleteId={athlete.uid} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between"><span>Fitness Score:</span> <span className="font-bold">{analysis.fitnessScore}</span></div>
            <div className="flex justify-between"><span>Stamina Score:</span> <span className="font-bold">{analysis.staminaScore}</span></div>
            <div className="flex justify-between"><span>Strength Score:</span> <span className="font-bold">{analysis.strengthScore}</span></div>
            <div className="flex justify-between"><span>Injury Risk:</span> <span className="font-bold text-destructive">{analysis.injuryRiskPercent}%</span></div>
            <div className="flex justify-between"><span>Predicted Injury:</span> <span className="font-bold">{analysis.predictedInjuryPart}</span></div>
            <div className="flex justify-between"><span>Stress Level:</span> <span className="font-bold">{analysis.stressScore}%</span></div>
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
            <ReadinessRadarChart data={readinessData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HistoricalDataChart
          data={heartRateData}
          title="Heart Rate History"
          description="Heart rate over the last 24 hours."
          dataKey="Heart Rate"
          unit="bpm"
          lineType="linear"
        />
        <HistoricalDataChart
          data={energyData}
          title="Energy Level History"
          description="Energy levels over the last 24 hours."
          dataKey="Energy"
          unit="%"
        />
      </div>
       <div className="grid grid-cols-1 gap-6">
        <HistoricalDataChart
          data={emgData}
          title="EMG Muscle Activity"
          description="Electromyography activity over the last 24 hours."
          dataKey="EMG"
          unit="mV"
          lineType="linear"
        />
      </div>
    </div>
  );
}
