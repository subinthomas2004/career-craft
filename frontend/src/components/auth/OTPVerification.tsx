import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const OTPVerification = ({ email, onVerify, onBack, isLoading }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const handleResend = async () => {
    setResendLoading(true);
    
    // TODO: Implement actual resend OTP logic
    // Example with Supabase:
    // const { error } = await supabase.auth.resend({
    //   type: 'signup',
    //   email: email,
    // });
    
    setTimeout(() => {
      setResendLoading(false);
      setCountdown(60);
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });
      
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  const handleSubmit = () => {
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full text-white">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto border border-white/10 shadow-glow">
        <Mail className="w-8 h-8 text-blue-400" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Verify your email</h2>
        <p className="text-white/70">
          We've sent a 6-digit code to{" "}
          <span className="text-white font-medium">{email}</span>
        </p>
        <p className="text-yellow-400/90 text-xs font-medium mt-1">
          Please check your spam or junk folder if you don't see the email in your inbox.
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center">
        <InputOTP
          value={otp}
          onChange={setOtp}
          maxLength={6}
          className="gap-2"
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-12 h-14 text-lg border border-white/20 bg-white/5 text-white rounded-md"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleSubmit}
        className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white border-0 rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
        disabled={otp.length !== 6 || isLoading}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          "Verify Email"
        )}
      </Button>

      {/* Resend */}
      <div className="text-center">
        <p className="text-sm text-white/60">
          Didn't receive the code?{" "}
          {countdown > 0 ? (
            <span className="text-white">Resend in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              {resendLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
              Resend code
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
