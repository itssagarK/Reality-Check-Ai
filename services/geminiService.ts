import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RealityCheckResponse } from "../types";

const SYSTEM_INSTRUCTION = `
Your purpose is to evaluate plans realistically and help users choose better paths
using evidence-based reasoning. You do not motivate, encourage, or validate ambition.
You audit feasibility and analyze trade-offs.

CORE PRINCIPLES
- Evaluate plans based on real-world constraints, not intent or enthusiasm.
- Prefer conservative, realistic interpretations over optimistic assumptions.
- Treat feasibility as a function of time, scope, dependencies, and human limits.

GROUNDING DISCIPLINE
- Base all reasoning on widely observed real-world patterns such as:
  - Learning and execution timelines
  - Validation and iteration cycles
  - Dependency, hiring, and coordination delays
  - Common failure and breakdown patterns
- Do not rely on anecdotes or exceptional cases.
- If a plan contradicts commonly reported benchmarks, feasibility must be reduced.

ASSUMPTIONS POLICY
- Assume the user is an average individual unless explicitly stated otherwise.
- Assume 2–3 hours of effort per day unless specified.
- Never invent user skills, funding, experience, validation, or external support.
- If critical information is missing, explicitly list assumptions in assumptions_used.

CORE AUDIT DIMENSIONS
All evaluations must consider and balance:
- Clarity of goal and problem definition
- Timeline realism
- Scope versus available capacity
- Dependency and coordination risk
- Resource and cash flow clarity (where applicable)
- Risk concentration and compounding effects

SCORING RULES
- reality_score must reflect feasibility, not ambition.
- Extremely compressed timelines for complex goals must result in very low scores.
- confidence_level must reflect the strength of grounding and assumptions,
  not the user's confidence or intent.

RISK ANALYSIS RULES
- Risks must be concrete, realistic, and aligned with known failure patterns.
- Probability and impact must be logically consistent with each risk.
- Multiple high-probability risks must compound into lower feasibility.

PLAN REVISION RULES
- realistic_plan must align with realistic learning curves and execution timelines.
- Reduce scope OR extend time; do not do both aggressively.
- Do not promise outcomes that contradict real-world constraints or norms.

STOP SIGNAL RULES
- stop_signal must clearly define when continued effort would likely waste
  time, money, or opportunity.
- Stop conditions must be measurable, practical, and unambiguous.

DECISION PATH ANALYSIS MODE
When performing Decision Path Analysis:
- Do not predict success or failure.
- Diagnose why the current path fails or struggles.
- Propose a maximum of two alternative paths.
- Explain why an alternative improves feasibility.
- Analyze likely trade-offs and consequences, not outcomes.
- Favor simplification, dependency reduction, and scope control.
- Explicitly identify overengineering risk and simplification advice.

TONE AND BEHAVIOR
- Be professional, neutral, and analytical.
- Do not use motivational, emotional, or judgmental language.
- Do not insult, shame, or pressure the user.
- Provide clarity, not reassurance.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    reality_score: { type: Type.INTEGER, description: "A score from 0 to 100 representing realistic feasibility." },
    confidence_level: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
    summary: { type: Type.STRING, description: "A concise, neutral summary of the audit." },
    assumptions_used: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of assumptions made about the user's skills, time, or resources."
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          probability: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        },
        required: ["description", "probability", "impact"],
      },
    },
    realistic_plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase_name: { type: Type.STRING },
          duration: { type: Type.STRING },
          actions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["phase_name", "duration", "actions"],
      },
    },
    stop_signal: { type: Type.STRING, description: "Clear condition to stop." },
    decision_path_analysis: {
      type: Type.OBJECT,
      properties: {
        diagnosis: { type: Type.STRING },
        alternatives: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              trade_offs: { type: Type.STRING },
            },
            required: ["name", "reasoning", "trade_offs"]
          },
        },
        simplification_advice: { type: Type.STRING },
      },
      required: ["diagnosis", "alternatives", "simplification_advice"],
    },
  },
  required: [
    "reality_score",
    "confidence_level",
    "summary",
    "assumptions_used",
    "risks",
    "realistic_plan",
    "stop_signal",
    "decision_path_analysis"
  ],
};

export const auditPlan = async (
  plan: string,
  constraints: string,
  resources: string,
  evidence?: string
): Promise<RealityCheckResponse> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set GEMINI_API_KEY in your environment or Vercel settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Resilient candidate models ordered by availability & free-tier compatibility
  const candidateModels = [
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.8-flash"
  ];

  const prompt = `
    User Plan: ${plan}
    
    Constraints/Context: ${constraints || "None provided"}
    
    Resources/Assets: ${resources || "None provided"}
    
    Supporting Evidence: ${evidence || "None provided"}
    
    Perform a rigorous Reality Check and Decision Path Analysis on this plan.
  `;

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response returned from model.");
      }
      
      return JSON.parse(text) as RealityCheckResponse;
    } catch (err: any) {
      console.warn(`Model ${model} failed with:`, err?.message || err);
      lastError = err;
      
      // If error is high demand (503) or rate limit (429), try next candidate model
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("503") || msg.includes("demand") || msg.includes("429") || msg.includes("quota") || msg.includes("resource_exhausted")) {
        continue;
      }
      // For schema or structural errors, break early
      break;
    }
  }

  // If all candidate models failed, give clear user guidance
  const errorMessage = lastError?.message || "";
  if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
    throw new Error(
      "Gemini API rate limit or quota exceeded (Error 429). Please wait 15–30 seconds and try again, or check your quota at ai.google.dev."
    );
  }
  if (errorMessage.includes("503") || errorMessage.includes("demand") || errorMessage.includes("UNAVAILABLE")) {
    throw new Error(
      "Gemini API servers are temporarily experiencing high demand (Error 503). Please wait a few seconds and try again."
    );
  }

  throw lastError || new Error("Failed to audit plan with available AI models.");
};
