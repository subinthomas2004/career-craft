import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Briefcase, FileCode, Users, Layers, Zap } from 'lucide-react';
import { TypingConfig } from '@/lib/typing/engine';
import { TypingMode, Difficulty } from '@/lib/typing/data';

interface ConfigPanelProps {
    config: TypingConfig;
    onChange: (newConfig: TypingConfig) => void;
    disabled?: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange, disabled }) => {

    const updateConfig = (updates: Partial<TypingConfig>) => {
        onChange({ ...config, ...updates });
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">

            {/* Mode Selection */}
            <div className="flex items-center gap-4">
                {/* <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Layers className="w-4 h-4" /> Mode
        </span> */}
                <div className="flex bg-muted p-1 rounded-lg">
                    <button
                        onClick={() => updateConfig({ mode: 'general' })}
                        disabled={disabled}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${config.mode === 'general' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Zap className="w-3.5 h-3.5" /> General
                    </button>
                    <button
                        onClick={() => updateConfig({ mode: 'technical' })}
                        disabled={disabled}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${config.mode === 'technical' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <FileCode className="w-3.5 h-3.5" /> Tech
                    </button>
                    <button
                        onClick={() => updateConfig({ mode: 'business' })}
                        disabled={disabled}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${config.mode === 'business' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Briefcase className="w-3.5 h-3.5" /> Business
                    </button>
                    <button
                        onClick={() => updateConfig({ mode: 'interview' })}
                        disabled={disabled}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${config.mode === 'interview' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Users className="w-3.5 h-3.5" /> HR
                    </button>
                    <button
                        onClick={() => updateConfig({ mode: 'code' })}
                        disabled={disabled}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${config.mode === 'code' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <FileCode className="w-3.5 h-3.5" /> Code
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Difficulty Select */}
                <Select
                    value={config.difficulty}
                    onValueChange={(val) => updateConfig({ difficulty: val as Difficulty })}
                    disabled={disabled}
                >
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                </Select>

                <div className="h-6 w-px bg-border" />

                {/* Duration Tabs */}
                <div className="flex bg-muted p-1 rounded-lg">
                    {[30, 60, 120].map(dur => (
                        <button
                            key={dur}
                            onClick={() => updateConfig({ duration: dur })}
                            disabled={disabled}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${config.duration === dur ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                        >
                            {dur}s
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};
