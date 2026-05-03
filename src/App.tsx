/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import ChatPage from "@/pages/ChatPage";
import SimulatorPage from "@/pages/SimulatorPage";
import NewsPage from "@/pages/NewsPage";
import TimelinePage from "@/pages/TimelinePage";
import VoterPage from "@/pages/VoterPage";
import QuizPage from "@/pages/QuizPage";
import ProfilePage from "@/pages/ProfilePage";
import FairnessDashboard from "@/pages/FairnessDashboard";
import LiveNewsPage from "@/pages/LiveNewsPage";
import GuidelinesPage from "@/pages/GuidelinesPage";

import { AuthProvider } from "@/lib/auth";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TooltipProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fairness" element={<FairnessDashboard />} />
              <Route path="/live-news" element={<LiveNewsPage />} />
              <Route path="/guidelines" element={<GuidelinesPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/detector" element={<NewsPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/voter-assistant" element={<VoterPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" richColors />
        </TooltipProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
