import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  X,
  Plus,
  Upload,
  Loader2,
  Gauge,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { domainSkills } from "@/data/domainSkills";

// Map domain keys to user-friendly labels and icons
const roleMap: Record<string, { label: string; icon: string }> = {
  web: { label: "Web Developer", icon: "🌐" },
  ai: { label: "AI / ML Engineer", icon: "🤖" },
  core: { label: "Core CS / SDE", icon: "💻" },
  data: { label: "Data Analyst", icon: "📊" },
  android: { label: "Android Developer", icon: "📱" },
  devops: { label: "DevOps Engineer", icon: "⚙️" },
  cyber: { label: "Cybersecurity", icon: "🔒" },
  game: { label: "Game Developer", icon: "🎮" },
  cloud: { label: "Cloud Engineer", icon: "☁️" },
  uiux: { label: "UI/UX Designer", icon: "🎨" },
  qa: { label: "QA Engineer", icon: "🧪" },
  pm: { label: "Product Manager", icon: "📋" },
  blockchain: { label: "Blockchain Dev", icon: "⛓️" },
  iot: { label: "IoT Engineer", icon: "📡" },
  mobile: { label: "Mobile Developer", icon: "📲" },
  network: { label: "Network Engineer", icon: "🔌" },
  db: { label: "Database Admin", icon: "🗄️" },
  system_design: { label: "System Architect", icon: "🏗️" },
  testing: { label: "Test Engineer", icon: "✅" },
  hr: { label: "HR / Soft Skills", icon: "🤝" },
};

interface SkillGapAnalysis {
  currentSkills: { name: string; level: number }[];
  missingSkills: { name: string; priority: string }[];
  roadmap: { week: string; title: string; description: string }[];
  resources: { title: string; type: string; platform: string; link: string }[];
  overallReadiness: number;
  summary: string;
}

const SkillGap = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("");
  const [showAllRoles, setShowAllRoles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleEntries = Object.entries(roleMap);
  const visibleRoles = showAllRoles ? roleEntries : roleEntries.slice(0, 8);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !userSkills.includes(trimmed)) {
      setUserSkills([...userSkills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setUserSkills(userSkills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      // Use the /upload/resume endpoint which does Groq AI-powered parsing
      // and returns { success, text, data: { skills: [...], full_name, ... } }
      const response = await api.post("/upload/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success && response.data?.data?.skills) {
        const extracted: string[] = response.data.data.skills;
        const merged = [...new Set([...userSkills, ...extracted])];
        setUserSkills(merged);
        setResumeFileName(file.name);
      } else if (response.data?.text) {
        // Fallback: extract skill-like words from resume raw text
        const text = response.data.text as string;
        const commonSkills = [
          "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++",
          "HTML", "CSS", "SQL", "MongoDB", "Git", "Docker", "AWS", "Azure",
          "Kubernetes", "Redux", "Angular", "Vue", "Next.js", "Express",
          "GraphQL", "REST API", "Figma", "Flutter", "Kotlin", "Swift"
        ];
        const found = commonSkills.filter(s => text.toLowerCase().includes(s.toLowerCase()));
        if (found.length > 0) {
          const merged = [...new Set([...userSkills, ...found])];
          setUserSkills(merged);
        }
        setResumeFileName(file.name);
      } else {
        setError("Could not extract skills from resume. Please add skills manually.");
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      setError("Failed to parse resume. Please add skills manually.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };


  const handleAnalyze = async () => {
    if (!selectedRole) {
      setError("Please select a target role first.");
      return;
    }
    if (userSkills.length === 0) {
      setError("Please add at least one skill.");
      return;
    }

    setIsLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await api.post("/groq/skill-gap/analyze", {
        userSkills,
        targetRole: roleMap[selectedRole]?.label || selectedRole,
        domainSkills: domainSkills[selectedRole] || [],
      });

      if (response.data?.success && response.data?.analysis) {
        setAnalysis(response.data.analysis);
      } else {
        setError("Failed to get analysis. Please try again.");
      }
    } catch {
      setError("Failed to analyze skills. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            AI Skill Gap Analyzer
          </h1>
          <p className="text-muted-foreground">
            Input your skills, select a target role, and get a personalized AI-powered analysis.
          </p>
        </div>

        {/* Role Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Target Role</CardTitle>
            <CardDescription>Select the role you're preparing for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {visibleRoles.map(([key, role]) => (
                <button
                  key={key}
                  onClick={() => { setSelectedRole(key); setAnalysis(null); }}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all text-center hover:scale-[1.02]",
                    selectedRole === key
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl mb-1 block">{role.icon}</span>
                  <span className="font-medium text-foreground text-xs">{role.label}</span>
                </button>
              ))}
            </div>
            {roleEntries.length > 8 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3"
                onClick={() => setShowAllRoles(!showAllRoles)}
              >
                {showAllRoles ? (
                  <><ChevronUp className="w-4 h-4 mr-1" /> Show Less</>
                ) : (
                  <><ChevronDown className="w-4 h-4 mr-1" /> Show All {roleEntries.length} Roles</>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Skills Input */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Your Skills
            </CardTitle>
            <CardDescription>Add your current skills manually or upload your resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Manual Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a skill (e.g., React, Python, SQL) and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={addSkill} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Resume Upload */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Parsing...</>
                ) : (
                  <><Upload className="w-4 h-4 mr-2" /> Upload Resume (PDF)</>
                )}
              </Button>
              {resumeFileName && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {resumeFileName}
                </span>
              )}
            </div>

            {/* Skill Tags */}
            {userSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {userSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {userSkills.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No skills added yet. Type above or upload your resume to extract skills automatically.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Analyze Button */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={isLoading || !selectedRole || userSkills.length === 0}
            className="px-8 text-base"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing with AI...</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" /> Analyze Skill Gap</>
            )}
          </Button>
          {!isLoading && selectedRole && userSkills.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Analyzing {userSkills.length} skill{userSkills.length > 1 ? "s" : ""} for {roleMap[selectedRole]?.label}
            </p>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="h-20 bg-muted rounded" />
                  <div className="h-20 bg-muted rounded" />
                  <div className="h-20 bg-muted rounded" />
                  <div className="h-20 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {analysis && !isLoading && (
          <div className="space-y-6">
            {/* Overall Readiness + Summary */}
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <Gauge className="w-8 h-8 text-primary mb-1" />
                    <span className={cn("text-4xl font-bold", getReadinessColor(analysis.overallReadiness))}>
                      {analysis.overallReadiness}%
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">Readiness</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">Your Readiness Summary</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Current Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    Your Current Skills
                  </CardTitle>
                  <CardDescription>How relevant your skills are for {roleMap[selectedRole]?.label}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.currentSkills.map((skill, index) => (
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
                  <CardDescription>Required skills for {roleMap[selectedRole]?.label}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.missingSkills.map((skill, index) => (
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Generated Learning Roadmap
                </CardTitle>
                <CardDescription>Personalized path to close your skill gaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {analysis.roadmap.map((item, index) => (
                    <div key={index} className="flex gap-4 mb-6 last:mb-0">
                      <div className="relative flex flex-col items-center">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          index === 0 
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </div>
                        {index < analysis.roadmap.length - 1 && (
                          <div className="w-0.5 h-full bg-border absolute top-10" />
                        )}
                      </div>
                      <div className={cn(
                        "flex-1 p-4 rounded-xl border",
                        index === 0
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}>
                        <p className="text-xs text-muted-foreground mb-1">{item.week}</p>
                        <p className="font-medium text-foreground">{item.title}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        )}
                        <Button
                          size="sm"
                          variant={index === 0 ? "default" : "outline"}
                          className="mt-3"
                          onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(item.title + " tutorial course free")}`, "_blank")}
                        >
                          Start Learning
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
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
                <CardDescription>AI-curated learning materials for your skill gaps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {analysis.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
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
                        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGap;
