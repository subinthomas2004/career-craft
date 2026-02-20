import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MockInterview from "./pages/MockInterview";
import MockInterviewLanding from "./pages/MockInterviewLanding";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Quiz from "./pages/Quiz";
import IntroPrep from "./pages/IntroPrep";
import TypingTest from "./pages/TypingTest";
import CodingPractice from "./pages/CodingPractice";
import CodingPracticeHome from "./pages/CodingPracticeHome";
import CodingProblemsListPage from "./pages/CodingProblemsListPage";
import SoftSkills from "./pages/SoftSkills";
import SkillGap from "./pages/SkillGap";
import DomainPrep from "./pages/DomainPrep";
import Notifications from "./pages/Notifications";
import Forum from "./pages/Forum";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import DashboardLayout from "./components/layout/DashboardLayout";
import ChatBot from "./components/chatbot/ChatBot";
import NotFound from "./pages/NotFound";

import GroupDiscussion from "./pages/GroupDiscussion";
import GDLanding from "./pages/GDLanding";
import GDTopicSelection from "./pages/GDTopicSelection";
import GDReport from './pages/GDReport';
import GD3DRoom from "./pages/experimental/GD3DRoom";
import DebateLanding from "./pages/DebateLanding";
import DebateTopicSelection from "./pages/DebateTopicSelection";
import DebateRoom from "./pages/DebateRoom";
import DebateReport from "./pages/DebateReport";
import AptitudeQuiz from "./pages/AptitudeQuiz";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TestGroqConnection from "./pages/TestGroqConnection";
import CommunicationCoach from "./pages/CommunicationCoach";

const queryClient = new QueryClient();
const App = () => <QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <Toaster />
    <Sonner position="top-center" />
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/test-groq" element={<TestGroqConnection />} />
        <Route path="/group-discussion/room" element={<GroupDiscussion />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="interview" element={<MockInterviewLanding />} />
          <Route path="interview/session" element={<MockInterview />} />
          <Route path="interview/hr-technical" element={<MockInterview type="hr-technical" />} />
          <Route path="intro-prep" element={<IntroPrep />} /> {/* Added route */}
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="typing" element={<TypingTest />} />
          <Route path="coding" element={<CodingPracticeHome />} />
          <Route path="coding/:language" element={<CodingProblemsListPage />} />
          <Route path="coding/problem/:id" element={<CodingPractice />} />
          <Route path="soft-skills" element={<SoftSkills />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="domain" element={<DomainPrep />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="forum" element={<Forum />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />


          <Route path="group-discussion" element={<GDLanding />} />
          <Route path="group-discussion/topic" element={<GDTopicSelection />} />
          <Route path="group-discussion" element={<GDLanding />} />
          <Route path="group-discussion/topic" element={<GDTopicSelection />} />
          <Route path="group-discussion/report" element={<GDReport />} />
          <Route path="debate" element={<DebateLanding />} />
          <Route path="debate/topic" element={<DebateTopicSelection />} />
          <Route path="debate/room" element={<DebateRoom />} />
          <Route path="debate/report" element={<DebateReport />} />
          <Route path="experimental/gd-3d" element={<GD3DRoom />} />
          <Route path="aptitude-quiz" element={<AptitudeQuiz />} />
          <Route path="communication-coach" element={<CommunicationCoach />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>;
export default App;