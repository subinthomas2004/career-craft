import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
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
    <div className="space-y-8 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </button>

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-primary" />
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Verify your email</h2>
        <p className="text-muted-foreground">
          We've sent a 6-digit code to{" "}
          <span className="text-foreground font-medium">{email}</span>
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
          <InputOTPGroup>
            <InputOTPSlot index={0} className="w-12 h-14 text-lg border-border bg-background/50" />
            <InputOTPSlot index={1} className="w-12 h-14 text-lg border-border bg-background/50" />
            <InputOTPSlot index={2} className="w-12 h-14 text-lg border-border bg-background/50" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="w-12 h-14 text-lg border-border bg-background/50" />
            <InputOTPSlot index={4} className="w-12 h-14 text-lg border-border bg-background/50" />
            <InputOTPSlot index={5} className="w-12 h-14 text-lg border-border bg-background/50" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleSubmit}
        className="w-full h-12 text-base font-medium"
        disabled={otp.length !== 6 || isLoading}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
        ) : (
          "Verify Email"
        )}
      </Button>

      {/* Resend */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          {countdown > 0 ? (
            <span className="text-foreground">Resend in {countdown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-primary font-medium hover:underline inline-flex items-center gap-1"
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
