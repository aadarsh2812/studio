'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface InjuryHotspotProps {
  predictedInjuryPart: string;
  injuryRiskPercent: number;
  className?: string;
}

const BodyPart = ({ id, path, partName, activePart, risk }: { id: string; path: string; partName: string; activePart: string; risk: number }) => {
  const isActive = partName.toLowerCase().includes(activePart.toLowerCase()) || activePart.toLowerCase().includes(partName.toLowerCase());
  const colorClass = risk > 60 ? 'fill-destructive/70' : 'fill-orange-500/70';
  
  return (
    <path
      id={id}
      d={path}
      className={cn(
        'fill-muted-foreground/20 transition-colors duration-300 stroke-background stroke-2',
        isActive && colorClass
      )}
    />
  );
};

const BodySVG = ({ parts, activePart, risk }: { parts: any[], activePart: string, risk: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 400"
    className="h-full w-auto"
  >
    {parts.map(part => (
      <BodyPart key={part.id} {...part} activePart={activePart} risk={risk} />
    ))}
  </svg>
);

const frontParts = [
    { id: 'front-head', path: "M99.5,16.5c-11.05,0-20,8.95-20,20s8.95,20,20,20s20-8.95,20-20S110.55,16.5,99.5,16.5z", partName: 'Head' },
    { id: 'front-neck', path: "M92.5,56.5h14v10h-14z", partName: 'Neck' },
    { id: 'front-left-shoulder', path: "M77.5,66.5c-5.52,0-10,4.48-10,10v5h-10v-5c0-8.28,6.72-15,15-15h5z", partName: 'Shoulder'},
    { id: 'front-right-shoulder', path: "M121.5,66.5c5.52,0,10,4.48,10,10v5h10v-5c0-8.28-6.72-15-15-15h-5z", partName: 'Shoulder'},
    { id: 'front-torso', path: "M77.5,66.5h44v90h-44z", partName: 'Torso' },
    { id: 'front-left-arm', path: "M52.5,76.5h15v80h-15z", partName: 'Left Arm' },
    { id: 'front-right-arm', path: "M131.5,76.5h15v80h-15z", partName: 'Right Arm' },
    { id: 'front-left-leg', path: "M77.5,156.5h20v110h-20z", partName: 'Left Leg' },
    { id: 'front-right-leg', path: "M101.5,156.5h20v110h-20z", partName: 'Right Leg' },
    { id: 'front-left-knee', path: "M77.5,216.5h20v30h-20z", partName: 'Knee' },
    { id: 'front-right-knee', path: "M101.5,216.5h20v30h-20z", partName: 'Knee' },
    { id: 'front-left-foot', path: "M77.5,266.5h20v10h-20z", partName: 'Ankle' },
    { id: 'front-right-foot', path: "M101.5,266.5h20v10h-20z", partName: 'Ankle' },
];

const backParts = [
    { id: 'back-head', path: "M99.5,16.5c-11.05,0-20,8.95-20,20s8.95,20,20,20s20-8.95,20-20S110.55,16.5,99.5,16.5z", partName: 'Head' },
    { id: 'back-neck', path: "M92.5,56.5h14v10h-14z", partName: 'Neck' },
    { id: 'back-left-shoulder', path: "M77.5,66.5c-5.52,0-10,4.48-10,10v5h-10v-5c0-8.28,6.72-15,15-15h5z", partName: 'Shoulder'},
    { id: 'back-right-shoulder', path: "M121.5,66.5c5.52,0,10,4.48,10,10v5h10v-5c0-8.28-6.72-15-15-15h-5z", partName: 'Shoulder'},
    { id: 'back-torso', path: "M77.5,66.5h44v90h-44z", partName: 'Back' },
    { id: 'back-left-arm', path: "M52.5,76.5h15v80h-15z", partName: 'Left Arm' },
    { id: 'back-right-arm', path: "M131.5,76.5h15v80h-15z", partName: 'Right Arm' },
    { id: 'back-left-leg', path: "M77.5,156.5h20v110h-20z", partName: 'Left Leg' },
    { id: 'back-right-leg', path: "M101.5,156.5h20v110h-20z", partName: 'Right Leg' },
    { id: 'back-left-hamstring', path: "M77.5,186.5h20v50h-20z", partName: 'Hamstring' },
    { id: 'back-right-hamstring', path: "M101.5,186.5h20v50h-20z", partName: 'Hamstring' },
    { id: 'back-left-knee', path: "M77.5,216.5h20v30h-20z", partName: 'Knee' },
    { id: 'back-right-knee', path: "M101.5,216.5h20v30h-20z", partName: 'Knee' },
    { id: 'back-left-foot', path: "M77.5,266.5h20v10h-20z", partName: 'Ankle' },
    { id: 'back-right-foot', path: "M101.5,266.5h20v10h-20z", partName: 'Ankle' },
];

export default function InjuryHotspot({ predictedInjuryPart, injuryRiskPercent, className }: InjuryHotspotProps) {
  const [view, setView] = useState<'front' | 'back'>('front');

  const toggleView = () => {
    setView(current => (current === 'front' ? 'back' : 'front'));
  };

  const getRiskColor = () => {
    if (injuryRiskPercent > 60) return 'text-destructive';
    if (injuryRiskPercent > 30) return 'text-orange-500';
    return 'text-green-500';
  };

  const parts = view === 'front' ? frontParts : backParts;
  const buttonLabel = view === 'front' ? 'F' : 'B';

  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow duration-300 h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Injury Hotspot</CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-full">
        <div className="grid grid-cols-3 items-center gap-4 h-full">
            <div className="col-span-2 h-[350px] flex items-center justify-center">
                <BodySVG parts={parts} activePart={predictedInjuryPart} risk={injuryRiskPercent} />
            </div>
            <div className="col-span-1 flex flex-col items-center justify-between h-full py-4">
                <div className="text-center">
                    <span className="text-xs text-muted-foreground">Highest Risk Area</span>
                    <p className="font-bold text-lg">{predictedInjuryPart}</p>
                </div>
                <div className="text-center">
                    <span className="text-xs text-muted-foreground">Risk Level</span>
                    <p className={cn("text-5xl font-bold font-headline", getRiskColor())}>
                        {injuryRiskPercent}%
                    </p>
                </div>
                <Button onClick={toggleView} variant="outline" size="icon" className="h-10 w-10 rounded-full">
                    <span className="font-bold">{buttonLabel}</span>
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
