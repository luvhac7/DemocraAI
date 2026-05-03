import { db, auth, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from "firebase/firestore";

const INITIAL_REPORTS = [
  {
    headline: "Hate Speech Allegations in West Bengal Campaign",
    status: "Violation",
    reason: "Candidate referenced religious divides during an official rally in Kolkata, violating MCC Chapter 1.",
    mccReference: "MCC Chapter 1, Clause 3",
    confidence: 0.94,
    source: "Local Monitor Feed"
  },
  {
    headline: "EVM Technical Glitch resolved in Bangalore North",
    status: "Fair",
    reason: "VVPAT machine was replaced within 15 minutes. No impact on voting integrity confirmed by BLO.",
    mccReference: "Procedural Guideline 4.2",
    confidence: 0.98,
    source: "ECI District Officer"
  },
  {
    headline: "Suspicious Cash Seizure at Checkpoint in Bihar",
    status: "Warning",
    reason: "Statutory flying squad seized 50 Lakhs from a vehicle with political flags. Investigation ongoing.",
    mccReference: "Election Expenditure Limit",
    confidence: 0.85,
    source: "Flying Squad Reports"
  },
  {
    headline: "Candidate uses Government Circuit House for Campaign Meeting",
    status: "Violation",
    reason: "Misuse of public infrastructure for partisan political activity. Violation of MCC Section VII.",
    mccReference: "MCC Section VII (d)",
    confidence: 0.91,
    source: "Citizen Complaint Portal"
  },
  {
    headline: "Independent Candidate promises free laptops to all students",
    status: "Fair",
    reason: "Electoral promise within manifesto guidelines. No bribe-like immediate distribution detected.",
    mccReference: "Manifesto Guidelines",
    confidence: 0.88,
    source: "Manifesto Analysis Bot"
  }
];

const INITIAL_NEWS = [
  {
    headline: "Elections announced: Parliamentary (Lok Sabha) polls to be held in 7 phases",
    source: "ECI Official Bulletin",
    summary: "The ECI has announced the schedule for the general elections. Phase 1 starts April 19.",
    category: "Announcement"
  },
  {
    headline: "Model Code of Conduct comes into immediate effect across India",
    source: "NDTV News",
    summary: "Standard code of conduct guidelines are now active following the election announcement.",
    category: "Guideline"
  },
  {
    headline: "Voter Helpline App logs 2 Crore new voter registrations in March",
    source: "Times of India",
    summary: "Youth engagement reaches record highs as first-time voters flock to the ECI app.",
    category: "Awareness"
  }
];

export const seedFairnessData = async () => {
  if (!auth.currentUser) {
    console.log("Skipping seeding: No user authenticated.");
    return;
  }

  try {
    // Seed Fairness Reports
    const qF = query(collection(db, "fairness_reports"), limit(1));
    const snapshotF = await getDocs(qF);
    
    if (snapshotF.empty) {
      console.log("Seeding initial fairness reports...");
      for (const report of INITIAL_REPORTS) {
        try {
          await addDoc(collection(db, "fairness_reports"), {
            ...report,
            timestamp: serverTimestamp()
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, "fairness_reports");
        }
      }
    }

    // Seed Live News
    const qN = query(collection(db, "live_news"), limit(1));
    const snapshotN = await getDocs(qN);
    
    if (snapshotN.empty) {
      console.log("Seeding initial live news...");
      for (const news of INITIAL_NEWS) {
        try {
          await addDoc(collection(db, "live_news"), {
            ...news,
            timestamp: serverTimestamp()
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, "live_news");
        }
      }
    }
  } catch (error) {
    console.error("Seeding process encountered an error:", error);
  }
};
