# Reality Check AI

Reality Check AI is a professional feasibility auditing and decision-path analysis system. It evaluates plans realistically and helps users choose better paths using evidence-based reasoning. It features a hyper-realistic glassmorphic UI and utilizes the Gemini API for fast, clinical, and direct analysis.

## Features
- **Clinical Feasibility Audits**: Get a reality score and tag for your plans.
- **Failure-Oriented Diagnosis**: Identify why a current path might struggle or fail.
- **Decision Path Analysis**: Explore alternative, more feasible paths with clear trade-offs.
- **Overengineering Detection**: Get simplification advice to avoid scope creep.
- **Hyper-Realistic Glassmorphic UI**: Beautiful, engaging, and responsive interface.
- **History Tracking**: Automatically saves your previous audits for easy retrieval.

## Prerequisites
To run this project locally, you will need:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm, yarn, or pnpm
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

## Local Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd reality-check-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory of the project and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: The Vite configuration automatically maps this to the application's environment).*

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Building for Production

To create a production-ready build, run:
```bash
npm run build
```
This will generate optimized static files in the `dist` directory, which can be deployed to any static hosting service.

## Usage Guide
1. **Input your plan**: Describe your project, goal, or plan in the main text area. Include context like your budget, skill level, and time commitment using the parameters panel.
2. **Analyze**: Click the "Execute Reality Check" button. The AI will process your input and generate a comprehensive audit.
3. **Review the Report**: 
   - Check your **Reality Score** and **Tag**.
   - Read the **Failure Diagnosis** to understand potential pitfalls.
   - Review **Alternative Paths** and click "Simulate Path" to explore them further.
4. **History**: Access past audits by clicking the "Audit Archives" (clock icon) button.

## Technologies Used
- React 19
- Vite
- Tailwind CSS
- Framer Motion (motion/react)
- Lucide React (Icons)
- @google/genai (Gemini API SDK)
