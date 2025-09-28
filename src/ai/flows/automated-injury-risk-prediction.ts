'use server';

/**
 * @fileOverview Analyzes sensor data to predict potential injury risks and generate performance scores.
 *
 * - analyzeSensorData - A function that triggers the analysis process.
 * - AnalyzeSensorDataInput - The input type for the analyzeSensorData function.
 * - AnalyzeSensorDataOutput - The return type for the analyzeSensorData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSensorDataInputSchema = z.object({
  heartrate: z.number().describe('Heart rate of the athlete.'),
  o2: z.number().describe('Oxygen saturation level of the athlete.'),
  emg: z.number().describe('Electromyography data.'),
  balance: z.number().describe('Balance score of the athlete.'),
  gait: z.number().describe('Gait score of the athlete.'),
  energy: z.number().describe('Energy level of the athlete.'),
  AccX: z.number().describe('Acceleration in the X axis.'),
  AccY: z.number().describe('Acceleration in the Y axis.'),
  AccZ: z.number().describe('Acceleration in the Z axis.'),
  GyroX: z.number().describe('Angular velocity around the X axis.'),
  GyroY: z.number().describe('Angular velocity around the Y axis.'),
  GyroZ: z.number().describe('Angular velocity around the Z axis.'),
});
export type AnalyzeSensorDataInput = z.infer<typeof AnalyzeSensorDataInputSchema>;

const AnalyzeSensorDataOutputSchema = z.object({
  fitnessScore: z.number().describe('Overall fitness score of the athlete (0-100).'),
  staminaScore: z.number().describe('Stamina score of the athlete (0-100).'),
  strengthScore: z.number().describe('Strength score of the athlete (0-100).'),
  reflexScore: z.number().describe('Reflex score of the athlete (0-100).'),
  neuralScore: z.number().describe('Neural score of the athlete (0-100).'),
  stressScore: z.number().describe('Stress score of the athlete (0-100).'),
  injuryRiskPercent: z.number().describe('Overall injury risk percentage (0-100).'),
  predictedInjuryPart: z.string().describe('The part of the body with the highest injury risk.'),
});
export type AnalyzeSensorDataOutput = z.infer<typeof AnalyzeSensorDataOutputSchema>;

export async function analyzeSensorData(input: AnalyzeSensorDataInput): Promise<AnalyzeSensorDataOutput> {
  return analyzeSensorDataFlow(input);
}

const analyzeSensorDataPrompt = ai.definePrompt({
  name: 'analyzeSensorDataPrompt',
  input: {schema: AnalyzeSensorDataInputSchema},
  output: {schema: AnalyzeSensorDataOutputSchema},
  prompt: `You are an AI expert in athlete performance analysis and injury risk prediction.

  Based on the provided sensor data, calculate performance scores and predict potential injury risks.

  Sensor Data:
  - Heart Rate: {{{heartrate}}}
  - Oxygen Saturation: {{{o2}}}
  - EMG: {{{emg}}}
  - Balance: {{{balance}}}
  - Gait: {{{gait}}}
  - Energy: {{{energy}}}
  - Acceleration (X, Y, Z): {{{AccX}}}, {{{AccY}}}, {{{AccZ}}}
  - Gyroscope (X, Y, Z): {{{GyroX}}}, {{{GyroY}}}, {{{GyroZ}}}

  Based on the data, determine:
  - fitnessScore: An overall fitness score (0-100).
  - staminaScore: A stamina score (0-100).
  - strengthScore: A strength score (0-100).
  - reflexScore: A reflex score (0-100).
  - neuralScore: A neural score (0-100), 
  - stressScore: a stress score (0-100)
  - injuryRiskPercent: The overall injury risk percentage (0-100).
  - predictedInjuryPart: The most likely body part to be injured (e.g., knee, ankle, shoulder).

  Ensure that the output is a JSON object conforming to the AnalyzeSensorDataOutputSchema.
  Adhere strictly to the schema and its descriptions when generating the output.
  `, 
});

const analyzeSensorDataFlow = ai.defineFlow(
  {
    name: 'analyzeSensorDataFlow',
    inputSchema: AnalyzeSensorDataInputSchema,
    outputSchema: AnalyzeSensorDataOutputSchema,
  },
  async input => {
    const {output} = await analyzeSensorDataPrompt(input);
    return output!;
  }
);
