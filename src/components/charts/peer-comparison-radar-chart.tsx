'use client';

import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/lib/types';

interface ComparisonData {
  subject: string;
  athlete: number;
  peer: number;
  pro: number;
}

interface PeerComparisonRadarChartProps {
  data: ComparisonData[];
  proName?: string;
  teammates: User[];
  onProChange: (athleteId: string) => void;
}

type DataKey = "athlete" | "peer" | "pro";

export default function PeerComparisonRadarChart({ data, proName, teammates, onProChange }: PeerComparisonRadarChartProps) {
  const [hidden, setHidden] = useState<Record<DataKey, boolean>>({
    athlete: false,
    peer: false,
    pro: false,
  });

  const toggleSeries = (dataKey: DataKey) => {
    setHidden(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };
  
  const handleLegendClick = (e: { dataKey: DataKey }) => {
    toggleSeries(e.dataKey);
  }

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center gap-4">
        {payload.map((entry: any, index: number) => {
          let value = entry.value;
          if (entry.dataKey === 'pro') {
            value = proName ? proName : 'Pro Avg';
          }
          return (
            <li
              key={`item-${index}`}
              onClick={() => handleLegendClick(entry)}
              className={`flex cursor-pointer items-center gap-2 text-sm ${hidden[entry.dataKey as DataKey] ? 'text-muted-foreground opacity-50' : ''}`}
            >
              <svg width="14" height="14" viewBox="0 0 32 32" style={{ fill: entry.color }}>
                <path d="M0,16h32v-4h-32Z"/>
              </svg>
              <span>{value}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
            <CardTitle>Peer & Pro Comparison</CardTitle>
            <CardDescription>Your scores vs. peers and a selected pro or teammate.</CardDescription>
        </div>
         <Select onValueChange={onProChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a teammate..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pro">Pro Athlete (Avg)</SelectItem>
                {teammates.map(t => (
                  <SelectItem key={t.uid} value={t.uid}>{t.displayName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
            <Radar
              name="You"
              dataKey="athlete"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.1}
              strokeWidth={2}
              hide={hidden.athlete}
            />
            <Radar
              name="Peer Avg"
              dataKey="peer"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.1}
              strokeWidth={2}
              hide={hidden.peer}
            />
             <Radar
              name="Pro Avg"
              dataKey="pro"
              stroke="hsl(var(--chart-4))"
              fill="hsl(var(--chart-4))"
              fillOpacity={0.1}
              strokeWidth={2}
              hide={hidden.pro}
            />
            <Legend content={renderLegend} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
