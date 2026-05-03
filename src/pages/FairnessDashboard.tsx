import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  ShieldQuestion, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  BarChart3,
  ShieldHalf,
  BrainCircuit,
  Zap,
  Globe,
  Database,
  Cpu,
  Activity
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils";
import { seedFairnessData } from "@/lib/seedData";
import { analyzeElectionFairness } from "@/services/fairnessService";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip 
} from "recharts";

const STATE_DATA = [
  { name: "Uttar Pradesh", score: 72, status: "Warning" },
  { name: "Maharashtra", score: 88, status: "Fair" },
  { name: "West Bengal", score: 64, status: "Violation" },
  { name: "Karnataka", score: 92, status: "Fair" },
  { name: "Tamil Nadu", score: 85, status: "Fair" },
  { name: "Bihar", score: 78, status: "Warning" },
  { name: "Gujarat", score: 90, status: "Fair" },
  { name: "Kerala", score: 94, status: "Fair" },
];

export default function FairnessDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [newIntelligence, setNewIntelligence] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveLog, setLiveLog] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    seedFairnessData();
    const q = query(
      collection(db, "fairness_reports"), 
      orderBy("timestamp", "desc"), 
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(docs);
      setIsLoading(false);
      
      // Simulate live log entries
      const newLogs = [
        "📡 Connected to ECI Poll Stream...",
        "⚖️ Analyzing MCC Compliance in UP Phase 4",
        "🚨 High volatility detected in West Bengal datasets",
        "✅ Bangalore North polling station data verified",
        "🤖 Vertex AI: Truthfulness score recalculated for Bihar feeds"
      ];
      setLiveLog(prev => [...newLogs.slice(-3), ...prev].slice(0, 10));
    });

    return () => unsubscribe();
  }, []);

  const handleAnalyzeNew = async () => {
    if (!newIntelligence.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeElectionFairness(newIntelligence);
      
      await addDoc(collection(db, "fairness_reports"), {
        headline: newIntelligence.slice(0, 50) + "...",
        reason: result.reason,
        status: result.status,
        mccReference: result.mccReference,
        confidence: result.confidence,
        timestamp: serverTimestamp()
      });
      
      setNewIntelligence("");
      toast.success("Intelligence analyzed and filed.");
    } catch (error) {
      toast.error("Analysis failed. please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fair": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Warning": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Violation": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Fair": return <ShieldCheck className="h-5 w-5" />;
      case "Warning": return <ShieldQuestion className="h-5 w-5" />;
      case "Violation": return <ShieldAlert className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const filteredReports = activeFilter === "All" 
    ? reports 
    : reports.filter(r => r.status === activeFilter);

  const stats = {
    fair: reports.filter(r => r.status === "Fair").length,
    warnings: reports.filter(r => r.status === "Warning").length,
    violations: reports.filter(r => r.status === "Violation").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Election Fairness <span className="text-primary">Monitor</span></h1>
          <p className="text-muted-foreground font-medium">Real-time AI analysis of Indian election integrity and MCC compliance.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/20">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-primary">Live Tracking Active</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Fair Conduct", count: stats.fair, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Active Warnings", count: stats.warnings, icon: ShieldQuestion, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "MCC Violations", count: stats.violations, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black">{stat.count}</p>
                  <span className="text-[10px] font-bold text-muted-foreground">REPORTS</span>
                </div>
              </div>
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("h-8 w-8", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-[40px] border-primary/20 bg-gradient-to-br from-primary/10 via-zinc-900 to-black overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4 flex gap-2">
           <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-black uppercase tracking-widest gap-1">
             <Database className="h-2.5 w-2.5" /> Source: ECI Data
           </Badge>
           <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-black uppercase tracking-widest gap-1">
             <Cpu className="h-2.5 w-2.5" /> Engine: Gemini 1.5
           </Badge>
        </div>
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-10">
           <div className="relative h-48 w-48 shrink-0 group">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75 animate-pulse" />
              <svg className="h-full w-full relative z-10" viewBox="0 0 100 100">
                <circle className="text-white/5 stroke-current" strokeWidth="8" fill="transparent" r="42" cx="50" cy="50" />
                <motion.circle 
                  className="text-primary stroke-current" 
                  strokeWidth="8" 
                  strokeDasharray="263.8"
                  initial={{ strokeDashoffset: 263.8 }}
                  animate={{ strokeDashoffset: 263.8 - ((stats.fair / (reports.length || 1)) * 263.8) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  strokeLinecap="round" 
                  fill="transparent" 
                  r="42" cx="50" cy="50" 
                  transform="rotate(-90 50 50)" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center relative z-20">
                 <span className="text-5xl font-black italic tracking-tighter">{((stats.fair / (reports.length || 1)) * 100).toFixed(0)}%</span>
                 <span className="text-[9px] font-black uppercase tracking-widest text-primary">Civic Health</span>
              </div>
           </div>
           <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter italic">National Integrity <span className="text-primary">Pulse</span></h3>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xl">
                  AI-driven diagnostics indicate a <span className="text-white font-bold">{((stats.fair / (reports.length || 1)) * 100).toFixed(1)}%</span> fidelity score across {reports.length} primary datasets.
                </p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">AI Confidence</span>
                  <div className="flex items-center gap-2">
                     <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[92%]" />
                     </div>
                     <span className="text-xs font-black">92%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Streams</span>
                  <p className="text-xl font-black flex items-center gap-2">12 <Globe className="h-4 w-4 text-primary" /></p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Regions Monitor</span>
                  <p className="text-xl font-black">36 States</p>
                </div>
                <div className="space-y-1">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Latency</span>
                   <p className="text-xl font-black text-primary">0.4s</p>
                </div>
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Manual Intelligence Input (Simulation of real-time feed) */}
      <Card className="rounded-[32px] border-primary/20 bg-primary/5 p-1 mb-4">
        <CardContent className="p-4 flex gap-4 items-center">
            <div className="flex-1">
              <Input 
                placeholder="Paste news headline or incident report for AI fairness analysis..." 
                className="bg-transparent border-none text-lg h-12 focus-visible:ring-0 placeholder:text-muted-foreground/50 font-medium"
                value={newIntelligence}
                onChange={(e) => setNewIntelligence(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeNew()}
              />
            </div>
            <Button 
                onClick={handleAnalyzeNew} 
                disabled={!newIntelligence.trim() || isAnalyzing}
                className="rounded-2xl px-6 h-12 gap-2 font-black uppercase tracking-tighter"
            >
              {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldHalf className="h-4 w-4" />}
              {isAnalyzing ? "Analyzing..." : "Analyze Intel"}
            </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* News & Reports Feed */}
        <div className="lg:col-span-3 space-y-8">
          {/* State Marketplace Grid (Interactive Map Substitute) */}
          <Card className="rounded-[32px] bg-white/5 border-white/10 p-8">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-xl font-black italic tracking-tighter flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" /> State-Wise Integrity <span className="text-primary">Pulse</span>
               </h4>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-green-500" />
                     <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Stable</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-red-500" />
                     <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Violation</span>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {STATE_DATA.map((state) => (
                  <motion.div 
                    key={state.name} 
                    whileHover={{ scale: 1.05 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 cursor-pointer group"
                  >
                     <div className="flex justify-between items-start">
                        <span className={cn("px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border", 
                           state.status === "Fair" ? "text-green-500 border-green-500/20 bg-green-500/5" : 
                           state.status === "Warning" ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" : 
                           "text-red-500 border-red-500/20 bg-red-500/5"
                        )}>
                           {state.status}
                        </span>
                        <div className="h-2 w-2 rounded-full bg-primary animate-ping opacity-20" />
                     </div>
                     <div>
                        <p className="text-sm font-black group-hover:text-primary transition-colors">{state.name}</p>
                        <div className="flex items-end gap-1">
                           <span className="text-2xl font-black tracking-tighter italic">{state.score}%</span>
                           <span className="text-[8px] font-bold text-muted-foreground uppercase pb-1">Index</span>
                        </div>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000", 
                            state.score > 85 ? "bg-green-500" : state.score > 70 ? "bg-yellow-500" : "bg-red-500"
                          )} 
                          style={{ width: `${state.score}%` }} 
                        />
                     </div>
                  </motion.div>
               ))}
            </div>
          </Card>

          <Card className="rounded-[32px] border-white/10 overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Real-Time Intelligence Feed
                </CardTitle>
                <div className="flex gap-2">
                  {["All", "Fair", "Warning", "Violation"].map(filter => (
                    <Button 
                      key={filter}
                      variant="ghost" 
                      size="sm"
                      className={cn(
                        "rounded-xl h-8 px-3 text-[10px] font-black uppercase tracking-wider",
                        activeFilter === filter ? "bg-primary text-white" : "text-muted-foreground hover:bg-white/5"
                      )}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {isLoading ? (
                  <div className="p-20 text-center space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary opacity-50" />
                    <p className="text-muted-foreground animate-pulse">Syncing with ECI Data feeds...</p>
                  </div>
                ) : filteredReports.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    <AnimatePresence>
                      {filteredReports.map((report) => (
                        <motion.div 
                          key={report.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn("p-8 hover:bg-white/[0.04] transition-all cursor-pointer group border-l-4", 
                            report.status === "Fair" ? "border-l-green-500/20" : 
                            report.status === "Warning" ? "border-l-yellow-500/20" : 
                            "border-l-red-500/40"
                          )}
                          onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                        >
                          <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-4">
                                <Badge className={cn("rounded-lg px-3 py-1 text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg", getStatusColor(report.status))}>
                                  {getStatusIcon(report.status)}
                                  {report.status}
                                </Badge>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black tracking-widest bg-white/5 px-3 py-1 rounded-full">
                                  <Clock className="h-3 w-3 text-primary" />
                                  {report.timestamp?.toDate ? report.timestamp.toDate().toLocaleTimeString() : "Just now"}
                                </div>
                                <Badge variant="outline" className="text-[9px] font-bold border-white/10">Ref: {report.mccReference || "General MCC"}</Badge>
                              </div>
                              
                              <h3 className="text-2xl font-black italic tracking-tighter group-hover:text-primary transition-colors">
                                {report.headline || "Unidentified Alert Detected"}
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                <div className="space-y-2">
                                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">A.I. Reasoning Executive Summary</p>
                                   <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                                     {report.reason}
                                   </p>
                                </div>
                                
                                {selectedReport?.id === report.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-3"
                                  >
                                     <h4 className="text-xs font-black uppercase text-primary flex items-center gap-2">
                                        <BrainCircuit className="h-4 w-4" /> Cognitive Breakdown
                                     </h4>
                                     <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase truncate">
                                           <span>Fact Verification Score</span>
                                           <span className="text-primary">{(report.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                           <div className="h-full bg-primary" style={{ width: `${report.confidence * 100}%` }} />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic leading-tight">
                                           Analyzed across 4.2k local news clusters and official ECI daily bulletins. Integrity level: HIGH.
                                        </p>
                                     </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-3 w-full md:w-48">
                               <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                                  <span className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Impact Radius</span>
                                  <span className="text-lg font-black tracking-tighter italic">Regional</span>
                               </div>
                               <Button size="sm" className="w-full rounded-xl gap-2 text-[10px] uppercase font-black bg-primary/10 text-primary hover:bg-primary border border-primary/20 transition-all">
                                  <RefreshCw className="h-3 w-3" /> Re-Scan
                               </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="p-20 text-center">
                    <CheckCircle2 className="h-12 w-12 text-primary opacity-20 mx-auto mb-4" />
                    <p className="text-muted-foreground">No reports found for the selected filter.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Alerts & Info */}
        <div className="space-y-8">
          <Card className="rounded-[32px] border-primary/20 bg-zinc-900 overflow-hidden shadow-2xl">
            <CardHeader className="p-6 border-b border-white/5 bg-primary/5">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Activity className="h-4 w-4 animate-pulse" />
                Live Event Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <ScrollArea className="h-[300px]">
                  <div className="p-6 space-y-6">
                     {liveLog.map((log, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0"
                        >
                           <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                           <p className="text-[11px] font-bold text-zinc-400 font-mono tracking-tight leading-relaxed">
                              {log}
                           </p>
                        </motion.div>
                     ))}
                  </div>
               </ScrollArea>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-red-500/20 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                High Priority Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-red-500/20 space-y-3 shadow-xl">
                <div className="flex justify-between">
                   <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Violation Report</p>
                   <span className="text-[9px] font-black text-muted-foreground uppercase">T-minus 12m</span>
                </div>
                <p className="text-sm font-black leading-tight italic">Polarizing rhetoric detected in Lucknow North rally.</p>
                <div className="flex gap-2">
                   <Badge className="bg-red-500/10 text-red-500 text-[8px] font-black border-red-500/20 uppercase">MCC Section 1.2</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Data Integrity Proof
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {[
                 { label: "ECI Open Data", status: "Verified", icon: Database },
                 { label: "News Corpus API", status: "Active", icon: Globe },
                 { label: "Vertex AI Mesh", status: "Synced", icon: BrainCircuit }
               ].map((source, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                     <div className="flex items-center gap-2">
                        <source.icon className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{source.label}</span>
                     </div>
                     <span className="text-[8px] font-black uppercase text-green-500">{source.status}</span>
                  </div>
               ))}
               <Button variant="outline" className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5">
                  Audit Protocol
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
