import { User, Team, AnalysisResult, UserRole } from './types';

export const mockUsers: User[] = [
  {
    uid: 'athlete-1',
    email: 'alex.doe@example.com',
    displayName: 'Alex Doe',
    role: 'athlete',
    photoURL: 'https://picsum.photos/seed/101/200/200',
    teamIds: ['team-1'],
  },
  {
    uid: 'coach-1',
    email: 'brian.smith@example.com',
    displayName: 'Brian Smith',
    role: 'coach',
    photoURL: 'https://picsum.photos/seed/201/200/200',
    teamIds: ['team-1'],
  },
  {
    uid: 'physio-1',
    email: 'carla.jones@example.com',
    displayName: 'Carla Jones',
    role: 'physiotherapist',
    photoURL: 'https://picsum.photos/seed/301/200/200',
    teamIds: ['team-1'],
  },
  {
    uid: 'athlete-2',
    displayName: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'athlete',
    photoURL: 'https://picsum.photos/seed/102/200/200',
    teamIds: ['team-1'],
  },
    {
    uid: 'athlete-3',
    displayName: 'Sam Wilson',
    email: 'sam.wilson@example.com',
    role: 'athlete',
    photoURL: 'https://picsum.photos/seed/103/200/200',
    teamIds: ['team-1'],
  },
  {
    uid: 'athlete-4',
    displayName: 'Jessica Chen',
    email: 'jessica.chen@example.com',
    role: 'athlete',
    photoURL: 'https://picsum.photos/seed/104/200/200',
    teamIds: ['team-1'],
  },
];

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    teamName: 'Varsity Football',
    coachId: 'coach-1',
    athleteIds: ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-4'],
  },
];

export const mockAnalysisResults: AnalysisResult[] = [
  {
    id: 'result-1',
    athleteId: 'athlete-1',
    timestamp: new Date(),
    sourceDataId: 'sensor-1',
    fitnessScore: 88,
    staminaScore: 92,
    strengthScore: 85,
    reflexScore: 95,
    neuralScore: 91,
    stressScore: 25,
    injuryRiskPercent: 15,
    predictedInjuryPart: 'Ankle',
  },
  {
    id: 'result-2',
    athleteId: 'athlete-2',
    timestamp: new Date(),
    sourceDataId: 'sensor-2',
    fitnessScore: 75,
    staminaScore: 80,
    strengthScore: 70,
    reflexScore: 85,
    neuralScore: 78,
    stressScore: 45,
    injuryRiskPercent: 35,
    predictedInjuryPart: 'Knee',
  },
    {
    id: 'result-3',
    athleteId: 'athlete-3',
    timestamp: new Date(),
    sourceDataId: 'sensor-3',
    fitnessScore: 92,
    staminaScore: 88,
    strengthScore: 95,
    reflexScore: 91,
    neuralScore: 89,
    stressScore: 18,
    injuryRiskPercent: 10,
    predictedInjuryPart: 'Shoulder',
  },
    {
    id: 'result-4',
    athleteId: 'athlete-4',
    timestamp: new Date(),
    sourceDataId: 'sensor-4',
    fitnessScore: 65,
    staminaScore: 70,
    strengthScore: 60,
    reflexScore: 75,
    neuralScore: 68,
    stressScore: 65,
    injuryRiskPercent: 70,
    predictedInjuryPart: 'Hamstring',
  },
];

export const getMockUserByRole = (role: UserRole): User | undefined => {
  if (role === 'athlete') {
    return mockUsers.find(u => u.uid === 'athlete-1');
  }
  return mockUsers.find(u => u.role === role);
}
