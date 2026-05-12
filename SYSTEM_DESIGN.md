# System Design: DemocraAI India

DemocraAI India is an intelligent platform designed to strengthen democratic participation in the world's largest democracy. It leverages modern AI, real-time data, and interactive simulations to empower citizens and ensure election integrity.

## 1. Architectural Overview

The application follows a modern full-stack SPA architecture with a headless backend (Firebase) and AI-driven intelligence (Gemini).

### Frontend (Client-Side)
- **Framework:** React 18+ with TypeScript for type-safe development.
- **Build Tool:** Vite for fast HMR and optimized production builds.
- **Styling:** Tailwind CSS for a utility-first, responsive design.
- **Animations:** Motion (Framer Motion) for fluid UI transitions and feedback.
- **Component Library:** Custom-built components using Radix UI primitives and shadcn/ui patterns.
- **Routing:** React Router v6 for client-side navigation.

### Backend & Data (Serverless)
- **Authentication:** Firebase Authentication (Google OAuth) for secure user sessions.
- **Database:** Cloud Firestore for real-time storage of user profiles, audit reports, and civic interactions.
- **Security:** Hardened Firestore Security Rules employing the "Master Gate" pattern to prevent unauthorized access.

### Intelligence Layer (AI Services)
- **Engine:** Gemini Pro (via `@google/genai`) for natural language processing.
- **Features:**
    - **Civic Assistant:** Semantic chat for explaining constitutional and electoral processes.
    - **Fake News Detector:** Heuristic and LLM-based analysis of news snippets.
    - **Stability Audit:** Automated analysis of codebase and data integrity markers.

---

## 2. Core Functional Modules

### A. AI Civic Assistant
- **Logic:** stateless chat interface that leverages zero-shot and few-shot prompting to provide context-aware answers about Indian laws, ECI guidelines, and constitutional rights.
- **Integration:** Uses a service-layer abstraction (`aiService.ts`) to manage prompts and handle streaming responses.

### B. Lok Sabha Election Simulator
- **Model:** A probabilistic simulation engine that takes user-defined variables (swing rates, turnout, alliance shifts) to project seat counts.
- **Visualization:** D3/Recharts-based charts for real-time feedback during variable adjustment.

### C. Fake News Detector
- **Process:**
    1. User inputs social media snippets or news URLs.
    2. The AI analyzes text for semantic inconsistencies, bias markers, and known misinformation patterns.
    3. Returns a "Fidelity Score" with specific red flags (e.g., emotional manipulation, lack of attribution).

### D. National Integrity Pulse (Stability Audit)
- **Purpose:** A meta-evaluation tool (inspired by hackathon/submission audits) that checks the "health" of the application's data and features.
- **Metrics:** Accessibility (WCAG), Problem Statement Alignment, and Truthfulness Verification scores.

---

## 3. Data Flow & Security

### Secure Interaction Flow
1. User Authenticates via Google.
2. Client requests AI analysis (e.g., Fake News detection).
3. Result is previewed to the user.
4. If opted, result is persisted to Firestore under `users/{uid}/audits` for history.

### Security Invariants
- **ID Poisoning Guard:** Validation helpers in Firestore rules ensure all document IDs are sanitized.
- **Temporal Integrity:** Server-side timestamps (`request.time`) are used for all record creation to prevent client-side clock skew or spoofing.
- **PII Isolation:** User sensitive data (emails) are only readable by the authenticated owner.

---

## 4. Scalability & Performance
- **Asset Optimization:** Minimal use of heavy assets; icons are served via `lucide-react` (SVG).
- **Lazy Loading:** Route-based code splitting ensures initial page loads are under 2s on 4G connections.
- **Concurrency:** AI calls are handled asynchronously with loading states to maintain UI responsiveness.
