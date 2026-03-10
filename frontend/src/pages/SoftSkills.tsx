import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  Smile,
  Calendar,
  Sparkles,
  Loader2,
  Mic,
  Swords,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/firebase";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface SessionData {
  score: number;
  wpm: number;
  grammarErrorCount: number;
  fillerWordCount: number;
  mode: string;
  createdAt: any;
}

interface DebateData {
  overallScore: number;
  createdAt: any;
}

interface TipData {
  title: string;
  description: string;
  priority: string;
  category: string;
}

const SoftSkills = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [commSessions, setCommSessions] = useState<SessionData[]>([]);
  const [debateSessions, setDebateSessions] = useState<DebateData[]>([]);
  const [tips, setTips] = useState<TipData[]>([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);

  // Computed metrics
  const communicationAvg = commSessions.length > 0
    ? Math.round(commSessions.reduce((sum, s) => sum + (s.score || 0), 0) / commSessions.length)
    : 0;

  const debateAvg = debateSessions.length > 0
    ? Math.round(debateSessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / debateSessions.length)
    : 0;

  const totalSessions = commSessions.length + debateSessions.length;

  const avgWpm = commSessions.length > 0
    ? Math.round(commSessions.reduce((sum, s) => sum + (s.wpm || 0), 0) / commSessions.length)
    : 0;

  const totalFillers = commSessions.reduce((sum, s) => sum + (s.fillerWordCount || 0), 0);

  const avgGrammarErrors = commSessions.length > 0
    ? Math.round(commSessions.reduce((sum, s) => sum + (s.grammarErrorCount || 0), 0) / commSessions.length)
    : 0;

  // Growth: compare latest half vs first half of scores
  const growthScore = (() => {
    const allScores = [
      ...commSessions.map(s => s.score || 0),
      ...debateSessions.map(s => s.overallScore || 0)
    ];
    if (allScores.length < 2) return 0;
    const mid = Math.floor(allScores.length / 2);
    const firstHalf = allScores.slice(0, mid);
    const secondHalf = allScores.slice(mid);
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    return Math.min(100, Math.max(0, Math.round(50 + (secondAvg - firstAvg))));
  })();

  // Consistency: based on total sessions
  const consistencyScore = (() => {
    if (totalSessions === 0) return 0;
    return Math.min(100, Math.round(totalSessions * 10));
  })();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      let commData: SessionData[] = [];
      let debateData: DebateData[] = [];

      // Fetch communication sessions
      const commRes = await api.get('/soft-skills/communication', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (commRes.data.success) {
        commData = commRes.data.sessions;
        setCommSessions(commData);
      }

      // Fetch debate sessions
      const debateRes = await api.get('/soft-skills/debate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (debateRes.data.success) {
        debateData = debateRes.data.sessions;
        setDebateSessions(debateData);
      }

      // Build heatmap from last 28 days
      buildHeatmap(commData, debateData);

    } catch (error) {
      console.error("Failed to fetch soft skills data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildHeatmap = (comm: SessionData[], debates: DebateData[]) => {
    const now = new Date();
    const weeks: number[][] = [];

    for (let w = 0; w < 4; w++) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        const dayOffset = w * 7 + d;
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() - (27 - dayOffset));
        const dateStr = targetDate.toISOString().split("T")[0];

        let count = 0;
        comm.forEach(s => {
          if (s.createdAt) {
            const sessionDate = new Date(s.createdAt).toISOString().split("T")[0];
            if (sessionDate === dateStr) count++;
          }
        });
        debates.forEach(s => {
          if (s.createdAt) {
            const sessionDate = new Date(s.createdAt).toISOString().split("T")[0];
            if (sessionDate === dateStr) count++;
          }
        });

        week.push(count);
      }
      weeks.push(week);
    }

    setHeatmapData(weeks);
  };

  const getHeatmapColor = (value: number) => {
    if (value === 0) return "bg-muted/50";
    if (value === 1) return "bg-green-200 dark:bg-green-900";
    if (value === 2) return "bg-green-300 dark:bg-green-700";
    if (value >= 3) return "bg-green-500 dark:bg-green-500";
    return "bg-muted/50";
  };

  const fetchTips = async () => {
    if (totalSessions === 0) return;

    setTipsLoading(true);
    try {
      const response = await api.post("/groq/soft-skills/tips", {
        communicationAvg,
        debateAvg,
        avgWpm,
        totalFillers,
        totalSessions,
        avgGrammarErrors,
      });

      if (response.data?.success && response.data?.tips) {
        setTips(response.data.tips);
      }
    } catch (error) {
      console.error("Failed to fetch tips:", error);
    } finally {
      setTipsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    if (priority === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
  };

  // Latest session metrics
  const latestSession = commSessions.length > 0 ? commSessions[0] : null;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your performance data...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (totalSessions === 0) {
    return (
      <div className="p-6 lg:p-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Soft Skills & Confidence Tracker
            </h1>
            <p className="text-muted-foreground">
              Monitor your communication skills and confidence levels over time.
            </p>
          </div>

          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Activity Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Complete a Communication Coach session or a Debate to start tracking your soft skills progress.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate("/dashboard/communication")} className="gap-2">
                  <Mic className="w-4 h-4" />
                  Communication Coach
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/debate")} className="gap-2">
                  <Swords className="w-4 h-4" />
                  Start a Debate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Soft Skills & Confidence Tracker
          </h1>
          <p className="text-muted-foreground">
            Monitor your communication skills and confidence levels over time.
          </p>
        </div>

        {/* Current Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: MessageSquare, label: "Communication", score: communicationAvg, color: "text-blue-500", subtitle: `${commSessions.length} sessions` },
            { icon: Heart, label: "Confidence", score: debateAvg, color: "text-red-500", subtitle: `${debateSessions.length} debates` },
            { icon: Smile, label: "Consistency", score: consistencyScore, color: "text-green-500", subtitle: `${totalSessions} total` },
            { icon: TrendingUp, label: "Growth", score: growthScore, color: "text-purple-500", subtitle: "trend" },
          ].map((item, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Heatmap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Activity Heatmap
            </CardTitle>
            <CardDescription>
              Your practice activity over the last 4 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[400px]">
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <span className="w-16"></span>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <span key={day} className="w-10 text-center">{day}</span>
                  ))}
                </div>
                {heatmapData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex items-center gap-2 mb-2">
                    <span className="w-16 text-xs text-muted-foreground">Week {weekIndex + 1}</span>
                    {week.map((value, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-10 h-10 rounded-lg ${getHeatmapColor(value)} flex items-center justify-center text-xs font-medium text-foreground/70 transition-colors`}
                        title={`${value} session${value !== 1 ? 's' : ''}`}
                      >
                        {value > 0 ? value : ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted/50" />
                <span className="text-xs text-muted-foreground">None</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-900" />
                <span className="text-xs text-muted-foreground">1 session</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-300 dark:bg-green-700" />
                <span className="text-xs text-muted-foreground">2 sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-xs text-muted-foreground">3+ sessions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Session Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Latest Session Analysis</CardTitle>
            <CardDescription>
              {latestSession
                ? "Breakdown from your most recent communication session"
                : "Complete a Communication Coach session to see detailed analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestSession ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Speech Metrics</h4>
                  {[
                    { label: "Overall Score", value: latestSession.score || 0 },
                    { label: "Speaking Pace", value: Math.min(100, Math.round((latestSession.wpm || 0) / 1.5)) },
                    { label: "Grammar", value: Math.max(0, 100 - (latestSession.grammarErrorCount || 0) * 15) },
                    { label: "Fluency (Low Fillers)", value: Math.max(0, 100 - (latestSession.fillerWordCount || 0) * 10) },
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className="text-sm font-medium text-foreground">{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Session Stats</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold text-foreground">{latestSession.wpm || 0}</p>
                      <p className="text-xs text-muted-foreground">WPM</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold text-foreground">{latestSession.score || 0}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold text-foreground">{latestSession.grammarErrorCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Grammar Errors</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold text-foreground">{latestSession.fillerWordCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Filler Words</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No communication sessions yet.</p>
                <Button onClick={() => navigate("/dashboard/communication")} variant="outline" className="gap-2">
                  <Mic className="w-4 h-4" />
                  Start a Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI-Powered Tips */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Improvement Tips
                </CardTitle>
                <CardDescription>Personalized tips based on your actual performance</CardDescription>
              </div>
              {tips.length === 0 && (
                <Button onClick={fetchTips} disabled={tipsLoading} size="sm">
                  {tipsLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> Generate Tips</>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {tipsLoading && tips.length === 0 && (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            )}

            {tips.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{tip.title}</h4>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium ml-2 whitespace-nowrap",
                        getPriorityColor(tip.priority)
                      )}>
                        {tip.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </div>
            )}

            {tips.length === 0 && !tipsLoading && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Click "Generate Tips" to get AI-powered advice based on your {totalSessions} sessions.
              </p>
            )}

            {tips.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" onClick={fetchTips} disabled={tipsLoading}>
                  {tipsLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Refreshing...</>
                  ) : (
                    "Refresh Tips"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoftSkills;
