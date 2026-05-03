import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Newspaper, 
  Search, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Globe,
  Share2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { seedFairnessData } from "@/lib/seedData";

export default function LiveNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    seedFairnessData();
    const q = query(
      collection(db, "live_news"), 
      orderBy("timestamp", "desc"), 
      limit(30)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(docs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredNews = news.filter(n => 
    n.headline?.toLowerCase().includes(search.toLowerCase()) ||
    n.source?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Live Election <span className="text-primary">Intelligence</span></h1>
          <p className="text-muted-foreground font-medium">Verified news and official bulletins from ECI and trusted agencies.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search news..." 
            className="pl-10 rounded-2xl bg-white/5 border-white/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <RefreshCw className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">Fetching live intelligence streams...</p>
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredNews.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="hover:border-primary/30 transition-all cursor-pointer group rounded-[24px]">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                          <Newspaper className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">{item.source}</Badge>
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-black tracking-widest">Live</Badge>
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleTimeString() : "Just now"}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-snug">
                            {item.headline}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {item.summary || "Summary loading from AI analysis engine..."}
                          </p>
                          <div className="flex items-center gap-4 pt-2">
                            <Button variant="link" className="p-0 h-auto text-xs font-black uppercase tracking-widest text-primary gap-1">
                              Read Full Report <ExternalLink className="h-3 w-3" />
                            </Button>
                            <Button variant="link" className="p-0 h-auto text-xs font-black uppercase tracking-widest text-muted-foreground gap-1">
                              <Share2 className="h-3 w-3" /> Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center p-20">
              <Globe className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">No matching news found.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                News Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { tag: "#LokSabha2024", count: "14.2k" },
                { tag: "#EVMFacts", count: "8.5k" },
                { tag: "#VoterAwareness", count: "5.1k" },
                { tag: "#ECICompliance", count: "3.2k" }
              ].map((trend, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-sm font-bold group-hover:text-primary transition-colors">{trend.tag}</span>
                  <span className="text-xs text-muted-foreground">{trend.count} posts</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[32px]">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Official Bulletins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="border-l-2 border-primary pl-4 py-1">
                 <p className="text-xs font-bold leading-tight">Phase 3 Voting guidelines updated for high-temp zones.</p>
                 <p className="text-[10px] text-muted-foreground mt-1">Source: ECI Official</p>
               </div>
               <div className="border-l-2 border-primary pl-4 py-1">
                 <p className="text-xs font-bold leading-tight">Voter Helpline App reaches 50M downloads.</p>
                 <p className="text-[10px] text-muted-foreground mt-1">Source: PIB India</p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
