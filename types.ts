export interface Risk {
  description: string;
  probability: "High" | "Medium" | "Low" | string;
  impact: "High" | "Medium" | "Low" | string;
  mitigation?: string;
  severity_score?: number; // 1 to 10
}

export interface PlanPhase {
  phase_name: string;
  duration: string;
  actions: string[];
  estimated_weeks?: number;
}

export interface AlternativePath {
  name: string;
  reasoning: string;
  trade_offs: string;
  is_best_pick?: boolean;
  estimated_savings?: string;
}

export interface DecisionPathAnalysis {
  diagnosis: string;
  alternatives: AlternativePath[];
  simplification_advice: string;
}

export interface ScoreBreakdown {
  technology: number;
  budget: number;
  time: number;
  skills: number;
  market: number;
  risk: number;
}

export interface TechStackItem {
  layer: "Frontend" | "Backend" | "Database" | "Hosting" | "APIs / Services" | string;
  tool: string;
  is_paid: boolean;
  purpose: string;
}

export interface CostCategory {
  category: string;
  amount_percentage: number;
  estimated_inr: number; // in Indian Rupees (₹)
  estimated_usd?: number;
  problem_identified?: string;
  actionable_solution?: string;
}

export interface StatCards {
  team_size: string;
  estimated_weeks: string;
  total_cost_range: string; // in ₹ INR
}

export interface SkillGapItem {
  skill: string;
  required_level: number; // 0 to 100
  current_level: number;  // 0 to 100
  gap_summary: string;
}

export interface ScalabilityTier {
  tier: "1K" | "10K" | "100K" | string;
  users: number;
  estimated_monthly_cost_inr: number; // in ₹ INR
  estimated_monthly_cost?: number;
  performance_rating: number; // 0 to 100
  bottleneck: string;
}

export interface ProblemSolutionDetail {
  id: string;
  sectorName: string;
  factorKey?: "technology" | "budget" | "time" | "skills" | "market" | "risk" | string;
  severity: "Critical" | "High" | "Medium" | "Low";
  percentage?: number;
  costInr?: number;
  problem: string;
  rootCause: string;
  solution: string;
  financialImpactInr: string;
  actionableDeScopeStep: string;
}

export interface RealityCheckResponse {
  reality_score: number;
  confidence_level: "High" | "Medium" | "Low";
  verdict?: string; // 1-line verdict beside the circular gauge
  summary: string;
  key_takeaways?: string[]; // 3 bullet takeaways
  assumptions_used: string[];
  risks: Risk[];
  realistic_plan: PlanPhase[];
  stop_signal: string;
  decision_path_analysis?: DecisionPathAnalysis;
  
  // Visual Graph fields in INR
  score_breakdown?: ScoreBreakdown;
  tech_stack?: TechStackItem[];
  cost_breakdown?: CostCategory[];
  stat_cards?: StatCards;
  skill_gaps?: SkillGapItem[];
  scalability_projection?: ScalabilityTier[];
  problem_solutions?: ProblemSolutionDetail[];
}

export interface UserInput {
  mode?: "reality-check" | "app-build";
  plan: string;
  constraints: string;
  resources: string;
  evidence?: string;
  
  // App Build specific fields
  techStack?: string;
  targetPlatform?: string;
  targetScale?: string;
  
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
