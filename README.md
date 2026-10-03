# Reality Check AI 

**Stop planning like it's all going to work out. Audit your plans against real-world limits.**

Reality Check AI is an evidence-grounded feasibility auditor that evaluates whether your goals are actually achievable—not whether they sound inspiring. It strips away optimism bias, wishful thinking, and motivation theater to tell you what will actually happen given real time, budget, skills, and human bandwidth.

>  **Built during Google for Startups: Prompt to Prototype** — A hands-on program where I learned, explored, and built my first project that matters.

---

## 📸 Screenshots

| Describe your plan & constraints | Feasibility score & diagnosis |
| :------------------------------: | :---------------------------: |
| <img src="https://github.com/user-attachments/assets/f8ce33a1-7dfc-4ec2-9c50-7b00fda1b71a" width="100%"/> | <img src="https://github.com/user-attachments/assets/93816438-2f72-4041-8627-77cc535dbc49" width="100%"/> |

| Critical Stop Signal & Timeline | Decision Paths & Risk Matrix |
| :-----------------------------: | :--------------------------: |
| <img src="https://github.com/user-attachments/assets/5c31657a-5172-4203-b3f1-b2f19217861f" width="100%"/> | <img src="https://github.com/user-attachments/assets/b3fca002-e5aa-48e2-b706-6b38bbdb531f" width="100%"/> |

---

##  What This Does

Most planning fails silently. You start with ambition, ignore constraints, and months later you're burnt out with half-finished projects. Reality Check AI stops that early by stress-testing your plan **before** failure happens.

Instead of asking:
- *Does this sound good?*
- *Are you motivated enough?*
- *Do you believe in yourself?*

It asks:
- **Given 24 hours in a day and real commitments, is this timeline realistic?**
- **How much time and budget will execution actually take?**
- **What hidden dependencies could derail this?**
- **Where does failure risk pile up?**

---

##  What's New in the Latest Version

The latest release introduces a **classic-meets-modern design system** and transforms audit results into interactive visual graphs:

*  **Classic-Meets-Modern Design System**: Deep navy and charcoal base with warm ivory/off-white content surfaces and bold warm gold accents. Features *Playfair Display* serif headings paired with clean *Plus Jakarta Sans* / *Inter* body typography.
*  **Dual Section Architecture**:
   1. **Reality Check**: General ventures, startup plans, side projects, and goals.
   2. **App Build Feasibility**: Dedicated software architecture, tech stack viability, third-party API dependencies, and cloud scale constraints.
*  **Light & Dark Mode**: Persistent theme toggle with seamless ivory and deep navy dark palettes.
*  **9 Comprehensive Visual Graphs (No Plain Text Dumps)**:
   1. *Overall Score Circular Gauge*: Animated 0–100 gauge with count-up animation and one-line verdict.
   2. *Score Breakdown Radar Chart*: 6-factor spider chart (Technology, Budget, Timeline, Skills, Market, Risk).
   3. *Risk Severity Horizontal Bar Chart*: Color-coded distribution sorted by severity with expandable mitigation tactics.
   4. *Tech Stack Diagram*: Layered architecture blueprint (Frontend, Backend, Database, Hosting, APIs) with Free/Paid badges.
   5. *Resource Donut Chart & Stat Cards*: Capital burn share plus metrics for team capacity, cycle time, and runway range.
   6. *Roadmap Gantt Timeline*: Phased delivery horizon with gated deliverables.
   7. *Skill Gap Paired Progress Bars*: Visual comparison between required competency and current developer skill levels.
   8. *Scalability & Cloud Cost Curve*: Dual-axis latency and cloud expenditure projections at 1K, 10K, and 100K users.
   9. *High-Feasibility Alternatives*: Comparative option cards highlighting the "Best Pick" with 1-click test action.
*  **Export to PDF & Copy Markdown**: Download a clean, multi-page PDF report with dedicated print stylesheets, or copy structured Markdown for Notion/Slack.

---

## 👥 Who This Is For

You should use Reality Check AI if you:
- Make plans that fail despite putting in genuine effort
- Start ambitious side projects but never seem to finish them
- Want to know why an idea won't work **before** spending months on it
- Have fixed constraints—full-time job, family, rent, limited budget—that limit your capacity
- Prefer honest data and hard truth over polite cheerleading

###  Who This Isn't For
- Looking for motivational speeches or positive affirmations
- Wanting "you got this" validation
- Expecting a guarantee of effortless success

---

##  How It Works

### 1. The Input
You provide:
* **The Plan** — What you want to build or achieve and your desired timeline.
* **Constraints** — How many hours per day/week you can realistically dedicate around your job or life.
* **Resources & Budget** — Money available, current technical skill level, team size.
* **Supporting Evidence** *(optional)* — Customer discovery notes, competitor research, pre-orders.

### 2. The Multi-Dimensional Audit
Reality Check AI audits the plan across six dimensions:
1. **Clarity** — Is the scope clearly bounded or still vague?
2. **Timeline Realism** — How does your timeframe compare to industry averages for similar scope?
3. **Scope vs. Capacity** — Does the math work given your actual free hours?
4. **External Dependencies** — Third-party APIs, suppliers, app store approvals, audience size.
5. **Resource Alignment** — Do your funds and technical skills match the requirements?
6. **Risk Concentration** — Where will points of failure compound into burnout?

### 3. The Output
You receive a structured evaluation:
* **Reality Score (0–100)**:
  *  **75–100 (Feasible)** — Realistic scope, safe margins, high likelihood of completion.
  *  **40–74 (Risky)** — Tight bottlenecks; requires scope cutting or timeline extension.
  *  **0–39 (Impossible / Unrealistic)** — Severe math deficit; destined to burn out without a major pivot.
* **Failure Diagnosis** — Clear, plain-English breakdown of where and why the plan breaks down.
* **Critical Stop Signal** — Measurable conditions for when you must cut your losses and pivot.
* **Failure Risk Matrix** — Prioritized list of risks ranked by Probability and Impact.
* **Realistic Roadmap** — Sequenced phases with calibrated duration estimates and action checklists.
* **Decision Path Analysis** — Root cause diagnosis plus 2 high-feasibility alternative strategies.

---

##  Core Principles

* **Assume Average Human Capacity** — Unless specified otherwise, assumes 2–3 productive hours per day for side projects, not superhuman 16-hour hustle.
* **Conservative Real-World Assumptions** — Bugs, iteration loops, vendor delays, and learning curves are baked into the calculations.
* **Grounded in Proven Patterns** — Recommendations reflect real benchmarks and post-mortems, not outlier survivor bias.
* **Respect Human Limits** — Acknowledges that context switching and burnout are real mathematical constraints.
* **Radical Candor** — If a plan is mathematically impossible, you will hear it directly without sugar-coating.

---

##  Real-World Example

**User input:**
> *"I want to build an AI bookkeeping SaaS in 45 days alone while working a 9-to-5 job with $500 budget."*

**Audit output:**
* **Reality Score:** `15 / 100` (Impossible)
* **Failure Diagnosis:** *Building a secure, compliant bookkeeping SaaS in 45 days with only 90 available hours is improbable due to financial compliance, bank integrations, and data security overhead.*
* **What breaks first:** *API integrations take 3× longer than expected; security testing is skipped; project abandoned by week 4 due to exhaustion.*
* **Critical Stop Signal:** *If by Day 20 you do not have automated transaction sync working reliably in a sandbox environment, stop development immediately.*
* **High-Feasibility Alternatives:**
  1. Build a specialized spreadsheet add-on (reduces code footprint by 70%, feasible in 45 days).
  2. Extend timeline to 6 months and focus initially on manual concierge onboarding.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS, Plus Jakarta Sans, Lucide Icons
* **Charts & Visuals**: Recharts (Responsive Line Chart with reference lines & custom tooltips)
* **AI Engine**: Google Gemini API via `@google/genai` SDK
* **Model Strategy**: Resilient automatic fallback (`gemini-3.1-flash-lite` ➔ `gemini-flash-latest` ➔ `gemini-3.8-flash`)
* **State & Persistence**: React Hooks + LocalStorage

---

## 🚀 Getting Started

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
   GEMINI_API_KEY=your_gemini_api_key_here
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

## 💡 How to Use the App

1. **Choose a Preset or Enter Your Plan**: Click one of the 4 quick-start presets or type your own goal in the form.
2. **Set Realistic Constraints**: State your actual weekly hours and budget so the AI can run an accurate math simulation.
3. **Execute Reality Check**: Click **Execute Reality Check** to generate your Reality Score, Failure Diagnosis, and Stop Signal.
4. **Inspect Decision Paths**: Switch between the **Audit Report** and **Decision Paths** tabs to see root-cause insights.
5. **Test Plan Variations**: Click **Test Plan Variation** to add buffer time or reduce scope, and watch your Reality Score trajectory trend upward on the evolution chart!
6. **Track History**: Access your past evaluations and search them anytime via the **Audits** sidebar.

---

## 📜 Philosophy

Most productivity apps are built to cheer you on and keep you feeling motivated. Reality Check AI exists to save you months of wasted effort by telling you the truth early.

Failure is rarely a lack of motivation—it is almost always simple math. When you attempt to compress 800 hours of work into 100 hours of bandwidth, failure is mathematically guaranteed. 

Reality Check AI helps you align your ambition with real-world mathematics so your projects actually cross the finish line.

---

## 🏆 About This Project

Reality Check AI was created during **Google for Startups: Prompt to Prototype**, an intensive program focused on rapidly moving from ambitious idea to a validated, functional product that solves real human problems. 

The mentorship and framework from Google for Startups and Scaler inspired the philosophy behind this product: building tools that provide genuine utility, honest clarity, and real-world leverage.

---

## 🤝 Contributing

Contributions, feedback, and suggestions are welcome!
* Found a bug or want a new feature? Please [open an issue](https://github.com/itssagarK/Reality-check-2/issues).
* Feel free to fork the repository and submit a pull request.

---

**Built with rigor by [@itssagarK](https://github.com/itssagarK). Stop guessing, start auditing.**

