import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  MessageSquare, 
  PlayCircle, 
  ShieldAlert, 
  Clock, 
  UserCircle, 
  Home, 
  Menu, 
  X,
  Vote,
  Trophy,
  ShieldCheck,
  Zap,
  BookOpen,
  BrainCircuit
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar.tsx";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Live Intelligence", href: "/live-news", icon: Zap },
  { name: "Fairness Monitor", href: "/fairness", icon: ShieldCheck },
  { name: "Civic Guidelines", href: "/guidelines", icon: BookOpen },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Civic Assistant", href: "/chat", icon: MessageSquare },
  { name: "Election Simulator", href: "/simulator", icon: PlayCircle },
  { name: "Fake News Detector", href: "/detector", icon: ShieldAlert },
  { name: "Stability Audit", href: "/audit", icon: BrainCircuit },
  { name: "Election Timeline", href: "/timeline", icon: Clock },
  { name: "Voter Assistant", href: "/voter-assistant", icon: Vote },
  { name: "Civic Quiz", href: "/quiz", icon: Trophy },
  { name: "Me", href: "/profile", icon: UserCircle },
];

import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function Sidebar({ className }: { className?: string }) {
  const location = useLocation();
  const { user, login, logout } = useAuth();
  const [civicScore, setCivicScore] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setCivicScore(null);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setCivicScore(doc.data().civicScore || 0);
      } else {
        setCivicScore(0);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className={cn("p-4 h-full flex items-center justify-center", className)}>
      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-3 flex flex-col items-center gap-4 h-fit shadow-2xl">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-3 py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <div key={item.href} className="relative group">
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-dot"
                      className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" 
                    />
                  )}
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-[14px] transition-all duration-300 relative overflow-hidden",
                      isActive 
                        ? "bg-white/20 shadow-lg scale-110" 
                        : "bg-white/5 hover:bg-white/10 hover:scale-105"
                    )}
                    title={item.name}
                  >
                    <item.icon className={cn(
                      "h-6 w-6 transition-colors",
                      isActive ? "text-white" : "text-white/60 group-hover:text-white"
                    )} />
                  </Link>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="w-8 h-[1px] bg-white/10 my-1" />

        {user ? (
          <div className="flex flex-col gap-3 items-center">
            <div className="group relative">
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/90 border border-white/10 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Civic Score</p>
                <p className="text-xl font-bold text-white leading-none">{civicScore ?? "---"}</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.min((civicScore || 0) / 10, 100)}%` }} />
                </div>
              </div>
              <div className="h-12 w-12 rounded-[14px] bg-primary/20 border border-primary/30 flex items-center justify-center cursor-help">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
            </div>

            <Link to="/profile" className="relative group">
              <Avatar className="h-12 w-12 rounded-[14px] border border-white/10 hover:scale-105 transition-transform">
                <AvatarImage src={user.photoURL || ""} className="object-cover" />
                <AvatarFallback className="bg-white/10 text-white rounded-[14px]">
                  {user.displayName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-[12px] text-white/40 hover:text-red-400 hover:bg-red-500/10" 
              onClick={logout}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-[14px] bg-white/5 text-white/60 hover:bg-white/10 hover:text-white" 
            onClick={login}
          >
            <UserCircle className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar className="hidden md:flex w-64" />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Vote className="h-6 w-6" />
            DemocraAI India
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
             <Menu className="h-6 w-6" />
          </Button>
        </header>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="p-0 w-64">
             <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
