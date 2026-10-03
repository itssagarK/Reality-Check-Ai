import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RealityCheckResponse, UserInput, ProblemSolutionDetail } from "../types";

const SYSTEM_INSTRUCTION = `
Your purpose is to evaluate plans and software app builds realistically using evidence-based engineering constraints calibrated specifically for India and the Indian tech ecosystem in Indian Rupees (INR / ₹).
You do not motivate, encourage, or validate ambition. You audit feasibility, identify failure points, and analyze trade-offs.

CORE PRINCIPLES
- Evaluate plans based on real-world constraints, not intent or enthusiasm.
- All budgets, cloud hosting, APIs, and tooling MUST be calculated in Indian Rupees (INR / ₹).
- Calibrate for Indian tech realities: AWS ap-south-1 (Mumbai), GCP (Delhi), Razorpay/Cashfree UPI payment gateways, Indian developer hourly rates (₹500–₹2,500/hr), and Indian internet bandwidth patterns.
- Prefer conservative, realistic interpretations over optimistic assumptions.
- Treat feasibility as a function of time, scope, dependencies, skills, and human limits.

GROUNDING & CALIBRATION (INDIA CONTEXT)
- Assume average individual capacity: 2–3 productive hours/day for side ventures unless stated otherwise.
- For software builds: assume standard industry cycle times (setup, bug fixing, edge cases, deployment, auth, UPI billing, GST compliance, cloud hosting).
- Never invent skills, funding, or audience that the user did not specify.
- Reality score (0-100):
  * 75-100: Feasible (balanced scope and timeline for Indian market)
  * 40-74: Risky (severe bottlenecks; scope/time mismatch)
  * 0-39: Impossible / Math Deficit (destined to fail/burnout without major pivot)

OUTPUT REQUIREMENTS
Generate a comprehensive, structured analysis formatted according to the schema:
1. Overall reality_score (0-100), confidence_level, verdict (one bold takeaway sentence), and 3 punchy key_takeaways.
2. score_breakdown across 6 key factors (0-100 each): technology, budget, time, skills, market, risk.
3. risks: list of 3-5 risks with probability, impact, severity_score (1-10), and a concise actionable mitigation.
4. tech_stack: 4-6 components across layers (Frontend, Backend, Database, Hosting, APIs) with tool name, is_paid flag, and purpose.
5. cost_breakdown: percentages and INR (₹) estimates for Development, Tools & Software, Hosting & Infrastructure, Marketing & Launch.
6. stat_cards: team_size, estimated_weeks, total_cost_range (in ₹ INR, e.g. "₹50,000 – ₹2,00,000").
7. skill_gaps: 3-4 skills comparing required_level (0-100) vs user current_level (0-100) with a brief gap_summary.
8. scalability_projection: metrics at 1K, 10K, and 100K users (monthly cost in ₹ INR, performance rating 0-100, and primary bottleneck).
9. realistic_plan: phased execution roadmap with phase_name, duration, estimated_weeks, and bullet actions.
10. stop_signal: an unambiguous, measurable condition to abort or pivot.
11. decision_path_analysis: root-cause diagnosis, simplification_advice, and 2 alternative paths with the best pick flagged and savings in ₹ INR.
12. problem_solutions: array of detailed problem & solution cards mapping to each chart slice/sector, containing the identified failure problem, root cause, actionable engineering solution, and financial impact in ₹ INR.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    reality_score: { type: Type.INTEGER, description: "A score from 0 to 100 representing realistic feasibility." },
    confidence_level: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
    verdict: { type: Type.STRING, description: "One-line bold verdict summarizing the audit verdict." },
    summary: { type: Type.STRING, description: "A concise, neutral summary of the audit." },
    key_takeaways: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 3 concise, high-impact bullet takeaways for the executive summary."
    },
    assumptions_used: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of assumptions made about the user's skills, time, or resources."
    },
    score_breakdown: {
      type: Type.OBJECT,
      properties: {
        technology: { type: Type.INTEGER },
        budget: { type: Type.INTEGER },
        time: { type: Type.INTEGER },
        skills: { type: Type.INTEGER },
        market: { type: Type.INTEGER },
        risk: { type: Type.INTEGER },
      },
      required: ["technology", "budget", "time", "skills", "market", "risk"]
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          probability: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          mitigation: { type: Type.STRING },
          severity_score: { type: Type.INTEGER }
        },
        required: ["description", "probability", "impact", "mitigation", "severity_score"],
      },
    },
    tech_stack: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          layer: { type: Type.STRING },
          tool: { type: Type.STRING },
          is_paid: { type: Type.BOOLEAN },
          purpose: { type: Type.STRING }
        },
        required: ["layer", "tool", "is_paid", "purpose"]
      }
    },
    cost_breakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          amount_percentage: { type: Type.INTEGER },
          estimated_inr: { type: Type.INTEGER, description: "Cost in Indian Rupees (INR / ₹)" },
          problem_identified: { type: Type.STRING },
          actionable_solution: { type: Type.STRING }
        },
        required: ["category", "amount_percentage", "estimated_inr"]
      }
    },
    stat_cards: {
      type: Type.OBJECT,
      properties: {
        team_size: { type: Type.STRING },
        estimated_weeks: { type: Type.STRING },
        total_cost_range: { type: Type.STRING, description: "Total cost range in ₹ INR e.g. ₹50,000 – ₹2,00,000" }
      },
      required: ["team_size", "estimated_weeks", "total_cost_range"]
    },
    skill_gaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          required_level: { type: Type.INTEGER },
          current_level: { type: Type.INTEGER },
          gap_summary: { type: Type.STRING }
        },
        required: ["skill", "required_level", "current_level", "gap_summary"]
      }
    },
    scalability_projection: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tier: { type: Type.STRING },
          users: { type: Type.INTEGER },
          estimated_monthly_cost_inr: { type: Type.INTEGER, description: "Estimated monthly cost in ₹ INR" },
          performance_rating: { type: Type.INTEGER },
          bottleneck: { type: Type.STRING }
        },
        required: ["tier", "users", "estimated_monthly_cost_inr", "performance_rating", "bottleneck"]
      }
    },
    realistic_plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase_name: { type: Type.STRING },
          duration: { type: Type.STRING },
          estimated_weeks: { type: Type.INTEGER },
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
              is_best_pick: { type: Type.BOOLEAN },
              estimated_savings: { type: Type.STRING, description: "Savings in ₹ INR and weeks e.g. ₹50,000 Saved / 4 Wks" }
            },
            required: ["name", "reasoning", "trade_offs"]
          },
        },
        simplification_advice: { type: Type.STRING },
      },
      required: ["diagnosis", "alternatives", "simplification_advice"],
    },
    problem_solutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          sectorName: { type: Type.STRING },
          factorKey: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
          percentage: { type: Type.INTEGER },
          costInr: { type: Type.INTEGER },
          problem: { type: Type.STRING },
          rootCause: { type: Type.STRING },
          solution: { type: Type.STRING },
          financialImpactInr: { type: Type.STRING },
          actionableDeScopeStep: { type: Type.STRING }
        },
        required: ["id", "sectorName", "severity", "problem", "rootCause", "solution", "financialImpactInr", "actionableDeScopeStep"]
      }
    }
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

/**
 * Fallback sanitizer ensuring all visual graph components receive complete, valid data
 * in Indian Rupees (₹) even if evaluating legacy audits or sparse responses.
 */
export const sanitizeAuditResult = (data: any, inputPlan?: string): RealityCheckResponse => {
  const score = typeof data.reality_score === "number" ? Math.max(0, Math.min(100, data.reality_score)) : 42;

  // Synthesize verdict
  const verdict = data.verdict || (
    score >= 75
      ? "Feasible to build with disciplined scope and low fixed cloud overhead."
      : score >= 40
      ? "High bottleneck risk: timeline and Indian market unit economics require de-scoping."
      : "Severe math deficit: execution workload exceeds available bandwidth by over 300%."
  );

  // Synthesize key takeaways
  const key_takeaways = Array.isArray(data.key_takeaways) && data.key_takeaways.length >= 3
    ? data.key_takeaways.slice(0, 3)
    : [
        `Reality Score of ${score}/100 indicates ${score >= 75 ? "viable unit economics in Indian market" : "significant delivery friction"}.`,
        data.stop_signal ? `Primary stop trigger: ${data.stop_signal.slice(0, 95)}...` : "Requires early validation before committing capital.",
        data.decision_path_analysis?.simplification_advice || "Recommended: reduce scope to single core user loop to conserve runway."
      ];

  // Synthesize score breakdown radar data
  const sb = data.score_breakdown || {};
  const score_breakdown = {
    technology: typeof sb.technology === "number" ? sb.technology : Math.max(20, Math.min(95, score + 10)),
    budget: typeof sb.budget === "number" ? sb.budget : Math.max(15, Math.min(90, score - 5)),
    time: typeof sb.time === "number" ? sb.time : Math.max(10, Math.min(85, score - 15)),
    skills: typeof sb.skills === "number" ? sb.skills : Math.max(25, Math.min(90, score + 5)),
    market: typeof sb.market === "number" ? sb.market : Math.max(20, Math.min(90, score)),
    risk: typeof sb.risk === "number" ? sb.risk : Math.max(15, Math.min(95, 100 - score))
  };

  // Synthesize risks
  const risks = Array.isArray(data.risks) && data.risks.length > 0
    ? data.risks.map((r: any) => {
        const prob = r.probability || "Medium";
        const imp = r.impact || "High";
        const calcSeverity = prob === "High" && imp === "High" ? 9 : imp === "High" ? 7 : prob === "High" ? 6 : 4;
        return {
          description: r.description || "Execution bottleneck",
          probability: prob,
          impact: imp,
          mitigation: r.mitigation || "Enforce phase gates and pre-validate customer demand.",
          severity_score: typeof r.severity_score === "number" ? r.severity_score : calcSeverity
        };
      })
    : [
        {
          description: "Scope creep exceeding available weekly development hours",
          probability: "High",
          impact: "High",
          mitigation: "Cut secondary features and freeze MVP specifications strictly.",
          severity_score: 9
        },
        {
          description: "Cloud infrastructure cost escalation in Mumbai region (ap-south-1)",
          probability: "Medium",
          impact: "Medium",
          mitigation: "Adopt scale-to-zero serverless and avoid multi-region instances early.",
          severity_score: 6
        },
        {
          description: "Drop-off during UPI payment and authentication onboarding",
          probability: "High",
          impact: "High",
          mitigation: "Implement single-tap UPI Intent flow via Razorpay/Cashfree SDK.",
          severity_score: 8
        }
      ];

  // Synthesize tech stack
  const tech_stack = Array.isArray(data.tech_stack) && data.tech_stack.length > 0
    ? data.tech_stack
    : [
        { layer: "Frontend", tool: "React / Vite / Tailwind", is_paid: false, purpose: "Rapid UI iteration with zero runtime cost" },
        { layer: "Backend", tool: "Node.js / Express API", is_paid: false, purpose: "Stateless business logic & webhook processing" },
        { layer: "Database", tool: "Supabase PostgreSQL (Mumbai)", is_paid: false, purpose: "Relational persistence with generous free tier" },
        { layer: "Hosting", tool: "Cloud Run / Vercel", is_paid: false, purpose: "Scale-to-zero serverless with ₹0 fixed monthly burn" },
        { layer: "APIs / Payments", tool: "Gemini 3 Flash & Razorpay UPI", is_paid: false, purpose: "Fast low-cost inference & friction-free Indian checkouts" }
      ];

  // Synthesize cost breakdown donut data in INR (₹)
  const rawCosts = Array.isArray(data.cost_breakdown) && data.cost_breakdown.length > 0 ? data.cost_breakdown : null;
  const cost_breakdown = rawCosts
    ? rawCosts.map((c: any) => ({
        category: c.category || "General Allocation",
        amount_percentage: typeof c.amount_percentage === "number" ? c.amount_percentage : 25,
        estimated_inr: typeof c.estimated_inr === "number" ? c.estimated_inr : (typeof c.estimated_usd === "number" ? c.estimated_usd * 86 : 25000),
        problem_identified: c.problem_identified,
        actionable_solution: c.actionable_solution
      }))
    : [
        {
          category: "Development & Engineering",
          amount_percentage: 55,
          estimated_inr: 110000,
          problem_identified: "Custom backend architecture and complex state management consume 60% of execution bandwidth.",
          actionable_solution: "Use managed Supabase backend and pre-built Tailwind UI components to save 120 dev hours."
        },
        {
          category: "Software & SaaS Subscriptions",
          amount_percentage: 15,
          estimated_inr: 30000,
          problem_identified: "Paid third-party API tiers and developer seats create fixed monthly burn before revenue.",
          actionable_solution: "Rely 100% on free-tier SaaS until reaching first 20 paying customers."
        },
        {
          category: "Cloud & Infrastructure (Mumbai)",
          amount_percentage: 10,
          estimated_inr: 20000,
          problem_identified: "Over-provisioned multi-tenant databases incur fixed AWS/GCP bills.",
          actionable_solution: "Deploy on scale-to-zero serverless (Cloud Run) with automated sleep states."
        },
        {
          category: "Go-to-Market & UPI Onboarding",
          amount_percentage: 20,
          estimated_inr: 40000,
          problem_identified: "Cold customer acquisition in India requires hyper-targeted localized outbound.",
          actionable_solution: "Direct LinkedIn/WhatsApp founder outreach to 50 targeted prospects before spending on ads."
        }
      ];

  // Synthesize stat cards in INR (₹)
  const stat_cards = data.stat_cards || {
    team_size: "1 Solo Builder",
    estimated_weeks: "8–10 Weeks",
    total_cost_range: "₹40,000 – ₹1,80,000"
  };

  // Synthesize skill gaps
  const skill_gaps = Array.isArray(data.skill_gaps) && data.skill_gaps.length > 0
    ? data.skill_gaps
    : [
        { skill: "Frontend Architecture", required_level: 80, current_level: 65, gap_summary: "Sufficient for MVP; maintain discipline on state management." },
        { skill: "API & Backend Security", required_level: 85, current_level: 50, gap_summary: "Requires careful token handling, rate-limiting, and webhook HMAC verification." },
        { skill: "Indian Market Customer Outreach", required_level: 75, current_level: 40, gap_summary: "Greatest blindspot: outreach volume must 3x to hit pilot adoption targets." },
        { skill: "DevOps & Production CI/CD", required_level: 70, current_level: 60, gap_summary: "Low risk with managed hosting; avoid premature Kubernetes orchestration." }
      ];

  // Synthesize scalability projection in INR (₹)
  const rawScalability = Array.isArray(data.scalability_projection) && data.scalability_projection.length > 0 ? data.scalability_projection : null;
  const scalability_projection = rawScalability
    ? rawScalability.map((p: any) => ({
        tier: p.tier || "1K",
        users: typeof p.users === "number" ? p.users : 1000,
        estimated_monthly_cost_inr: typeof p.estimated_monthly_cost_inr === "number" ? p.estimated_monthly_cost_inr : (typeof p.estimated_monthly_cost === "number" ? p.estimated_monthly_cost * 86 : 2000),
        performance_rating: typeof p.performance_rating === "number" ? p.performance_rating : 90,
        bottleneck: p.bottleneck || "None"
      }))
    : [
        { tier: "1K Users", users: 1000, estimated_monthly_cost_inr: 2100, performance_rating: 95, bottleneck: "None (Free tier coverage)" },
        { tier: "10K Users", users: 10000, estimated_monthly_cost_inr: 12000, performance_rating: 82, bottleneck: "Database connection pooling & unindexed queries" },
        { tier: "100K Users", users: 100000, estimated_monthly_cost_inr: 78000, performance_rating: 68, bottleneck: "Background job queues & compute auto-scaling" }
      ];

  // Synthesize realistic plan
  const realistic_plan = Array.isArray(data.realistic_plan) && data.realistic_plan.length > 0
    ? data.realistic_plan.map((p: any, idx: number) => ({
        phase_name: p.phase_name || `Phase ${idx + 1}`,
        duration: p.duration || "2–3 Weeks",
        estimated_weeks: p.estimated_weeks || (idx + 1) * 3,
        actions: Array.isArray(p.actions) ? p.actions : ["Define bounded requirements", "Ship vertical prototype"]
      }))
    : [
        { phase_name: "Phase 1: Problem Validation & Wireframe", duration: "2 Weeks", estimated_weeks: 2, actions: ["Interview 10 potential Indian users", "Confirm willingness to pay via UPI", "Lock single core screen"] },
        { phase_name: "Phase 2: Core Vertical Slice", duration: "4 Weeks", estimated_weeks: 6, actions: ["Deploy authentication & Supabase schema", "Connect core workflow end-to-end", "Integrate UPI webhook"] },
        { phase_name: "Phase 3: Soft Launch & Closed Beta", duration: "3 Weeks", estimated_weeks: 9, actions: ["Onboard first 25 Indian users manually", "Fix drop-offs", "Enable live billing"] }
      ];

  // Synthesize alternatives in INR (₹)
  const decision_path_analysis = data.decision_path_analysis || {
    diagnosis: data.summary || "Scope and timeline exhibit structural tension against single-builder capacity.",
    simplification_advice: "Reduce the functional footprint by 60% and launch as a lightweight concierge workflow.",
    alternatives: [
      {
        name: "Micro-MVP with UPI Pre-Orders",
        reasoning: "Eliminates build risk by securing upfront payment commitment before full engineering investment.",
        trade_offs: "Requires direct outbound selling and manual concierge fulfillment.",
        is_best_pick: true,
        estimated_savings: "Saves ₹85,000 & 6 Weeks"
      },
      {
        name: "WhatsApp Bot / Chrome Extension",
        reasoning: "Build on existing Indian distribution rails (WhatsApp/Chrome) to eliminate mobile app store overhead.",
        trade_offs: "Bound by WhatsApp Business API messaging fees and platform policies.",
        is_best_pick: false,
        estimated_savings: "Saves ₹45,000 & 4 Weeks"
      }
    ]
  };

  // Synthesize rich problem_solutions mapping for interactive chart redirects
  const problem_solutions: ProblemSolutionDetail[] = Array.isArray(data.problem_solutions) && data.problem_solutions.length > 0
    ? data.problem_solutions
    : [
        {
          id: "ps-tech",
          sectorName: "Technology & Stack",
          factorKey: "technology",
          severity: score_breakdown.technology < 50 ? "Critical" : score_breakdown.technology < 70 ? "High" : "Medium",
          percentage: score_breakdown.technology,
          costInr: 45000,
          problem: "Over-engineered architecture with premature distributed microservices or multi-framework setup.",
          rootCause: "Attempting to build production scale before achieving initial product-market fit.",
          solution: "Consolidate into a monolithic Next.js/React framework backed by Supabase with single PostgreSQL database in Mumbai.",
          financialImpactInr: "Saves ₹45,000 in dev contractor fees and prevents 4 weeks of pipeline setup.",
          actionableDeScopeStep: "Drop background microservices; implement synchronous REST/RPC endpoints for MVP."
        },
        {
          id: "ps-budget",
          sectorName: "Capital & Runway",
          factorKey: "budget",
          severity: score_breakdown.budget < 50 ? "Critical" : "High",
          percentage: score_breakdown.budget,
          costInr: 60000,
          problem: "Runway exhaustion risk due to upfront fixed SaaS and cloud infrastructure commitments.",
          rootCause: "Subscribing to paid tiers ($20-$50/month) before generating recurring customer cash flow.",
          solution: "Utilize scale-to-zero serverless tiers (Cloud Run, Vercel Hobby, Supabase Free) with local SQLite or Redis caches.",
          financialImpactInr: "Preserves ₹60,000 in liquid runway over the first 6 months of build.",
          actionableDeScopeStep: "Cancel all paid SaaS trials; replace with open-source alternatives."
        },
        {
          id: "ps-timeline",
          sectorName: "Delivery Timeline",
          factorKey: "time",
          severity: score_breakdown.time < 50 ? "Critical" : "High",
          percentage: score_breakdown.time,
          costInr: 35000,
          problem: "Timeline deficit: estimated engineering hours exceed single contributor capacity by over 2.5x.",
          rootCause: "Underestimating testing, edge cases, auth flows, and payment integration cycles.",
          solution: "Impose a strict 30-day timebox: ship ONLY the core user workflow and hardcode secondary settings.",
          financialImpactInr: "Accelerates time-to-market by 6 weeks; prevents ₹35,000 opportunity cost.",
          actionableDeScopeStep: "Remove user preferences and settings page; use sensible defaults."
        },
        {
          id: "ps-skills",
          sectorName: "Skill Alignment",
          factorKey: "skills",
          severity: score_breakdown.skills < 50 ? "High" : "Medium",
          percentage: score_breakdown.skills,
          costInr: 25000,
          problem: "Execution friction in specialized backend security, payment tokenization, and deployment automation.",
          rootCause: "Solo builder learning curve across multiple disparate full-stack domains simultaneously.",
          solution: "Use battle-tested SDKs (e.g. Razorpay Standard Checkout SDK, Supabase Auth) rather than custom implementations.",
          financialImpactInr: "Saves 40 hours of security debugging and ₹25,000 in external audit fees.",
          actionableDeScopeStep: "Replace custom JWT auth with OAuth / Magic Link provider."
        },
        {
          id: "ps-market",
          sectorName: "Market Demand",
          factorKey: "market",
          severity: score_breakdown.market < 50 ? "Critical" : "High",
          percentage: score_breakdown.market,
          costInr: 50000,
          problem: "Insufficient pre-validation: zero verified Indian customer commitments or letters of intent before writing code.",
          rootCause: "Building in isolation based on assumptions rather than observed customer pain.",
          solution: "Conduct 15 qualitative customer discovery calls; collect ₹500–₹1,000 refundable pilot deposits via UPI.",
          financialImpactInr: "Prevents spending ₹50,000+ building an unvalidated product.",
          actionableDeScopeStep: "Pause coding until 10 target users confirm they will pay upon launch."
        },
        {
          id: "ps-risk",
          sectorName: "Operational Risk",
          factorKey: "risk",
          severity: score_breakdown.risk < 50 ? "Critical" : "High",
          percentage: score_breakdown.risk,
          costInr: 40000,
          problem: "High failure density: third-party API dependencies and app store approval delays.",
          rootCause: "Tightly coupling core product value to external vendor APIs and app review cycles.",
          solution: "Design graceful fallbacks for API rate limits and build initial MVP as a responsive Web PWA before native submission.",
          financialImpactInr: "Eliminates ₹40,000 in native build licenses and 3-week store review lag.",
          actionableDeScopeStep: "Launch as mobile-optimized Web PWA; defer native app store builds."
        }
      ];

  return {
    reality_score: score,
    confidence_level: data.confidence_level || "Medium",
    verdict,
    summary: data.summary || "Plan evaluated against Indian market constraints and engineering limits.",
    key_takeaways,
    assumptions_used: Array.isArray(data.assumptions_used) && data.assumptions_used.length > 0 ? data.assumptions_used : ["Assumed 15 hours per week of dedicated execution time", "Calibrated for Indian cloud pricing and local software ecosystem"],
    risks,
    realistic_plan,
    stop_signal: data.stop_signal || "If by Week 4 no active user has completed the core workflow, pause build and re-interview audience.",
    decision_path_analysis,
    score_breakdown,
    tech_stack,
    cost_breakdown,
    stat_cards,
    skill_gaps,
    scalability_projection,
    problem_solutions
  };
};

export const auditPlan = async (
  input: UserInput
): Promise<RealityCheckResponse> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set GEMINI_API_KEY in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const candidateModels = [
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.8-flash"
  ];

  const modeContext = input.mode === "app-build"
    ? `MODE: SOFTWARE APP BUILD AUDIT (CALIBRATED FOR INDIA / INDIAN RUPEES ₹)
Target Platform: ${input.targetPlatform || "Web & Mobile (India)"}
Proposed Tech Stack: ${input.techStack || "Not specified"}
Target Scale: ${input.targetScale || "1K to 10K active users in India"}
App Specification: ${input.plan}
Constraints & Bandwidth: ${input.constraints || "None provided"}
Budget & Developer Skills: ${input.resources || "None provided"}
Market/Validation Evidence: ${input.evidence || "None provided"}`
    : `MODE: GENERAL PLAN & VENTURE FEASIBILITY AUDIT (CALIBRATED FOR INDIA / INDIAN RUPEES ₹)
Plan: ${input.plan}
Constraints/Context: ${input.constraints || "None provided"}
Resources/Assets: ${input.resources || "None provided"}
Supporting Evidence: ${input.evidence || "None provided"}`;

  const prompt = `
${modeContext}

Perform a rigorous, evidence-grounded Reality Check and Architecture Feasibility Analysis for the Indian market in Indian Rupees (INR / ₹).
Ensure all costs, scalability tiers, stat cards, and alternatives use Indian Rupees (₹).
Generate a rich problem_solutions array identifying exact problems and concrete engineering solutions for each sector of the analysis.
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
      
      const parsed = JSON.parse(text);
      return sanitizeAuditResult(parsed, input.plan);
    } catch (err: any) {
      console.warn(`Model ${model} failed with:`, err?.message || err);
      lastError = err;
      
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("503") || msg.includes("demand") || msg.includes("429") || msg.includes("quota") || msg.includes("resource_exhausted")) {
        continue;
      }
      break;
    }
  }

  const errorMessage = lastError?.message || "";
  if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
    throw new Error(
      "Gemini API rate limit or quota exceeded (Error 429). Please wait 15–30 seconds and try again."
    );
  }
  if (errorMessage.includes("503") || errorMessage.includes("demand") || errorMessage.includes("UNAVAILABLE")) {
    throw new Error(
      "Gemini API servers are temporarily experiencing high demand (Error 503). Please wait a few seconds and try again."
    );
  }

  throw lastError || new Error("Failed to audit plan with available AI models.");
};
