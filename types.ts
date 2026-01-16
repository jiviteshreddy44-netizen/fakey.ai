
export enum View {
  HOME = 'HOME',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  LIVE = 'LIVE',
  TEXT_LAB = 'TEXT_LAB',
  SIGNAL_LIBRARY = 'SIGNAL_LIBRARY',
  HISTORY = 'HISTORY',
  AI_ASSISTANT = 'AI_ASSISTANT',
  AUDIO_LAB = 'AUDIO_LAB',
  REVERSE_GROUNDING = 'REVERSE_GROUNDING',
  JUDICIAL_REPORT = 'JUDICIAL_REPORT',
  BATCH_TRIAGE = 'BATCH_TRIAGE',
  FORENSIC_TIMELINE = 'FORENSIC_TIMELINE'
}

export enum Verdict {
  REAL = 'REAL',
  LIKELY_FAKE = 'LIKELY_FAKE'
}

export interface AnalysisStepResult {
  score: number;
  explanation: string;
  confidenceQualifier: 'Low' | 'Medium' | 'High';
}

export interface AnalysisExplanation {
  point: string;
  detail: string;
  simpleDetail?: string;
  timestamp?: string;
  category: 'visual' | 'audio' | 'temporal' | 'linguistic' | 'factual' | 'integrity';
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  verdict: Verdict;
  confidence: number;
  confidenceLevel: 'Low' | 'Medium' | 'High';
  deepfakeProbability: number;
  summary: string;
  userRecommendation: string;
  analysisSteps: {
    integrity: AnalysisStepResult;
    consistency: AnalysisStepResult;
    aiPatterns: AnalysisStepResult;
    temporal: AnalysisStepResult;
  };
  explanations: AnalysisExplanation[];
  manipulationType?: string;
  guidance: string;
  fileMetadata: {
    name: string;
    size: string;
    type: string;
    preview?: string;
  };
}

export interface TextAnalysisResult {
  likelihoodRange: string;
  aiProbability: number;
  verdictLabel: string;
  ambiguityNote: string;
  aiSignals: string[];
  humanSignals: string[];
  isFactual: boolean | 'STRICT';
  summary: string;
  claims: {
    claim: string;
    category: 'FACT' | 'OPINION' | 'PREDICTION' | 'AMBIGUOUS';
    status: 'STRONGLY_SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'DISPUTED' | 'NO_EVIDENCE';
    sourceUrl?: string;
    sourceConfidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  linguisticMarkers: string[];
  sources?: {
    title: string;
    url: string;
  }[];
}
