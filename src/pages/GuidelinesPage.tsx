import React from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Flag, 
  MapPin, 
  Phone, 
  Globe, 
  FileCheck, 
  ShieldAlert, 
  Info,
  ChevronRight,
  Download,
  ExternalLink,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const GUIDELINES = [
  {
    category: "General Conduct",
    rules: [
      "No caste or communal feelings shall be appealed to for securing votes.",
      "Religious places shall not be used for election propaganda.",
      "Political parties and candidates shall refrain from criticism of all aspects of private life.",
      "Bribing, intimidation of voters, and personation of voters are strictly prohibited."
    ]
  },
  {
    category: "Meetings & Rallies",
    rules: [
      "Prior permission must be obtained from local police for any meeting venue.",
      "The use of loudspeakers requires written permission from authorities.",
      "Organizers must ensure no disruption to normal traffic flow.",
      "The use of government machinery or personnel is strictly forbidden."
    ]
  },
  {
    category: "Polling Day",
    rules: [
      "No campaigning within 100 meters of polling stations.",
      "Voters must carry official IDEs (Voter ID/Aadhaar) to the booth.",
      "Silence must be maintained during polling hours.",
      "Mobile phones are not allowed inside the polling station."
    ]
  }
];

export default function GuidelinesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="rounded-full px-4 py-1 text-primary border-primary/20 bg-primary/5 uppercase font-black tracking-widest text-[10px]">
          Citizen Empowerment Hub
        </Badge>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
          Civic Rules & <span className="text-primary italic">Action Portal</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
          Simplified ECI guidelines and step-by-step instructions on how to ensure election fairness in your community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[32px] md:col-span-2 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Simplified ECI Code of Conduct
            </CardTitle>
            <CardDescription>Complex legal rules converted into easy-to-understand bullet points.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion className="w-full">
              {GUIDELINES.map((group, i) => (
                <AccordionItem key={group.category} value={`item-${i}`} className="border-white/10">
                  <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-primary transition-colors">
                    {group.category}
                  </AccordionTrigger>
                  <AccordionContent className="p-4 space-y-4">
                    {group.rules.map((rule, idx) => (
                      <div key={idx} className="flex gap-3 group">
                        <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <ChevronRight className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                          {rule}
                        </p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[32px] border-orange-500/20 bg-orange-500/5 overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-10">
              <ShieldAlert className="h-24 w-24" />
            </div>
            <CardHeader>
              <CardTitle className="text-orange-600 dark:text-orange-400">Report Violation</CardTitle>
              <CardDescription>Found an MCC breach? Here is how to alert the ECI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Download className="h-3 w-3" /> cVIGIL App
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The primary app for citizens to report violations. Record video/photo and upload instantly.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary text-[10px] uppercase font-black tracking-widest mt-2">
                  Visit NVSP Portal <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Phone className="h-3 w-3" /> Toll-Free 1950
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Direct helpline for any voter-related grievances or reporting suspicious activity.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Booth Level Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Find my BLO", icon: Users },
                { name: "Booth Location", icon: MapPin },
                { name: "Form 6 Status", icon: FileCheck }
              ].map((item, i) => (
                <Button key={i} variant="outline" className="w-full justify-start gap-3 rounded-xl border-white/10 bg-white/5">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust Message */}
      <div className="p-10 rounded-[40px] bg-gradient-to-br from-primary/10 via-background to-transparent border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <Info className="h-32 w-32" />
        </div>
        <div className="max-w-2xl space-y-4">
          <h3 className="text-3xl font-black tracking-tighter">Your Vote is Your <span className="text-primary italic">Intelligence.</span></h3>
          <p className="text-muted-foreground font-medium">
            DemocraAI India is committed to providing non-partisan information. We encourage you to always double-check facts via official ECI channels like <b>results.eci.gov.in</b> or the <b>Voter Helpline App</b>.
          </p>
          <div className="flex gap-4 pt-4">
             <Button className="rounded-2xl h-12 px-6 font-bold">Download Full Guide</Button>
             <Button variant="ghost" className="rounded-2xl h-12 px-6 font-bold">Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
