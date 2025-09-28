export type UserRole = 'athlete' | 'coach' | 'physiotherapist';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL: string;
  teamIds?: string[];
}

export interface Team {
  id: string;
  teamName: string;
  coachId: string;
  athleteIds: string[];
}

export interface SensorData {
  id: string;
  athleteId: string;
  timestamp: Date;
  heartrate: number;
  o2: number;
  emg: number;
  balance: number;
  gait: number;
  energy: number;
  AccX: number;
  AccY: number;
  AccZ: number;
  GyroX: number;
  GyroY: number;
  GyroZ: number;
}

export interface AnalysisResult {
  id: string;
  athleteId: string;
  timestamp: Date;
  sourceDataId: string;
  fitnessScore: number;
  staminaScore: number;
  strengthScore: number;
  reflexScore: number;
  neuralScore: number;
  stressScore: number;
  injuryRiskPercent: number;
  predictedInjuryPart: string;
}
