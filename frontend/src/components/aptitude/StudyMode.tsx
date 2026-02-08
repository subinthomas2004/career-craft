import { useState } from "react";
import { aptitudeTopics } from "@/data/aptitudeQuestions";
import { getStudyMaterial, StudySection } from "@/data/aptitudeStudyMaterials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ArrowLeft,
    BookOpen,
    Calculator,
    Lightbulb,
    CheckCircle2,
    HelpCircle,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyModeProps {
    onBack: () => void;
}

export const StudyMode = ({ onBack }: StudyModeProps) => {
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    // If no topic selected, show the grid
    if (!selectedTopicId) {
        return (
            <div className="animate-in fade-in zoom-in duration-300">
                <Button variant="ghost" onClick={onBack} className="mb-6 gap-2 pl-0 hover:pl-2 transition-all">
                    <ArrowLeft className="h-4 w-4" /> Back to Menu
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Study Zone</h1>
                    <p className="text-muted-foreground text-lg">
                        Master the concepts. Choose a topic to view formulas, tips, and example problems.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {aptitudeTopics.map((topic) => (
                        <Card
                            key={topic.id}
                            className="cursor-pointer hover:border-primary transition-all hover:bg-accent/40"
                            onClick={() => setSelectedTopicId(topic.id)}
                        >
                            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                <div className="text-4xl">{topic.icon}</div>
                                <h3 className="font-medium">{topic.name}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Detail View
    const topicInfo = aptitudeTopics.find(t => t.id === selectedTopicId);
    const studyData = topicInfo ? getStudyMaterial(topicInfo.id, topicInfo.name) : null;

    if (!studyData) return <div>Loading...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-right duration-300">
            <Button variant="ghost" onClick={() => setSelectedTopicId(null)} className="mb-6 gap-2 pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="h-4 w-4" /> Back to Topics
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Intro & Formulas */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">{topicInfo?.icon}</span>
                            <h1 className="text-3xl font-bold">{studyData.title}</h1>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {studyData.introduction}
                        </p>
                    </div>

                    {/* Formulas Section */}
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="h-5 w-5 text-primary" />
                                Key Formulas & Concepts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {studyData.formulas.map((formula, idx) => (
                                <div key={idx} className="bg-card p-4 rounded-lg border shadow-sm">
                                    <h4 className="font-medium text-sm text-muted-foreground mb-1">{formula.label}</h4>
                                    <div className="font-mono text-lg font-bold text-primary mb-2 bg-muted/50 p-2 rounded w-fit">
                                        {formula.equation}
                                    </div>
                                    {formula.description && (
                                        <p className="text-sm text-foreground/80">{formula.description}</p>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Examples Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <BookOpen className="h-6 w-6" />
                            Solved Examples
                        </h2>
                        <div className="space-y-4">
                            {studyData.examples.length > 0 ? (
                                studyData.examples.map((example, idx) => (
                                    <ExampleCard key={idx} example={example} index={idx} />
                                ))
                            ) : (
                                <div className="p-8 border rounded-xl text-center text-muted-foreground bg-muted/20">
                                    No specific examples loaded for this topic yet.
                                    <br />
                                    Try taking a quiz to see dynamic questions!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Tips */}
                <div className="space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                                <Lightbulb className="h-5 w-5" />
                                Expert Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {studyData.tips.map((tip, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const ExampleCard = ({ example, index }: { example: { question: string; solution: string; explanation: string }, index: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="overflow-hidden">
            <div
                className="p-4 flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="bg-primary/10 text-primary font-bold h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-sm">
                    {index + 1}
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-base leading-snug">{example.question}</h3>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
            </div>

            {isOpen && (
                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2">
                    <div className="pl-11 pt-2 md:pt-4 border-t mt-2">
                        <div className="mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Answer</span>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">{example.solution}</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg text-sm text-foreground/90 leading-relaxed">
                            <span className="font-bold block mb-1">Explanation:</span>
                            {example.explanation}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
