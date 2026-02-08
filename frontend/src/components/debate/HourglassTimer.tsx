import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface HourglassTimerProps {
    timeLeft: number;
    totalTime: number;
    className?: string;
}

export const HourglassTimer = ({ timeLeft, totalTime, className }: HourglassTimerProps) => {
    // Calculate percentage of time elapsed (0 to 100)
    // timeLeft goes from totalTime -> 0
    // We want "top sand" to go from 100% -> 0%
    // "bottom sand" goes from 0% -> 100%

    // Safety check just in case totalTime is 0
    const safeTotal = totalTime || 300;

    const percentage = Math.max(0, Math.min(100, (timeLeft / safeTotal) * 100));

    return (
        <div className={cn("relative flex flex-col items-center gap-1", className)}>
            {/* Hourglass Container */}
            <div className="relative w-10 h-16 md:w-12 md:h-20 drop-shadow-sm">

                {/* SVG Frame for Hourglass shape (Glass Container) */}
                <svg
                    viewBox="0 0 100 200"
                    className="w-full h-full z-20 relative pointer-events-none overflow-visible"
                >
                    <defs>
                        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                        </linearGradient>
                    </defs>

                    {/* Top Bulb */}
                    <path
                        d="M 10,10 L 90,10 L 90,80 Q 90,100 50,100 Q 10,100 10,80 Z"
                        fill="url(#glassGradient)"
                        stroke="#94a3b8"
                        strokeWidth="3"
                        className="backdrop-blur-[2px]"
                    />

                    {/* Bottom Bulb */}
                    <path
                        d="M 10,190 L 90,190 L 90,120 Q 90,100 50,100 Q 10,100 10,120 Z"
                        fill="url(#glassGradient)"
                        stroke="#94a3b8"
                        strokeWidth="3"
                        className="backdrop-blur-[2px]"
                    />
                </svg>

                {/* SAND LAYER (Inside the Glass) */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">

                    {/* Top Sand (Draining) */}
                    <div className="absolute top-[5%] w-[80%] h-[40%] overflow-hidden rounded-b-full">
                        {/* This div shrinks in height as time passes */}
                        <motion.div
                            className="bg-amber-400 w-full absolute top-0"
                            initial={{ height: "100%" }}
                            animate={{ height: `${percentage}%` }}
                            transition={{ duration: 1, ease: "linear" }}
                            style={{ borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%' }}
                        />
                    </div>

                    {/* The Stream (Only visible when time is running) */}
                    {timeLeft > 0 && timeLeft < safeTotal && (
                        <div className="absolute top-[45%] h-[10%] w-[2px] bg-amber-400 z-10 animate-pulse" />
                    )}

                    {/* Bottom Sand (Filling) */}
                    <div className="absolute bottom-[5%] w-[80%] h-[40%] flex items-end justify-center overflow-hidden rounded-t-full">
                        {/* This div grows in height */}
                        <motion.div
                            className="bg-amber-400 w-full rounded-t-full"
                            initial={{ height: "0%" }}
                            animate={{ height: `${100 - percentage}%` }}
                            transition={{ duration: 1, ease: "linear" }}
                        />
                    </div>

                </div>

            </div>

            {/* Digital Time Overlay */}
            <div className={cn("text-[10px] md:text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/80 backdrop-blur border border-slate-200 text-slate-600 shadow-sm", timeLeft < 60 && "text-red-500 border-red-200 bg-red-50")}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
        </div>
    );
};
