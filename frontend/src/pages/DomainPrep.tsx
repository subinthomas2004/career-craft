import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { domainData } from "@/data/domainPrepData";
import { domainCourses } from "@/data/domainCourses";
import { domainSkills } from "@/data/domainSkills";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  BookOpen,
  Play,
  ExternalLink,
  CheckCircle
} from "lucide-react";

const DomainPrep = () => {
  const [selectedDomainId, setSelectedDomainId] = useState("web");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const selectedDomain = domainData.find(d => d.id === selectedDomainId) || domainData[0];
  const courses = domainCourses[selectedDomainId] || [];
  const skills = domainSkills[selectedDomainId] || [
    "Problem Solving", "Critical Thinking", "Technical Communication", "Debugging", "System Design"
  ];

  const handleDomainSelect = (id: string) => {
    setSelectedDomainId(id);
    setExpandedQuestion(null); // Reset expanded state on domain change
  };

  const toggleQuestion = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Domain Preparation
          </h1>
          <p className="text-slate-500 text-lg">
            Master your domain with curated interview questions and expert answers.
          </p>
        </div>

        {/* Domain Selection - Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {domainData.map((domain) => (
            <button
              key={domain.id}
              onClick={() => { setSelectedDomainId(domain.id); setExpandedQuestion(null); }}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 flex flex-col items-center gap-2 text-center",
                selectedDomainId === domain.id
                  ? "bg-white border-indigo-600 shadow-md ring-1 ring-indigo-600/20"
                  : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm"
              )}
            >
              <span className="text-3xl filter drop-shadow-sm">{domain.icon}</span>
              <span className={cn(
                "font-medium text-sm",
                selectedDomainId === domain.id ? "text-indigo-700" : "text-slate-700"
              )}>
                {domain.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tabs for Questions, Courses, Skills */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{selectedDomain.icon}</span>
                  <div>
                    <CardTitle className="text-2xl text-slate-900">{selectedDomain.label}</CardTitle>
                    <CardDescription className="text-slate-500">
                      Top 20 Interview Questions & Answers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {selectedDomain.questions.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "transition-colors duration-200",
                        expandedQuestion === index ? "bg-indigo-50/30" : "hover:bg-slate-50"
                      )}
                    >
                      <button
                        onClick={() => toggleQuestion(index)}
                        className="w-full text-left p-6 flex gap-4 items-start focus:outline-none"
                      >
                        <span className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors mt-0.5",
                          expandedQuestion === index
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-500"
                        )}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className={cn(
                            "font-medium text-lg transition-colors pr-8",
                            expandedQuestion === index ? "text-indigo-900" : "text-slate-700"
                          )}>
                            {item.q}
                          </h3>
                          <div
                            className={cn(
                              "grid transition-[grid-template-rows] duration-300 ease-out",
                              expandedQuestion === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                            )}
                          >
                            <div className="overflow-hidden">
                              <div className="p-4 bg-white rounded-lg border border-indigo-100 text-slate-600 leading-relaxed shadow-sm">
                                <strong className="text-indigo-600 block mb-1 text-xs uppercase tracking-wider">Answer</strong>
                                {item.a}
                              </div>
                            </div>
                          </div>
                        </div>
                        {expandedQuestion === index ? (
                          <ChevronUp className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Courses</CardTitle>
                <CardDescription>
                  Top-rated courses to master {selectedDomain.label}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.length > 0 ? (
                  courses.map((course, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all bg-white">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover border border-slate-100"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Course' }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Play className="w-8 h-8 text-primary" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate" title={course.title}>{course.title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {course.platform} • <span className="font-medium text-slate-600">{course.duration}</span>
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="shrink-0">
                        <a href={course.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          To Course
                        </a>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 italic">
                    Select a domain to view recommended courses.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>
                  Essential skills for {selectedDomain.label} roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                    >
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DomainPrep;
