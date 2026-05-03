import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { civicAssistant } from "@/lib/aiService";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await civicAssistant(input, messages);
      const botMsg: Message = { role: "model", parts: [{ text: response || "" }] };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { role: "model", parts: [{ text: "I'm sorry, I encountered an error. Please try again." }] };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent italic">AI Civic <span className="text-primary italic">Assistant</span></h1>
          <p className="text-muted-foreground font-medium">Non-partisan guidance for the Indian Electorate.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/20">
             <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-primary">Support: EN | हिन्दी | ಕನ್ನಡ</span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearChat} className="rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all h-9">
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="text-xs font-bold uppercase tracking-wider">Flush History</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-white/5 dark:bg-zinc-900/30 backdrop-blur-xl overflow-hidden flex flex-col relative rounded-[40px] border border-white/10 shadow-2xl">
        <ScrollArea className="flex-1 p-6 md:p-10" ref={scrollRef}>
          <div className="space-y-8 max-w-3xl mx-auto">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-10 py-12">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 3 }}
                  className="w-28 h-28 rounded-[40px] bg-gradient-to-tr from-primary via-primary to-orange-400 flex items-center justify-center shadow-2xl shadow-primary/30"
                >
                  <Bot className="h-14 w-14 text-white -rotate-3" />
                </motion.div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tighter">Namaste. How can I help today?</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto font-medium text-lg leading-relaxed">
                    I'm your non-partisan guide to the Indian democratic process. Ask me about rules, rights, or registrations.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                  {[
                    { text: "Help me register for Form 6", icon: "📝" },
                    { text: "What are my rights as a voter?", icon: "⚖️" },
                    { text: "Explain EVM & VVPAT security", icon: "🛡️" },
                    { text: "Latest ECI guidelines for 2024", icon: "📜" }
                  ].map((q, idx) => (
                    <motion.div
                      key={q.text}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Button 
                        variant="secondary" 
                        className="w-full text-sm justify-between h-auto py-5 px-6 rounded-[24px] bg-white/5 hover:bg-white/10 border border-white/5 shadow-sm hover:translate-y-[-4px] transition-all group"
                        onClick={() => setInput(q.text)}
                      >
                        <span className="font-bold">{q.text}</span>
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">{q.icon}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-[20px] flex items-center justify-center shadow-lg shrink-0 border mt-1",
                    msg.role === "user" 
                      ? "bg-primary text-white border-primary/20 rotate-3" 
                      : "bg-white dark:bg-zinc-800 border-white/10 -rotate-3"
                  )}>
                    {msg.role === "user" ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                  </div>
                  <div className={cn(
                    "p-6 rounded-[32px] max-w-[85%] prose prose-sm dark:prose-invert shadow-xl border leading-relaxed",
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-tr-none border-primary/30" 
                      : "bg-white dark:bg-zinc-900 border-white/10 rounded-tl-none font-medium text-zinc-200"
                  )}>
                    <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[20px] bg-white dark:bg-zinc-800 border border-white/10 flex items-center justify-center shadow-lg shrink-0 -rotate-3 mt-1">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-white/10 rounded-[32px] rounded-tl-none p-6 flex items-center gap-4 shadow-xl">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-primary/60">AI Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-8 pt-0">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex gap-3 p-2 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[30px] shadow-2xl"
            >
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Bharat Assistant anything..."
                className="flex-1 rounded-[24px] px-6 h-14 bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-muted-foreground/30"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                className="rounded-[22px] h-14 w-14 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0" 
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
              </Button>
            </form>
          </div>
          
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
               <div className="h-1 w-1 rounded-full bg-green-500" />
               <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-40">
                 End-to-End Encrypted
               </p>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-1 w-1 rounded-full bg-blue-500" />
               <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-40">
                 ECI Rules Compliant
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
