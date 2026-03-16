import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
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
    technicalQuizCount: 0,
    aptitudeExamCount: 0,
    gdCount: 0,
    debateCount: 0,
    averageScore: 0,
    resumeScore: 0
  });
  const [streak, setStreak] = useState(0);

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
          if (data.streak !== undefined) {
            setStreak(data.streak);
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8 stagger-children">
        <StatCard
          icon={Video}
          title="Interviews"
          value={stats.interviewsAttended}
          change={stats.interviewsAttended > 0 ? "Well done!" : "Start now"}
          changeType="neutral"
        />
        <StatCard
          icon={Users}
          title="GDs"
          value={stats.gdCount || 0}
          change="Public speaking"
          changeType="neutral"
        />
        <StatCard
          icon={Swords}
          title="Debates"
          value={stats.debateCount || 0}
          change="Argumentation"
          changeType="neutral"
        />
        <StatCard
          icon={Code}
          title="Tech Quiz"
          value={stats.technicalQuizCount || 0}
          change="Keep learning"
          changeType="positive"
        />
        <StatCard
          icon={Brain}
          title="Aptitude"
          value={stats.aptitudeExamCount || 0}
          change="Main exams"
          changeType="positive"
        />
        <StatCard
          icon={Flame}
          title="Day Streak"
          value={streak}
          change={streak > 0 ? "Keep it up!" : "Start today"}
          changeType="neutral"
        />
      </div>

      {/* Features Grid */}
      <div className="mt-8 mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Features
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 ml-6 lg:ml-8">
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
              <p className="text-xs text-muted-foreground line-clamp-2">{module.description}</p>
              <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;