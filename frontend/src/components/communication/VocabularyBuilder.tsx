import React, { useState } from 'react';
import { vocabularyWords, getRandomWord, VocabularyWord } from '@/data/vocabularyData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Volume2, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const VocabularyBuilder = () => {
    const [currentWord, setCurrentWord] = useState<VocabularyWord>(getRandomWord());
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
    const recognitionRef = React.useRef<any>(null);

    React.useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const spoken = event.results[0][0].transcript.toLowerCase().trim().replace(/[^a-z]/g, '');
                setTranscript(event.results[0][0].transcript);

                const target = currentWord.word.toLowerCase().replace(/[^a-z]/g, '');

                if (spoken === target || spoken.includes(target) || target.includes(spoken)) {
                    setResult('correct');
                } else {
                    setResult('incorrect');
                }
                setIsRecording(false);
            };

            recognitionRef.current.onerror = () => {
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, [currentWord]);

    const playAudio = () => {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    };

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            setTranscript('');
            setResult(null);
            setIsRecording(true);
            recognitionRef.current?.start();
        }
    };

    const nextWord = () => {
        setResult(null);
        setTranscript('');
        setCurrentWord(getRandomWord());
    };

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center space-y-2">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{currentWord.category} Vocabulary</span>
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{currentWord.word}</h2>
                <div className="flex items-center justify-center gap-2 text-gray-500">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        {currentWord.phonetic}
                    </span>
                    <button onClick={playAudio} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-indigo-600">
                        <Volume2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <Card className="border-indigo-100 bg-white/50 shadow-sm">
                <CardContent className="p-4 space-y-3">
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase">Meaning</span>
                        <p className="text-sm text-gray-700 font-medium">{currentWord.meaning}</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase">Example</span>
                        <p className="text-sm text-indigo-900/80 italic">"{currentWord.usageExample}"</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col items-center gap-4 pt-4">
                <button
                    onClick={toggleRecording}
                    className={cn(
                        "w-20 h-20 flex items-center justify-center rounded-full transition-all shadow-lg",
                        isRecording ? "bg-red-500 animate-pulse" : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
                    )}
                >
                    {isRecording ? <Square className="w-8 h-8 text-white fill-current" /> : <Mic className="w-8 h-8 text-white" />}
                </button>
                <p className="text-xs text-center text-gray-500 font-medium h-4">
                    {isRecording ? "Listening..." : "Tap to pronounce"}
                </p>
            </div>

            {result && (
                <div className={cn(
                    "p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2",
                    result === 'correct' ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
                )}>
                    <div className="flex items-center gap-3">
                        {result === 'correct' ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                        )}
                        <div>
                            <p className={cn("font-bold text-sm", result === 'correct' ? "text-emerald-700" : "text-red-700")}>
                                {result === 'correct' ? "Perfect Pronunciation!" : "Not quite right."}
                            </p>
                            <p className="text-xs text-gray-500 italic">You said: "{transcript}"</p>
                        </div>
                    </div>
                    {result === 'correct' && (
                        <Button size="sm" onClick={nextWord} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4">
                            Next Word <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}
                </div>
            )}
            {result === 'incorrect' && (
                <Button variant="outline" className="w-full flex gap-2" onClick={nextWord}>
                    Skip for now <ArrowRight className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
};

export default VocabularyBuilder;
