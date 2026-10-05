# Reality Check India (Reality Check 2)

**Evidence-based software app architecture and venture feasibility simulator calibrated in Indian Rupees (₹ INR).**

Reality Check India is an AI-powered engineering and venture feasibility simulator that stress-tests your software builds, technical architectures, and startup plans against unforgiving real-world constraints. It eliminates optimism bias, ungrounded tech stack choices, and motivation theater to tell you what will actually happen given real developer bandwidth, cloud burn in Mumbai (`ap-south-1`), UPI payment churn, and unit economics in ₹ Indian Rupees.

> **Built during Google for Startups: Prompt to Prototype** — A hands-on program focused on transforming ambitious ideas into rigorous, production-grade applications that solve real-world problems.

---

## 📸 Screenshots

| Describe your app architecture & constraints | Feasibility score & failure diagnosis |
| :------------------------------------------: | :-----------------------------------: |
| <img src="https://github.com/user-attachments/assets/f8ce33a1-7dfc-4ec2-9c50-7b00fda1b71a" width="100%"/> | <img src="https://github.com/user-attachments/assets/93816438-2f72-4041-8627-77cc535dbc49" width="100%"/> |

| Critical Stop Signal & Realistic Timeline | Decision Paths & Risk Severity Matrix |
| :---------------------------------------: | :-----------------------------------: |
| <img src="https://github.com/user-attachments/assets/5c31657a-5172-4203-b3f1-b2f19217861f" width="100%"/> | <img src="https://github.com/user-attachments/assets/b3fca002-e5aa-48e2-b706-6b38bbdb531f" width="100%"/> |

---

## ⚡ What Makes It Different: Calibrated for Indian Realities

Most feasibility and planning tools assume Silicon Valley budgets ($10k/month AWS bills, frictionless Stripe subscriptions, and full-time teams). Reality Check India is grounded in real Indian engineering and market dynamics:

* **Mumbai Cloud Latency (`ap-south-1`)**: Audits serverless cold starts, database network roundtrips, and managed tier expenses on AWS, Supabase, and GCP Mumbai regions.
* **UPI AutoPay & Payment Gateway Friction**: Factors in 12–18% recurring mandate drop-offs, RBI compliance limits, Razorpay/Cashfree KYC checkpoints, and mandatory 18% GST overhead.
* **Solo Developer Bandwidth**: Replaces unrealistic 16-hour hustle assumptions with actual part-time bandwidth (10–20 hrs/week) around Indian workplace commitments.
* **Google Play 20-Tester Rules**: Accounts for Google's mandatory 14-day closed testing policy with 20 opt-in testers before any Android production release.
* **Rupee-Denominated Cloud Runway**: All financial models, token burn estimates, and database infrastructure costs are computed natively in **₹ Indian Rupees**.

---

## 🚀 Key Features

### 1. Dual Audit Modes
* **App Build Feasibility (₹)**: Deep-dive technical audit for software apps, micro-SaaS, and mobile APKs. Evaluates proposed tech stacks (Next.js, FastAPI, Supabase, Gemini WebSockets), third-party APIs, and deployment pipelines.
* **General Venture Plan (₹)**: Evaluates ambitious startup concepts, D2C brand launches, marketplace unit economics, and customer acquisition channels.

### 2. Futuristic Architectural UI & Zero-Clutter Experience
* **Precision CAD Dot-Grid Canvas**: Subtle engineering blueprint background texture (`24px × 24px` precision mesh) providing an authentic cockpit feel.
* **1-Click Archetypes with Minimizable Sidebar**: Pre-configured Indian venture blueprints (Indic AI Voice Coach, GST e-Invoice SaaS, B2B Quick-Commerce ERP, D2C Filter Coffee). Features a dedicated **Minimize/Expand** toggle that cleanly expands the main audit form to full width (`col-span-12`).
* **Single-Elevation 4 Audit Dimensions Ribbon**: Clean horizontal bar highlighting the 4 core evaluation pillars without nested card clutter:
  - `01. Tech Stack Architecture` (Monolith vs microservices, ORM complexity, cold-start latency)
  - `02. Engineering Bandwidth` (Realistic dev hours/week vs MVP milestone)
  - `03. Fatal Traps & Gateways` (RBI mandate churn, Razorpay KYC, App Store approval)
  - `04. Cloud Runway in ₹ INR` (Mumbai VM, DB & AI inference burn)

### 3. 9 Interactive Visual Graphs (No Plain Text Dumps)
1. **Overall Reality Score Gauge**: Animated 0–100 gauge with count-up animation, status badge, and immediate verdict.
2. **Feasibility Radar Chart**: Multi-factor spider chart (Tech Stack, Timeline, Budget, Skills, Market, Risk).
3. **Risk Severity Horizontal Bar Chart**: Color-coded breakdown sorted by severity with concrete mitigation strategies.
4. **Interactive Tech Stack Diagram**: Layered architectural blueprint (Frontend, Backend, Database, Hosting, APIs) with Free/Paid tiers.
5. **Capital & Resource Donut Chart**: Indian Rupee capital allocation with team capacity and runway metrics.
6. **Roadmap Horizontal Gantt Timeline**: Phased delivery horizon with gated deliverables and realistic milestones.
7. **Skill Gap Paired Progress Bars**: Visual comparison between required framework competencies and current developer proficiency.
8. **Scalability & Latency Curve**: Dual-axis projection of latency and cloud expenditure at 1K, 10K, and 100K users in ₹ INR.
9. **High-Feasibility Alternatives**: Comparative decision cards highlighting the recommended strategic path with a 1-click **Test Variation** action.

### 4. Interactive Problem & Solution Inspector
Clicking on graph slices, high-risk flags, or bottleneck dimensions launches the **Problem & Solution Modal**, revealing root-cause technical breakdowns and letting you apply the recommended architectural fix directly into a test variation.

### 5. Plan Iteration Trajectory & Audit Archive
* **Iteration Tracking**: Test variations (e.g. switching from microservices to a monolith, or cutting scope) and track your Reality Score trajectory on an interactive evolution curve.
* **Local Persistence**: Full search, reload, and delete capabilities for all past audits via the **Archive** drawer.
* **Export Options**: 1-click **Download PDF** with clean print stylesheets and **Copy Summary** for Notion, Slack, or documentation.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS, Plus Jakarta Sans, JetBrains Mono
* **Icons**: Lucide Icons
* **Charts & Visualizations**: Recharts (Responsive Radar, Bar, Donut, and Trajectory Curves)
* **AI Engine**: Google Gemini API via `@google/genai` TypeScript SDK
* **Model Strategy**: Resilient automatic fallback mechanism across high-performance Gemini models (`gemini-2.5-flash` ➔ `gemini-3.1-flash-lite` ➔ `gemini-flash-latest` ➔ `gemini-3.8-flash`)
* **Persistence**: LocalStorage with schema validation

---

## 🚦 Reality Score Calibration

| Reality Score | Status | Description |
| :-----------: | :----: | :---------- |
| **75 – 100** | **Feasible to Build** | Realistic scope, safe margins, proven architecture, high probability of launch. |
| **40 – 74** | **High Friction / Bottlenecks** | Tight bottlenecks; requires scope simplification, technology pruning, or timeline buffer. |
| **0 – 39** | **Unfeasible / Math Deficit** | Severe bandwidth or budget deficit; mathematically guaranteed to burn out without a major pivot. |

---

## 💻 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/itssagarK/Reality-check-2.git
   cd Reality-check-2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your API Key:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(A template is provided in `.env.example`)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 💡 How to Use

1. **Select an Archetype or Enter Custom Specs**: Click any 1-click preset (or use the minimize button to close the tab for full-width input).
2. **Define Proposed Architecture**: Specify your tech stack, targeted platforms (Android APK, Web), and initial scale.
3. **Input Realistic Constraints**: Enter your actual free hours/week and available budget in ₹ INR.
4. **Run the Audit**: Press `⌘ + ↵` (or click **Run App Architecture & Feasibility Audit**).
5. **Inspect Visual Bottlenecks**: Click into any chart slice to open the Problem & Solution inspector.
6. **Iterate & Improve**: Click **Test Plan Variation** to apply optimizations and watch your Reality Score trajectory climb.

---

## 📜 Philosophy

Most productivity and developer tools cheer you on with false optimism. Reality Check India exists to save engineers, founders, and indie hackers months of wasted effort by revealing architectural bottlenecks and math deficits **before** writing code.

> *Failure is rarely a lack of motivation—it is almost always simple math. Align your ambition with real-world mathematics so your software actually ships.*

---

## 🏆 Acknowledgements

Reality Check India was conceived and developed during **Google for Startups: Prompt to Prototype**. Special thanks to the Google for Startups and Scaler teams for their mentorship and frameworks on building evidence-grounded AI applications.

---

**Built with rigor by [@itssagarK](https://github.com/itssagarK). Stop guessing, start auditing.**
