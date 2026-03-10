import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
    onTranscriptChange: (transcript: string) => void;
    isProcessing: boolean;
    onRecordingComplete?: (wpm: number, duration: number) => void;
    onRecordingStart?: () => void;
    forceStop?: boolean; // Used by external timers to stop recording
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
    onTranscriptChange,
    isProcessing,
    onRecordingComplete,
    onRecordingStart,
    forceStop
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");

    // Tracking for WPM
    const startTimeRef = useRef<number | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                let final = "";
                let interim = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }

                if (final) {
                    setTranscript(prev => {
                        const newTranscript = prev + " " + final;
                        onTranscriptChange(newTranscript.trim());
                        return newTranscript;
                    });
                }
                setInterimTranscript(interim);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                handleStop();
            };

            recognitionRef.current.onend = () => {
                if (isRecording) {
                    // Speech recognition sometimes stops randomly after a pause
                    setIsRecording(false);
                }
            };
        } else {
            console.error("Browser does not support Speech Recognition");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Effect to handle external stop (e.g., from timer)
    useEffect(() => {
        if (forceStop && isRecording) {
            handleStop();
        }
    }, [forceStop]);

    const handleStart = () => {
        setTranscript("");
        setInterimTranscript("");
        onTranscriptChange("");
        startTimeRef.current = Date.now();
        setIsRecording(true);
        if (onRecordingStart) onRecordingStart();
        try {
            recognitionRef.current?.start();
        } catch (e) {
            console.error("Failed to start recognition:", e);
        }
    };

    const handleStop = () => {
        setIsRecording(false);
        try {
            recognitionRef.current?.stop();
        } catch (e) {
            console.error("Failed to stop recognition:", e);
        }

        // Calculate WPM if we have a callback
        if (onRecordingComplete && startTimeRef.current) {
            // Need latest transcript, so wait a tiny bit for final results
            setTimeout(() => {
                // Use a ref-like approach to get latest or just use the current state
                setTranscript(currentTranscript => {
                    const durationInSeconds = (Date.now() - startTimeRef.current!) / 1000;
                    const wordCount = currentTranscript.trim().split(/\s+/).filter(w => w.length > 0).length;
                    const wpm = durationInSeconds > 0 ? Math.round((wordCount / durationInSeconds) * 60) : 0;
                    onRecordingComplete(wpm, Math.round(durationInSeconds));
                    return currentTranscript;
                });
            }, 500); // Wait half a second for recognition to finalize
        }
    };

    const reset = () => {
        setTranscript("");
        setInterimTranscript("");
        onTranscriptChange("");
        startTimeRef.current = null;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-center gap-4">
                {!isRecording ? (
                    <Button
                        onClick={handleStart}
                        size="lg"
                        className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 shadow-lg transition-all hover:scale-105"
                        disabled={isProcessing}
                    >
                        <Mic className="w-8 h-8 text-white" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleStop}
                        size="lg"
                        variant="destructive"
                        className="rounded-full w-16 h-16 animate-pulse"
                    >
                        <Square className="w-6 h-6 fill-current" />
                    </Button>
                )}

                {(transcript || interimTranscript) && !isRecording && (
                    <Button onClick={reset} variant="outline" size="icon" className="rounded-full h-16 w-16">
                        <RotateCcw className="w-6 h-6" />
                    </Button>
                )}
            </div>

            <p className="text-center text-sm text-gray-500 min-h-[20px]">
                {isRecording ? "Listening... Speak clearly into your microphone" : "Click microphone to start"}
            </p>

            {/* Transcript Area */}
            <Card className="min-h-[200px] max-h-[400px] overflow-y-auto bg-gray-50/50 border-2 border-dashed border-gray-200 shadow-inner">
                <CardContent className="p-6">
                    {transcript || interimTranscript ? (
                        <p className="text-lg leading-relaxed text-gray-700">
                            {transcript}
                            <span className="text-gray-400 italic ml-1">{interimTranscript}</span>
                        </p>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Your speech transcript will appear here...
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Visualizer Placeholder */}
            {isRecording && (
                <div className="flex justify-center gap-1 h-8 items-center">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1 bg-primary/60 rounded-full animate-bounce" style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
