import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Vote, 
  ShieldCheck, 
  MessageSquare, 
  PlayCircle, 
  BarChart3, 
  Clock, 
  Globe, 
  ShieldAlert, 
  BookOpen,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Activity,
  Zap,
  MapPin,
  RefreshCw,
  Database,
  Cpu,
  BrainCircuit,
  Fingerprint
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

// Mock data for charts
const chartData = [
  { time: "09:00", fairness: 85, violations: 2, trust: 90 },
  { time: "11:00", fairness: 82, violations: 5, trust: 92 },
  { time: "13:00", fairness: 78, violations: 12, trust: 88 },
  { time: "15:00", fairness: 81, violations: 8, trust: 91 },
  { time: "17:00", fairness: 84, violations: 4, trust: 94 },
  { time: "19:00", fairness: 86, violations: 3, trust: 95 },
];

const features = [
  {
    title: "Election Fairness Monitor",
    description: "Real-time AI analysis of MCC compliance and integrity alerts.",
    icon: ShieldCheck,
    color: "bg-green-600/10 text-green-600",
    href: "/fairness",
    status: "Active"
  },
  {
    title: "Live Intelligence Feed",
    description: "Verified election news streams from ECI and trusted agencies.",
    icon: Globe,
    color: "bg-blue-600/10 text-blue-600",
    href: "/live-news",
    status: "+12 New"
  },
  {
    title: "AI Bharat Assistant",
    description: "Multilingual guidance on ECI processes in 12+ Indian languages.",
    icon: MessageSquare,
    color: "bg-orange-500/10 text-orange-600",
    href: "/chat",
    status: "v2.0"
  },
  {
    title: "Lok Sabha Simulator",
    description: "Simulate seat-sharing and voter behavior across all Indian states.",
    icon: PlayCircle,
    color: "bg-purple-600/10 text-purple-600",
    href: "/simulator",
    status: "Beta"
  },
  {
    title: "IT Cell Fact-Checker",
    description: "Combat electoral misinformation and deepfakes with Indian context.",
    icon: ShieldAlert,
    color: "bg-red-500/10 text-red-500",
    href: "/detector",
    status: "High Load"
  },
  {
    title: "Civic Guidelines",
    description: "Simplified ECI rules and step-by-step reporting guides.",
    icon: BookOpen,
    color: "bg-indigo-600/10 text-indigo-600",
    href: "/guidelines",
    status: "Manual"
  }
];

const NewsTicker = () => {
  const [localNews, setLocalNews] = useState<string[]>([]);

  useEffect(() => {
    const q = query(collection(db, "live_news"), orderBy("timestamp", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data().headline);
      if (items.length > 0) setLocalNews(items);
    });
    return () => unsubscribe();
  }, []);

  const tickerItems = localNews.length > 0 ? localNews : [
    "ECI declares polling schedule for Uttar Pradesh Phase 4",
    "Model Code of Conduct strictly enforced in Karnataka",
    "Voter turnout reaches 68% in early morning reports",
    "AI monitors detect 140+ misinformation nodes in past hour"
  ];

  return (
    <div className="bg-primary/10 border-y border-white/5 py-3 overflow-hidden whitespace-nowrap">
      <motion.div 
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        className="flex gap-16 items-center w-max"
      >
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary">
            <Zap className="h-3 w-3 fill-primary" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};


export default function Home() {
  const [fairnessScore, setFairnessScore] = useState(84);
  const [activeAlerts, setActiveAlerts] = useState(7);

  useEffect(() => {
    // Simulate slight fluctuations in metrics
    const interval = setInterval(() => {
      setFairnessScore(prev => Math.min(100, Math.max(70, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
      {/* News Ticker Bar */}
      <NewsTicker />

      <section className="relative overflow-hidden pt-12 pb-20 px-6 rounded-[60px] bg-gradient-to-br from-primary/10 via-zinc-900 to-black border border-white/5">
        <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12">
          <ShieldCheck className="h-96 w-96 text-primary" />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Live 2024 Election Monitor</span>
              </div>
              <div className="hidden md:flex gap-2">
                 <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 uppercase tracking-widest gap-1 py-1">
                   <Database className="h-3 w-3" /> ECI Data
                 </Badge>
                 <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 uppercase tracking-widest gap-1 py-1">
                   <BrainCircuit className="h-3 w-3" /> Vertex AI
                 </Badge>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic">
              Monitoring <span className="text-primary italic">Indian</span> Democracy.
            </h1>
            
            <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary shrink-0" />
              Real-time fairness diagnostics and AI-powered misinformation defense for the largest democratic exercise on Earth.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
               <Link to="/fairness" className={cn(buttonVariants({ size: "lg" }), "rounded-2xl h-16 px-10 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30")}>
                 Fairness Monitor
               </Link>
               <Link to="/live-news" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-2xl h-16 px-10 text-lg font-black uppercase tracking-widest border-white/10 hover:bg-white/5")}>
                 Live Intelligence
               </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">States Voting Today</p>
                <p className="text-3xl font-black">12 <span className="text-sm font-medium text-muted-foreground">Ph-4</span></p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Alerts</p>
                <p className="text-3xl font-black text-red-500">{activeAlerts}</p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">AI Trust Index</p>
                <p className="text-3xl font-black text-green-500">92%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
            <Card className="rounded-[48px] bg-zinc-900/40 backdrop-blur-3xl border-white/10 relative overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <CardHeader className="border-b border-white/5 p-8 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2 italic">
                      <Fingerprint className="h-6 w-6 text-primary" />
                      National <span className="text-primary italic">Fidelity</span>
                    </CardTitle>
                    <CardDescription className="font-bold flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                       Real-time Bharat Monitor
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                     Stable Data
                  </Badge>
               </CardHeader>
               <CardContent className="p-10 space-y-12">
                  <div className="relative h-64 w-64 mx-auto">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                    <svg className="h-full w-full relative z-10" viewBox="0 0 100 100">
                      <circle className="text-white/5 stroke-current" strokeWidth="6" fill="transparent" r="42" cx="50" cy="50" />
                      <motion.circle 
                        className="text-primary stroke-current transition-all duration-1000" 
                        strokeWidth="8" 
                        strokeDasharray="263.8"
                        initial={{ strokeDashoffset: 263.8 }}
                        animate={{ strokeDashoffset: 263.8 - ((fairnessScore / 100) * 263.8) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round" 
                        fill="transparent" 
                        r="42" cx="50" cy="50" 
                        transform="rotate(-90 50 50)" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                       <span className="text-6xl font-black italic tracking-tighter">{fairnessScore}%</span>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Conduct Integrity</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-48 w-full">
                    <div className="h-full">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Integrity Velocity</p>
                        <RefreshCw className="h-3 w-3 animate-spin duration-[6s] opacity-30" />
                      </div>
                      <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorFairness" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff4b2b" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ff4b2b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="fairness" stroke="#ff4b2b" fillOpacity={1} fill="url(#colorFairness)" strokeWidth={4} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-full">
                      <p className="text-[10px] font-black uppercase text-red-500/60 tracking-widest mb-2">Threat Detection Frequency</p>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={chartData}>
                          <Bar dataKey="violations" fill="#ef4444" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link to={feature.href}>
              <Card className="h-full rounded-[32px] bg-white/5 border-white/5 hover:bg-white/[0.08] hover:translate-y-[-8px] transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <feature.icon className="h-24 w-24" />
                </div>
                <CardHeader className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg", feature.color)}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-white/10 group-hover:border-primary/50 transition-colors">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="text-sm font-medium leading-relaxed mt-2">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                   <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                      Explore Module <ChevronRight className="h-4 w-4" />
                   </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Alerts & News Trend Panel */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[40px] border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardHeader className="p-10 border-b border-white/5">
             <CardTitle className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" />
                High Integrity Alerts <span className="text-primary italic">Resolved</span>
             </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-6">
             {[
               { region: "Noida, UP", time: "14 mins ago", issue: "Large scale fake campaign video detected and flagged.", type: "AI Fact Check" },
               { region: "Patna, Bihar", time: "42 mins ago", issue: "Voter intimidation report verified as false by local ECI team.", type: "Security Monitor" },
               { region: "Bangalore, KA", time: "2 hours ago", issue: "MCC violation regarding rally timings investigated.", type: "Compliance" }
             ].map((alert, i) => (
                <div key={i} className="flex gap-6 items-start pb-6 border-b border-white/5 last:border-0 last:pb-0 group">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 shrink-0 flex items-center justify-center font-black text-xs text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {i+1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">{alert.type}</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{alert.time}</span>
                    </div>
                    <h4 className="text-lg font-bold leading-tight">{alert.issue}</h4>
                    <p className="text-xs text-muted-foreground font-medium">Verified Location: <span className="text-white">{alert.region}</span></p>
                  </div>
                </div>
             ))}
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-primary/20 bg-primary/5 flex flex-col justify-center items-center text-center p-10 space-y-8">
           <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <RefreshCw className="h-12 w-12 text-primary" />
           </div>
           <div className="space-y-2">
             <h3 className="text-3xl font-black tracking-tighter italic">Join World's Largest <span className="text-primary italic">Democracy.</span></h3>
             <p className="text-muted-foreground font-medium">Verify your registration, understand your rights, and vote for the future of Bharat.</p>
           </div>
           <Link to="/voter-assistant" className={cn(buttonVariants({ size: "lg" }), "w-full rounded-2xl h-14 uppercase font-black tracking-widest")}>
              Get Started Now
           </Link>
           <p className="text-[9px] font-black uppercase tracking-widest opacity-30 italic">Powered by ECI Open Data & Vertex AI</p>
        </Card>
      </div>
    </div>
  );
}
