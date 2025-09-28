'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePerformanceReport } from '@/ai/flows/performance-report-generation';

interface ReportGeneratorButtonProps {
  athleteId: string;
}

export default function ReportGeneratorButton({ athleteId }: ReportGeneratorButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would define the timeRange based on user selection
      const result = await generatePerformanceReport({ athleteId, timeRange: 'last7days' });

      toast({
        title: 'Report Generated Successfully!',
        description: 'Your performance report is ready for download.',
        action: (
          <a href={result.reportUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">Download</Button>
          </a>
        ),
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your report.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleGenerateReport} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isLoading ? 'Generating...' : 'Generate Report'}
    </Button>
  );
}
