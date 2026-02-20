import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Rocket, KeyRound, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import Spline from '@splinetool/react-spline';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
        if (location.state?.otp) {
            setOtp(location.state.otp);
        }
    }, [location.state]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            await api.post(
                '/auth/reset-password',
                { email, otp, password }
            );

            toast({
                title: "Success",
                description: "Password reset successfully. You can now login.",
            });

            navigate("/auth");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    /* 
     * Enhanced Glassmorphism for Dark Backgrounds
     */
    const glassPageClass = `
    relative w-full h-full flex flex-col justify-center
    bg-black/60 backdrop-blur-xl backdrop-saturate-150
    border border-white/10
    shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
    overflow-hidden
    text-white
  `;

    return (
        <div className="min-h-screen bg-black/90 relative overflow-hidden flex items-center justify-center p-4">
            {/* Spline Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="w-full h-full scale-[1.25] origin-center">
                    <Spline
                        scene="https://prod.spline.design/SORNV1gVuL2J1f0M/scene.splinecode"
                        className="w-full h-full"
                    />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-md p-8 rounded-[2rem] ${glassPageClass} !h-auto z-10`}
            >
                <div className="space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/50">
                            <Rocket className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">Reset Password</h1>
                        <p className="text-white/60 text-sm">
                            Enter the OTP sent to your email and your new password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs text-white/80">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                                <Input
                                    id="email"
                                    type="email"
                                    className="pl-10 bg-white/5 border-white/10 text-white"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    readOnly={!!location.state?.email} // Make read-only if passed from previous page
                                />
                            </div>
                        </div>

                        {!location.state?.otp && (
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-xs text-white/80">OTP Code</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                                    <Input
                                        id="otp"
                                        type="text"
                                        className="pl-10 bg-white/5 border-white/10 text-black font-mono tracking-widest text-center text-lg"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength={6}
                                        style={{ color: 'white' }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs text-white/80">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-10 bg-white/5 border-white/10 text-white"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-xs text-white/80">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    className="pl-10 bg-white/5 border-white/10 text-white"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>

                    <div className="text-center">
                        <Link to="/auth" className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
