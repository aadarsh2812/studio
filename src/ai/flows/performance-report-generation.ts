'use server';

/**
 * @fileOverview Flow for generating PDF performance reports for athletes.
 *
 * - generatePerformanceReport - A function that generates the performance report.
 * - GeneratePerformanceReportInput - The input type for the generatePerformanceReport function.
 * - GeneratePerformanceReportOutput - The return type for the generatePerformanceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePerformanceReportInputSchema = z.object({
  athleteId: z.string().describe('The UID of the athlete.'),
  timeRange: z.string().describe('The time range for the report (e.g., last7days).'),
});
export type GeneratePerformanceReportInput = z.infer<typeof GeneratePerformanceReportInputSchema>;

const GeneratePerformanceReportOutputSchema = z.object({
  reportUrl: z.string().describe('The public URL of the generated PDF report.'),
});
export type GeneratePerformanceReportOutput = z.infer<typeof GeneratePerformanceReportOutputSchema>;

export async function generatePerformanceReport(input: GeneratePerformanceReportInput): Promise<GeneratePerformanceReportOutput> {
  return generatePerformanceReportFlow(input);
}

const generatePerformanceReportFlow = ai.defineFlow(
  {
    name: 'generatePerformanceReportFlow',
    inputSchema: GeneratePerformanceReportInputSchema,
    outputSchema: GeneratePerformanceReportOutputSchema,
  },
  async input => {
    // TODO: Implement the logic to call the Firebase Cloud Function here
    // For now, return a dummy URL
    return { reportUrl: 'https://example.com/dummy-report.pdf' };
  }
);
