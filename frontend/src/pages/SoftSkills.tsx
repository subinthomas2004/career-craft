import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  Smile,
  ArrowRight,
  Calendar
} from "lucide-react";

const SoftSkills = () => {
  const heatmapData = [
    { week: "Week 1", days: [3, 4, 5, 3, 4, 5, 4] },
    { week: "Week 2", days: [4, 5, 4, 5, 5, 4, 5] },
    { week: "Week 3", days: [5, 4, 5, 5, 4, 5, 5] },
    { week: "Week 4", days: [4, 5, 5, 4, 5, 5, 5] },
  ];

  const getColor = (value: number) => {
    if (value <= 2) return "bg-red-300";
    if (value <= 3) return "bg-amber-300";
    if (value <= 4) return "bg-green-300";
    return "bg-green-500";
  };

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
            { icon: MessageSquare, label: "Communication", score: 82, color: "text-blue-500" },
            { icon: Heart, label: "Confidence", score: 75, color: "text-red-500" },
            { icon: Smile, label: "Positivity", score: 88, color: "text-green-500" },
            { icon: TrendingUp, label: "Growth", score: 70, color: "text-purple-500" },
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Confidence Heatmap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Confidence Heatmap
            </CardTitle>
            <CardDescription>
              Your confidence levels based on interview performance
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
                    <span className="w-16 text-xs text-muted-foreground">{week.week}</span>
                    {week.days.map((value, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-10 h-10 rounded-lg ${getColor(value)} flex items-center justify-center text-xs font-medium text-foreground/70`}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-300" />
                <span className="text-xs text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-300" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-300" />
                <span className="text-xs text-muted-foreground">Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-xs text-muted-foreground">Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Interview Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Interview Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown from your last mock interview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Speech Analysis</h4>
                {[
                  { label: "Clarity", value: 85 },
                  { label: "Pace", value: 78 },
                  { label: "Filler Words", value: 65 },
                  { label: "Volume", value: 90 },
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
                <h4 className="font-medium text-foreground">Content Analysis</h4>
                {[
                  { label: "Relevance", value: 88 },
                  { label: "Structure", value: 72 },
                  { label: "Examples", value: 80 },
                  { label: "Technical Accuracy", value: 85 },
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
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Improvement Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Reduce Filler Words",
                  description: "Practice pausing instead of using 'um', 'uh', 'like'",
                },
                {
                  title: "Structure Your Answers",
                  description: "Use the STAR method for behavioral questions",
                },
                {
                  title: "Maintain Eye Contact",
                  description: "Look at the camera during video interviews",
                },
                {
                  title: "Practice Active Listening",
                  description: "Wait for the full question before answering",
                },
              ].map((tip, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl bg-muted/50 border border-border"
                >
                  <h4 className="font-medium text-foreground mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoftSkills;
