import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Video,
  Mic,
  ArrowRight,
  Lightbulb,
  Code,
  Keyboard,
  LayoutGrid
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import InterviewTimer from "@/components/interview/InterviewTimer";
import HrTechView from "@/components/interview/HrTechView";
import HrOnlyView from "@/components/interview/HrOnlyView";
import TechOnlyView from "@/components/interview/TechOnlyView";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { Difficulty } from "@/lib/interview/types";

const domains = [
  { id: "web", label: "Web Development", icon: "🌐" },
  { id: "ai", label: "AI/ML", icon: "🤖" },
  { id: "core", label: "Core CS", icon: "💻" },
  { id: "data", label: "Data Science", icon: "📊" },
  { id: "android", label: "Android Dev", icon: "📱" },
  { id: "devops", label: "DevOps", icon: "☁️" },
  { id: "cyber", label: "Cybersecurity", icon: "🔒" },
  { id: "game", label: "Game Dev", icon: "🎮" },
  { id: "cloud", label: "Cloud Computing", icon: "☁️" },
  { id: "uiux", label: "UI/UX Design", icon: "🎨" },
  { id: "qa", label: "QA Automation", icon: "🐛" },
  { id: "pm", label: "Product Mgmt", icon: "📋" },
];

const interviewTypes = [
  { id: "hr", label: "HR Interview", description: "Sarah — Behavioral and situational questions", icon: "👩‍💼" },
  { id: "hr-tech", label: "HR + Technical", description: "Sarah & David — Complete interview experience", icon: "👥" },
  { id: "technical", label: "Technical Interview", description: "David — Technical and coding questions", icon: "👨‍💻" },
];

const MockInterview = () => {
  const [stage, setStage] = useState<"setup" | "instructions" | "interview" | "feedback">("setup");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [resumeText, setResumeText] = useState<string>("");
  const [parsedResumeData, setParsedResumeData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // NEW: Domain input mode toggle
  const [domainMode, setDomainMode] = useState<"grid" | "text">("grid");
  const [jobRoleText, setJobRoleText] = useState<string>("");

  // Compute effective domain/jobRole
  const effectiveDomain = domainMode === "grid" ? selectedDomain : "";
  const effectiveJobRole = domainMode === "text" ? jobRoleText : "";

  const {
    sessionState,
    avatarState,
    currentTranscript,
    isCodeQuestion,
    startSession,
    submitResponse,
    submitCode,
    isListening,
    startListening,
    stopListening,
    endSession,
    ready,
    isTransitioning
  } = useInterviewSession({
    domain: effectiveDomain,
    includeHr: selectedType === 'hr' || selectedType === 'hr-tech',
    interviewType: selectedType as any || 'hr',
    difficulty: 'intermediate' as Difficulty,
    resumeText: resumeText,
    jobRole: effectiveJobRole
  });

  // Local Video Assets
  const hrVideos = useMemo(() => ({
    idle: "/avatars/hr/hr_listening.mp4",
    talking: "/avatars/hr/hr_talking.mp4",
    listening: "/avatars/hr/hr_listening.mp4",
    nodding: "/avatars/hr/hr_nodding.mp4"
  }), []);

  const techVideos = useMemo(() => ({
    idle: "/avatars/tech/tech_listening.mp4",
    talking: "/avatars/tech/tech_talking.mp4",
    listening: "/avatars/tech/tech_listening.mp4",
    nodding: "/avatars/tech/tech_nodding.mp4"
  }), []);

  // Check if setup is valid for proceeding
  const isSetupValid = () => {
    const hasDomainOrRole = domainMode === "grid" ? !!selectedDomain : jobRoleText.trim().length > 2;
    const hasType = !!selectedType;
    // For HR only, domain/role is optional (behavioral questions don't need a domain)
    if (selectedType === 'hr') return hasType;
    return hasDomainOrRole && hasType;
  };

  const handleStartSetup = () => {
    if (isSetupValid()) {
      setStage("instructions");
    }
  };

  const handleStartInterview = () => {
    setStage("interview");
    startSession();
    toast.success("Interview started! Listen to the introduction.");
  };

  const handleEndInterview = useCallback(async () => {
    endSession();
    setIsMicOn(false);
    setIsVideoOn(false);
    setStage("feedback");

    // Record Activity
    try {
      if (sessionState && sessionState.history.length > 0) {
        const avgScore = Math.round(sessionState.history.reduce((a, b) => a + b.score, 0) / sessionState.history.length);
        const label = effectiveJobRole || effectiveDomain.toUpperCase() || "General";

        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          await api.post('/auth/activity', {
            title: `Mock Interview: ${label}`,
            activityType: 'interview',
            score: `${avgScore}%`
          });
        }
      }
    } catch (err) {
      console.error("Failed to record activity", err);
    }
  }, [endSession, sessionState, effectiveDomain, effectiveJobRole]);

  const handleManualSubmit = () => {
    setIsMicOn(false);
    submitResponse();
  };

  // Track previous avatar state to detect "Finish Talking" event
  const prevAvatarState = useRef(avatarState);

  useEffect(() => {
    if (stage === 'interview') {
      if (avatarState === 'talking') {
        if (isMicOn) setIsMicOn(false);
        if (isListening) stopListening();
      }

      if (prevAvatarState.current === 'talking' && avatarState === 'idle') {
        if (!isTransitioning) {
            console.log("Avatar finished talking -> Auto-starting Mic");
            setIsMicOn(true);
        } else {
            console.log("Avatar finished talking but we are transitioning -> keeping mic off");
        }
      }

      prevAvatarState.current = avatarState;

      if (avatarState !== 'talking' && !isTransitioning) {
        if (isMicOn) {
          if (!isListening) startListening();
        } else {
          stopListening();
        }
      }
    }
  }, [isMicOn, stage, startListening, stopListening, isListening, avatarState, isTransitioning]);

  useEffect(() => {
    if (stage === 'interview' && sessionState?.isOver) {
      handleEndInterview();
      toast.success("Interview completed!");
    }
  }, [sessionState?.isOver, stage, handleEndInterview]);

  const handleCodeSubmit = (code: string, language: string) => {
    setIsMicOn(false);
    submitCode(code, language);
    toast.success("Code submitted for analysis!");
  };

  const calculateScores = () => {
    if (!sessionState?.history.length) return { overall: 0, clarity: 0, confidence: 0, content: 0 };
    const avgScore = Math.round(sessionState.history.reduce((a, b) => a + b.score, 0) / sessionState.history.length);
    return {
      overall: avgScore,
      clarity: Math.min(100, avgScore + 10),
      confidence: Math.min(100, avgScore + 5),
      content: avgScore
    };
  };

  if (stage === "setup") {
    return (
      <div className="p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              AI Mock Interview
            </h1>
            <p className="text-muted-foreground">
              Practice with AI interviewers and get real-time feedback on your performance.
            </p>
          </div>

          {/* Domain / Job Role Selection */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Domain / Role</CardTitle>
                  <CardDescription>Choose a domain or type your target job role</CardDescription>
                </div>
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                  <button
                    onClick={() => setDomainMode("grid")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                      domainMode === "grid"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Select
                  </button>
                  <button
                    onClick={() => setDomainMode("text")}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                      domainMode === "text"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                    Type Role
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {domainMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {domains.map((domain) => (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedDomain(domain.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-center backdrop-blur-xl",
                        selectedDomain === domain.id
                          ? "border-primary bg-primary/10"
                          : "border-border/50 bg-background/40 hover:border-primary/50 hover:shadow-md"
                      )}
                    >
                      <span className="text-3xl mb-2 block">{domain.icon}</span>
                      <span className="font-medium text-foreground">{domain.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="e.g., Full Stack Developer, Data Analyst, DevOps Engineer..."
                    value={jobRoleText}
                    onChange={(e) => setJobRoleText(e.target.value)}
                    className="h-12 text-base"
                  />
                  {jobRoleText.trim().length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      The AI interviewers will tailor questions for the <span className="font-semibold text-foreground">{jobRoleText}</span> role.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resume Upload (Optional) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resume Context <Badge variant="outline" className="ml-2 text-xs">Optional</Badge></CardTitle>
              <CardDescription>Upload your resume (PDF) for a personalized interview experience. Without a resume, the interview will focus on the selected domain/role.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setIsUploading(true);
                      const formData = new FormData();
                      formData.append("resume", file);

                      try {
                        const { data } = await api.post("/upload/resume", formData, {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                          timeout: 60000, // 60s timeout to prevent infinite circling
                        });

                        if (data.success) {
                          setResumeText(data.text);
                          setParsedResumeData(data.data);
                          toast.success("Resume uploaded and analyzed!");
                        }
                      } catch (error: any) {
                        console.error("Upload error details:", error);
                        const errorMessage = error.response?.data?.error || error.message || "Failed to upload resume. Check console.";
                        toast.error(errorMessage);
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                    disabled={isUploading || resumeText.length > 0}
                  />
                  {isUploading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                </div>

                {resumeText && (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-md border border-border/50 text-sm text-muted-foreground flex justify-between items-center">
                      <span>Resume parsed successfully ({resumeText.length} characters)</span>
                      <Button variant="ghost" size="sm" onClick={() => { setResumeText(""); setParsedResumeData(null); }} className="text-destructive hover:text-destructive">
                        Remove
                      </Button>
                    </div>

                    {parsedResumeData && (
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/50 text-sm space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Extracted Info</Badge>
                        </div>

                        {parsedResumeData.full_name && (
                          <p><span className="font-semibold text-foreground">Name:</span> {parsedResumeData.full_name}</p>
                        )}

                        {parsedResumeData.skills && parsedResumeData.skills.length > 0 && (
                          <div>
                            <span className="font-semibold text-foreground block mb-1">Top Skills:</span>
                            <div className="flex flex-wrap gap-1">
                              {parsedResumeData.skills.map((skill: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedResumeData.experience && parsedResumeData.experience.length > 0 && (
                          <div>
                            <span className="font-semibold text-foreground block mb-1">Latest Experience:</span>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {parsedResumeData.experience.slice(0, 2).map((exp: any, i: number) => (
                                <li key={i}>{exp.role} at {exp.company}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {resumeText && (
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/50 text-sm space-y-3 animate-in fade-in slide-in-from-top-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Parsed Words (Raw Text)</Badge>
                        </div>
                        <div className="max-h-40 overflow-y-auto p-2 bg-background rounded border border-border/50 text-xs text-muted-foreground whitespace-pre-wrap">
                          {resumeText}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interview Type */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Interview Type</CardTitle>
              <CardDescription>Choose your interview experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {interviewTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "p-6 rounded-xl border-2 transition-all text-left backdrop-blur-xl shadow-lg",
                      selectedType === type.id
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-background/40 hover:border-primary/50 hover:shadow-xl"
                    )}
                  >
                    <span className="text-2xl mb-2 block">{type.icon}</span>
                    <h3 className="font-semibold text-foreground mb-1">{type.label}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full"
            disabled={!isSetupValid()}
            onClick={handleStartSetup}
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (stage === "instructions") {
    return (
      <div className="p-6 lg:p-8 min-h-screen flex items-center justify-center">
        <Card className="max-w-2xl w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Interview Instructions</CardTitle>
            <CardDescription>Please read carefully before starting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Speak Clearly & Test Mic</h3>
                  <p className="text-sm text-muted-foreground mb-3">Make sure your microphone is on. You can test it below:</p>

                  <div className="flex items-center gap-3 bg-background/50 p-2 rounded-md border border-border/50">
                    <Button
                      size="sm"
                      variant={isListening ? "destructive" : "outline"}
                      onClick={isListening ? stopListening : startListening}
                    >
                      {isListening ? "Stop Test" : "Test Microphone"}
                    </Button>
                    <p className="text-sm italic text-foreground/80 flex-1 truncate">
                      {isListening ? (currentTranscript || "Say something...") : "Click to verify your voice input"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Professional Setting</h3>
                  <p className="text-sm text-muted-foreground">Ensure you are in a quiet environment with good lighting. Eye contact with the camera is recommended.</p>
                </div>
              </div>

              {(selectedType === 'hr-tech' || selectedType === 'technical') && (
                <div className="flex items-start gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <Code className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Coding Questions</h3>
                    <p className="text-sm text-muted-foreground">
                      If asked a coding question, please use the <span className="font-semibold text-foreground">Code Editor</span> (toggle with the bracket icon) to write and run your solution.
                    </p>
                  </div>
                </div>
              )}

              {/* Interview summary */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/50 text-sm">
                <h4 className="font-semibold text-foreground mb-2">Your Interview Setup</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p><span className="font-medium text-foreground">Type:</span> {interviewTypes.find(t => t.id === selectedType)?.label}</p>
                  <p><span className="font-medium text-foreground">Domain:</span> {effectiveJobRole || domains.find(d => d.id === effectiveDomain)?.label || "General"}</p>
                  <p><span className="font-medium text-foreground">Resume:</span> {resumeText ? "Uploaded ✓" : "Not provided"}</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={handleStartInterview} disabled={!ready}>
              {ready ? "I'm Ready - Start Interview" : "Loading Resources..."}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (stage === "interview" && sessionState) {
    if (selectedType === 'hr-tech') {
      return (
        <div className="h-screen flex flex-col bg-foreground/5">
          <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-foreground">Interview in Progress</span>
            </div>
          </div>

          <div className="flex-1 p-4 lg:p-6 overflow-hidden">
            <HrTechView
              sessionState={sessionState}
              avatarState={avatarState}
              hrVideos={hrVideos}
              techVideos={techVideos}
              isMicOn={isMicOn}
              setIsMicOn={setIsMicOn}
              isVideoOn={isVideoOn}
              setIsVideoOn={setIsVideoOn}
              isListening={isListening}
              currentTranscript={currentTranscript}
              onManualSubmit={handleManualSubmit}
              onEndInterview={handleEndInterview}
              onCodeSubmit={handleCodeSubmit}
              isCodeQuestion={isCodeQuestion}
            />
          </div>
        </div>
      );
    } else if (selectedType === 'technical') {
      return (
        <div className="h-screen flex flex-col bg-foreground/5">
          <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-foreground">Technical Interview in Progress</span>
            </div>
          </div>

          <div className="flex-1 p-4 lg:p-6 overflow-hidden">
            <TechOnlyView
              sessionState={sessionState}
              avatarState={avatarState}
              techVideos={techVideos}
              isMicOn={isMicOn}
              setIsMicOn={setIsMicOn}
              isVideoOn={isVideoOn}
              setIsVideoOn={setIsVideoOn}
              isListening={isListening}
              currentTranscript={currentTranscript}
              onManualSubmit={handleManualSubmit}
              onEndInterview={handleEndInterview}
              onCodeSubmit={handleCodeSubmit}
              isCodeQuestion={isCodeQuestion}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="h-screen flex flex-col bg-foreground/5">
          <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-foreground">Interview in Progress</span>
            </div>
          </div>

          <div className="flex-1 p-4 lg:p-6 overflow-hidden">
            <HrOnlyView
              sessionState={sessionState}
              avatarState={avatarState}
              hrVideos={hrVideos}
              isMicOn={isMicOn}
              setIsMicOn={setIsMicOn}
              isVideoOn={isVideoOn}
              setIsVideoOn={setIsVideoOn}
              isListening={isListening}
              currentTranscript={currentTranscript}
              onManualSubmit={handleManualSubmit}
              onEndInterview={handleEndInterview}
            />
          </div>
        </div>
      );
    }
  }

  const scores = calculateScores();

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Interview Complete!
          </h1>
          <p className="text-muted-foreground">
            Here's your performance analysis and feedback.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Overall", score: scores.overall, color: "text-primary" },
            { label: "Clarity", score: scores.clarity, color: "text-blue-500" },
            { label: "Confidence", score: scores.confidence, color: "text-green-500" },
            { label: "Content", score: scores.content, color: "text-purple-500" },
          ].map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="32" cy="32" r="28"
                      stroke="currentColor" strokeWidth="4" fill="none"
                      className="text-muted/30"
                    />
                    <circle
                      cx="32" cy="32" r="28"
                      stroke="currentColor" strokeWidth="4" fill="none"
                      strokeDasharray={`${item.score * 1.76} ${100 * 1.76}`}
                      className={item.color}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-foreground">{item.score}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interview Transcript & Feedback</CardTitle>
            <CardDescription>Review your answers and see where you can improve.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sessionState?.history.map((h, i) => (
              <div key={i} className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="h-6 w-6 rounded-full flex items-center justify-center p-0 shrink-0">
                      {i + 1}
                    </Badge>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-foreground">{h.question.text}</p>
                      {h.question.codeTask && (
                        <div className="mt-2 p-3 bg-muted/50 rounded-md border border-border">
                          <p className="text-xs font-semibold text-blue-500 mb-1 uppercase tracking-wider">Coding Task</p>
                          <p className="text-sm font-mono text-foreground/90 whitespace-pre-wrap">{h.question.codeTask}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={h.score > 70 ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}>
                    {h.score}% Match
                  </Badge>
                </div>

                <div className="ml-8 space-y-3">
                  <div className="bg-background p-3 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground uppercase mb-1 font-semibold">Your Answer</p>
                    {h.answer.includes('[Submitted Code') ? (
                      <pre className="text-sm text-foreground/90 font-mono whitespace-pre-wrap overflow-x-auto p-3 bg-[#1e1e1e] text-gray-200 rounded-md mt-2">
                        {h.answer.replace(/\[Submitted Code - (.*?)\]\n/, '// Language: $1\n')}
                      </pre>
                    ) : (
                      <p className="text-sm text-foreground/90">{h.answer}</p>
                    )}
                  </div>

                  {h.question.expectedKeywords && h.question.expectedKeywords.length > 0 && (
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                      <p className="text-xs text-primary uppercase mb-1 font-semibold flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> Suggested Improvement
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try to include more specific examples. Mention keywords like: {h.question.expectedKeywords.join(", ")}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => setStage("setup")}>
            Try Another Interview
          </Button>
          <Button className="flex-1">
            View Full Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
