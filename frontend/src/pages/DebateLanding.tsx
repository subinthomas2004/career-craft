import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DebateLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full font-sans relative overflow-hidden bg-background">
            {/* Hero Section */}
            <main className="flex-1 flex flex-col justify-center items-center relative p-8">
                {/* Background Image / Gradient */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-background to-red-50/50" />
                    <div className="absolute inset-0 bg-[url('/debate-bg-pattern.svg')] opacity-[0.03]" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <Badge variant="outline" className="mb-4 text-red-600 border-red-200 px-4 py-1 text-md uppercase tracking-widest bg-red-50 backdrop-blur-md">
                        AI-Powered Debate
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-foreground drop-shadow-sm">
                        Sharpen Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500">
                            Argumentation Skills
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Challenge AI opponents, structure your thoughts, and master the art of persuasion in a one-on-one debate simulation.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Button
                            size="lg"
                            onClick={() => navigate('/dashboard/debate/topic')}
                            className="h-14 px-8 text-lg rounded-full bg-red-600 hover:bg-red-700 text-white transition-all transform hover:scale-105 shadow-xl shadow-red-200"
                        >
                            <Play className="w-5 h-5 mr-2 fill-white" />
                            Start Debate
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DebateLanding;
