'use client';

import LiveMetricCard from './live-metric-card';
import PeerComparisonRadarChart from '../charts/peer-comparison-radar-chart';
import HistoricalDataChart from '../charts/historical-data-chart';
import { HeartPulse, ShieldAlert, Zap, Droplets } from 'lucide-react';
import { mockAnalysisResults, mockUsers } from '@/lib/mock-data';
import { useAuth } from '@/lib/hooks';
import { useState, useEffect } from 'react';
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
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    stress: 25,
    injuryRisk: 15,
  });
  const [selectedPro, setSelectedPro] = useState<User | null>(null);

  const athleteData = mockAnalysisResults.find(r => r.athleteId === user?.uid);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        bloodPressureSystolic: Math.round(prev.bloodPressureSystolic + (Math.random() - 0.5) * 4),
        bloodPressureDiastolic: Math.round(prev.bloodPressureDiastolic + (Math.random() - 0.5) * 3),
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
  const oxygenData = generateRandomData(98, 4);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <LiveMetricCard 
          title="Live Blood Pressure"
          value={`${liveMetrics.bloodPressureSystolic}/${liveMetrics.bloodPressureDiastolic} mmHg`}
          description="Your current blood pressure"
          Icon={HeartPulse}
          colorClassName="text-red-500"
          className="md:col-span-3"
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
          className="md:col-span-2"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PeerComparisonRadarChart 
            data={comparisonData} 
            proName={selectedPro?.displayName} 
            teammates={teammates}
            onProChange={handleProChange}
        />
        <HistoricalDataChart
          data={heartRateData}
          title="Heart Rate History"
          description="Your heart rate over the last 24 hours."
          dataKey="Heart Rate"
          unit="bpm"
          lineType="linear"
        />
        <HistoricalDataChart
          data={oxygenData}
          title="Blood Oxygen (SpO2)"
          description="Oxygen saturation over the last 24 hours."
          dataKey="SpO2"
          unit="%"
        />
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
