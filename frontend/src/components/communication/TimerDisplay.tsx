import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
    duration: number; // in seconds
    isActive: boolean;
    onTimeUp: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ duration, isActive, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        onTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    const progress = ((duration - timeLeft) / duration) * 100;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (circumference * (100 - progress)) / 100;

    const isUrgent = timeLeft <= 10 && timeLeft > 0;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={cn(
                "relative w-20 h-20 transition-all",
                isUrgent && "animate-pulse"
            )}>
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="40" cy="40" r="36"
                        stroke="currentColor" strokeWidth="4" fill="transparent"
                        className="text-gray-200"
                    />
                    <circle
                        cx="40" cy="40" r="36"
                        stroke="currentColor" strokeWidth="4" fill="transparent"
                        className={cn(
                            'transition-all duration-1000',
                            isUrgent ? 'text-red-500' :
                                progress > 50 ? 'text-yellow-500' : 'text-purple-500'
                        )}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <span className={cn(
                    'absolute inset-0 flex items-center justify-center text-lg font-mono font-bold',
                    isUrgent ? 'text-red-600' : 'text-gray-800'
                )}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
            </div>
            {isActive && (
                <span className={cn(
                    'text-xs font-medium',
                    isUrgent ? 'text-red-500' : 'text-gray-500'
                )}>
                    {isUrgent ? 'Almost done!' : 'Time remaining'}
                </span>
            )}
            {timeLeft === 0 && (
                <span className="text-xs font-bold text-red-600 animate-bounce">Time's up!</span>
            )}
        </div>
    );
};

export default TimerDisplay;
