import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Spline from '@splinetool/react-spline';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const ForgotPassword = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [otp, setOtp] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            await axios.post(
                'http://localhost:5003/api/auth/forgot-password',
                { email },
                config
            );

            // Open dialog instead of just showing success message
            setIsSent(true);
            setIsDialogOpen(true);
            toast({
                title: "OTP Sent",
                description: "Please check your email and enter the OTP.",
            });
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

    const handleVerifyOtp = () => {
        if (otp.length !== 6) {
            toast({
                title: "Invalid OTP",
                description: "Please enter a 6-digit OTP.",
                variant: "destructive",
            });
            return;
        }
        // Navigate to Reset Password page with email AND otp in state
        navigate('/auth/reset-password', { state: { email, otp } });
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
                        <h1 className="text-2xl font-bold">Forgot Password?</h1>
                        <p className="text-white/60 text-sm">
                            {isSent
                                ? "We've sent a password reset link to your email."
                                : "Enter your email address to reset your password."}
                        </p>
                    </div>

                    {!isSent ? (
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
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
                                Please check your email inbox and spam folder.
                                <br />
                                <Button variant="link" onClick={() => setIsDialogOpen(true)} className="text-green-200 underline mt-2">
                                    Click here to enter OTP
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <Link to="/auth" className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* OTP Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md bg-black/80 border-white/10 backdrop-blur-xl text-white">
                    <DialogHeader>
                        <DialogTitle>Enter Verification Code</DialogTitle>
                        <DialogDescription className="text-white/60">
                            We have sent a 6-digit code to <strong>{email}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-4">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className="border-white/20 text-white" />
                                <InputOTPSlot index={1} className="border-white/20 text-white" />
                                <InputOTPSlot index={2} className="border-white/20 text-white" />
                                <InputOTPSlot index={3} className="border-white/20 text-white" />
                                <InputOTPSlot index={4} className="border-white/20 text-white" />
                                <InputOTPSlot index={5} className="border-white/20 text-white" />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto px-8"
                        >
                            Verify & Proceed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ForgotPassword;
