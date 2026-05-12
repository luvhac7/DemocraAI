# DemocraAI India 🇮🇳

**Intelligent Election Navigator for Indian Democracy**

DemocraAI India is a holistic platform designed to bridge the information gap between the electorate and the complex electoral machinery of India. By combining AI-driven analysis with interactive transparency tools, we empower voters to make informed decisions and verify the integrity of the information they consume.

## 🚀 Vision
To build a "National Integrity Pulse" that ensures every Indian citizen has access to verified civic knowledge, real-time election simulations, and a defense mechanism against digital misinformation.

---

## ✨ Key Features

### 🤖 AI Civic Assistant
A 24/7 intelligent companion that answers complex queries about the Indian Constitution, Model Code of Conduct (MCC), and voting processes in simple language.

### 🗳️ Lok Sabha Simulator
An interactive tool that allows users to simulate national election outcomes based on various demographic shifts, swing factors, and alliance changes.

### 🛡️ Fake News Detector
Combat misinformation with our AI-powered detector. Enter any news snippet to receive an "Integrity Score" and a detailed breakdown of potential biases or factual gaps.

### 📋 Stability Audit
A unique feature that provides a real-time audit of the platform's own data fidelity, accessibility standards, and alignment with the democratic problem statement.

### 📍 Voter Guide & Timeline
Regionalized information for every Indian state, including key dates, constituency details, and registration procedures.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Motion.
- **Backend:** Firebase (Auth & Firestore).
- **AI Engine:** Google Gemini Pro API.
- **Charts:** Recharts / D3.js.
- **Icons:** Lucide React.
- **UI Components:** Radix UI primitives.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── ui/             # Reusable atomic UI components (Button, Card, etc.)
│   ├── layout/         # Navigation and high-level layout wrappers
│   └── charts/         # Custom visualization components
├── pages/
│   ├── Home.tsx        # Dashboard entry point
│   ├── SimulatorPage.tsx # Election simulation logic
│   ├── NewsPage.tsx    # Fake News detection interface
│   ├── AuditPage.tsx   # Integrity & Stability audit results
│   └── ChatPage.tsx    # Civic Assistant interface
├── lib/
│   ├── firebase.ts     # Firebase initialization & error handling
│   ├── aiService.ts    # Gemini API wrapper and prompts
│   └── auth.tsx        # Auth state provider
└── services/           # External API handlers and business logic
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn
- A Firebase Project
- Google Gemini API Key

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_PROJECT_ID=your_id
   GEMINI_API_KEY=your_gemini_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Legal & Compliance
This application is designed as an educational and transparency tool. It is not affiliated with the Election Commission of India (ECI). All data used for simulations is based on publicly available historical datasets.
