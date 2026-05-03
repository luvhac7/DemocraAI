import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Play, 
  PlayCircle,
  TrendingUp, 
  Settings2, 
  Users, 
  Info,
  DollarSign,
  Gavel,
  Globe,
  Calendar,
  Layers,
  History,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ElectionResultChart from "@/components/charts/ElectionResultChart";
import { simulateElection } from "@/services/api";
import { Candidate, SimulationResult } from "@/types";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";

import { INDIAN_STATES, INDIAN_PARTIES } from "@/constants_india";

export default function SimulatorPage() {
  const { user } = useAuth();
  const [electionDetails, setElectionDetails] = useState({
    country: "India",
    state: "Uttar Pradesh",
    date: "2024-05-20",
    type: "Lok Sabha Election"
  });
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "National Alliance", party: "BJP", vision: "Viksit Bharat and Economic Infrastructure" },
    { id: "2", name: "United Opposition", party: "INC", vision: "Nyay and Social Welfare Schemes" },
    { id: "3", name: "Common Man's Party", party: "AAP", vision: "Education and Healthcare reforms" }
  ]);
  const [strategies, setStrategies] = useState<Record<string, any>>({
    "1": { budget: 15000, promises: ["Infrastructure", "Digital India"] },
    "2": { budget: 12000, promises: ["Farmer support", "Youth employment"] },
    "3": { budget: 8000, promises: ["Free Electricity", "Mohalla Clinics"] }
  });
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    const simsPath = "simulations";
    const q = query(collection(db, simsPath), where("userId", "==", user.uid), orderBy("timestamp", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, simsPath);
    });
    return () => unsubscribe();
  }, [user]);

  const addCandidate = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setCandidates([...candidates, { id: newId, name: "New Candidate", party: "Ind.", vision: "Vision statement" }]);
    setStrategies({ ...strategies, [newId]: { budget: 3000, promises: [] } });
  };

  const removeCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  const updateStrategy = (id: string, key: string, value: any) => {
    setStrategies({
      ...strategies,
      [id]: { ...strategies[id], [key]: value }
    });
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const result = await simulateElection({ candidates, strategies });
      setSimulationResult(result);
      
      if (user) {
        const simsPath = "simulations";
        try {
          await addDoc(collection(db, simsPath), {
            userId: user.uid,
            winner: result.winner.name,
            totalVotes: result.totalVotes,
            candidates: candidates.map(c => ({ name: c.name, party: c.party })),
            electionDetails,
            timestamp: serverTimestamp()
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, simsPath);
        }
      }

      toast.success("Simulation complete!");
    } catch (error) {
      toast.error("Failed to run simulation");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Election Simulator</h1>
          <p className="text-muted-foreground">Experiment with campaign strategies and voter dynamics.</p>
        </div>
        <Button size="lg" onClick={handleSimulate} disabled={isSimulating} className="gap-2">
          {isSimulating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <TrendingUp className="h-5 w-5" />
            </motion.div>
          ) : (
            <Play className="h-5 w-5 fill-current" />
          )}
          {isSimulating ? "Simulating..." : "Run Simulation"}
        </Button>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Target State / UT
              </Label>
              <Select 
                value={electionDetails.state}
                onValueChange={(val) => setElectionDetails({ ...electionDetails, state: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Phase / Date
              </Label>
              <Input 
                type="date"
                value={electionDetails.date}
                onChange={(e) => setElectionDetails({ ...electionDetails, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Election Structure
              </Label>
              <Select 
                value={electionDetails.type}
                onValueChange={(val) => setElectionDetails({ ...electionDetails, type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lok Sabha Election">Lok Sabha</SelectItem>
                  <SelectItem value="Rajya Sabha Election">Rajya Sabha</SelectItem>
                  <SelectItem value="State Assembly">State Assembly (Vidhan Sabha)</SelectItem>
                  <SelectItem value="Panchayat Election">Panchayat / Municipal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Candidates</CardTitle>
                <CardDescription>Define who is running and their core vision.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addCandidate} className="gap-1">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="p-4 rounded-xl border bg-card space-y-4 relative group">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Candidate Name</Label>
                      <Input 
                        value={candidate.name} 
                        onChange={(e) => setCandidates(candidates.map(c => c.id === candidate.id ? { ...c, name: e.target.value } : c))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Party Name</Label>
                      <Input 
                        value={candidate.party} 
                        onChange={(e) => setCandidates(candidates.map(c => c.id === candidate.id ? { ...c, party: e.target.value } : c))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Vision / Core Message</Label>
                    <Input 
                      value={candidate.vision} 
                      onChange={(e) => setCandidates(candidates.map(c => c.id === candidate.id ? { ...c, vision: e.target.value } : c))}
                    />
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <Badge variant="secondary" className="gap-1">
                       <DollarSign className="h-3 w-3" />
                       Budget: ${strategies[candidate.id]?.budget || 0}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => removeCandidate(candidate.id)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Strategies</CardTitle>
              <CardDescription>Adjust variables that impact voter behavior.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={candidates[0]?.id}>
                <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
                  {candidates.map(c => (
                    <TabsTrigger key={c.id} value={c.id} className="px-4 py-2">
                      {c.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {candidates.map(c => (
                  <TabsContent key={c.id} value={c.id} className="space-y-6 pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2">
                          Campaign Budget ($)
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </Label>
                        <span className="text-sm font-mono font-bold">${strategies[c.id]?.budget}</span>
                      </div>
                      <Slider
                        value={[strategies[c.id]?.budget || 0]}
                        max={20000}
                        step={500}
                        onValueChange={(val) => updateStrategy(c.id, "budget", val[0])}
                      />
                    </div>
                    <div className="space-y-4">
                       <Label className="flex items-center gap-2">
                         Key Promises
                         <Gavel className="h-3 w-3 text-muted-foreground" />
                       </Label>
                       <div className="flex flex-wrap gap-2">
                         {(strategies[c.id]?.promises || []).map((p: string, i: number) => (
                           <Badge key={i} variant="outline" className="pr-1 pl-3 py-1 gap-2">
                             {p}
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-4 w-4 p-0 hover:bg-transparent"
                               onClick={() => updateStrategy(c.id, "promises", (strategies[c.id]?.promises || []).filter((_: any, idx: number) => idx !== i))}
                             >
                                <X className="h-3 w-3" />
                             </Button>
                           </Badge>
                         ))}
                         <Button variant="outline" size="sm" className="h-7 border-dashed" onClick={() => {
                            const p = prompt("Enter a promise");
                            if (p) updateStrategy(c.id, "promises", [...(strategies[c.id]?.promises || []), p]);
                         }}>
                            <Plus className="h-3 w-3 mr-1" /> Add Promise
                         </Button>
                       </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Live Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {simulationResult ? (
                <div className="space-y-6">
                  <div className="text-center p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Projected Winner</p>
                    <h3 className="text-2xl font-bold">{simulationResult.winner.name}</h3>
                    <p className="text-sm text-muted-foreground">{simulationResult.winner.party}</p>
                    
                    <div className="mt-4 pt-4 border-t border-primary/10">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Seats Projection</p>
                      <p className="text-3xl font-black text-primary">
                        {Math.round((Number(simulationResult.results.find(r => r.id === simulationResult.winner.id)?.percentage) || 0) / 100 * 543)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">/ 543</span>
                      </p>
                    </div>
                  </div>
                  
                  <ElectionResultChart data={simulationResult.results as Candidate[]} />

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vote Share %</h4>
                    {simulationResult.results.map((r) => (
                      <div key={r.id} className="flex justify-between items-center text-sm p-3 rounded-lg bg-muted/30">
                        <span className="font-medium">{r.name}</span>
                        <span className="font-mono font-bold text-primary">{r.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-4 text-muted-foreground">
                  <PlayCircle className="h-12 w-12 opacity-20" />
                  <p>No active simulation. Configure your candidates and click "Run Simulation" to see projected outcomes.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Your Recent Simulations
            </CardTitle>
            <CardDescription>A record of your previous election scenarios and their outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((sim) => (
                <div key={sim.id} className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">{sim.electionDetails?.country || "Global"}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{sim.electionDetails?.type || "Simulation"}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {sim.timestamp?.toDate ? sim.timestamp.toDate().toLocaleDateString() : "Just now"}
                    </Badge>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">Projected Winner</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-bold">{sim.winner}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground flex justify-between pt-2 border-t mt-2">
                    <span>{sim.candidates?.length || 0} Candidates</span>
                    <span>{sim.totalVotes?.toLocaleString() || 0} Votes</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
