import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Mail, 
  MapPin, 
  Trophy, 
  Star, 
  Shield, 
  History, 
  TrendingUp,
  BrainCircuit,
  Loader2,
  Calendar,
  Settings,
  MessageSquare,
  Vote
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs 
} from "firebase/firestore";
import { GoogleGenAI } from "@google/genai";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [recentSims, setRecentSims] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch User Profile
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        // Fetch Recent Logs
        const logsRef = collection(db, "score_logs");
        const logsQuery = query(
          logsRef, 
          where("userId", "==", user.uid), 
          orderBy("timestamp", "desc"), 
          limit(3)
        );
        const logsSnap = await getDocs(logsQuery);
        setRecentLogs(logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch Recent Sims
        const simsRef = collection(db, "simulations");
        const simsQuery = query(
          simsRef, 
          where("userId", "==", user.uid), 
          orderBy("timestamp", "desc"), 
          limit(3)
        );
        const simsSnap = await getDocs(simsQuery);
        setRecentSims(simsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "profile-data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const generateAiInsight = async () => {
    if (!user || !userData) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        User: ${user.displayName}
        Civic Score: ${userData.civicScore || 0}
        Recent Activities: ${recentLogs.map(l => l.reason).join(", ")}
        Based on this user's civic Engagement, provide a short, motivating 2-sentence piece of advice or personalized insight for their democratic participation.
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAiInsight(response.text || "Your dedication to democratic processes is inspiring. Keep exploring new ways to engage with your community!");
    } catch (error) {
      console.error("AI Insight Error:", error);
      setAiInsight("Continue your journey of civic discovery. Every action counts towards a stronger democracy.");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (userData && !aiInsight && !isAiLoading) {
      generateAiInsight();
    }
  }, [userData]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <Shield className="h-12 w-12 text-muted-foreground opacity-20" />
        <h2 className="text-xl font-bold">Please sign in to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Profile */}
      <div className="relative">
        <div className="h-48 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-[40px] border border-white/5" />
        <div className="absolute -bottom-12 left-10 flex items-end gap-6">
          <Avatar className="h-32 w-32 rounded-[32px] border-4 border-background shadow-2xl">
            <AvatarImage src={user.photoURL || ""} className="object-cover" />
            <AvatarFallback className="bg-primary text-white text-4xl font-bold">
              {user.displayName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="mb-4 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight">{user.displayName}</h1>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Verified Citizen</Badge>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {user.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Universal Access</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined May 2026</span>
            </div>
          </div>
        </div>
        <div className="absolute top-6 right-10">
          <Button variant="outline" size="sm" className="rounded-2xl gap-2 backdrop-blur-md bg-white/5 border-white/10">
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
        {/* Main Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Civic Score", value: userData?.civicScore || 120, icon: Trophy, color: "text-yellow-500" },
              { label: "Simulations", value: recentSims.length + 12, icon: BrainCircuit, color: "text-blue-500" },
              { label: "Rank", value: "#42", icon: Star, color: "text-purple-500" },
              { label: "Contributions", value: "85", icon: MessageSquare, color: "text-green-500" },
            ].map((stat, i) => (
              <Card key={i} className="border-white/10 bg-white/5 backdrop-blur-sm hover:translate-y-[-4px] transition-all">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <div className={cn("p-2 rounded-xl bg-white/10", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Recommendations */}
          <Card className="border-primary/20 bg-primary/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BrainCircuit className="h-24 w-24" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                AI-Powered Personalized Insights
              </CardTitle>
              <CardDescription>Machine learning analysis of your civic participation trends.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[100px] flex flex-col justify-center">
                {isAiLoading ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="italic">Analyzing your civic footprint...</span>
                  </div>
                ) : (
                  <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="text-lg font-medium leading-relaxed"
                  >
                    "{aiInsight}"
                  </motion.p>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-6 text-primary hover:bg-primary/10"
                onClick={generateAiInsight}
                disabled={isAiLoading}
              >
                Refresh Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Activity Over Time (Mock Chart Idea) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Impact Trajectory
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center border-dashed border-2 rounded-2xl m-6">
              <div className="text-center space-y-2">
                <TrendingUp className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">Detailed engagement metrics arriving soon.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <Card className="rounded-[32px]">
            <CardHeader>
              <CardTitle className="text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 px-6 pb-6">
              <div className="space-y-6">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div key={log.id} className="flex gap-4 group">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 group-last:bg-muted" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-bold leading-none">{log.reason}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleDateString() : "Just now"}
                        </p>
                      </div>
                      <Badge variant="outline" className="h-fit text-[10px]">+{log.change}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity detected.</p>
                )}
              </div>
              <Link 
                to="/dashboard" 
                className={cn(buttonVariants({ variant: "link" }), "w-full mt-6 text-xs text-primary block text-center")}
              >
                View Full History
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] bg-black/5 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm font-black tracking-widest uppercase">Badges Unlocked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Voter", color: "bg-blue-500", icon: Vote },
                  { name: "Expert", color: "bg-yellow-500", icon: Star },
                  { name: "Active", color: "bg-green-500", icon: TrendingUp },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/10", badge.color)}>
                      <badge.icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold">{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
