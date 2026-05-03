import React from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  History, 
  X, 
  ChevronLeft,
  AlertCircle,
  Lightbulb,
  Cpu
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Testing", score: 0, color: "bg-red-500/40" },
  { name: "Accessibility", score: 92.5, color: "bg-blue-500" },
  { name: "Google Services", score: 75, color: "bg-blue-500" },
  { name: "Problem Statement Alignment", score: 98, color: "bg-blue-500" },
];

const insights = [
  {
    icon: Lightbulb,
    text: "Testing coverage appears limited to core paths, with gaps around edge cases and integration flows."
  },
  {
    icon: Cpu,
    text: "Usage reflects broader adoption of Google services like Cloud Functions, BigQuery, or AI/ML APIs across workflows."
  },
  {
    icon: Sparkles,
    text: "Performance behavior is consistently efficient, showing stable load times and optimized resource usage."
  },
  {
    icon: ShieldCheck,
    text: "Codebase quality appears strong, showing clear structure, maintainability, and alignment across components."
  },
  {
    icon: CheckCircle2,
    text: "Accessibility practices appear well-aligned with standards, supported by consistent structure and inclusive interactions."
  },
  {
    icon: BrainCircuit,
    text: "Security implementation demonstrates strong defensive practices and awareness of common risk vectors."
  }
];

export default function EvaluationPage() {
  const navigate = useNavigate();
  const overallScore = 82.84;

  return (
    <div className="container max-auto py-12 px-4 md:px-8 space-y-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-primary" />
              AI Stability <span className="text-primary text-4xl">Audit</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              Analysis completed: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-1 font-black uppercase text-[10px] tracking-widest gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Audit Status: Pass
          </Badge>
          <Button variant="ghost" size="icon" className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Score & Breakdown Card */}
        <Card className="lg:col-span-12 rounded-[40px] border-white/5 bg-zinc-900/50 backdrop-blur-3xl overflow-hidden shadow-2xl">
          <CardContent className="p-0">
             <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left side: Circular Gauge */}
                <div className="p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="relative h-64 w-64">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle 
                        className="text-white/5 stroke-current" 
                        strokeWidth="8" 
                        fill="transparent" 
                        r="42" cx="50" cy="50" 
                      />
                      {/* Progress circle */}
                      <motion.circle 
                        className="text-blue-500 stroke-current" 
                        strokeWidth="8" 
                        strokeDasharray="263.8"
                        initial={{ strokeDashoffset: 263.8 }}
                        animate={{ strokeDashoffset: 263.8 - (overallScore / 100 * 263.8) }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        strokeLinecap="round" 
                        fill="transparent" 
                        r="42" cx="50" cy="50" 
                        transform="rotate(-90 50 50)" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                       <motion.span 
                         initial={{ opacity: 0, scale: 0.5 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="text-6xl font-black tracking-tighter"
                       >
                         {overallScore}%
                       </motion.span>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Integrity Score</span>
                    </div>
                  </div>
                  <div className="mt-8 text-center space-y-2">
                     <p className="text-sm font-bold text-zinc-300">Operational Integrity: High</p>
                     <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                       Calculated across 14,000 truth-markers and ECI guideline sets.
                     </p>
                  </div>
                </div>

                {/* Right side: Categories */}
                <div className="p-12 space-y-8">
                  {categories.map((cat, i) => (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-zinc-300">{cat.name}</span>
                        <span className="text-sm font-black text-blue-500 italic">{cat.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className={cn("h-full", cat.color)}
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.score}%` }}
                          transition={{ duration: 1.5, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-8 flex justify-between items-center border-t border-white/5">
                    <Button variant="outline" className="rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest border-white/10 hover:bg-white/5">
                       <History className="h-4 w-4" /> Previous Score
                    </Button>
                    <div className="flex items-center gap-2">
                       <Info className="h-4 w-4 text-muted-foreground" />
                       <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Version 2.4.1</span>
                    </div>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* AI Insights Panel (Bottom section from screenshot) */}
        <Card className="lg:col-span-12 rounded-[40px] border-white/5 bg-zinc-900/30 overflow-hidden">
          <CardContent className="p-10 space-y-8">
            <div className="flex items-center gap-2 text-primary">
               <Sparkles className="h-5 w-5" />
               <h4 className="text-sm font-black uppercase tracking-[0.2em]">Recommendations for Fidelity Gain</h4>
            </div>

            <div className="space-y-6">
               <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {insights.map((insight, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 items-start group"
                      >
                         <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                            <insight.icon className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
                         </div>
                         <p className="text-sm text-zinc-400 font-medium leading-relaxed pt-1 group-hover:text-white transition-colors">
                            {insight.text}
                         </p>
                      </motion.div>
                    ))}
                  </div>
               </ScrollArea>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Compute Cost</span>
                     <span className="text-xs font-black tracking-tighter italic">Low-Efficiency Tier</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                     <span className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Data Freshness</span>
                     <span className="text-xs font-black tracking-tighter italic">14s ago</span>
                  </div>
               </div>
               <Button className="rounded-xl gap-2 font-black uppercase text-xs px-8 bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/20">
                  Generate PDF Report <Sparkles className="h-4 w-4" />
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
