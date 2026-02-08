import { useState, useEffect, useCallback, useRef } from 'react';
import { TypingMode, Difficulty, getRandomText } from './data';

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
    }, [config.mode, config.difficulty, config.duration]);

    const resetTest = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        const newText = getRandomText(config.mode, config.difficulty);
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

                return {
                    ...prev,
                    status: nextStatus,
                    typed: newTyped,
                    cursorPosition: newTyped.length,
                    // note: we don't decrement errors here to be strict? 
                    // usually backspace fixes the error visually but the "error count" stat might remain
                    // or we can re-calc errors. Let's keep cumulative error count (did mistake once)
                    // but we might want "current uncorrected errors" vs "total errors made".
                    // 'errors' field currently logic is cumulative.
                };
            }

            // Handle printable characters
            if (key.length === 1) {
                if (prev.typed.length >= prev.text.length) return prev;

                const newTyped = prev.typed + key;
                const index = prev.typed.length;
                const expectedChar = prev.text[index];
                const isCorrect = key === expectedChar;

                const newErrors = isCorrect ? prev.errors : prev.errors + 1;

                // Track missed keys
                const newMissedKeys = { ...prev.missedKeys };
                if (!isCorrect) {
                    // Track the key that SHOULD have been typed
                    const charShouldBe = expectedChar;
                    newMissedKeys[charShouldBe] = (newMissedKeys[charShouldBe] || 0) + 1;
                }

                // Calculate Accuracy
                const totalTyped = newTyped.length;
                // Accuracy = (Total Typed - Total Errors) / Total Typed?
                // Or (Total Correct Keystrokes) / Total Keystrokes
                const correctTyped = totalTyped - newErrors; // rough approx
                const newAccuracy = totalTyped > 0
                    ? Math.max(0, Math.round(((totalTyped - newErrors) / totalTyped) * 100))
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
                        errors: newErrors,
                        accuracy: newAccuracy,
                        missedKeys: newMissedKeys
                    };
                }

                return {
                    ...prev,
                    status: nextStatus,
                    typed: newTyped,
                    cursorPosition: newTyped.length,
                    errors: newErrors,
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
