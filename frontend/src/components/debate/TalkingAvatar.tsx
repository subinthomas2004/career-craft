import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TalkingAvatarProps {
    isSpeaking: boolean;
    stance: 'Pro' | 'Con';
}

export const TalkingAvatar = ({ isSpeaking, stance }: TalkingAvatarProps) => {
    const [blink, setBlink] = useState(false);

    // Random blinking effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 200);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    // Mouth animation variants
    const mouthVariants = {
        idle: {
            scaleY: 0.1,
            transition: { duration: 0.5 }
        },
        speaking: {
            scaleY: [0.1, 0.5, 0.2, 0.6, 0.1], // Random-ish movement
            transition: {
                duration: 0.4,
                repeat: Infinity,
                repeatType: "loop" as const,
                ease: "easeInOut" as const
            }
        }
    };

    const color = stance === 'Pro' ? 'bg-green-500' : 'bg-red-500';
    const shadowColor = stance === 'Pro' ? 'shadow-green-500/50' : 'shadow-red-500/50';

    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-[60px] opacity-20 ${color}`} />

            {/* Head Container */}
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-40 h-40 bg-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-between p-4 z-10 border border-slate-100"
            >
                {/* Antenna */}
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-6 bg-slate-200 rounded-full flex flex-col items-center`}>
                    <div className={`w-4 h-4 rounded-full ${color} shadow-[0_0_15px_rgba(0,0,0,0.3)] animate-pulse`} />
                </div>

                {/* Eyes Container */}
                <div className="flex gap-8 mt-8">
                    {/* Left Eye */}
                    <div className="relative w-10 h-10 bg-slate-900 rounded-full overflow-hidden flex items-center justify-center group">
                        <motion.div
                            animate={{ scaleY: blink ? 0.1 : 1 }}
                            className={`w-3 h-3 rounded-full ${color} shadow-[0_0_10px_currentColor]`}
                        />
                    </div>
                    {/* Right Eye */}
                    <div className="relative w-10 h-10 bg-slate-900 rounded-full overflow-hidden flex items-center justify-center">
                        <motion.div
                            animate={{ scaleY: blink ? 0.1 : 1 }}
                            className={`w-3 h-3 rounded-full ${color} shadow-[0_0_10px_currentColor]`}
                        />
                    </div>
                </div>

                {/* Mouth */}
                <div className="w-20 h-12 flex items-center justify-center mb-4">
                    <motion.div
                        variants={mouthVariants}
                        animate={isSpeaking ? "speaking" : "idle"}
                        className={`w-full h-8 bg-slate-800 rounded-full overflow-hidden relative`}
                    >
                        {/* Tongue/Inside */}
                        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-10 h-4 bg-red-400 rounded-full opacity-50" />
                    </motion.div>
                </div>

                {/* Ear muffs / Side details */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-12 bg-slate-200 rounded-l-lg border-r border-slate-300" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-12 bg-slate-200 rounded-r-lg border-l border-slate-300" />

            </motion.div>

            {/* Neck */}
            <div className="absolute bottom-0 w-16 h-8 bg-slate-300 rounded-b-xl z-0 -mb-6" />
        </div>
    );
};
