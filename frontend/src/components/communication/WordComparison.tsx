import React from 'react';
import { cn } from '@/lib/utils';

interface WordComparisonProps {
    referenceText: string;
    transcript: string;
}

const normalizeWord = (word: string) =>
    word.toLowerCase().replace(/[^a-z0-9']/g, '');

const WordComparison: React.FC<WordComparisonProps> = ({ referenceText, transcript }) => {
    const refWords = referenceText.split(/\s+/).map(w => w.trim()).filter(Boolean);
    const spokenWords = transcript.split(/\s+/).map(w => w.trim()).filter(Boolean);

    // Simple word matching using Levenshtein-like approach
    const getMatchStatus = (refWord: string, spokenWord: string | undefined): 'correct' | 'close' | 'missed' => {
        if (!spokenWord) return 'missed';
        const normRef = normalizeWord(refWord);
        const normSpoken = normalizeWord(spokenWord);
        if (normRef === normSpoken) return 'correct';
        // Check if close (within 2 chars difference or one is substring of other)
        if (normRef.includes(normSpoken) || normSpoken.includes(normRef)) return 'close';
        if (Math.abs(normRef.length - normSpoken.length) <= 2) {
            let matches = 0;
            const shorter = normRef.length <= normSpoken.length ? normRef : normSpoken;
            const longer = normRef.length > normSpoken.length ? normRef : normSpoken;
            for (let i = 0; i < shorter.length; i++) {
                if (shorter[i] === longer[i]) matches++;
            }
            if (matches / longer.length > 0.6) return 'close';
        }
        return 'missed';
    };

    // Match reference words against spoken words
    let spokenIdx = 0;
    const results = refWords.map((refWord) => {
        const status = getMatchStatus(refWord, spokenWords[spokenIdx]);
        if (status !== 'missed') spokenIdx++;
        return { word: refWord, status };
    });

    const correctCount = results.filter(r => r.status === 'correct').length;
    const closeCount = results.filter(r => r.status === 'close').length;
    const missedCount = results.filter(r => r.status === 'missed').length;
    const accuracy = Math.round(((correctCount + closeCount * 0.5) / refWords.length) * 100);

    const statusColors = {
        correct: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        close: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        missed: 'bg-red-100 text-red-800 border-red-300',
    };

    return (
        <div className="space-y-4">
            {/* Accuracy Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Word-by-Word Comparison</h3>
                <div className="flex items-center gap-2">
                    <span className={cn(
                        'text-2xl font-bold',
                        accuracy >= 80 ? 'text-emerald-600' : accuracy >= 50 ? 'text-yellow-600' : 'text-red-600'
                    )}>
                        {accuracy}%
                    </span>
                    <span className="text-xs text-gray-500">accuracy</span>
                </div>
            </div>

            {/* Word Grid */}
            <div className="flex flex-wrap gap-1.5">
                {results.map((result, idx) => (
                    <span
                        key={idx}
                        className={cn(
                            'px-2 py-1 text-sm rounded-md border font-medium transition-all',
                            statusColors[result.status]
                        )}
                    >
                        {result.word}
                    </span>
                ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-300" />
                    Correct ({correctCount})
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-yellow-200 border border-yellow-300" />
                    Close ({closeCount})
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-red-200 border border-red-300" />
                    Missed ({missedCount})
                </span>
            </div>
        </div>
    );
};

export default WordComparison;
