import React from 'react';
import { TypingState } from '@/lib/typing/engine';
import { Timer, Zap, Target, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LiveStatsProps {
    state: TypingState;
    duration: number;
}

export const LiveStats: React.FC<LiveStatsProps> = ({ state, duration }) => {
    const progress = ((duration - state.timeLeft) / duration) * 100;

    return (
        <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm md:text-base">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-primary font-bold text-2xl">
                        <Timer className="w-5 h-5 opacity-70" />
                        <span>{state.timeLeft}s</span>
                    </div>
                    <div className="h-8 w-px bg-border mx-2 hidden md:block" />
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-0.5">
                                <Zap className="w-3 h-3" /> WPM
                            </div>
                            <span className="text-xl font-bold">{state.wpm}</span>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-0.5">
                                <Target className="w-3 h-3" /> Accuracy
                            </div>
                            <span className={`text-xl font-bold ${state.accuracy < 90 ? 'text-amber-500' : 'text-green-500'}`}>
                                {state.accuracy}%
                            </span>
                        </div>

                        <div className="flex flex-col hidden sm:flex">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-0.5">
                                <Activity className="w-3 h-3" /> Errors
                            </div>
                            <span className={`text-xl font-bold ${state.errors > 0 ? 'text-destructive' : 'text-foreground'}`}>
                                {state.errors}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar with smooth transition */}
            <Progress value={progress} className="h-1.5 transition-all duration-1000 ease-linear" />
        </div>
    );
};
