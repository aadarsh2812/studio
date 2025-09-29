'use client';

import LiveMetricCard from './live-metric-card';
import PeerComparisonRadarChart from '../charts/peer-comparison-radar-chart';
import HistoricalDataChart from '../charts/historical-data-chart';
import { HeartPulse, Zap } from 'lucide-react';
import { BloodPressureIcon } from '../icons/blood-pressure';
import { mockAnalysisResults, mockUsers } from '@/lib/mock-data';
import { useAuth } from '@/lib/hooks';
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import InjuryHotspot from '../athlete/injury-hotspot';
import DeviceStatus from './device-status';

const generateRandomData = (base: number, range: number) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.round(base + (Math.random() - 0.5) * range),
  }));
};

export default function AthleteDashboard() {
  const { user } = useAuth();
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    bloodPressureSystolic: 0,
    bloodPressureDiastolic: 0,
    stress: 0,
  });
  const [showPastData, setShowPastData] = useState(false);
  const [selectedPro, setSelectedPro] = useState<User | null>(null);

  const athleteData = mockAnalysisResults.find(r => r.athleteId === user?.uid);

  // Handle device connection status change
  const handleConnectionChange = (connected: boolean) => {
    setIsDeviceConnected(connected);
    
    if (!connected) {
      // Reset metrics to zero when device disconnects
      setLiveMetrics({
        bloodPressureSystolic: 0,
        bloodPressureDiastolic: 0,
        stress: 0,
      });
    } else {
      // Restore default values when device connects
      setLiveMetrics({
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        stress: 25,
      });
    }
  };

  useEffect(() => {
    if (!isDeviceConnected) return;
    
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        bloodPressureSystolic: Math.round(prev.bloodPressureSystolic + (Math.random() - 0.5) * 4),
        bloodPressureDiastolic: Math.round(prev.bloodPressureDiastolic + (Math.random() - 0.5) * 3),
        stress: Math.round(Math.max(0, Math.min(100, prev.stress + (Math.random() - 0.5) * 6))),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isDeviceConnected]);
  
  // Listen for device connection events from sidebar
  useEffect(() => {
    const handleDeviceConnectionChange = (event: CustomEvent) => {
      const { connected } = event.detail;
      handleConnectionChange(connected);
      
      // Dispatch global event to synchronize all status indicators
      window.dispatchEvent(new CustomEvent('global-device-status-change', { 
        detail: { connected: connected }
      }));
    };
    
    const handleShowPastData = (event: CustomEvent) => {
      setShowPastData(event.detail.showPastData);
    };
    
    // Listen for global status changes
    const handleGlobalStatusChange = (event: CustomEvent) => {
      const { connected } = event.detail;
      handleConnectionChange(connected);
    };
    
    window.addEventListener('device-connection-change', handleDeviceConnectionChange as EventListener);
    window.addEventListener('show-past-data', handleShowPastData as EventListener);
    window.addEventListener('global-device-status-change', handleGlobalStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('device-connection-change', handleDeviceConnectionChange as EventListener);
      window.removeEventListener('show-past-data', handleShowPastData as EventListener);
      window.removeEventListener('global-device-status-change', handleGlobalStatusChange as EventListener);
    };
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

  // Generate data based on connection status and past data request
  const pastHeartRateData = generateRandomData(70, 40);
  const pastEmgData = generateRandomData(500, 300);
  const pastOxygenData = generateRandomData(98, 4);
  
  const heartRateData = isDeviceConnected ? generateRandomData(70, 40) : 
                        showPastData ? pastHeartRateData : 
                        Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 0 }));
  
  const emgData = isDeviceConnected ? generateRandomData(500, 300) : 
                 showPastData ? pastEmgData : 
                 Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 0 }));
  
  const oxygenData = isDeviceConnected ? generateRandomData(98, 4) : 
                    showPastData ? pastOxygenData : 
                    Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: 0 }));

  return (
    <div className="grid gap-6">
      {/* Device Status Indicator */}
      <DeviceStatus 
        autoToggle={true} 
        initialStatus={isDeviceConnected}
        onConnectionChange={handleConnectionChange}
      />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <LiveMetricCard 
              title="Heart Rate"
              value={`${isDeviceConnected ? Math.round(70 + Math.random() * 10) : 0} bpm`}
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
              title="Blood Pressure"
              value={`${liveMetrics.bloodPressureSystolic}/${liveMetrics.bloodPressureDiastolic} mmHg`}
              description="Your current blood pressure"
              Icon={BloodPressureIcon}
              colorClassName="text-blue-500"
            />
        </div>
        <div className="lg:col-span-2">
            <InjuryHotspot
              predictedInjuryPart={athleteData.predictedInjuryPart}
              injuryRiskPercent={athleteData.injuryRiskPercent}
            />
        </div>
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
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
