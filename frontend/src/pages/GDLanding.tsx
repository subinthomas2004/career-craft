import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Play, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const GDLanding = () => {
    const navigate = useNavigate();
    const [joinCode, setJoinCode] = useState('');
    const [showJoin, setShowJoin] = useState(false);

    const handleJoin = () => {
        const code = joinCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        if (code.length !== 6) {
            toast.error("Please enter a valid 6-character room code.");
            return;
        }
        navigate(`/group-discussion/join/${code}`);
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
            {/* Hero Section */}
            <main className="flex-1 flex flex-col justify-center items-center relative overflow-hidden">
                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <Badge variant="outline" className="mb-4 text-primary border-primary/50 px-4 py-1 text-md uppercase tracking-widest bg-primary/10 backdrop-blur-md">
                        AI-Powered Simulation
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-gray-900 drop-shadow-sm">
                        Master the Art of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                            Group Discussion
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Practice with realistic AI personas, get real-time feedback, and improve your communication skills in an immersive virtual environment.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Button
                            size="lg"
                            onClick={() => navigate('/dashboard/group-discussion/topic')}
                            className="h-14 px-8 text-lg rounded-full bg-black text-white hover:bg-gray-800 transition-all transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)]"
                        >
                            <Play className="w-5 h-5 mr-2 fill-white" />
                            Start New Session
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setShowJoin(!showJoin)}
                            className="h-14 px-8 text-lg rounded-full border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all transform hover:scale-105"
                        >
                            <UserPlus className="w-5 h-5 mr-2" />
                            Join with Code
                        </Button>
                    </div>

                    {/* Join Code Input */}
                    {showJoin && (
                        <div className="mt-6 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                            <Input
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 7))}
                                placeholder="Enter room code (e.g. ABC-DEF)"
                                className="max-w-xs text-center text-lg font-mono tracking-[0.2em] h-12 rounded-full border-2 border-indigo-200 focus:border-indigo-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                            />
                            <Button
                                onClick={handleJoin}
                                className="h-12 px-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Join
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default GDLanding;
