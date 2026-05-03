import React, { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { getTimeline } from "@/services/api";

export default function TimelinePage() {
  const [country, setCountry] = useState("India");
  const [type, setType] = useState("Lok Sabha");
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimeline = async () => {
    setIsLoading(true);
    try {
      const data = await getTimeline(country, type);
      setTimeline(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [country, type]);

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Election Timeline</h1>
          <p className="text-muted-foreground">Keep track of key dates and phases for upcoming elections.</p>
        </div>
        <div className="flex gap-2">
             <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                </SelectContent>
             </Select>
             <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Election Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lok Sabha">Lok Sabha (General)</SelectItem>
                  <SelectItem value="Rajya Sabha">Rajya Sabha</SelectItem>
                  <SelectItem value="State Assembly">State Assembly</SelectItem>
                  <SelectItem value="Municipal">Municipal / Panchayat</SelectItem>
                </SelectContent>
             </Select>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
        <div className="space-y-12">
          {timeline.map((item, index) => (
            <div key={index} className="relative md:pl-16 flex flex-col md:flex-row gap-6">
              <div className="hidden md:flex absolute left-4 top-1 h-5 w-5 rounded-full bg-background border-2 border-primary items-center justify-center z-10">
                {index === 0 ? <CheckCircle2 className="h-3 w-3 text-primary" /> : <Circle className="h-2 w-2 text-primary" />}
              </div>
              
              <div className="md:w-32 pt-1">
                <span className="text-sm font-bold text-primary uppercase tracking-tighter block">{item.date}</span>
              </div>

              <Card className="flex-1 overflow-hidden group hover:border-primary transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{item.phase}</CardTitle>
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      {index === 0 ? "Current Phase" : "Upcoming"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Official procedures for {item.phase.toLowerCase()} in {country}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This phase involves rigorous verification of candidates, public manifestos, and preparation of polling infrastructure across all regions.
                  </p>
                  <Button variant="link" className="px-0 mt-4 h-auto text-primary font-semibold gap-1">
                    Learn Requirements <ArrowRight className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
