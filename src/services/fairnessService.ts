import { GoogleGenAI } from "@google/genai";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface FairnessAnalysis {
  status: "Fair" | "Warning" | "Violation";
  reason: string;
  mccReference: string;
  confidence: number;
}

export const analyzeElectionFairness = async (newsText: string): Promise<FairnessAnalysis> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const systemInstruction = `As an expert in Indian Election Law and ECI Model Code of Conduct (MCC), analyze the following election-related news text for potential fairness violations.
      
      Categories for Status:
      - FAIR: No violation of MCC or democratic norms.
      - WARNING: Suspicious activity, potential misuse of resources, or polarized rhetoric that borders on violation.
      - VIOLATION: Clear breach of MCC (e.g., hate speech, use of religious places for campaign, distribution of liquor/money, misuse of government machinery).`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: `Analyze this news text for fairness: "${newsText}"` }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("Invalid AI response format");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Fairness Analysis failed:", error);
    return {
      status: "Warning",
      reason: "Automated analysis inconclusive. Manual review suggested.",
      mccReference: "General Conduct Guidelines",
      confidence: 0.5
    };
  }
};

export const fetchLatestFairnessReports = async () => {
  try {
    const reportsRef = collection(db, "fairness_reports");
    const q = query(reportsRef, orderBy("timestamp", "desc"), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "fairness_reports");
    return [];
  }
};
