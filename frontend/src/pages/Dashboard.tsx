import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Clock,
  Flame,
  Award,
  MessageSquare,
  Users,
  BarChart3,
  Swords,
  Mic,
  User
} from "lucide-react";
import { useState, useEffect } from "react";

const modules = [
  { icon: Video, label: "Mock Interview", path: "/dashboard/interview", color: "from-blue-500 to-blue-600", description: "Practice AI interviews" },
  { icon: FileText, label: "Resume Builder", path: "/dashboard/resume", color: "from-green-500 to-green-600", description: "Optimize your resume" },
  { icon: Brain, label: "Quizzes", path: "/dashboard/quiz", color: "from-purple-500 to-purple-600", description: "Test your knowledge" },
  { icon: Code, label: "Coding Practice", path: "/dashboard/coding", color: "from-orange-500 to-orange-600", description: "Solve coding problems" },
  { icon: Keyboard, label: "Typing Test", path: "/dashboard/typing", color: "from-pink-500 to-pink-600", description: "Improve typing speed" },
  { icon: Target, label: "Skill Gap", path: "/dashboard/skill-gap", color: "from-cyan-500 to-cyan-600", description: "Identify skill gaps" },
  { icon: BookOpen, label: "Domain Prep", path: "/dashboard/domain", color: "from-indigo-500 to-indigo-600", description: "Domain knowledge" },
  { icon: MessageSquare, label: "Soft Skills", path: "/dashboard/soft-skills", color: "from-rose-500 to-rose-600", description: "Communication skills" },
  { icon: Users, label: "Group Discussion", path: "/dashboard/group-discussion", color: "from-teal-500 to-teal-600", description: "Practice AI group discussions" },
  { icon: Swords, label: "Debate Simulator", path: "/dashboard/debate", color: "from-red-500 to-red-600", description: "Challenge AI in debates" },
  { icon: Mic, label: "Comm. Coach", path: "/dashboard/communication-coach", color: "from-indigo-500 to-purple-500", description: "Improve fluency & grammar" },
  { icon: User, label: "Intro Prep", path: "/dashboard/intro-prep", color: "from-pink-500 to-rose-500", description: "Perfect your self-intro" },
];

const recentActivities = [
  { icon: Video, title: "Completed HR Interview", time: "2 hours ago", score: "85%" },
  { icon: Brain, title: "DSA Quiz - Arrays", time: "Yesterday", score: "92%" },
  { icon: Keyboard, title: "Typing Test", time: "2 days ago", score: "65 WPM" },
];

const upcomingTasks = [
  { title: "Complete JavaScript Quiz", due: "Today", priority: "high" },
  { title: "Practice System Design", due: "Tomorrow", priority: "medium" },
  { title: "Update Resume", due: "This week", priority: "low" },
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
              {modules.filter(m => m.label.includes("Interview") || m.label.includes("Soft") || m.label.includes("Comm") || m.label.includes("Intro")).map((module, index) => (
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
              {modules.filter(m => m.label.includes("Skill") || m.label.includes("Domain")).map((module, index) => (
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

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Progress Overview */}
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border/40 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Skill Progress</h2>
              <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
                <Link to="/dashboard/skill-gap" className="flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[
                { skill: "Data Structures", progress: 75, color: "bg-blue-500" },
                { skill: "System Design", progress: 45, color: "bg-purple-500" },
                { skill: "Communication", progress: 82, color: "bg-green-500" },
                { skill: "Problem Solving", progress: 68, color: "bg-orange-500" },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-xs sm:text-sm font-medium text-foreground">{item.skill}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-1.5 sm:h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border/40 p-4 sm:p-6 shadow-lg">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-3 sm:space-y-4">
                {user?.recentActivities && user.recentActivities.length > 0 ? (
                  user.recentActivities.slice(0, 3).map((activity: any, index: number) => {
                    let Icon = FileText;
                    let color = "bg-blue-500/10 text-blue-500";

                    if (activity.activityType === 'interview') { Icon = Video; color = "bg-blue-500/10 text-blue-500"; }
                    else if (activity.activityType === 'quiz') { Icon = Brain; color = "bg-purple-500/10 text-purple-500"; }
                    else if (activity.activityType === 'coding') { Icon = Code; color = "bg-orange-500/10 text-orange-500"; }
                    else if (activity.activityType === 'resume') { Icon = FileText; color = "bg-green-500/10 text-green-500"; }
                    else if (activity.activityType === 'typing') { Icon = Keyboard; color = "bg-pink-500/10 text-pink-500"; }

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl bg-background/60 backdrop-blur-md"
                      >
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${color} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {activity.score && (
                          <span className="text-xs sm:text-sm font-medium text-primary">{activity.score}</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No recent activity. Start learning!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-4 sm:space-y-6">
          {/* Preparation Score */}
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border/40 p-4 sm:p-6 shadow-lg">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Readiness Score</h2>
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted/30"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${78 * 2.83} ${100 * 2.83}`}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">78%</span>
              </div>
            </div>
            <p className="text-center text-muted-foreground text-xs sm:text-sm">
              You're on track! Keep practicing to improve your score.
            </p>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border/40 p-4 sm:p-6 shadow-lg">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Upcoming Tasks</h2>
            <div className="space-y-2 sm:space-y-3">
              {upcomingTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 backdrop-blur-md"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 ${task.priority === 'high' ? 'bg-destructive' :
                    task.priority === 'medium' ? 'bg-primary' : 'bg-muted'
                    }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.due}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3 sm:mt-4" size="sm">
              View All Tasks
            </Button>
          </div>

          {/* Domain Focus */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/30 backdrop-blur-xl rounded-2xl border border-border/40 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Your Focus</h2>
            </div>
            <div className="bg-card/50 rounded-xl p-3 sm:p-4 mb-4">
              <p className="font-medium text-foreground text-sm sm:text-base">Web Development</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Full Stack Track</p>
            </div>
            <Button asChild className="w-full text-sm">
              <Link to="/dashboard/domain">
                Continue Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;