import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTypingEngine, TypingConfig } from '@/lib/typing/engine';
import { TypingArea } from './TypingArea';
import { ConfigPanel } from './ConfigPanel';
import { LiveStats } from './LiveStats';
import { ResultsDashboard } from './ResultsDashboard';
import { Keyboard } from 'lucide-react';
import { api } from '@/lib/api';

export const TypingTestContainer = () => {
    const [config, setConfig] = useState<TypingConfig>({
        duration: 60,
        mode: 'general',
        difficulty: 'intermediate'
    });

    const { state, resetTest, pauseTest, resumeTest, handleKeyPress } = useTypingEngine(config);
    const [isFocused, setIsFocused] = useState(false);

    // Global key handler
    useEffect(() => {
        const handleWindowKeyDown = (e: KeyboardEvent) => {
            // Ignore if some other input is focused (rudimentary check)
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            // If test finished, ignore
            if (state.status === 'finished') return;

            // Handle typical ignore keys
            if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
                return;
            }

            // Auto-focus logic: If user starts typing, we treat it as focused interaction
            if (!isFocused) setIsFocused(true);

            // Prevent default scrolling for Space if mostly focused on game
            if (e.key === ' ' && isFocused) {
                e.preventDefault();
            }

            handleKeyPress(e.key);
        };

        window.addEventListener('keydown', handleWindowKeyDown);
        return () => window.removeEventListener('keydown', handleWindowKeyDown);
    }, [handleKeyPress, state.status, isFocused]);

    // Record Activity on Finish
    useEffect(() => {
        if (state.status === 'finished') {
            const recordTypingActivity = async () => {
                try {
                    const userInfo = localStorage.getItem("userInfo");
                    if (userInfo) {
                        const { token } = JSON.parse(userInfo);
                        await api.post('/auth/activity', {
                            title: `Typing Test: ${config.mode.charAt(0).toUpperCase() + config.mode.slice(1)}`,
                            activityType: 'typing',
                            score: `${state.wpm} WPM`
                        });
                    }
                } catch (err) {
                    console.error("Failed to record activity", err);
                }
            };
            recordTypingActivity();
        }
    }, [state.status, config.mode, state.wpm]);


    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-0">

            {/* Header / Intro (Only show if not running to reduce clutter) */}
            {state.status === 'idle' && (
                <div className="text-center space-y-2 mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        Professional Typing Test
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Test your speed with industry-standard texts. Configure your environment below.
                    </p>
                </div>
            )}

            {/* Config Panel - Disabled while running */}
            {state.status !== 'finished' && (
                <ConfigPanel
                    config={config}
                    onChange={setConfig}
                    disabled={state.status === 'running' || state.status === 'paused'}
                />
            )}

            {/* Main Game Area */}
            {state.status !== 'finished' ? (
                <Card className={`transition-all duration-300 ${state.status === 'running' ? 'shadow-lg ring-1 ring-primary/20' : 'shadow'}`}>
                    <CardContent className="p-6 md:p-10 min-h-[300px] flex flex-col">
                        <LiveStats state={state} duration={config.duration} />

                        <div
                            className="flex-1 mt-4 relative bg-muted/20 rounded-xl p-6 md:p-8 cursor-text border border-transparent hover:border-primary/10 transition-colors"
                            onClick={() => {
                                // Focus 'dummy' input if we had one, for now just set visual focus
                                setIsFocused(true);
                            }}
                        >
                            {/* Visual cue if not focused potentially? For now global listener handles it */}
                            {!isFocused && state.status === 'idle' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px] z-10 rounded-xl">
                                    <div className="flex items-center gap-2 text-primary font-medium animate-pulse">
                                        <Keyboard className="w-5 h-5" /> Start typing to begin...
                                    </div>
                                </div>
                            )}

                            <TypingArea state={state} />
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <ResultsDashboard state={state} config={config} onRestart={resetTest} />
            )}

            {/* Footer Hints */}
            {state.status === 'idle' && (
                <div className="text-center text-sm text-muted-foreground/60">
                    <p>Pro Tip: Accuracy matters more than raw speed for the final score.</p>
                </div>
            )}

        </div>
    );
};
