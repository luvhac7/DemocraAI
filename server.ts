import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "DemocraAI Server is running" });
  });

  // Election Simulation Engine
  app.post("/api/simulate", (req, res) => {
    const { candidates, strategies, voterSegmentBias } = req.body;
    
    // Simple simulation logic
    // We assign weights based on strategies and some randomness
    const results = candidates.map((c: any) => {
      const strategy = strategies?.[c.id] || { budget: 1000, promises: [] };
      const baseScore = Math.random() * 50;
      const budgetWeight = (strategy.budget / 10000) * 20; // Up to 20% boost
      const promiseWeight = (strategy.promises?.length || 0) * 2; // Each promise adds 2%
      
      return {
        ...c,
        votes: Math.floor(baseScore + budgetWeight + promiseWeight + (Math.random() * 10))
      };
    });

    const totalVotes = results.reduce((acc: number, curr: any) => acc + curr.votes, 0);
    const finalResults = results.map((r: any) => ({
      ...r,
      percentage: totalVotes > 0 ? ((r.votes / totalVotes) * 100).toFixed(2) : 0
    })).sort((a: any, b: any) => b.votes - a.votes);

    res.json({
      timestamp: new Date().toISOString(),
      winner: finalResults[0],
      results: finalResults,
      totalVotes
    });
  });

  // Voter Assistant Steps (Static logic for demo)
  app.get("/api/voter-info", (req, res) => {
    const { country, age, location } = req.query;
    // Mocked response for different regions
    const info = {
      steps: [
        "Check voter registration status",
        "Obtain National ID or Voter ID card",
        "Locate nearest polling booth",
        "Know your candidates and their visions",
        "Vote on election day"
      ],
      documents: [
        "Government ID (Passport/National ID)",
        "Proof of Residence",
        "Voter Registration Card"
      ]
    };
    res.json(info);
  });

  // Timeline Generator (Based on general patterns)
  app.get("/api/timeline", (req, res) => {
    const { country, type } = req.query;
    const timeline = [
      { phase: "Voter Registration", date: "Month 1-3" },
      { phase: "Candidate Nomination", date: "Month 4" },
      { phase: "Campaign Period", date: "Month 5" },
      { phase: "Election Day", date: "End of Month 5" },
      { phase: "Result Declaration", date: "Month 6" }
    ];
    res.json(timeline);
  });

  // Real-Time Intelligence & Fairness Engine (Simulated)
  app.post("/api/intelligence/refresh", (req, res) => {
    // This simulates the Cloud Scheduler/Function logic
    const newsKeywords = ["EVM capturing", "MCC violation", "BJP campaign", "Congress rally", "Voter intimidation"];
    const sources = ["ANI", "NDTV", "Times of India", "ECI Bulletin"];
    
    // Simulate fetching a few news items
    const newsItem = {
      headline: `${newsKeywords[Math.floor(Math.random() * newsKeywords.length)]} reported in ${path.join("Bhopal", "Lucknow", "Bangalore", "Patna")}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      processed: newsItem,
      message: "Syncing with ECI fairness monitor..."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
