'use client';

import LiveMetricCard from './live-metric-card';
import ReadinessRadarChart from '../charts/readiness-radar-chart';
import HistoricalDataChart from '../charts/historical-data-chart';
import { HeartPulse, ShieldAlert, Zap } from 'lucide-react';
import { mockAnalysisResults } from '@/lib/mock-data';
import { useAuth } from '@/lib/hooks';
import { useState, useEffect } from 'react';

const generateHeartRateData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: 60 + Math.random() * 40,
  }));
};

export default function AthleteDashboard() {
  const { user } = useAuth();
  const [liveMetrics, setLiveMetrics] = useState({
    heartRate: 78,
    stress: 25,
    injuryRisk: 15,
  });

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

  if (!athleteData) {
    return <div>No analysis data available for this athlete.</div>;
  }
  
  const readinessData = [
    { subject: 'Fitness', score: athleteData.fitnessScore, fullMark: 100 },
    { subject: 'Stamina', score: athleteData.staminaScore, fullMark: 100 },
    { subject: 'Strength', score: athleteData.strengthScore, fullMark: 100 },
    { subject: 'Reflex', score: athleteData.reflexScore, fullMark: 100 },
    { subject: 'Neural', score: athleteData.neuralScore, fullMark: 100 },
  ];

  const heartRateData = generateHeartRateData();

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReadinessRadarChart data={readinessData} />
        <HistoricalDataChart
          data={heartRateData}
          title="Heart Rate History"
          description="Your heart rate over the last 24 hours."
          dataKey="Heart Rate"
          unit="bpm"
        />
      </div>
    </div>
  );
}
