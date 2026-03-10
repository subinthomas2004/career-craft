import { useState, useEffect, useCallback, useRef } from 'react';
import { TypingMode, Difficulty, Duration, getRandomText } from './data';

export interface TypingState {
    status: 'idle' | 'running' | 'paused' | 'finished';
    text: string;
    typed: string;
    timeLeft: number;
    wpm: number;
    accuracy: number;
    errors: number;
    totalChars: number;
    cursorPosition: number;
    startTime: number | null;
    history: { wpm: number; time: number }[];
    missedKeys: Record<string, number>; // New: Track specific keys missed
}

export interface TypingConfig {
    duration: number; // in seconds
    mode: TypingMode;
    difficulty: Difficulty;
    overrideText?: string; // For ranked mode — use this text instead of random
}

export const useTypingEngine = (config: TypingConfig) => {
    const [state, setState] = useState<TypingState>({
        status: 'idle',
        text: '',
        typed: '',
        timeLeft: config.duration,
        wpm: 0,
        accuracy: 100,
        errors: 0,
        totalChars: 0,
        cursorPosition: 0,
        startTime: null,
        history: [],
        missedKeys: {},
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize text when config changes
    useEffect(() => {
        resetTest();
    }, [config.mode, config.difficulty, config.duration, config.overrideText]);

    const resetTest = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        const newText = config.overrideText || getRandomText(config.mode, config.difficulty, config.duration as Duration);
        setState({
            status: 'idle',
            text: newText,
            typed: '',
            timeLeft: config.duration,
            wpm: 0,
            accuracy: 100,
            errors: 0,
            totalChars: 0,
            cursorPosition: 0,
            startTime: null,
            history: [],
            missedKeys: {},
        });
    }, [config]);

    const startTest = useCallback(() => {
        if (state.status === 'running') return;

        setState(prev => ({ ...prev, status: 'running', startTime: Date.now() }));

        timerRef.current = setInterval(() => {
            setState(prev => {
                if (prev.timeLeft <= 1) {
                    finishTest();
                    return { ...prev, timeLeft: 0, status: 'finished' };
                }

                const elapsedTime = config.duration - (prev.timeLeft - 1);

                // Calculate WPM: (Correct chars / 5) / (minutes)
                // More standard formula: (All Typed Chars / 5) / Time ? 
                // Gross WPM = (All Typed / 5) / Time
                // Net WPM = Gross WPM - (Errors / Time)
                // Let's use Net WPM for the main display
                const minutes = elapsedTime / 60;
                const grossWpm = (prev.typed.length / 5) / minutes;
                const netWpm = Math.max(0, grossWpm - (prev.errors / minutes));

                return {
                    ...prev,
                    timeLeft: prev.timeLeft - 1,
                    wpm: Math.round(netWpm),
                    history: [...prev.history, { wpm: Math.round(netWpm), time: prev.timeLeft }]
                };
            });
        }, 1000);
    }, [state.status, config.duration]);

    const pauseTest = useCallback(() => {
        if (state.status !== 'running') return;
        if (timerRef.current) clearInterval(timerRef.current);
        setState(prev => ({ ...prev, status: 'paused' }));
    }, [state.status]);

    const resumeTest = useCallback(() => {
        if (state.status !== 'paused') return;
        startTest();
    }, [state.status, startTest]);

    const finishTest = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setState(prev => ({ ...prev, status: 'finished' }));
    }, []);

    const handleKeyPress = useCallback((key: string) => {
        if (state.status === 'finished') return;

        // Auto-start on first keypress if idle
        if (state.status === 'idle') {
            startTest();
        }

        setState(prev => {
            // If paused, ignore input
            if (prev.status === 'paused') return prev;

            let nextStatus = prev.status === 'idle' ? 'running' : prev.status;

            // Handle Backspace
            if (key === 'Backspace') {
                if (prev.typed.length === 0) return { ...prev, status: nextStatus };

                const newTyped = prev.typed.slice(0, -1);

                // Recalculate accuracy based on current snapshot (backspace-friendly)
                let correctCount = 0;
                for (let i = 0; i < newTyped.length; i++) {
                    if (newTyped[i] === prev.text[i]) correctCount++;
                }
                const newAccuracy = newTyped.length > 0
                    ? Math.max(0, Math.round((correctCount / newTyped.length) * 100))
                    : 100;

                // Count current errors (snapshot, not cumulative)
                const currentErrors = newTyped.length - correctCount;

                return {
                    ...prev,
                    status: nextStatus,
                    typed: newTyped,
                    cursorPosition: newTyped.length,
                    errors: currentErrors,
                    accuracy: newAccuracy,
                };
            }

            // Handle printable characters
            if (key.length === 1) {
                if (prev.typed.length >= prev.text.length) return prev;

                const newTyped = prev.typed + key;
                const index = prev.typed.length;
                const expectedChar = prev.text[index];
                const isCorrect = key === expectedChar;

                // Track missed keys
                const newMissedKeys = { ...prev.missedKeys };
                if (!isCorrect) {
                    const charShouldBe = expectedChar;
                    newMissedKeys[charShouldBe] = (newMissedKeys[charShouldBe] || 0) + 1;
                }

                // Calculate accuracy as snapshot (correct chars in current typed string)
                let correctCount = 0;
                for (let i = 0; i < newTyped.length; i++) {
                    if (newTyped[i] === prev.text[i]) correctCount++;
                }
                const currentErrors = newTyped.length - correctCount;
                const newAccuracy = newTyped.length > 0
                    ? Math.max(0, Math.round((correctCount / newTyped.length) * 100))
                    : 100;

                // Check completion
                if (newTyped.length === prev.text.length) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    finishTest();
                    return {
                        ...prev,
                        status: 'finished',
                        typed: newTyped,
                        cursorPosition: newTyped.length,
                        errors: currentErrors,
                        accuracy: newAccuracy,
                        missedKeys: newMissedKeys
                    };
                }

                return {
                    ...prev,
                    status: nextStatus,
                    typed: newTyped,
                    cursorPosition: newTyped.length,
                    errors: currentErrors,
                    accuracy: newAccuracy,
                    totalChars: prev.totalChars + 1,
                    missedKeys: newMissedKeys
                };
            }

            return prev;
        });

    }, [state.status, state.text, startTest, finishTest]);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return {
        state,
        resetTest,
        pauseTest,
        resumeTest,
        handleKeyPress
    };
};
