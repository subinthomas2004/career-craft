import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTypingEngine, TypingConfig } from '@/lib/typing/engine';
import { getRankedText } from '@/lib/typing/data';
import { TypingArea } from './TypingArea';
import { ConfigPanel } from './ConfigPanel';
import { LiveStats } from './LiveStats';
import { ResultsDashboard } from './ResultsDashboard';
import { Leaderboard } from './Leaderboard';
import { PersonalProgress } from './PersonalProgress';
import { Keyboard, Trophy, Zap, Play, Timer, Target, Users, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

export const TypingTestContainer = () => {
    const [isRankedMode, setIsRankedMode] = useState(false);
    const [rankedStarted, setRankedStarted] = useState(false); // Whether user clicked "Start Ranked Test"
    const [config, setConfig] = useState<TypingConfig>({
        duration: 60,
        mode: 'general',
        difficulty: 'intermediate'
    });

    // Override config for ranked mode
    const activeConfig: TypingConfig = isRankedMode
        ? { duration: 180, mode: 'general', difficulty: 'professional', overrideText: getRankedText() }
        : config;

    const { state, resetTest, pauseTest, resumeTest, handleKeyPress } = useTypingEngine(activeConfig);
    const [isFocused, setIsFocused] = useState(false);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when content changes
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [state.status, state.typed, isRankedMode, rankedStarted]);

    // Global key handler — only when ranked test is started or in practice mode
    useEffect(() => {
        const handleWindowKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }
            if (state.status === 'finished') return;
            // In ranked mode, don't accept keys until user clicks start
            if (isRankedMode && !rankedStarted) return;
            if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
                return;
            }
            if (!isFocused) setIsFocused(true);
            if (e.key === ' ' && isFocused) {
                e.preventDefault();
            }
            handleKeyPress(e.key);
        };

        window.addEventListener('keydown', handleWindowKeyDown);
        return () => window.removeEventListener('keydown', handleWindowKeyDown);
    }, [handleKeyPress, state.status, isFocused, isRankedMode, rankedStarted]);

    // Calculate consistency score using coefficient of variation
    const getConsistencyScore = (): number => {
        const wpms = state.history.map(h => h.wpm).filter(w => w > 0);
        if (wpms.length < 2) return 100;
        const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
        if (mean === 0) return 0;
        const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / mean) * 100;
        return Math.max(0, Math.min(100, Math.round(100 - cv)));
    };

    // Record Activity & Save to DB on Finish
    useEffect(() => {
        if (state.status === 'finished') {
            const consistencyScore = getConsistencyScore();
            const saveResults = async () => {
                try {
                    const userInfo = localStorage.getItem("userInfo");
                    if (!userInfo) return;

                    const { token } = JSON.parse(userInfo);
                    const headers = { Authorization: `Bearer ${token}` };

                    await api.post('/auth/activity', {
                        title: `Typing Test: ${isRankedMode ? 'Ranked' : activeConfig.mode.charAt(0).toUpperCase() + activeConfig.mode.slice(1)}`,
                        activityType: 'typing',
                        score: `${state.wpm} WPM`
                    }, { headers });

                    if (isRankedMode) {
                        const { data } = await api.post('/typing/ranked', {
                            wpm: state.wpm,
                            accuracy: state.accuracy,
                            consistency: consistencyScore
                        }, { headers });
                        setUserRank(data.userRank);
                    }

                    await api.post('/typing/history', {
                        mode: isRankedMode ? 'ranked' : activeConfig.mode,
                        difficulty: activeConfig.difficulty,
                        duration: activeConfig.duration,
                        wpm: state.wpm,
                        accuracy: state.accuracy,
                        consistency: consistencyScore,
                        errors: state.errors
                    }, { headers });

                    setRefreshTrigger(prev => prev + 1);
                } catch (err) {
                    console.error("Failed to save results", err);
                }
            };
            saveResults();
        }
    }, [state.status]);

    // Handle starting ranked test
    const handleStartRanked = () => {
        setRankedStarted(true);
        setIsFocused(true);
    };

    // Handle mode switch
    const handleSwitchMode = (ranked: boolean) => {
        setIsRankedMode(ranked);
        setRankedStarted(false);
        setUserRank(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-0">

            {/* Header */}
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

            {/* Mode Toggle — Practice vs Ranked */}
            {state.status !== 'running' && state.status !== 'paused' && state.status !== 'finished' && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => handleSwitchMode(false)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${!isRankedMode
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
                            }`}
                    >
                        <Zap className="w-4 h-4" /> Practice
                    </button>
                    <button
                        onClick={() => handleSwitchMode(true)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${isRankedMode
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/25'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
                            }`}
                    >
                        <Trophy className="w-4 h-4" /> Ranked
                    </button>
                </div>
            )}

            {/* ===== PRACTICE MODE IDLE ===== */}
            {!isRankedMode && state.status !== 'finished' && (
                <>
                    {/* Config Panel */}
                    <ConfigPanel
                        config={config}
                        onChange={setConfig}
                        disabled={state.status === 'running' || state.status === 'paused'}
                    />

                    {/* Typing Area */}
                    <Card className={`transition-all duration-300 ${state.status === 'running' ? 'shadow-lg ring-1 ring-primary/20' : 'shadow'}`}>
                        <CardContent className="p-6 md:p-10 min-h-[300px] flex flex-col">
                            <div className="flex items-center justify-between">
                                <LiveStats state={state} duration={activeConfig.duration} />
                                {state.status === 'idle' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); resetTest(); }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                                        title="New paragraph"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" /> New Text
                                    </button>
                                )}
                            </div>
                            <div
                                className="flex-1 mt-4 relative bg-muted/20 rounded-xl p-6 md:p-8 cursor-text border border-transparent hover:border-primary/10 transition-colors"
                                onClick={() => setIsFocused(true)}
                            >
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
                </>
            )}

            {/* ===== RANKED MODE IDLE (Instructions + Leaderboard + Start Button) ===== */}
            {isRankedMode && state.status === 'idle' && !rankedStarted && (
                <>
                    {/* Instructions Card */}
                    <Card className="border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 shadow-md">
                        <CardContent className="p-6 md:p-8 space-y-6">
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-2">
                                    <Trophy className="w-8 h-8 text-yellow-500" />
                                </div>
                                <h2 className="text-2xl font-bold">Ranked Typing Challenge</h2>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Compete against other users on the global leaderboard. Only the top 5 scores are displayed.
                                </p>
                            </div>

                            {/* Rules */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background/60 border">
                                    <Timer className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-semibold">180 Seconds</span>
                                    <span className="text-xs text-muted-foreground">Fixed duration</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background/60 border">
                                    <Target className="w-5 h-5 text-green-500" />
                                    <span className="text-sm font-semibold">Same Paragraph</span>
                                    <span className="text-xs text-muted-foreground">For all users</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background/60 border">
                                    <Users className="w-5 h-5 text-yellow-500" />
                                    <span className="text-sm font-semibold">Top 5 Only</span>
                                    <span className="text-xs text-muted-foreground">Best scores kept</span>
                                </div>
                            </div>

                            {/* Start Button */}
                            <div className="text-center">
                                <Button
                                    size="lg"
                                    onClick={handleStartRanked}
                                    className="px-10 py-6 text-lg rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg shadow-yellow-500/25 transition-all hover:shadow-xl hover:shadow-yellow-500/30"
                                >
                                    <Play className="w-5 h-5 mr-2" /> Start Ranked Test
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leaderboard — shown below instructions in ranked idle */}
                    <Leaderboard refreshTrigger={refreshTrigger} />
                </>
            )}

            {/* ===== RANKED MODE — Test Started (typing area) ===== */}
            {isRankedMode && (rankedStarted || state.status === 'running' || state.status === 'paused') && state.status !== 'finished' && (
                <Card className={`transition-all duration-300 ${state.status === 'running' ? 'shadow-lg ring-1 ring-primary/20' : 'shadow'}`}>
                    <CardContent className="p-6 md:p-10 min-h-[300px] flex flex-col">
                        <LiveStats state={state} duration={activeConfig.duration} />
                        <div
                            className="flex-1 mt-4 relative bg-muted/20 rounded-xl p-6 md:p-8 cursor-text border border-transparent hover:border-primary/10 transition-colors"
                            onClick={() => setIsFocused(true)}
                        >
                            {state.status === 'idle' && (
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
            )}

            {/* ===== FINISHED STATE ===== */}
            {state.status === 'finished' && (
                <>
                    <ResultsDashboard
                        state={state}
                        config={activeConfig}
                        onRestart={() => { resetTest(); setUserRank(null); setRankedStarted(false); }}
                        isRankedMode={isRankedMode}
                        consistencyScore={getConsistencyScore()}
                    />

                    {/* Leaderboard — ONLY for ranked mode */}
                    {isRankedMode && (
                        <Leaderboard userRank={userRank} refreshTrigger={refreshTrigger} />
                    )}

                    {/* Personal Progress — always */}
                    <PersonalProgress refreshTrigger={refreshTrigger} />
                </>
            )}

            {/* Footer Hints — practice only */}
            {!isRankedMode && state.status === 'idle' && (
                <div className="text-center text-sm text-muted-foreground/60">
                    <p>Pro Tip: Accuracy matters more than raw speed. Fix errors with backspace — corrections remove the penalty!</p>
                </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={bottomRef} />
        </div>
    );
};
