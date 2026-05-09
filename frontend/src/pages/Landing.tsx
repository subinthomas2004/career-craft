import { HomeCarousel } from "@/components/landing/HomeCarousel";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import Navbar from "@/components/layout/Navbar";
import { Suspense, lazy, useState, useEffect } from "react";
import Spline from '@splinetool/react-spline';
import { Rocket, Video, FileText, Brain, Keyboard, Code, Target, ArrowRight, CheckCircle, Users, Award, Zap, Sparkles, Play } from "lucide-react";

// Module images
import moduleInterview from "@/assets/module-interview.png";
import moduleResume from "@/assets/module-resume.png";
import moduleQuiz from "@/assets/module-quiz.png";
import moduleTyping from "@/assets/module-typing.png";
import moduleCoding from "@/assets/module-coding.png";

const features = [{
  icon: Video,
  title: "AI Mock Interviews",
  description: "Practice with AI interviewers that adapt to your responses. Get real-time feedback on clarity, confidence, and content.",
  image: moduleInterview
}, {
  icon: FileText,
  title: "Resume Analyzer",
  description: "Upload your resume and get instant ATS optimization tips. Create professional resumes with our templates.",
  image: moduleResume
}, {
  icon: Users,
  title: "Group Discussions & Debates",
  description: "Participate in real-time or AI-moderated virtual rooms to enhance your argumentation and communication skills."
}, {
  icon: Brain,
  title: "Smart Assessments & Skill Gap",
  description: "Assess your knowledge with adaptive aptitude and technical quizzes. Identify missing skills for your target role.",
  image: moduleQuiz
}, {
  icon: Code,
  title: "Coding Challenges",
  description: "Solve coding problems with our integrated IDE. Auto-graded test cases and detailed solutions.",
  image: moduleCoding
}, {
  icon: Keyboard,
  title: "Typing Trainer",
  description: "Improve your typing speed and accuracy with gamified exercises. Compete on leaderboards and track your WPM.",
  image: moduleTyping
}];

const Landing = () => {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <Navbar />

      {/* Hero Section with Spline */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0">
          {/* Fallback gradient while loading */}
          <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 transition-opacity duration-1000 pointer-events-none ${splineLoaded ? 'opacity-0' : 'opacity-100'}`} />

          <div className="absolute inset-0">
            <Spline
              scene="https://prod.spline.design/1LhiVpvVbo069hva/scene.splinecode"
              className="w-full h-full"
              onLoad={() => setSplineLoaded(true)}
            />
          </div>

          {/* Overlay gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/60 pointer-events-none" />
        </div>

        {/* Centered Title */}
        <div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center pointer-events-none h-full pt-28 md:pt-40"
        >

          <div
            className="flex flex-col justify-start items-center"
            style={{ transform: 'translate(-22px, 0px)' }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 animate-fade-in-up font-display tracking-tight text-foreground drop-shadow-sm">
              Career<span className="text-gradient">Craft</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground/90 max-w-xl mx-auto animate-fade-in font-medium" style={{
              animationDelay: '0.2s'
            }}>
              The all-in-one AI platform for campus placement preparation.
              Master interviews, optimize resumes, and ace technical rounds.
            </p>
          </div>

          {/* CTA Button - Centered in the "hole" */}
          <div
            className="absolute top-1/2 left-1/2 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up pointer-events-auto"
            style={{
              animationDelay: '0.3s',
              transform: 'translate(calc(-50% - 30px), calc(-50% + 46px))' // Locked position
            }}
          >
            <Button asChild className="px-8 py-6 h-auto text-sm font-semibold shadow-sm hover:scale-110 transition-all duration-300 group rounded-full border border-white/20 bg-white/10 backdrop-blur-xl text-foreground hover:bg-white/20">
              <Link to="/auth?mode=register">
                Start Free Today
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-24 pb-24 px-4 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto">
          <div className="text-center mb-16">
            <HomeCarousel />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 hover:bg-primary/20 hover:scale-105 transition-all duration-300 cursor-default">
              <Zap className="w-4 h-4" />
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From mock interviews to skill assessments, we've got every aspect of your placement journey covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} gradient={index === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-card/50 to-card/30" />
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 hover:bg-primary/20 hover:scale-105 transition-all duration-300 cursor-default">
              <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
              Start Your Journey
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start your placement preparation journey in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
              step: "01",
              icon: Users,
              title: "Create Your Profile",
              description: "Sign up and tell us about your target role and current skills."
            }, {
              step: "02",
              icon: Target,
              title: "Get Personalized Plan",
              description: "AI analyzes your profile and creates a custom preparation roadmap."
            }, {
              step: "03",
              icon: Award,
              title: "Practice & Improve",
              description: "Use our tools to practice and track your progress to placement success."
            }].map((item, index) => (
              <div key={index} className="relative group">
                {/* Connection Line */}
                {index < 2 && <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />}

                <div className="glass-card p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-glow cursor-default">
                  <div className="text-6xl font-bold text-primary/10 absolute top-4 right-6 font-display group-hover:text-primary/20 transition-colors duration-300">
                    {item.step}
                  </div>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <item.icon className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 font-display group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
            <div className="absolute inset-0 bg-hero-pattern opacity-10" />

            {/* Glow Effects */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-foreground/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/30 rounded-full blur-[80px]" />

            {/* Content */}
            <div className="relative p-12 md:p-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 font-display">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join our platform and accelerate your placement preparation journey with CareerCraft today.
              </p>
              <Button size="lg" variant="secondary" asChild className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <Link to="/auth?mode=register">
                  Get Started for Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-border/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground font-display">CareerCraft</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2025 CareerCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;