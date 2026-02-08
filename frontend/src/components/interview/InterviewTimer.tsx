import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface InterviewTimerProps {
  isRunning: boolean;
}

const InterviewTimer = ({ isRunning }: InterviewTimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span className="font-mono text-sm">{formatTime(seconds)}</span>
    </div>
  );
};

export default InterviewTimer;
