// Athlete readiness assessment flow to generate readiness scores for athletes.

'use server';

/**
 * @fileOverview Assesses athlete readiness by generating performance scores.
 *
 * - assessAthleteReadiness - A function that initiates the athlete readiness assessment process.
 * - AthleteReadinessInput - The input type for the assessAthleteReadiness function.
 * - AthleteReadinessOutput - The return type for the assessAthleteReadiness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AthleteReadinessInputSchema = z.object({
  athleteId: z.string().describe('The UID of the athlete.'),
  sensorData: z.array(
    z.object({
      timestamp: z.string().describe('The time the data was recorded.'),
      heartrate: z.number().describe('Heart rate of the athlete.'),
      o2: z.number().describe('Oxygen saturation level.'),
      emg: z.number().describe('Electromyography data.'),
      balance: z.number().describe('Balance score.'),
      gait: z.number().describe('Gait score.'),
      energy: z.number().describe('Energy level.'),
      AccX: z.number().describe('Accelerometer X-axis data.'),
      AccY: z.number().describe('Accelerometer Y-axis data.'),
      AccZ: z.number().describe('Accelerometer Z-axis data.'),
      GyroX: z.number().describe('Gyroscope X-axis data.'),
      GyroY: z.number().describe('Gyroscope Y-axis data.'),
      GyroZ: z.number().describe('Gyroscope Z-axis data.'),
    })
  ).describe('Array of sensor data for the athlete.'),
});

export type AthleteReadinessInput = z.infer<typeof AthleteReadinessInputSchema>;

const AthleteReadinessOutputSchema = z.object({
  fitnessScore: z.number().describe('Overall fitness score (0-100).'),
  staminaScore: z.number().describe('Stamina score (0-100).'),
  strengthScore: z.number().describe('Strength score (0-100).'),
  reflexScore: z.number().describe('Reflex score (0-100).'),
  neuralScore: z.number().describe('Neural score (0-100).'),
  stressScore: z.number().describe('Stress score (0-100).'),
});

export type AthleteReadinessOutput = z.infer<typeof AthleteReadinessOutputSchema>;

export async function assessAthleteReadiness(
  input: AthleteReadinessInput
): Promise<AthleteReadinessOutput> {
  return assessAthleteReadinessFlow(input);
}

const assessAthleteReadinessPrompt = ai.definePrompt({
  name: 'assessAthleteReadinessPrompt',
  input: {schema: AthleteReadinessInputSchema},
  output: {schema: AthleteReadinessOutputSchema},
  prompt: `You are an AI assistant specializing in assessing athlete readiness based on sensor data.

  Analyze the provided sensor data to generate readiness scores for the athlete.
  Consider the following factors for each score:

  - Fitness Score: Overall physical fitness level based on heart rate, O2 saturation, and energy levels.
  - Stamina Score: Endurance and ability to sustain physical activity.
  - Strength Score: Physical strength and power.
  - Reflex Score: Reaction time and agility.
  - Neural Score: Cognitive function and mental acuity.
  - Stress Score: Physiological stress level.

  Provide the scores as numbers between 0 and 100, where higher scores indicate better readiness.

  Sensor Data:
  {{#each sensorData}}
  - Timestamp: {{timestamp}}, Heart Rate: {{heartrate}}, O2: {{o2}}, EMG: {{emg}}, Balance: {{balance}}, Gait: {{gait}}, Energy: {{energy}}, AccX: {{AccX}}, AccY: {{AccY}}, AccZ: {{AccZ}}, GyroX: {{GyroX}}, GyroY: {{GyroY}}, GyroZ: {{GyroZ}}
  {{/each}}
  `,
});

const assessAthleteReadinessFlow = ai.defineFlow(
  {
    name: 'assessAthleteReadinessFlow',
    inputSchema: AthleteReadinessInputSchema,
    outputSchema: AthleteReadinessOutputSchema,
  },
  async input => {
    const {output} = await assessAthleteReadinessPrompt(input);
    return output!;
  }
);
