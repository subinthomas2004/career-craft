
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Shield, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import OTPVerification from "@/components/auth/OTPVerification";

import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

import Spline from '@splinetool/react-spline';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isRegister, setIsRegister] = useState(searchParams.get("mode") === "register");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';

      const { data } = await api.post(
        endpoint,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      if (isRegister) {
        setShowOTP(true);
        toast({
          title: "Verify your email",
          description: "We've sent a 6-digit code to your email.",
        });
      } else {
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        if (data.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }

    } catch (error: any) {
      if (error.response?.status === 409) {
        toast({
          title: "Already Logged In",
          description: "This account is already logged in on another device/tab. Please logout from that session first.",
          variant: "destructive"
        });
      } else if (error.response?.data?.message === 'Please verify your email first') {
        toast({
          title: "Not Verified",
          description: "This email is registered but not verified. Please register again to get a new code.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Authentication failed.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(
        '/auth/verify-otp',
        {
          email: formData.email,
          otp
        }
      );

      // Verification successful, log user in
      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Account verified!",
        description: "Your account has been created successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Authenticate with backend to store user in MongoDB
      const { data } = await api.post(
        '/auth/google',
        {
          name: user.displayName,
          email: user.email,
          googleId: user.uid,
          picture: user.photoURL,
        }
      );

      // Save backend user info (includes MongoDB _id and JWT)
      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Signed in with Google",
        description: "Welcome back!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google Login Error:", error);
      if (error.response?.status === 409) {
        toast({
          title: "Already Logged In",
          description: "This account is already logged in on another device/tab. Please logout from that session first.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: error.response?.data?.message || error.message || "Failed to sign in with Google",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* 
   * Enhanced Glassmorphism for Dark Backgrounds
   * - Darker base for contrast against vibrant Spline scene
   * - White text for readability
   * - Subtle borders
   */
  const glassPageClass = `
    relative w-full h-full flex flex-col justify-center
    bg-black/60 backdrop-blur-xl backdrop-saturate-150
    border border-white/10
    shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
    overflow-hidden
    text-white
  `;

  if (showOTP && isRegister) {
    return (
      <div className="min-h-screen bg-black/90 relative overflow-hidden">
        {/* Spline Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Scaled wrapper to hide "Built with Spline" watermark */}
          <div className="w-full h-full scale-[1.25] origin-center">
            <Spline
              scene="https://prod.spline.design/SORNV1gVuL2J1f0M/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md p-8 rounded-[2rem] ${glassPageClass} !h-auto`}
          >
            <div className="relative z-10">
              <OTPVerification
                email={formData.email}
                onVerify={handleOTPVerify}
                onBack={() => setShowOTP(false)}
                isLoading={isLoading}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/90 relative overflow-hidden flex items-center justify-center p-4">
      {/* Spline Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Scaled wrapper to hide "Built with Spline" watermark */}
        <div className="w-full h-full scale-[1.25] origin-center">
          <Spline
            scene="https://prod.spline.design/SORNV1gVuL2J1f0M/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Book Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-5xl h-[650px] grid grid-cols-1 md:grid-cols-2 rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm"
      >
        {/* Left Page: Branding (Static) */}
        <div className={`hidden md:flex flex-col items-center justify-center p-12 text-center rounded-l-[2rem] border-r border-white/10 ${glassPageClass}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-primary/40 rounded-2xl blur-xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl border border-white/20">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold font-display text-white">
                Career<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Craft</span>
              </h1>
              <p className="text-white/80 text-lg max-w-xs mx-auto">
                Your AI-powered placement preparation companion
              </p>
            </div>

            <div className="flex flex-col gap-4 items-center pt-4">
              {[
                { icon: Sparkles, text: "AI Mock Interviews" },
                { icon: Shield, text: "Resume Analysis" },
                { icon: Zap, text: "Skill Assessment" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90 bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                  <item.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Page: Auth Forms (Animated) */}
        <div className={`relative bg-black/40 backdrop-blur-xl ${glassPageClass} rounded-none md:rounded-r-[2rem]`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? "register" : "login"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-8 md:p-12 overflow-y-auto"
            >
              <FormContent
                isRegister={isRegister}
                formData={formData}
                setFormData={setFormData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                handleToggleMode={() => setIsRegister(!isRegister)}
                handleGoogleLogin={handleGoogleLogin}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// Form Content Component (Restored)
interface FormContentProps {
  isRegister: boolean;
  formData: { name: string; email: string; password: string; confirmPassword: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; confirmPassword: string }>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleToggleMode: () => void;
  handleGoogleLogin: () => Promise<void>;
}

const FormContent = ({
  isRegister,
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  isLoading,
  handleSubmit,
  handleToggleMode,
  handleGoogleLogin
}: FormContentProps) => (
  <div className="space-y-4 h-full flex flex-col justify-center text-white">
    {/* Mobile Logo */}
    <Link to="/" className="flex items-center gap-2 group md:hidden self-center mb-2">
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow">
        <Rocket className="w-4 h-4 text-white" />
      </div>
      <span className="text-lg font-bold text-white">Career<span className="text-blue-400">Craft</span></span>
    </Link>

    <div className="space-y-1 text-center md:text-left">
      <h2 className="text-2xl font-bold tracking-tight text-white">
        {isRegister ? "Create account" : "Welcome back"}
      </h2>
      <p className="text-white/60 text-xs">
        {isRegister ? "Start your journey today." : "Sign in to continue."}
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-3">
      {isRegister && (
        <div className="space-y-1">
          <Label htmlFor="name" className="text-xs text-white/80">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              id="name"
              className="pl-10 h-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 text-sm focus:border-primary/50"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required={isRegister}
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="email" className="text-xs text-white/80">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            id="email"
            type="email"
            className="pl-10 h-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 text-sm focus:border-primary/50"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-xs text-white/80">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            className="pl-10 pr-10 h-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 text-sm focus:border-primary/50"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isRegister && (
        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-xs text-white/80">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              id="confirmPassword"
              type="password"
              className="pl-10 h-10 bg-white/10 border-white/10 text-white placeholder:text-white/30 text-sm focus:border-primary/50"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
        </div>
      )}

      {!isRegister && (
        <div className="flex justify-end">
          <Link to="/auth/forgot-password" className="text-xs text-white/60 hover:text-white hover:underline transition-colors">Forgot password?</Link>
        </div>
      )}

      <Button type="submit" className="w-full h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-primary/25 transition-all text-sm border-0" disabled={isLoading}>
        {isLoading ? "Processing..." : (isRegister ? "Create Account" : "Sign In")}
        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
      </Button>
    </form>

    <div className="relative my-3">
      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
      <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-black/40 px-2 text-white/40 backdrop-blur-md rounded-full border border-white/5">Or continue with</span></div>
    </div>

    <div className="grid grid-cols-1 gap-2"> {/* Changed to grid-cols-1 since only one button */}
      <Button
        variant="outline"
        type="button" // Ensure it doesn't submit form
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="h-9 bg-white/5 hover:bg-white/10 border-white/10 text-white text-xs hover:text-white transition-all w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
        {isLoading ? "Connecting..." : "Continue with Google"}
      </Button>
      {/* GitHub button removed */}
    </div>

    <div className="text-center text-xs text-white/50 mt-2">
      {isRegister ? "Already have an account?" : "Don't have an account?"} <button type="button" onClick={handleToggleMode} className="text-blue-400 font-bold hover:underline hover:text-blue-300 transition-colors">{isRegister ? "Sign in" : "Sign up"}</button>
    </div>
  </div>
);

export default Auth;
