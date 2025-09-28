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

type VisibleData = {
  [key: string]: boolean;
  athlete: boolean;
  peer: boolean;
  pro: boolean;
};

export default function PeerComparisonRadarChart({ data }: PeerComparisonRadarChartProps) {
  const [visible, setVisible] = useState<VisibleData>({ athlete: true, peer: true, pro: true });

  const toggleVisibility = (dataKey: keyof VisibleData) => {
    setVisible(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };
  
  const handleLegendClick = (e: any) => {
    toggleVisibility(e.dataKey);
  }

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
            {visible.athlete && <Radar
              name="You"
              dataKey="athlete"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.1}
              strokeWidth={2}
            />}
            {visible.peer && <Radar
              name="Peer Avg"
              dataKey="peer"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.1}
              strokeWidth={2}
            />}
             {visible.pro && <Radar
              name="Pro Avg"
              dataKey="pro"
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
              fillOpacity={0.1}
              strokeWidth={2}
            />}
            <Legend onClick={handleLegendClick} />
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
