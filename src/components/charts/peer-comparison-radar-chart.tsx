'use client';

import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ComparisonData {
  subject: string;
  athlete: number;
  peer: number;
  pro: number;
}

interface PeerComparisonRadarChartProps {
  data: ComparisonData[];
}

type DataKey = "athlete" | "peer" | "pro";

export default function PeerComparisonRadarChart({ data }: PeerComparisonRadarChartProps) {
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
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            onClick={() => handleLegendClick(entry)}
            className={`flex cursor-pointer items-center gap-2 text-sm ${hidden[entry.dataKey as DataKey] ? 'text-muted-foreground opacity-50' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 32 32" style={{ fill: entry.color }}>
              <path d="M0,16h32v-4h-32Z"/>
            </svg>
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Peer & Pro Comparison</CardTitle>
        <CardDescription>Your scores vs. average peers and top professionals.</CardDescription>
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
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
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
