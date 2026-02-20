import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../lib/api';
import { InterviewEngine } from '../lib/interview/engine';
import { InterviewConfig, InterviewState, Question } from '../lib/interview/types';
import { useSpeechRecognition } from './useSpeechRecognition';

export const useInterviewSession = (config: InterviewConfig) => {
    const [engine, setEngine] = useState<InterviewEngine | null>(null);
    const [sessionState, setSessionState] = useState<InterviewState | null>(null);
    const [avatarState, setAvatarState] = useState<'idle' | 'talking' | 'listening'>('idle');
    const [isCodeQuestion, setIsCodeQuestion] = useState(false);

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
    // Track question counts per interviewer for dynamic length
    const questionCountRef = useRef({ hr: 0, tech: 0 });

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
    }, [config.domain, config.difficulty, config.interviewType]);

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
        questionCountRef.current = { hr: 0, tech: 0 }; // Reset counts

        const q = engine.startSession();
        console.log("Initial Question:", q);
        setSessionState({ ...engine.getState() });

        if (q) {
            console.log("Speaking question in 5s (giving user time to settle):", q.text);
            setTimeout(() => speakQuestion(q.text), 5000);
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
        setIsCodeQuestion(false);
    }, [stopListening]);

    const submitResponse = useCallback((overrideAnswer?: string) => {
        if (!engine) return;

        // Stop listening immediately to prevent transcript pollution
        stopListening();
        setAvatarState('idle');
        setIsCodeQuestion(false); // Reset code question flag

        // Use override if provided, else use transcript
        const answer = overrideAnswer || transcript;

        // Submit to engine to save history with metrics
        // 1. Calculate WPM
        const wordCount = answer.split(' ').length;
        const durationInMin = 10 / 60; // Approximating 10s or using real duration if tracked
        const wpm = Math.round(wordCount / durationInMin);

        // 2. Count Fillers (Regex for common fillers)
        const fillers = (answer.match(/\b(um|uh|like|you know|sort of)\b/gi) || []).length;

        // 3. Pause Duration
        const pauseDuration = 2;

        engine.submitAnswer(answer, 10, { wpm, fillerCount: fillers, pauseDuration });
        resetTranscript();

        const fetchNextQuestion = async () => {
            // DYNAMIC FLOW: Use Groq API when resume is provided (both modes)
            if (config.resumeText && config.resumeText.length > 10) {
                try {
                    const history = engine.getState().history.flatMap(h => [
                        { role: 'assistant', content: h.question.text },
                        { role: 'user', content: h.answer }
                    ]);

                    // For HR Only and Intro Prep: always 'hr'. For HR+Tech: alternate based on interviewer
                    const currentInterviewer = engine.getState().currentInterviewer;
                    const nextType = (config.interviewType === 'hr' || config.interviewType === 'intro-prep')
                        ? 'hr'
                        : (currentInterviewer === 'hr_manager' ? 'hr' : 'technical');

                    // Track question counts
                    if (nextType === 'hr') {
                        questionCountRef.current.hr++;
                    } else {
                        questionCountRef.current.tech++;
                    }

                    const { data } = await api.post('/groq/interview/question', {
                        resumeText: config.resumeText,
                        history: history,
                        type: nextType,
                        domain: config.domain,
                        interviewType: config.interviewType,
                        questionCount: nextType === 'hr'
                            ? questionCountRef.current.hr
                            : questionCountRef.current.tech
                    });

                    if (data.success && data.question) {
                        // Check for Termination Signal
                        if (data.question.includes("[END_INTERVIEW]")) {
                            const closingMessage = data.question.replace("[END_INTERVIEW]", "").trim();
                            const nextQ = engine.setNextQuestionFromExternal(closingMessage);
                            setSessionState({ ...engine.getState() });
                            setTimeout(() => speakQuestion(closingMessage), 500);
                            // Schedule disconnect after speech (approx)
                            setTimeout(() => {
                                endSession();
                            }, 5000 + (closingMessage.length * 50));
                            return;
                        }

                        // Check for coding question
                        if (data.isCodeQuestion) {
                            setIsCodeQuestion(true);
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

    }, [engine, transcript, stopListening, resetTranscript, speakQuestion, config, endSession]);

    // Submit code and get AI analysis, then proceed to next question
    const submitCode = useCallback(async (code: string, language: string) => {
        if (!engine) return;

        stopListening();
        setAvatarState('idle');
        setIsCodeQuestion(false);

        const currentQuestion = engine.getState().currentQuestion?.text || '';

        // Submit the code as the answer to the engine
        const formattedAnswer = `[Submitted Code - ${language}]\n${code}`;

        // Save to engine history
        engine.submitAnswer(formattedAnswer, 15, { wpm: 0, fillerCount: 0, pauseDuration: 0 });
        resetTranscript();

        try {
            // Analyze the code via Groq
            const { data: analysisData } = await api.post('/groq/interview/analyze-code', {
                code,
                language,
                question: currentQuestion,
                resumeText: config.resumeText,
                domain: config.domain
            });

            if (analysisData.success && analysisData.feedback) {
                // Speak the code feedback
                const feedbackQ = engine.setNextQuestionFromExternal(analysisData.feedback);
                setSessionState({ ...engine.getState() });
                setTimeout(() => speakQuestion(feedbackQ.text), 500);
            } else {
                // Fallback: just move to next question
                submitResponse(formattedAnswer);
            }
        } catch (error) {
            console.error("Code analysis failed, using as regular answer", error);
            // Fallback: Pass code as a regular text answer for the next question flow
            const history = engine.getState().history.flatMap(h => [
                { role: 'assistant', content: h.question.text },
                { role: 'user', content: h.answer }
            ]);

            try {
                const { data } = await api.post('/groq/interview/question', {
                    resumeText: config.resumeText,
                    history,
                    type: 'technical',
                    domain: config.domain,
                    questionCount: questionCountRef.current.tech
                });

                if (data.success && data.question) {
                    const nextQ = engine.setNextQuestionFromExternal(data.question);
                    setSessionState({ ...engine.getState() });
                    setTimeout(() => speakQuestion(nextQ.text), 1500);
                }
            } catch (fallbackError) {
                console.error("Fallback question fetch also failed", fallbackError);
                const nextQ = engine.getNextQuestion();
                setSessionState({ ...engine.getState() });
                if (nextQ) setTimeout(() => speakQuestion(nextQ.text), 1500);
            }
        }
    }, [engine, stopListening, resetTranscript, speakQuestion, config, submitResponse]);

    return {
        ready: !!engine && voices.length > 0, // Wait for voices? optional.
        sessionState,
        avatarState,
        currentTranscript: interimTranscript || transcript,
        isCodeQuestion,
        startSession,
        endSession, // Exported
        submitResponse,
        submitCode,
        isListening,
        startListening,
        stopListening
    };
};
