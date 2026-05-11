import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export type AvatarState = 'idle' | 'talking' | 'listening' | 'nodding';

interface AvatarPlayerProps {
    state: AvatarState;
    videoSet: {
        idle: string;
        talking: string;
        listening: string;
        nodding?: string;
    };
    isActive: boolean;
    className?: string;
}

const AvatarPlayer = ({ state, videoSet, isActive, className }: AvatarPlayerProps) => {
    // We keep the internal state logic for "Nodding" management
    const [internalState, setInternalState] = useState<AvatarState>(state);
    
    // Refs for explicit video control
    const videoRefs = {
        idle: useRef<HTMLVideoElement>(null),
        talking: useRef<HTMLVideoElement>(null),
        listening: useRef<HTMLVideoElement>(null),
        nodding: useRef<HTMLVideoElement>(null)
    };

    // Sync internal state with prop state
    useEffect(() => {
        setInternalState(state);
    }, [state]);

    // Ref to store timeouts for delayed pausing (prevents freezing during fade-out)
    const pauseTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

    // Sync Video Playback with state changes
    useEffect(() => {
        // Iterate through all states and explicitly start/stop their respective video nodes
        Object.entries(videoRefs).forEach(([key, ref]) => {
            const video = ref.current;
            if (!video) return;

            const isTarget = internalState === key;
            
            // Clear any scheduled pause for this video if it just became active
            if (pauseTimeoutsRef.current[key]) {
                clearTimeout(pauseTimeoutsRef.current[key]);
                delete pauseTimeoutsRef.current[key];
            }

            if (isTarget) {
                // Reset timeline immediately for start frame sync
                video.currentTime = 0;
                const playPromise = video.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        // Log only critical play errors
                        if (err.name !== "AbortError") console.warn(`Video play error for ${key}:`, err);
                    });
                }
            } else {
                // DELAY PAUSING: Wait 400ms so the 300ms CSS fade-out finishes gracefully
                // while the video keeps playing, avoiding an ugly frame freeze during transition.
                pauseTimeoutsRef.current[key] = setTimeout(() => {
                    if (video && !video.paused && internalState !== key) {
                        video.pause();
                    }
                }, 400);
            }
        });

        // Cleanup all timeouts on unmount
        return () => {
            Object.values(pauseTimeoutsRef.current).forEach(clearTimeout);
        };
    }, [internalState]);

    // Random Nodding Logic when Listening
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (state === 'listening' && isActive) {
            const scheduleNod = () => {
                const delay = Math.random() * 5000 + 3000; // Random delay between 3-8s
                timeout = setTimeout(() => {
                    if (videoSet.nodding) {
                        setInternalState('nodding');
                        setTimeout(() => {
                            setInternalState('listening');
                            scheduleNod(); // Schedule next nod
                        }, 2500);
                    }
                }, delay);
            };
            scheduleNod();
        }

        return () => clearTimeout(timeout);
    }, [state, isActive, videoSet.nodding]);

    // Helper to render a video layer
    const renderVideoLayer = (videoSrc: string | undefined, targetState: 'idle' | 'talking' | 'listening' | 'nodding', visible: boolean) => {
        if (!videoSrc) return null;

        return (
            <video
                key={targetState}
                ref={videoRefs[targetState]}
                src={videoSrc}
                loop
                playsInline
                muted
                preload="auto"
                className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-300", // 300ms smooth fade
                    visible ? "opacity-100 z-10" : "opacity-0 z-0"
                )}
            />
        );
    };

    return (
        <div className={cn("relative overflow-hidden rounded-2xl bg-black/5", className)}>

            {/* Render all video states simultaneously for instant switching */}

            {/* Idle - show when idle regardless of active status */}
            {renderVideoLayer(videoSet.idle, 'idle', internalState === 'idle')}

            {/* Talking */}
            {renderVideoLayer(videoSet.talking, 'talking', internalState === 'talking')}

            {/* Listening */}
            {renderVideoLayer(videoSet.listening, 'listening', internalState === 'listening')}

            {/* Nodding (falls back to listening if undefined) */}
            {renderVideoLayer(videoSet.nodding, 'nodding', internalState === 'nodding')}


            {/* Active Indicator Overlay */}
            {isActive && (
                <div className={cn(
                    "absolute top-4 right-4 w-3 h-3 z-50 rounded-full shadow-[0_0_10px_#22c55e] transition-all duration-300",
                    internalState === 'talking' ? "bg-green-500 animate-pulse" : "bg-green-500/50"
                )} />
            )}
        </div>
    );
};

export default AvatarPlayer;
