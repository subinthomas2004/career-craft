import React from 'react';
import {
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    Lightbulb,
    TrendingUp,
    FileCheck,
    Target,
    Type,
    BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useResume } from '@/context/ResumeContext';
import { getScoreColor, getScoreLabel } from '@/lib/ats-analyzer';

export function ATSScoreCard() {
    const { atsScore, setActiveStep } = useResume();

    if (!atsScore) {
        return null;
    }

    const scoreColor = getScoreColor(atsScore.overall);
    const scoreLabel = getScoreLabel(atsScore.overall);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'critical':
                return <AlertCircle className="w-5 h-5 text-destructive" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-warning" />;
            case 'suggestion':
                return <Lightbulb className="w-5 h-5 text-info" />;
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-success" />;
            default:
                return null;
        }
    };

    const getBreakdownIcon = (key: string) => {
        switch (key) {
            case 'formatting':
                return <Type className="w-4 h-4" />;
            case 'keywords':
                return <Target className="w-4 h-4" />;
            case 'structure':
                return <FileCheck className="w-4 h-4" />;
            case 'content':
                return <BookOpen className="w-4 h-4" />;
            case 'readability':
                return <TrendingUp className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-slide-up">
            {/* Main Score Card */}
            <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    fill="none"
                                    className="stroke-muted"
                                    strokeWidth="12"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    fill="none"
                                    className={`${scoreColor.replace('text-', 'stroke-')}`}
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                    strokeDasharray={`${atsScore.overall * 4.4} 440`}
                                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-bold ${scoreColor}`}>
                                    {atsScore.overall}
                                </span>
                                <span className="text-sm text-muted-foreground">out of 100</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                ATS Score: {scoreLabel}
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                {atsScore.overall >= 80
                                    ? 'Your resume is well-optimized for applicant tracking systems!'
                                    : atsScore.overall >= 60
                                        ? 'Your resume needs some improvements to pass ATS filters.'
                                        : 'Your resume needs significant changes to pass ATS filters.'}
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <Button onClick={() => setActiveStep('edit')}>
                                    Edit Resume
                                </Button>
                                <Button variant="outline" onClick={() => setActiveStep('template')}>
                                    Choose Template
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Breakdown */}
                <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Score Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {Object.entries(atsScore.breakdown).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium capitalize">
                                    {getBreakdownIcon(key)}
                                    <span>{key}</span>
                                </div>
                                <Progress value={value} className="h-2" />
                                <span className="text-sm text-muted-foreground">{value}%</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Feedback List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {atsScore.feedback.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-4 p-4 rounded-lg border ${item.category === 'critical'
                                    ? 'bg-destructive/5 border-destructive/20'
                                    : item.category === 'warning'
                                        ? 'bg-warning/5 border-warning/20'
                                        : item.category === 'suggestion'
                                            ? 'bg-info/5 border-info/20'
                                            : 'bg-success/5 border-success/20'
                                }`}
                        >
                            {getCategoryIcon(item.category)}
                            <div className="flex-1">
                                <h4 className="font-medium text-foreground">{item.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {item.description}
                                </p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                Impact: {item.impact}%
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
