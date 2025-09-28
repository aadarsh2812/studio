import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveMetricCardProps {
  title: string;
  value: string;
  description: string;
  Icon: LucideIcon;
  colorClassName: string;
  className?: string;
}

export default function LiveMetricCard({ title, value, description, Icon, colorClassName, className }: LiveMetricCardProps) {
  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow duration-300 h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${colorClassName}`} />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-headline">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
