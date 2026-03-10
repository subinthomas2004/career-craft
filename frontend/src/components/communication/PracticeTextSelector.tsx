import React, { useState } from 'react';
import { practiceTexts, getTextsByDifficulty, getRandomText, PracticeText } from '@/data/practiceTexts';
import { Button } from '@/components/ui/button';
import { BookOpen, Shuffle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PracticeTextSelectorProps {
    onSelectText: (text: PracticeText) => void;
    selectedText: PracticeText | null;
}

const difficultyColors = {
    beginner: { bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', label: '🟢 Beginner' },
    intermediate: { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', label: '🔵 Intermediate' },
    advanced: { bg: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700', label: '🟣 Advanced' },
};

const PracticeTextSelector: React.FC<PracticeTextSelectorProps> = ({ onSelectText, selectedText }) => {
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
    const [showList, setShowList] = useState(false);

    const filteredTexts = getTextsByDifficulty(difficulty);
    const colors = difficultyColors[difficulty];

    const handleShuffle = () => {
        const randomText = getRandomText(difficulty);
        onSelectText(randomText);
    };

    return (
        <div className="space-y-3">
            {/* Difficulty Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                    <button
                        key={level}
                        onClick={() => { setDifficulty(level); setShowList(false); }}
                        className={cn(
                            'flex-1 text-xs font-medium py-1.5 px-2 rounded-md transition-all capitalize',
                            difficulty === level
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                        )}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {/* Selected Text Display */}
            {selectedText && (
                <div className={cn('p-4 rounded-lg border', colors.bg)}>
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-primary text-sm flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> {selectedText.title}
                        </h4>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', colors.badge)}>
                            {selectedText.wordCount} words
                        </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic text-sm">
                        "{selectedText.content}"
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShuffle} className="flex-1 gap-1">
                    <Shuffle className="w-3 h-3" /> Shuffle
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowList(!showList)}
                    className="flex-1 gap-1"
                >
                    <ChevronDown className={cn('w-3 h-3 transition-transform', showList && 'rotate-180')} />
                    Browse ({filteredTexts.length})
                </Button>
            </div>

            {/* Text List Dropdown */}
            {showList && (
                <div className="max-h-48 overflow-y-auto space-y-1 border rounded-lg p-2 bg-white">
                    {filteredTexts.map(text => (
                        <button
                            key={text.id}
                            onClick={() => { onSelectText(text); setShowList(false); }}
                            className={cn(
                                'w-full text-left p-2 rounded-md text-sm transition-all hover:bg-gray-50',
                                selectedText?.id === text.id && 'bg-primary/5 border border-primary/20'
                            )}
                        >
                            <p className="font-medium text-gray-800">{text.title}</p>
                            <p className="text-xs text-gray-500 truncate">{text.content.slice(0, 60)}...</p>
                        </button>
                    ))}
                </div>
            )}

            {/* Hint */}
            <p className="text-xs text-center text-gray-500">Read the text above clearly and naturally.</p>
        </div>
    );
};

export default PracticeTextSelector;
