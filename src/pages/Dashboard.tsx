import React, { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ReTooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Vote, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query, limit, where, orderBy } from "firebase/firestore";
import { useAuth } from "@/lib/auth";

const sentimentData = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 52 },
  { name: 'Wed', value: 48 },
  { name: 'Thu', value: 61 },
  { name: 'Fri', value: 55 },
  { name: 'Sat', value: 67 },
  { name: 'Sun', value: 72 },
];

const voterTurnout = [
  { year: '2012', value: 54.9 },
  { year: '2016', value: 55.7 },
  { year: '2020', value: 66.8 },
  { year: '2024 (Proj)', value: 68.2 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [newsStats, setNewsStats] = useState({ total: 0, real: 0, fake: 0, misleading: 0 });
  const [simulationCount, setSimulationCount] = useState(0);
  const [avgCivicScore, setAvgCivicScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to news verifications
    const newsPath = "news_verifications";
    const unsubscribeNews = onSnapshot(collection(db, newsPath), (snapshot) => {
      const stats = { total: 0, real: 0, fake: 0, misleading: 0 };
      snapshot.forEach(doc => {
        const data = doc.data();
        stats.total++;
        if (data.label === "Real") stats.real++;
        else if (data.label === "Fake") stats.fake++;
        else if (data.label === "Misleading") stats.misleading++;
      });
      setNewsStats(stats);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, newsPath);
    });

    // Listen to simulations
    const simsPath = "simulations";
    const unsubscribeSims = onSnapshot(collection(db, simsPath), (snapshot) => {
      setSimulationCount(snapshot.size);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, simsPath);
    });

    // Listen to user profiles for Avg Civic Score
    const usersPath = "users";
    const unsubscribeUsers = onSnapshot(collection(db, usersPath), (snapshot) => {
      let totalScore = 0;
      let count = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (typeof data.civicScore === 'number') {
          totalScore += data.civicScore;
          count++;
        }
      });
      setAvgCivicScore(count > 0 ? Math.round(totalScore / count) : 0);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, usersPath);
    });

    // Listen to user's score history
    let unsubscribeScoreHistory = () => {};
    if (user) {
      const logsPath = "score_logs";
      const q = query(collection(db, logsPath), where("userId", "==", user.uid), orderBy("timestamp", "desc"), limit(10));
      unsubscribeScoreHistory = onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setScoreHistory(logs);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, logsPath);
      });
    }

    return () => {
      unsubscribeNews();
      unsubscribeSims();
      unsubscribeUsers();
      unsubscribeScoreHistory();
    };
  }, [user]);

  const newsDistribution = [
    { name: 'Real', value: newsStats.total > 0 ? Math.round((newsStats.real / newsStats.total) * 100) : 0, color: '#10b981' },
    { name: 'Fake', value: newsStats.total > 0 ? Math.round((newsStats.fake / newsStats.total) * 100) : 0, color: '#ef4444' },
    { name: 'Misleading', value: newsStats.total > 0 ? Math.round((newsStats.misleading / newsStats.total) * 100) : 0, color: '#f59e0b' },
  ];

  const summaryStats = [
    { title: "Total Verified News", value: newsStats.total.toLocaleString(), icon: ShieldAlert, trend: "+12%", trendUp: true },
    { title: "Simulator Runs", value: simulationCount.toLocaleString(), icon: Vote, trend: "+24%", trendUp: true },
    { title: "Voter Engagement", value: "82%", icon: Users, trend: "+5%", trendUp: true },
    { title: "Avg Civic Score", value: avgCivicScore.toString(), icon: CheckCircle2, trend: "+4%", trendUp: true },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights into election trends and public sentiment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs flex items-center gap-1 mt-1 ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
             <div className="flex justify-between items-start">
               <div>
                 <CardTitle>Public Sentiment Index</CardTitle>
                 <CardDescription>Real-time aggregate sentiment analysis based on news trends.</CardDescription>
               </div>
               <Badge variant="outline" className="text-green-500 bg-green-500/10">Positive Momentum</Badge>
             </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ReTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>News Veracity Distribution</CardTitle>
            <CardDescription>Breakdown of AI-determined news labels.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col justify-center">
             <ResponsiveContainer width="100%" height={200}>
               <PieChart>
                 <Pie
                    data={newsDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                 >
                    {newsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Pie>
                 <ReTooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="mt-4 grid grid-cols-3 gap-2 px-4">
                {newsDistribution.map((entry) => (
                  <div key={entry.name} className="text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{entry.name}</p>
                    <p className="text-lg font-bold" style={{ color: entry.color }}>{entry.value}%</p>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card>
           <CardHeader>
             <CardTitle>Voter Turnout Trends</CardTitle>
             <CardDescription>Historical comparison of voter participation rates.</CardDescription>
           </CardHeader>
           <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={voterTurnout}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <ReTooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
              <CardTitle>Recent Risk Analysis</CardTitle>
              <CardDescription>Hotspots for misinformation and civic disruption.</CardDescription>
           </CardHeader>
           <CardContent>
              <div className="space-y-4">
                 {[
                   { label: "Deepfake Surge", status: "Critical", icon: AlertTriangle, color: "text-red-500" },
                   { label: "Voter Suppression Ads", status: "High", icon: ShieldAlert, color: "text-orange-500" },
                   { label: "Mail-in Ballot Scams", status: "Moderate", icon: TrendingUp, color: "text-yellow-500" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-background ${item.color}`}>
                           <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                           <p className="text-sm font-semibold">{item.label}</p>
                           <p className="text-xs text-muted-foreground">Global monitoring cluster</p>
                        </div>
                     </div>
                     <Badge variant={item.status === 'Critical' ? 'destructive' : 'outline'}>{item.status}</Badge>
                   </div>
                 ))}
              </div>
           </CardContent>
         </Card>
      </div>

      {user && scoreHistory.length > 0 && (
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-primary" />
               Your Civic Score History
             </CardTitle>
             <CardDescription>A chronological record of your contributions and earned civic points.</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               {scoreHistory.map((log) => (
                 <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/10 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                       <Badge variant="outline" className="text-primary border-primary/20">+{log.change}</Badge>
                     </div>
                     <div>
                       <p className="text-sm font-bold">{log.reason}</p>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                         {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleDateString() : "Just now"}
                       </p>
                     </div>
                   </div>
                   <div className="text-right">
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Verified</Badge>
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
