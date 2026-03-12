import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  FileText,
  Brain,
  Keyboard,
  Code,
  Target,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  MessageSquare,
  Users,
  BarChart3,
  Swords,
  Mic,
  User,
  Building2,
  Briefcase
} from "lucide-react";
import { useState, useEffect } from "react";

const modules = [
  { icon: Video, label: "Mock Interview", path: "/dashboard/interview", color: "from-blue-500 to-blue-600", description: "Practice AI interviews" },
  { icon: FileText, label: "Resume Builder", path: "/dashboard/resume", color: "from-green-500 to-green-600", description: "Optimize your resume" },
  { icon: Brain, label: " Technical Quizzes", path: "/dashboard/quiz", color: "from-purple-500 to-purple-600", description: "Test your Technical knowledge" },
  { icon: Code, label: "Coding Practice", path: "/dashboard/coding", color: "from-orange-500 to-orange-600", description: "Solve coding problems" },
  { icon: Keyboard, label: "Typing Test", path: "/dashboard/typing", color: "from-pink-500 to-pink-600", description: "Improve typing speed" },
  { icon: Target, label: "Skill Gap", path: "/dashboard/skill-gap", color: "from-cyan-500 to-cyan-600", description: "Identify skill gaps" },
  { icon: BookOpen, label: "Domain Prep", path: "/dashboard/domain", color: "from-indigo-500 to-indigo-600", description: "Domain knowledge" },
  { icon: Users, label: "Group Discussion", path: "/dashboard/group-discussion", color: "from-teal-500 to-teal-600", description: "Practice AI group discussions" },
  { icon: Swords, label: "Debate Simulator", path: "/dashboard/debate", color: "from-red-500 to-red-600", description: "Challenge AI in debates" },
  { icon: Mic, label: "Comm. Coach", path: "/dashboard/communication-coach", color: "from-indigo-500 to-purple-500", description: "Improve fluency & grammar" },
  { icon: User, label: "Intro Prep", path: "/dashboard/intro-prep", color: "from-pink-500 to-rose-500", description: "Perfect your self-intro" },
  { icon: Building2, label: "Company Prep", path: "/dashboard/company-prep", color: "from-teal-500 to-emerald-500", description: "Company Preparation" },
  { icon: Briefcase, label: "Job Portal", path: "/dashboard/jobs", color: "from-blue-500 to-cyan-500", description: "Find Jobs" },
  { icon: Brain, label: "Aptitude Quiz", path: "/dashboard/aptitude-quiz", color: "from-purple-500 to-purple-600", description: "Test your aptitude skills" }
];


const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    interviewsAttended: 0,
    quizzesTaken: 0,
    averageScore: 0,
    resumeScore: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Fetch fresh stats from backend
          const config = {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
            },
          };

          // You might need to import axios if not already imported
          // Assuming axios is available or using fetch
          const { data } = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
            }
          });

          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Here's an overview of your placement preparation progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 stagger-children">
        <StatCard
          icon={Video}
          title="Interviews"
          value={stats.interviewsAttended}
          change={stats.interviewsAttended > 0 ? "Keep practicing!" : "Start your first!"}
          changeType="neutral"
        />
        <StatCard
          icon={Brain}
          title="Quizzes"
          value={stats.quizzesTaken}
          change={stats.quizzesTaken > 0 ? "Good job!" : "Try a quiz"}
          changeType="positive"
        />
        <StatCard
          icon={Flame}
          title="Day Streak"
          value={1}
          change="Keep it up!"
          changeType="neutral"
        />
        <StatCard
          icon={Award}
          title="Avg Score"
          value={`${Math.round(stats.averageScore)}%`}
          change={stats.averageScore > 0 ? "Based on quizzes" : "No data yet"}
          changeType="neutral"
        />
      </div>

      {/* Module Tabs Navigation */}
      <div className="mb-6 sm:mb-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto p-2">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              All Features
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Interview
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Assessment
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {modules.map((module, index) => (
                <Link
                  key={index}
                  to={module.path}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40 p-4 sm:p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <module.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{module.label}</h3>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                  <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interview" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {modules.filter(m => m.label.includes("Interview") || m.label.includes("Comm") || m.label.includes("Intro")).map((module, index) => (
                <Link
                  key={index}
                  to={module.path}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40 p-4 sm:p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <module.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{module.label}</h3>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {modules.filter(m => m.label.includes("Coding") || m.label.includes("Typing")).map((module, index) => (
                <Link
                  key={index}
                  to={module.path}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40 p-4 sm:p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <module.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{module.label}</h3>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {modules.filter(m => m.label.includes("Quiz") || m.label.includes("Resume")).map((module, index) => (
                <Link
                  key={index}
                  to={module.path}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40 p-4 sm:p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <module.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{module.label}</h3>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {modules.filter(m => m.label.includes("Skill") || m.label.includes("Domain") || m.label.includes("Company") || m.label.includes("Job")).map((module, index) => (
                <Link
                  key={index}
                  to={module.path}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40 p-4 sm:p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <module.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">{module.label}</h3>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;