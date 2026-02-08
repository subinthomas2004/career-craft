import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  BookOpen, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  { id: "sde", label: "Software Engineer", icon: "💻" },
  { id: "web", label: "Web Developer", icon: "🌐" },
  { id: "data", label: "Data Analyst", icon: "📊" },
  { id: "ml", label: "ML Engineer", icon: "🤖" },
];

const skillsData = {
  current: [
    { name: "JavaScript", level: 80 },
    { name: "React", level: 75 },
    { name: "HTML/CSS", level: 85 },
    { name: "Git", level: 70 },
    { name: "Problem Solving", level: 65 },
  ],
  missing: [
    { name: "TypeScript", priority: "high" },
    { name: "System Design", priority: "high" },
    { name: "Docker", priority: "medium" },
    { name: "CI/CD", priority: "medium" },
    { name: "Testing", priority: "low" },
  ],
  resources: [
    { title: "TypeScript Deep Dive", type: "Course", platform: "Udemy", link: "#" },
    { title: "System Design Primer", type: "GitHub", platform: "GitHub", link: "#" },
    { title: "Docker for Beginners", type: "Tutorial", platform: "Docker Docs", link: "#" },
    { title: "Jest Testing Guide", type: "Documentation", platform: "Jest", link: "#" },
  ]
};

const SkillGap = () => {
  const [selectedRole, setSelectedRole] = useState("sde");

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            AI Skill Gap Analyzer
          </h1>
          <p className="text-muted-foreground">
            Identify missing skills and get a personalized learning roadmap.
          </p>
        </div>

        {/* Role Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Target Role</CardTitle>
            <CardDescription>Select the role you're preparing for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-center",
                    selectedRole === role.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-3xl mb-2 block">{role.icon}</span>
                  <span className="font-medium text-foreground text-sm">{role.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Current Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Your Current Skills
              </CardTitle>
              <CardDescription>Skills identified from your resume and assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillsData.current.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Missing Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-5 h-5" />
                Skills to Develop
              </CardTitle>
              <CardDescription>Required skills for {roles.find(r => r.id === selectedRole)?.label}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {skillsData.missing.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    skill.priority === "high" 
                      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : skill.priority === "medium"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                  )}>
                    {skill.priority} priority
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Learning Roadmap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI-Generated Learning Roadmap
            </CardTitle>
            <CardDescription>Personalized path to close your skill gaps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {[
                { week: "Week 1-2", title: "TypeScript Fundamentals", status: "current" },
                { week: "Week 3-4", title: "System Design Basics", status: "upcoming" },
                { week: "Week 5-6", title: "Docker & Containerization", status: "upcoming" },
                { week: "Week 7-8", title: "CI/CD Pipelines", status: "upcoming" },
              ].map((item, index) => (
                <div key={index} className="flex gap-4 mb-6 last:mb-0">
                  <div className="relative flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      item.status === "current" 
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <div className="w-0.5 h-full bg-border absolute top-10" />
                    )}
                  </div>
                  <div className={cn(
                    "flex-1 p-4 rounded-xl border",
                    item.status === "current"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  )}>
                    <p className="text-xs text-muted-foreground mb-1">{item.week}</p>
                    <p className="font-medium text-foreground">{item.title}</p>
                    {item.status === "current" && (
                      <Button size="sm" className="mt-3">
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Recommended Resources
            </CardTitle>
            <CardDescription>Curated learning materials for your skill gaps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {skillsData.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {resource.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {resource.type} • {resource.platform}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillGap;
