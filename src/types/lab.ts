export type AdulterantId = 
  | 'starch'
  | 'urea'
  | 'detergent'
  | 'formalin'
  | 'sucrose'
  | 'neutralizer'
  | 'hydrogen_peroxide'
  | 'salt_chlorides'
  | 'pure';

export interface Reagent {
  id: string;
  name: string;
  chemicalFormula: string;
  colorHex: string;
  fluidColor: string; // for 3D liquid
  glassTint: string;
  shelfPosition: number; // 0 to 7
  shelfRow: 'top' | 'bottom';
  description: string;
  hazardNote?: string;
}

export interface MilkSample {
  id: string;
  name: string;
  origin: string;
  adulterant: AdulterantId;
  description: string;
  fatContent: number;
  snfContent: number;
  isAdulterated: boolean;
}

export interface AssayStep {
  stepNumber: number;
  instruction: string;
  actionRequired: 'add_milk' | 'add_reagent' | 'heat_sample' | 'observe';
  targetReagentId?: string;
  requiredVolumeMl?: number;
  description: string;
  visualCue: string;
}

export interface AssayProtocol {
  id: string;
  title: string;
  targetAdulterant: AdulterantId;
  purpose: string;
  chemicalPrinciple: string;
  reactionEquation?: string;
  reagentsNeeded: string[];
  requiresHeating: boolean;
  heatingTimeSeconds?: number;
  positiveObservation: string;
  positiveColor: string; // hex
  negativeObservation: string;
  negativeColor: string; // hex
  steps: AssayStep[];
  fssaiStandardRef: string;
  healthRiskLevel: 'Critical' | 'High' | 'Moderate';
}

export interface TestResultRecord {
  id: string;
  timestamp: string;
  sampleId: string;
  sampleName: string;
  sampleBatch: string;
  assayId: string;
  assayName: string;
  testedAdulterant: string;
  resultStatus: 'Positive (Adulterated)' | 'Negative (Pure)' | 'Inconclusive';
  colorObserved: string;
  reactionNotes: string;
  testedBy: string;
  safetyRating: 'Safe' | 'Hazardous' | 'Caution';
}

export interface AdulterantDetail {
  id: AdulterantId;
  name: string;
  commonSources: string[];
  economicMotive: string;
  chemicalNature: string;
  acuteToxicity: string;
  chronicHazards: string[];
  fssaiTolerance: string;
  affectedOrgans: string[];
  preventionTip: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  adulterantTopic: string;
}
