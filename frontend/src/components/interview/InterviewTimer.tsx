import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterviewTimerProps {
  isRunning: boolean;
  maxDurationSeconds?: number; // Default: 25 * 60 = 1500s
  onTimeUp?: () => void;
}

const InterviewTimer = ({ isRunning, maxDurationSeconds = 25 * 60, onTimeUp }: InterviewTimerProps) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(s => {
          const next = s + 1;
          if (next >= maxDurationSeconds) {
            if (interval) clearInterval(interval);
            onTimeUpRef.current?.();
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, maxDurationSeconds]);

  const remaining = Math.max(0, maxDurationSeconds - secondsElapsed);
  const isLowTime = remaining <= 120; // Under 2 minutes
  const isCritical = remaining <= 30; // Under 30 seconds

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500",
      isCritical ? "bg-red-500/20 text-red-500 animate-pulse" :
        isLowTime ? "bg-orange-500/15 text-orange-500" :
          "text-muted-foreground"
    )}>
      <Clock className="w-4 h-4" />
      <span className={cn(
        "font-mono text-sm font-semibold",
        isCritical && "text-red-500",
        isLowTime && !isCritical && "text-orange-500"
      )}>
        {formatTime(remaining)}
      </span>
    </div>
  );
};

export default InterviewTimer;
