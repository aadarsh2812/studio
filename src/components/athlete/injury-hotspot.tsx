'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface InjuryHotspotProps {
  predictedInjuryPart: string;
  injuryRiskPercent: number;
  className?: string;
}

const BodyPart = ({ id, path, partName, activePart, risk }: { id: string; path: string; partName: string; activePart: string; risk: number }) => {
  const isActive = partName.toLowerCase() === activePart.toLowerCase();
  const colorClass = risk > 60 ? 'fill-destructive/70' : 'fill-orange-500/70';
  
  return (
    <path
      id={id}
      d={path}
      className={cn(
        'fill-muted-foreground/20 transition-colors duration-300',
        isActive && colorClass
      )}
    />
  );
};

const BodySVG = ({ parts, activePart, risk, isFront = true }: { parts: any[], activePart: string, risk: number, isFront?: boolean }) => (
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
    { id: 'front-head', path: 'M85,30 A20,20 0 1,1 115,30 L115,50 L85,50 Z', partName: 'Head' },
    { id: 'front-neck', path: 'M90,50 h20 v10 h-20 z', partName: 'Neck' },
    { id: 'front-torso', path: 'M70,60 h60 v80 h-60 z', partName: 'Torso' },
    { id: 'front-left-arm', path: 'M50,60 h20 v80 h-20 z', partName: 'Left Arm' },
    { id: 'front-right-arm', path: 'M130,60 h20 v80 h-20 z', partName: 'Right Arm' },
    { id: 'front-left-shoulder', path: 'M70,60 A20,20 0 0,0 50,60', partName: 'Shoulder'},
    { id: 'front-right-shoulder', path: 'M130,60 A20,20 0 0,1 150,60', partName: 'Shoulder'},
    { id: 'front-left-leg', path: 'M70,140 h25 v120 h-25 z', partName: 'Left Leg' },
    { id: 'front-right-leg', path: 'M105,140 h25 v120 h-25 z', partName: 'Right Leg' },
    { id: 'front-left-knee', path: 'M70,200 h25 v30 h-25 z', partName: 'Knee' },
    { id: 'front-right-knee', path: 'M105,200 h25 v30 h-25 z', partName: 'Knee' },
    { id: 'front-left-ankle', path: 'M70,250 h25 v10 h-25 z', partName: 'Ankle' },
    { id: 'front-right-ankle', path: 'M105,250 h25 v10 h-25 z', partName: 'Ankle' },
];

const backParts = [
    { id: 'back-head', path: 'M85,30 A20,20 0 1,1 115,30 L115,50 L85,50 Z', partName: 'Head' },
    { id: 'back-neck', path: 'M90,50 h20 v10 h-20 z', partName: 'Neck' },
    { id: 'back-torso', path: 'M70,60 h60 v80 h-60 z', partName: 'Back' },
    { id: 'back-left-arm', path: 'M50,60 h20 v80 h-20 z', partName: 'Left Arm' },
    { id: 'back-right-arm', path: 'M130,60 h20 v80 h-20 z', partName: 'Right Arm' },
    { id: 'back-left-shoulder', path: 'M70,60 A20,20 0 0,0 50,60', partName: 'Shoulder'},
    { id: 'back-right-shoulder', path: 'M130,60 A20,20 0 0,1 150,60', partName: 'Shoulder'},
    { id: 'back-left-leg', path: 'M70,140 h25 v120 h-25 z', partName: 'Left Leg' },
    { id: 'back-right-leg', path: 'M105,140 h25 v120 h-25 z', partName: 'Right Leg' },
    { id: 'back-left-hamstring', path: 'M70,140 h25 v50 h-25 z', partName: 'Hamstring' },
    { id: 'back-right-hamstring', path: 'M105,140 h25 v50 h-25 z', partName: 'Hamstring' },
    { id: 'back-left-knee', path: 'M70,200 h25 v30 h-25 z', partName: 'Knee' },
    { id: 'back-right-knee', path: 'M105,200 h25 v30 h-25 z', partName: 'Knee' },
    { id: 'back-left-ankle', path: 'M70,250 h25 v10 h-25 z', partName: 'Ankle' },
    { id: 'back-right-ankle', path: 'M105,250 h25 v10 h-25 z', partName: 'Ankle' },
];


export default function InjuryHotspot({ predictedInjuryPart, injuryRiskPercent, className }: InjuryHotspotProps) {
  const getRiskColor = () => {
    if (injuryRiskPercent > 60) return 'text-destructive';
    if (injuryRiskPercent > 30) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow duration-300 h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Injury Hotspot</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex items-center justify-between px-4 pb-2">
            <div className="flex flex-col">
                 <span className="text-xs text-muted-foreground">Highest Risk Area</span>
                <span className="font-bold text-base">{predictedInjuryPart}</span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">Risk Level</span>
                 <span className={cn("text-4xl font-bold font-headline", getRiskColor())}>
                    {injuryRiskPercent}%
                </span>
            </div>
        </div>
        <Tabs defaultValue="front" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="front">Front</TabsTrigger>
            <TabsTrigger value="back">Back</TabsTrigger>
          </TabsList>
          <div className="h-40">
            <TabsContent value="front" className="h-full">
                <BodySVG parts={frontParts} activePart={predictedInjuryPart} risk={injuryRiskPercent} />
            </TabsContent>
            <TabsContent value="back" className="h-full">
                <BodySVG parts={backParts} activePart={predictedInjuryPart} risk={injuryRiskPercent} isFront={false} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
