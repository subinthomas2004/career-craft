import React from 'react';
import { cn } from '@/lib/utils';

interface PronunciationScoreProps {
    referenceText: string;
    transcript: string;
}

const normalizeWord = (word: string) =>
    word.toLowerCase().replace(/[^a-z0-9']/g, '');

const PronunciationScore: React.FC<PronunciationScoreProps> = ({ referenceText, transcript }) => {
    const refWords = referenceText.split(/\s+/).map(w => normalizeWord(w)).filter(Boolean);
    const spokenWords = transcript.split(/\s+/).map(w => normalizeWord(w)).filter(Boolean);

    // Find words in reference that don't appear in spoken (possibly mispronounced)
    const spokenSet = new Set(spokenWords);
    const problemWords: string[] = [];
    const matchedWords: string[] = [];

    refWords.forEach(word => {
        if (spokenSet.has(word)) {
            matchedWords.push(word);
        } else {
            // Check for close matches
            const hasClose = spokenWords.some(sw => {
                if (Math.abs(sw.length - word.length) > 2) return false;
                let matches = 0;
                const shorter = word.length <= sw.length ? word : sw;
                const longer = word.length > sw.length ? word : sw;
                for (let i = 0; i < shorter.length; i++) {
                    if (shorter[i] === longer[i]) matches++;
                }
                return matches / longer.length > 0.7;
            });
            if (!hasClose) {
                problemWords.push(word);
            } else {
                matchedWords.push(word);
            }
        }
    });

    const uniqueProblems = [...new Set(problemWords)];
    const score = Math.round((matchedWords.length / refWords.length) * 100);

    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (circumference * score) / 100;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-6">
                {/* Circular Score */}
                <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="48" cy="48" r="40"
                            stroke="currentColor" strokeWidth="8" fill="transparent"
                            className="text-gray-200"
                        />
                        <circle
                            cx="48" cy="48" r="40"
                            stroke="currentColor" strokeWidth="8" fill="transparent"
                            className={cn(
                                score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'
                            )}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className={cn(
                        'absolute inset-0 flex items-center justify-center text-xl font-bold',
                        score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                    )}>
                        {score}%
                    </span>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">Pronunciation Score</h4>
                    <p className="text-sm text-gray-500">
                        {score >= 80 ? 'Excellent pronunciation! Keep it up.' :
                            score >= 50 ? 'Good attempt. Practice the highlighted words.' :
                                'Keep practicing. Focus on the words below.'}
                    </p>
                </div>
            </div>

            {/* Problem Words */}
            {uniqueProblems.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-red-600 uppercase mb-2">Words to Practice</p>
                    <div className="flex flex-wrap gap-2">
                        {uniqueProblems.slice(0, 10).map((word, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-200 font-medium">
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PronunciationScore;
