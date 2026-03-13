import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../lib/api';
import { InterviewEngine } from '../lib/interview/engine';
import { InterviewConfig, InterviewState, Question } from '../lib/interview/types';
import { useSpeechRecognition } from './useSpeechRecognition';

export const useInterviewSession = (config: InterviewConfig) => {
    const [engine, setEngine] = useState<InterviewEngine | null>(null);
    const [sessionState, setSessionState] = useState<InterviewState | null>(null);
    const [avatarState, setAvatarState] = useState<'idle' | 'talking' | 'listening'>('idle');
    const [spokenCharIndex, setSpokenCharIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
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
    const consecutiveCountRef = useRef({ hr: 0, tech: 0 });
    // Track start time for flexible interview pacing
    const sessionStartTimeRef = useRef<number | null>(null);

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
    }, [config.domain, config.difficulty, config.interviewType, config.jobRole]);

    const speakQuestion = useCallback((text: string): Promise<void> => {
        return new Promise((resolve) => {
            if (!('speechSynthesis' in window) || !isSessionActiveRef.current) {
                resolve();
                return;
            }

            // Stop any current speech and clear previous timeouts
            window.speechSynthesis.cancel();
            setSpokenCharIndex(0);
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
            selectedVoice = currentInterviewer === 'hr_manager' ? voices[0] : (voices[1] || voices[0]);
        }

        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        let hasEnded = false;

        const finishSpeaking = () => {
            if (hasEnded) return;
            hasEnded = true;
            setAvatarState('idle');
            resolve();
        };

        utterance.onend = finishSpeaking;
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                setSpokenCharIndex(event.charIndex);
            }
        };
        // Fallback for browsers with poor onboundary support:
        // Increment charIndex based on average reading speed if it hasn't updated
        const progressInterval = setInterval(() => {
            if (hasEnded) {
                clearInterval(progressInterval);
                return;
            }
            // If synthesis is speaking, slowly increment as a fallback
            if (window.speechSynthesis.speaking) {
                setSpokenCharIndex(prev => prev + 1);
            }
        }, 100);

        utterance.onerror = (e) => {
            console.error("Speech error", e);
            clearInterval(progressInterval);
            finishSpeaking();
        };

        // Failsafe timeout
        const wordCount = text.split(' ').length;
        const estimatedDurationMs = (wordCount / 100) * 60 * 1000 + 4000;

        safetyTimeoutRef.current = setTimeout(() => {
            clearInterval(progressInterval);
            if (!hasEnded) {
                console.warn("Speech synthesis 'onend' timed out - forcing listening state.");
                finishSpeaking();
            }
        }, estimatedDurationMs);

        window.speechSynthesis.speak(utterance);
        });
    }, [engine, voices]);

    const startSession = useCallback(() => {
        console.log("Starting Session...");
        if (!engine) {
            console.error("Engine not initialized");
            return;
        }
        isSessionActiveRef.current = true;
        questionCountRef.current = { hr: 0, tech: 0 };
        consecutiveCountRef.current = { hr: 0, tech: 0 };
        sessionStartTimeRef.current = Date.now();

        const q = engine.startSession();
        console.log("Initial Question:", q);
        setSessionState({ ...engine.getState() });

        if (q) {
            console.log("Speaking question in 5s (giving user time to settle):", q.text);
            setTimeout(() => speakQuestion(q.text), 5000);
        }
    }, [engine, speakQuestion]);

    const endSession = useCallback(() => {
        isSessionActiveRef.current = false;
        setSpokenCharIndex(0);

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

        // Stop listening immediately
        stopListening();
        setAvatarState('idle');
        setIsCodeQuestion(false);

        const answer = overrideAnswer || transcript;

        // Calculate speech metrics
        const wordCount = answer.split(' ').length;
        const durationInMin = 10 / 60;
        const wpm = Math.round(wordCount / durationInMin);
        const fillers = (answer.match(/\b(um|uh|like|you know|sort of)\b/gi) || []).length;
        const pauseDuration = 2;

        engine.submitAnswer(answer, 10, { wpm, fillerCount: fillers, pauseDuration });
        resetTranscript();

        const fetchNextQuestion = async () => {
            try {
                const history = engine.getState().history.flatMap(h => [
                    { role: 'assistant', content: h.question.text },
                    { role: 'user', content: h.answer }
                ]);

                const currentInterviewer = engine.getState().currentInterviewer;

                // Determine question type
                let nextType: string;
                if (config.interviewType === 'hr' || config.interviewType === 'intro-prep') {
                    nextType = 'hr';
                } else if (config.interviewType === 'technical') {
                    nextType = 'technical';
                } else {
                    // hr-tech: alternate based on current interviewer
                    nextType = currentInterviewer === 'hr_manager' ? 'hr' : 'technical';
                }

                // Track question counts
                if (nextType === 'hr') {
                    questionCountRef.current.hr++;
                    consecutiveCountRef.current.hr++;
                    consecutiveCountRef.current.tech = 0;
                } else {
                    questionCountRef.current.tech++;
                    consecutiveCountRef.current.tech++;
                    consecutiveCountRef.current.hr = 0;
                }

                // Compute elapsed time for soft pacing
                const elapsedMs = sessionStartTimeRef.current ? Date.now() - sessionStartTimeRef.current : 0;
                const elapsedMinutes = Math.floor(elapsedMs / 60000);

                const { data } = await api.post('/groq/interview/question', {
                    resumeText: config.resumeText || '',
                    history: history,
                    type: nextType,
                    domain: config.domain,
                    jobRole: config.jobRole || '',
                    interviewType: config.interviewType,
                    questionCount: nextType === 'hr'
                        ? questionCountRef.current.hr
                        : questionCountRef.current.tech,
                    consecutiveCount: nextType === 'hr'
                        ? consecutiveCountRef.current.hr
                        : consecutiveCountRef.current.tech,
                    elapsedMinutes: elapsedMinutes
                });

                if (data.success && data.question) {
                    // Check for Termination Signal
                    if (data.question.includes("[END_INTERVIEW]")) {
                        const closingMessage = data.question.replace("[END_INTERVIEW]", "").trim();
                        engine.setNextQuestionFromExternal(closingMessage);
                        setSessionState({ ...engine.getState() });
                        setTimeout(() => speakQuestion(closingMessage), 500);
                        // Schedule disconnect after speech
                        setTimeout(() => {
                            engine.endInterview();
                            setSessionState({ ...engine.getState() });
                            endSession();
                        }, 5000 + (closingMessage.length * 50));
                        return;
                    }

                    let questionText = data.question;

                    // Manual Failsafe override if LLM forgot to add [SWITCH] after 3 questions (ONLY in hr-tech mode)
                    const activeConsecutive = nextType === 'hr' ? consecutiveCountRef.current.hr : consecutiveCountRef.current.tech;
                    if (config.interviewType === 'hr-tech' && activeConsecutive >= 3 && !questionText.includes('[SWITCH]') && !questionText.includes('[END_INTERVIEW]')) {
                        console.log(`Forcing switch for ${nextType} after 3 consecutive questions`);
                        questionText += ' [SWITCH]';
                    }

                    // Check for [SWITCH] signal — AI wants to hand off to the other interviewer AFTER this question
                    const shouldSwitch = questionText.includes('[SWITCH]');
                    if (shouldSwitch) {
                        questionText = questionText.replace('[SWITCH]', '').trim();
                        setIsTransitioning(true);
                    } else {
                        setIsTransitioning(false);
                    }

                    // Check for coding question
                    if (data.isCodeQuestion) {
                        setIsCodeQuestion(true);
                    }

                    const nextQ = engine.setNextQuestionFromExternal(questionText, data.codeTask);
                    setSessionState({ ...engine.getState() });
                    
                    // Wait a moment then speak the handoff/question
                    await new Promise(r => setTimeout(r, 1500));
                    await speakQuestion(nextQ.text);

                    // Switch interviewer AFTER this question is spoken (for the NEXT round)
                    if (shouldSwitch) {
                        engine.switchInterviewer();
                        setSessionState({ ...engine.getState() });
                        
                        // Automatically submit a placeholder transition answer and fetch the new interviewer's question instantly!
                        engine.submitAnswer("[Candidate transitioned to the next interviewer automatically]", 0, { wpm: 0, fillerCount: 0, pauseDuration: 0 });
                        fetchNextQuestion();
                    }

                    return;
                }
            } catch (error) {
                console.error("Failed to fetch dynamic question", error);
                // On error, stay idle - user can retry or end
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

        const formattedAnswer = `[Submitted Code - ${language}]\n${code}`;

        engine.submitAnswer(formattedAnswer, 15, { wpm: 0, fillerCount: 0, pauseDuration: 0 });
        resetTranscript();

        try {
            const { data: analysisData } = await api.post('/groq/interview/analyze-code', {
                code,
                language,
                question: currentQuestion,
                resumeText: config.resumeText || '',
                domain: config.domain,
                jobRole: config.jobRole || ''
            });

            if (analysisData.success && analysisData.feedback) {
                const feedbackQ = engine.setNextQuestionFromExternal(analysisData.feedback);
                setSessionState({ ...engine.getState() });
                setTimeout(() => speakQuestion(feedbackQ.text), 500);
            } else {
                submitResponse(formattedAnswer);
            }
        } catch (error) {
            console.error("Code analysis failed, using as regular answer", error);
            const history = engine.getState().history.flatMap(h => [
                { role: 'assistant', content: h.question.text },
                { role: 'user', content: h.answer }
            ]);

            try {
                const { data } = await api.post('/groq/interview/question', {
                    resumeText: config.resumeText || '',
                    history,
                    type: 'technical',
                    domain: config.domain,
                    jobRole: config.jobRole || '',
                    interviewType: config.interviewType,
                    questionCount: questionCountRef.current.tech
                });

                if (data.success && data.question) {
                    const nextQ = engine.setNextQuestionFromExternal(data.question, data.codeTask);
                    setSessionState({ ...engine.getState() });
                    setTimeout(() => speakQuestion(nextQ.text), 1500);
                }
            } catch (fallbackError) {
                console.error("Fallback question fetch also failed", fallbackError);
                setAvatarState('idle');
            }
        }
    }, [engine, stopListening, resetTranscript, speakQuestion, config, submitResponse]);

    return {
        ready: !!engine && voices.length > 0,
        sessionState,
        avatarState,
        spokenCharIndex,
        currentTranscript: interimTranscript || transcript,
        isCodeQuestion,
        startSession,
        endSession,
        submitResponse,
        submitCode,
        isListening,
        startListening,
        stopListening,
        isTransitioning
    };
};
