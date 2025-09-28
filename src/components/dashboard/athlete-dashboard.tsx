'use client';

import LiveMetricCard from './live-metric-card';
import PeerComparisonRadarChart from '../charts/peer-comparison-radar-chart';
import HistoricalDataChart from '../charts/historical-data-chart';
import { HeartPulse, ShieldAlert, Zap, Users } from 'lucide-react';
import { mockAnalysisResults, mockUsers } from '@/lib/mock-data';
import { useAuth } from '@/lib/hooks';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User } from '@/lib/types';

const generateRandomData = (base: number, range: number) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.round(base + (Math.random() - 0.5) * range),
  }));
};

export default function AthleteDashboard() {
  const { user } = useAuth();
  const [liveMetrics, setLiveMetrics] = useState({
    heartRate: 78,
    stress: 25,
    injuryRisk: 15,
  });
  const [selectedPro, setSelectedPro] = useState<User | null>(null);

  const athleteData = mockAnalysisResults.find(r => r.athleteId === user?.uid);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        heartRate: Math.round(prev.heartRate + (Math.random() - 0.5) * 4),
        stress: Math.round(Math.max(0, Math.min(100, prev.stress + (Math.random() - 0.5) * 6))),
        injuryRisk: Math.round(Math.max(0, Math.min(100, prev.injuryRisk + (Math.random() - 0.6) * 4))),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!athleteData || !user) {
    return <div>No analysis data available for this athlete.</div>;
  }
  
  const teammates = mockUsers.filter(
    (u) =>
      u.role === 'athlete' &&
      u.uid !== user.uid &&
      u.teamIds?.some((id) => user.teamIds?.includes(id))
  );

  const handleProChange = (athleteId: string) => {
    const pro = mockUsers.find(u => u.uid === athleteId);
    setSelectedPro(pro || null);
  };
  
  const proData = selectedPro ? mockAnalysisResults.find(r => r.athleteId === selectedPro.uid) : null;

  const comparisonData = [
    { subject: 'Fitness', athlete: athleteData.fitnessScore, peer: 78, pro: proData?.fitnessScore ?? 95 },
    { subject: 'Stamina', athlete: athleteData.staminaScore, peer: 82, pro: proData?.staminaScore ?? 98 },
    { subject: 'Strength', athlete: athleteData.strengthScore, peer: 75, pro: proData?.strengthScore ?? 92 },
    { subject: 'Reflex', athlete: athleteData.reflexScore, peer: 88, pro: proData?.reflexScore ?? 96 },
    { subject: 'Neural', athlete: athleteData.neuralScore, peer: 85, pro: proData?.neuralScore ?? 94 },
  ];

  const heartRateData = generateRandomData(70, 40);
  const emgData = generateRandomData(500, 300);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LiveMetricCard 
          title="Live Heart Rate"
          value={`${liveMetrics.heartRate} bpm`}
          description="Your current heart rate"
          Icon={HeartPulse}
          colorClassName="text-red-500"
        />
        <LiveMetricCard 
          title="Stress Level"
          value={`${liveMetrics.stress}%`}
          description="Physiological stress index"
          Icon={Zap}
          colorClassName="text-yellow-500"
        />
        <LiveMetricCard 
          title="Injury Risk"
          value={`${liveMetrics.injuryRisk}%`}
          description={`High-risk: ${athleteData.predictedInjuryPart}`}
          Icon={ShieldAlert}
          colorClassName="text-orange-500"
        />
      </div>
       <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Compare Against a Teammate
            </CardTitle>
            <CardDescription>Select a teammate to compare your performance metrics against theirs.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleProChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a teammate..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pro">Pro Athlete (Avg)</SelectItem>
                {teammates.map(t => (
                  <SelectItem key={t.uid} value={t.uid}>{t.displayName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <div/>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PeerComparisonRadarChart data={comparisonData} proName={selectedPro?.displayName} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HistoricalDataChart
          data={heartRateData}
          title="Heart Rate History"
          description="Your heart rate over the last 24 hours."
          dataKey="Heart Rate"
          unit="bpm"
        />
        <HistoricalDataChart
            data={emgData}
            title="EMG Muscle Activity"
            description="Electromyography activity over the last 24 hours."
            dataKey="EMG"
            unit="mV"
        />
      </div>
    </div>
  );
}
