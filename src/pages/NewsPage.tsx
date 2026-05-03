import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, ShieldCheck, ShieldQuestion, Loader2, History, Trash2, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Label } from "@/components/ui/label.tsx";
import { detectFakeNews } from "@/lib/aiService";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { toast } from "sonner";

export default function NewsPage() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const handleDetect = async () => {
    if (!text.trim() || isLoading) return;
    
    if (!user) {
      toast.error("Please sign in to verify news");
      return;
    }

    setIsLoading(true);
    try {
      const data = await detectFakeNews(text);
      setResult(data);
      
      const path = "news_verifications";
      try {
        await addDoc(collection(db, path), {
          text: text.length > 200 ? text.substring(0, 200) + "..." : text,
          label: data.label,
          confidence: data.confidence,
          reasoning: data.reasoning,
          userId: user.uid,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
      }

      toast.success("Analysis complete");
      fetchHistory();
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze news");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    const path = "news_verifications";
    try {
      const q = query(collection(db, path), orderBy("timestamp", "desc"), limit(5));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setHistory(docs);
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [user]);

  const getLabelColor = (label: string) => {
    switch(label) {
      case "Real": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Fake": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "Misleading": return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
      default: return "";
    }
  };

  const getLabelIcon = (label: string) => {
    switch(label) {
      case "Real": return <ShieldCheck className="h-10 w-10 text-green-500" />;
      case "Fake": return <ShieldAlert className="h-10 w-10 text-red-500" />;
      case "Misleading": return <ShieldQuestion className="h-10 w-10 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-black tracking-tight tracking-tighter">IT Cell Fact-Checker</h1>
        <p className="text-muted-foreground font-medium text-lg">Combat electoral misinformation and deepfakes across Indian social media.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verify News</CardTitle>
              <CardDescription>Paste the news snippet or headline below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Paste news from WhatsApp, Twitter (X), or News Sites (Hindi, English, Kannada etc.)..."
                className="min-h-[200px] text-lg resize-none focus-visible:ring-primary rounded-[24px] p-6 bg-muted/20"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground italic">AI results are probabilistic. Always use multiple sources.</p>
                <Button onClick={handleDetect} disabled={isLoading || !text.trim()} className="gap-2 px-8">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                  {isLoading ? "Verifying..." : "Verify Now"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className={`border-2 ${getLabelColor(result.label).split(' ')[2]}`}>
                  <CardHeader className="flex flex-row items-center gap-6 pb-2">
                    {getLabelIcon(result.label)}
                    <div>
                      <div className="flex items-center gap-2">
                         <CardTitle className="text-2xl">{result.label}</CardTitle>
                         <Badge className={getLabelColor(result.label)}>
                           {(result.confidence * 100).toFixed(0)}% Confidence
                         </Badge>
                      </div>
                      <CardDescription>AI-driven authenticity analysis</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                       <Label>Verification Confidence</Label>
                       <Progress value={result.confidence * 100} className={`h-2 ${result.label === 'Fake' ? '[&>div]:bg-red-500' : result.label === 'Real' ? '[&>div]:bg-green-500' : '[&>div]:bg-yellow-500'}`} />
                    </div>
                    
                    <div className="p-4 rounded-xl bg-muted/50 border border-muted space-y-3">
                       <h4 className="font-semibold flex items-center gap-2">
                         <CheckCircle2 className="h-4 w-4 text-primary" />
                         AI Reasoning
                       </h4>
                       <p className="text-sm leading-relaxed">{result.reasoning}</p>
                    </div>

                    {result.keyPoints && (
                       <div className="space-y-3">
                         <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key Points Fact-Checked</h4>
                         <div className="grid gap-2">
                            {result.keyPoints.map((point: string, i: number) => (
                              <div key={i} className="flex gap-2 items-start text-sm p-2 rounded bg-background border">
                                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </div>
                            ))}
                         </div>
                       </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent History</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {history.length > 0 ? history.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border bg-background space-y-2 hover:bg-muted/30 transition-colors cursor-pointer capitalize">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className={getLabelColor(item.label)}>
                          {item.label}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{(item.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-xs line-clamp-2 italic">"{item.text}"</p>
                    </div>
                  )) : (
                    <div className="text-center py-10 text-muted-foreground italic text-xs">
                       No recent activity.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Added Textarea missing import fix if needed, but shadcn add should handle it.
// Actually I didn't add textarea. Let's add it.
