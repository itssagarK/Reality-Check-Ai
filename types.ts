export interface Risk {
  description: string;
  probability: string;
  impact: string;
}

export interface PlanPhase {
  phase_name: string;
  duration: string;
  actions: string[];
}

export interface AlternativePath {
  name: string;
  reasoning: string;
  trade_offs: string;
}

export interface DecisionPathAnalysis {
  diagnosis: string;
  alternatives: AlternativePath[];
  simplification_advice: string;
}

export interface RealityCheckResponse {
  reality_score: number;
  confidence_level: "High" | "Medium" | "Low";
  summary: string;
  assumptions_used: string[];
  risks: Risk[];
  realistic_plan: PlanPhase[];
  stop_signal: string;
  decision_path_analysis?: DecisionPathAnalysis;
}

export interface UserInput {
  plan: string;
  constraints: string;
  resources: string;
  evidence?: string;
  projectId?: string;
  projectName?: string;
  variationLabel?: string;
}

export interface SavedAudit {
  id: string;
  timestamp: number;
  userInput: UserInput;
  result: RealityCheckResponse;
  projectId?: string;
  iteration?: number;
  variationLabel?: string;
}
