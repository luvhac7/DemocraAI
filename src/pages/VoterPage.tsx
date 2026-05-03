import React, { useState } from "react";
import { Vote, FileText, MapPin, UserCheck, ShieldCheck, ChevronRight, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { INDIAN_STATES } from "@/constants_india";
import { getVoterInfo } from "@/services/api";

export default function VoterPage() {
  const [formData, setFormData] = useState({ country: "India", age: "18", location: "Uttar Pradesh" });
  const [voterInfo, setVoterInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await getVoterInfo({
        country: formData.country,
        age: parseInt(formData.age),
        location: formData.location
      });
      setVoterInfo(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">Personalized Voter Assistant</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Get a customized checklist of steps and documents required to cast your vote.
        </p>
      </div>

      {!voterInfo ? (
        <Card className="max-w-md mx-auto shadow-xl border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Tell us about yourself</CardTitle>
            <CardDescription>We'll use this to find regional voting requirements.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value="India" disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Current Age</Label>
                  <Input id="age" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">State / UT</Label>
                  <Select 
                    value={formData.location}
                    onValueChange={(val) => setFormData({ ...formData, location: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3 text-xs">
                <Info className="h-4 w-4 text-primary shrink-0" />
                <p>Note: First-time voters must register using **Form 6** on the NVSP portal or Voter Helpline App.</p>
              </div>
              <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? "Analyzing ECI Guidelines..." : "Generate Indian Voter Guide"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-primary" />
              Your Voting Steps
            </h2>
            <div className="space-y-4">
              {voterInfo.steps.map((step: string, i: number) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                     <p className="font-semibold">{step}</p>
                     <Button variant="link" size="sm" className="h-auto p-0 mt-1 opacity-70">View Details</Button>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground self-center" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Required Documents
            </h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                {voterInfo.documents.map((doc: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                     <CheckCircle2 className="h-5 w-5 text-green-500" />
                     <span className="font-medium">{doc}</span>
                  </div>
                ))}
                <div className="pt-4 p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-2">
                   <ShieldCheck className="h-10 w-10 text-muted-foreground opacity-50" />
                   <p className="text-sm font-medium">Verify Identity</p>
                   <p className="text-xs text-muted-foreground italic">Always bring original copies. Digital IDs may not be accepted in some regions.</p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setVoterInfo(null)}>Change Information</Button>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border-primary/20 bg-primary/5 overflow-hidden">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm flex items-center gap-2 font-black uppercase tracking-widest">
                   <MapPin className="h-4 w-4 text-primary" />
                   Polling Booth Finder
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground italic">Target: {formData.location || "Default State"}</p>
                  
                  <div className="relative h-40 rounded-2xl bg-muted/20 border border-white/5 overflow-hidden flex items-center justify-center group">
                    <div className="absolute inset-0 grayscale opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/77,13,5,0/800x400?access_token=pk.ey')] bg-cover bg-center" />
                    <div className="relative z-10 text-center space-y-1 p-4">
                       <MapPin className="h-6 w-6 text-primary mx-auto animate-bounce mb-1" />
                       <p className="text-[10px] font-black uppercase tracking-tighter">Interactive Map Simulator</p>
                       <p className="text-[8px] text-muted-foreground uppercase max-w-[150px] mx-auto">Requires Google Maps API Key to activate live booth routing</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/10">
                       <div className="flex items-center gap-2 overflow-hidden">
                          <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                          <span className="text-[10px] font-bold truncate">KV No. 1, Sector 24, Noida</span>
                       </div>
                       <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest h-5 px-1.5 border-primary/20 text-primary">0.8 KM</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest h-8">
                       View All Centers
                    </Button>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
