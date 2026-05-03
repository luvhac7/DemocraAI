import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, HelpCircle, Trophy, ArrowRight, RefreshCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, getDoc, setDoc, increment, serverTimestamp, collection, addDoc } from "firebase/firestore";

const quizQuestions = [
  {
    question: "What is the primary purpose of a primary election?",
    options: [
      "To elect the President directly",
      "To select a party's candidate for the general election",
      "To vote on local tax laws",
      "To recount votes from the previous year"
    ],
    correctIndex: 1,
    explanation: "Primary elections are held by political parties to select the candidates who will represent the party in the general election."
  },
  {
    question: "How often are elections for the U.S. House of Representatives held?",
    options: ["Every 2 years", "Every 4 years", "Every 6 years", "Every year"],
    correctIndex: 0,
    explanation: "Members of the U.S. House of Representatives serve two-year terms and are up for re-election every even-numbered year."
  },
  {
    question: "What is 'Gerrymandering'?",
    options: [
      "A type of voting machine",
      "Manipulating the boundaries of an electoral constituency to favor one party",
      "The process of counting mail-in ballots",
      "The speech given by a candidate after winning"
    ],
    correctIndex: 1,
    explanation: "Gerrymandering is a practice intended to establish a political advantage for a particular party or group by manipulating district boundaries."
  }
];

export default function QuizPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === quizQuestions[currentStep].correctIndex) {
      setScore(prev => prev + 100);
      toast.success("Correct! +100 Civic Score");
    } else {
      toast.error("Incorrect answer.");
    }
  };

  const saveScore = async (finalScore: number) => {
    if (!user || finalScore === 0) return;
    setIsSaving(true);
    const userRef = doc(db, "users", user.uid);
    const logPath = "score_logs";
    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          civicScore: finalScore,
          createdAt: serverTimestamp()
        });
      } else {
        await setDoc(userRef, {
          civicScore: increment(finalScore),
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      // Log the score change
      await addDoc(collection(db, logPath), {
        userId: user.uid,
        change: finalScore,
        reason: "Quiz Completion",
        timestamp: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      saveScore(score);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Civic Quiz Challenge</h1>
        <p className="text-muted-foreground">Test your knowledge and boost your Civic Score!</p>
      </div>

      {!isFinished ? (
        <Card className="shadow-lg border-2">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
               <Badge variant="outline">Question {currentStep + 1} of {quizQuestions.length}</Badge>
               <div className="flex items-center gap-2">
                 <Trophy className="h-4 w-4 text-yellow-500" />
                 <span className="font-bold text-lg">{score}</span>
               </div>
            </div>
            <Progress value={((currentStep) / quizQuestions.length) * 100} className="h-2" />
            <CardTitle className="text-2xl leading-tight">{quizQuestions[currentStep].question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              {quizQuestions[currentStep].options.map((option, i) => (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    selectedOption === i 
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                      : "hover:border-primary/50"
                  } ${
                    isAnswered && i === quizQuestions[currentStep].correctIndex 
                      ? "border-green-500 bg-green-500/10" 
                      : isAnswered && selectedOption === i && i !== quizQuestions[currentStep].correctIndex
                      ? "border-red-500 bg-red-500/10"
                      : ""
                  }`}
                >
                  <span className="font-medium">{option}</span>
                  {isAnswered && i === quizQuestions[currentStep].correctIndex && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {isAnswered && selectedOption === i && i !== quizQuestions[currentStep].correctIndex && <XCircle className="h-5 w-5 text-red-500" />}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 rounded-xl bg-muted/50 border space-y-2"
                >
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Explanation
                  </h4>
                  <p className="text-sm text-muted-foreground italic">
                    {quizQuestions[currentStep].explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-2">
               {!isAnswered ? (
                 <Button onClick={handleConfirm} disabled={selectedOption === null} size="lg" className="w-full">
                    Confirm Answer
                 </Button>
               ) : (
                 <Button onClick={handleNext} size="lg" className="w-full gap-2">
                    {currentStep === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                    <ArrowRight className="h-4 w-4" />
                 </Button>
               )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="text-center shadow-xl border-4 border-primary/20">
            <CardHeader className="pt-10">
               <div className="w-24 h-24 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/20">
                 <Trophy className="h-12 w-12 text-yellow-500" />
               </div>
               <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
               <CardDescription className="text-lg uppercase tracking-widest font-bold text-primary">
                 Civic Champion Level 1
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pb-10">
               <div className="p-6 rounded-3xl bg-secondary/50 border">
                  <p className="text-sm text-muted-foreground mb-1 uppercase font-semibold">Total Points Earned</p>
                  <span className="text-5xl font-black text-primary">{score}</span>
               </div>
               <div className="flex gap-3">
                  <Button variant="outline" onClick={resetQuiz} className="flex-1 gap-2">
                    <RefreshCcw className="h-4 w-4" /> Try Again
                  </Button>
                  <Link to="/dashboard" className={cn(buttonVariants(), "flex-1")}>
                    Go to Dashboard
                  </Link>
               </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
