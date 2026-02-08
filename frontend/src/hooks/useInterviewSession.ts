import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../lib/api';
import { InterviewEngine } from '../lib/interview/engine';
import { InterviewConfig, InterviewState, Question } from '../lib/interview/types';
import { useSpeechRecognition } from './useSpeechRecognition';

export const useInterviewSession = (config: InterviewConfig) => {
    const [engine, setEngine] = useState<InterviewEngine | null>(null);
    const [sessionState, setSessionState] = useState<InterviewState | null>(null);
    const [avatarState, setAvatarState] = useState<'idle' | 'talking' | 'listening'>('idle');

    const {
        transcript,
        interimTranscript,
        isListening,
        startListening,
        stopListening,
        resetTranscript,
    } = useSpeechRecognition();

    // Refs for cleanup
    const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isSessionActiveRef = useRef(false);

    // Voice Loading
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            if (available.length) {
                setVoices(available);
            }
        };

        loadVoices();

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    // Initialize Engine
    useEffect(() => {
        const newEngine = new InterviewEngine(config);
        setEngine(newEngine);
        setSessionState(newEngine.getState());
    }, [config.domain, config.difficulty]);

    const speakQuestion = useCallback((text: string) => {
        if (!('speechSynthesis' in window) || !isSessionActiveRef.current) return;

        // Stop any current speech and clear previous timeouts
        window.speechSynthesis.cancel();
        if (safetyTimeoutRef.current) {
            clearTimeout(safetyTimeoutRef.current);
            safetyTimeoutRef.current = null;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // onstart is more accurate for sync
        utterance.onstart = () => {
            setAvatarState('talking');
        };

        // Robust Voice Selection
        let selectedVoice = null;
        const currentInterviewer = engine?.getState().currentInterviewer;

        if (voices.length > 0) {
            if (currentInterviewer === 'hr_manager') {
                // FEMALE VOICE (Sarah) - Priority Order
                const preference = [
                    'Google US English',
                    'Samantha',
                    'Victoria',
                    'Microsoft Zira',
                    'Google UK English Female'
                ];

                // Try favorites first
                for (const name of preference) {
                    selectedVoice = voices.find(v => v.name.includes(name));
                    if (selectedVoice) break;
                }

                // Fallback to any female
                if (!selectedVoice) {
                    selectedVoice = voices.find(v =>
                        v.name.toLowerCase().includes('female') ||
                        v.name.toLowerCase().includes('woman')
                    );
                }
            } else {
                // MALE VOICE (David) - Priority Order
                const preference = [
                    'Google UK English Male',
                    'Daniel',
                    'Microsoft David',
                    'Alex'
                ];

                for (const name of preference) {
                    selectedVoice = voices.find(v => v.name.includes(name));
                    if (selectedVoice) break;
                }

                // Fallback to any male or generic not-sarah
                if (!selectedVoice) {
                    selectedVoice = voices.find(v =>
                        v.name.toLowerCase().includes('male') &&
                        !v.name.toLowerCase().includes('female')
                    );
                }
            }
        }

        // Ultimate fallback if specific search failed but we have voices
        if (!selectedVoice && voices.length > 0) {
            // Default: 0 for HR, 1 for Tech (if available)
            selectedVoice = currentInterviewer === 'hr_manager' ? voices[0] : (voices[1] || voices[0]);
        }

        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        let hasEnded = false;

        const finishSpeaking = () => {
            if (hasEnded) return;
            hasEnded = true;

            // MANUAL MODE: Do NOT auto-start listening.
            // Just set state to idle so user can click "Start"
            setAvatarState('idle');
        };

        utterance.onend = finishSpeaking;
        utterance.onerror = (e) => {
            console.error("Speech error", e);
            finishSpeaking();
        };

        // Failsafe: If text is short, it should end quickly. If long, longer.
        const wordCount = text.split(' ').length;
        // Calculate based on slow speech (100 wpm) to avoid cutting off early + 4s buffer
        const estimatedDurationMs = (wordCount / 100) * 60 * 1000 + 4000;

        // SAFETY: Force listening start if the event doesn't fire within expected time + buffer
        safetyTimeoutRef.current = setTimeout(() => {
            if (!hasEnded) {
                console.warn("Speech synthesis 'onend' timed out - forcing listening state.");
                finishSpeaking();
            }
        }, estimatedDurationMs);

        window.speechSynthesis.speak(utterance);
    }, [startListening, engine, voices]);

    const startSession = useCallback(() => {
        console.log("Starting Session...");
        if (!engine) {
            console.error("Engine not initialized");
            return;
        }
        isSessionActiveRef.current = true; // Mark session as active

        const q = engine.startSession();
        console.log("Initial Question:", q);
        setSessionState({ ...engine.getState() });

        if (q) {
            console.log("Speaking question in 1s:", q.text);
            setTimeout(() => speakQuestion(q.text), 1000);
        }
    }, [engine, speakQuestion]);

    const endSession = useCallback(() => {
        isSessionActiveRef.current = false; // Mark session as inactive

        // Stop Speech
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        // Clear Safety Timeout
        if (safetyTimeoutRef.current) {
            clearTimeout(safetyTimeoutRef.current);
            safetyTimeoutRef.current = null;
        }

        // Stop Listening
        stopListening();
        setAvatarState('idle');
    }, [stopListening]);

    const submitResponse = useCallback((overrideAnswer?: string) => {
        if (!engine) return;

        // Stop listening immediately to prevent transcript pollution
        stopListening();
        setAvatarState('idle');

        // Use override if provided, else use transcript
        const answer = overrideAnswer || transcript;

        // Submit to engine to save history with metrics
        // 1. Calculate WPM
        const wordCount = answer.split(' ').length;
        const durationInMin = 10 / 60; // Approximating 10s or using real duration if tracked
        const wpm = Math.round(wordCount / durationInMin);

        // 2. Count Fillers (Regex for common fillers)
        const fillers = (answer.match(/\b(um|uh|like|you know|sort of)\b/gi) || []).length;

        // 3. Pause Duration (Time since question ended until speaking started)
        // We need to track this better, but for now defaulting to estimated reaction time
        const pauseDuration = 2;

        engine.submitAnswer(answer, 10, { wpm, fillerCount: fillers, pauseDuration });
        resetTranscript();

        const fetchNextQuestion = async () => {
            // DYNAMIC FLOW: Use Groq API if resume is provided
            if (config.resumeText && config.resumeText.length > 10) {
                try {
                    const history = engine.getState().history.flatMap(h => [
                        { role: 'assistant', content: h.question.text },
                        { role: 'user', content: h.answer }
                    ]);

                    const { data } = await api.post('/groq/interview/question', {
                        resumeText: config.resumeText,
                        history: history,
                        type: (engine.getState().currentInterviewer === 'hr_manager' || !config.domain) ? 'hr' : 'technical',
                        domain: config.domain
                    });

                    if (data.success && data.question) {
                        // Check for Termination Signal
                        if (data.question.includes("[END_INTERVIEW]")) {
                            const closingMessage = data.question.replace("[END_INTERVIEW]", "").trim();
                            setTimeout(() => speakQuestion(closingMessage), 500);
                            // Schedule disconnect after speech (approx)
                            setTimeout(() => {
                                endSession();
                                // Optional: Show toast or completion modal context
                            }, 5000 + (closingMessage.length * 50));
                            return;
                        }

                        const nextQ = engine.setNextQuestionFromExternal(data.question);
                        setSessionState({ ...engine.getState() });
                        setTimeout(() => speakQuestion(nextQ.text), 1500);
                        return;
                    }
                } catch (error) {
                    console.error("Failed to fetch dynamic question, falling back to static", error);
                }
            }

            // STATIC FLOW (Fallback or default)
            const nextQ = engine.getNextQuestion();
            setSessionState({ ...engine.getState() });

            if (nextQ) {
                setTimeout(() => speakQuestion(nextQ.text), 1500);
            } else {
                setAvatarState('idle');
            }
        };

        fetchNextQuestion();

    }, [engine, transcript, stopListening, resetTranscript, speakQuestion, config]);

    return {
        ready: !!engine && voices.length > 0, // Wait for voices? optional.
        sessionState,
        avatarState,
        currentTranscript: interimTranscript || transcript,
        startSession,
        endSession, // Exported
        submitResponse,
        isListening,
        startListening,
        stopListening
    };
};
