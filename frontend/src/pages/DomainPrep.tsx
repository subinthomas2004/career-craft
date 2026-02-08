import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  ChevronRight,
  CheckCircle,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

const domains = [
  { id: "web", name: "Web Development", icon: "🌐", color: "bg-blue-500" },
  { id: "ai", name: "AI/ML", icon: "🤖", color: "bg-purple-500" },
  { id: "sde", name: "Software Engineering", icon: "💻", color: "bg-green-500" },
  { id: "data", name: "Data Science", icon: "📊", color: "bg-orange-500" },
];

const domainContent = {
  web: {
    questions: [
      "Explain the difference between var, let, and const in JavaScript.",
      "What is the Virtual DOM in React?",
      "How does CSS Flexbox work?",
      "What are RESTful APIs?",
      "Explain the concept of closures in JavaScript.",
    ],
    courses: [
      { title: "React - The Complete Guide", platform: "Udemy", duration: "48h" },
      { title: "The Web Developer Bootcamp", platform: "Udemy", duration: "63h" },
      { title: "JavaScript: The Hard Parts", platform: "Frontend Masters", duration: "12h" },
    ],
    skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "TypeScript", "Git", "REST APIs"],
  },
  ai: {
    questions: [
      "What is the difference between supervised and unsupervised learning?",
      "Explain gradient descent optimization.",
      "What are neural networks?",
      "How does regularization prevent overfitting?",
      "What is the bias-variance tradeoff?",
    ],
    courses: [
      { title: "Machine Learning by Andrew Ng", platform: "Coursera", duration: "60h" },
      { title: "Deep Learning Specialization", platform: "Coursera", duration: "100h" },
      { title: "PyTorch for Deep Learning", platform: "Udacity", duration: "40h" },
    ],
    skills: ["Python", "TensorFlow", "PyTorch", "NumPy", "Pandas", "Statistics", "Linear Algebra"],
  },
  sde: {
    questions: [
      "Explain SOLID principles.",
      "What is system design?",
      "How do you handle race conditions?",
      "What is the difference between SQL and NoSQL?",
      "Explain microservices architecture.",
    ],
    courses: [
      { title: "System Design Interview", platform: "ByteByteGo", duration: "20h" },
      { title: "Design Patterns", platform: "Udemy", duration: "30h" },
      { title: "Grokking the System Design", platform: "Educative", duration: "25h" },
    ],
    skills: ["Data Structures", "Algorithms", "System Design", "OOP", "Design Patterns", "Testing"],
  },
  data: {
    questions: [
      "What is the difference between data science and data analytics?",
      "Explain the concept of p-value.",
      "How do you handle missing data?",
      "What is feature engineering?",
      "Explain A/B testing.",
    ],
    courses: [
      { title: "Data Science Professional", platform: "IBM", duration: "80h" },
      { title: "SQL for Data Science", platform: "Coursera", duration: "15h" },
      { title: "Statistics with Python", platform: "Coursera", duration: "25h" },
    ],
    skills: ["Python", "SQL", "Statistics", "Data Visualization", "Excel", "Tableau", "Machine Learning"],
  },
};

const DomainPrep = () => {
  const [selectedDomain, setSelectedDomain] = useState("web");
  const content = domainContent[selectedDomain as keyof typeof domainContent];

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Domain Preparation
          </h1>
          <p className="text-muted-foreground">
            Focused preparation materials for your target domain.
          </p>
        </div>

        {/* Domain Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={cn(
                "p-6 rounded-xl border-2 transition-all text-center",
                selectedDomain === domain.id
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span className="text-4xl mb-3 block">{domain.icon}</span>
              <span className="font-medium text-foreground">{domain.name}</span>
            </button>
          ))}
        </div>

        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Interview Questions
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Required Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Common Interview Questions</CardTitle>
                <CardDescription>
                  Practice these frequently asked questions for {domains.find(d => d.id === selectedDomain)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {content.questions.map((question, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all group cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{question}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Courses</CardTitle>
                <CardDescription>
                  Top-rated courses to master {domains.find(d => d.id === selectedDomain)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.courses.map((course, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.platform} • {course.duration}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>
                  Essential skills for {domains.find(d => d.id === selectedDomain)?.name} roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {content.skills.map((skill, index) => (
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
