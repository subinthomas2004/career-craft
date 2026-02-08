import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Video, Play, Bot, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MockInterviewLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
            {/* Header Removed to fix overlap with DashboardLayout */}
            {/* Hero Section */}
            <main className="flex-1 flex flex-col justify-center items-center relative overflow-hidden">
                {/* Background - Removed as per request */}

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <Badge variant="outline" className="mb-4 text-emerald-700 border-emerald-700/50 px-4 py-1 text-md uppercase tracking-widest bg-emerald-50/80 backdrop-blur-sm font-bold shadow-sm">
                        AI-Powered Interview Coach
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-black drop-shadow-sm">
                        Ace Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                            Job Interview
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
                        Experience a realistic interview simulation with our advanced AI. Get real-time feedback on your answers, body language, and communication style.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <div className="flex items-center gap-2 text-gray-600 text-sm uppercase tracking-wider font-bold">
                            <span className="flex items-center gap-1"><Mic className="w-4 h-4" /> Voice Enabled</span>
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Face Analysis</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button
                            size="lg"
                            onClick={() => navigate('/dashboard/interview/session')}
                            className="h-14 px-8 text-lg rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] font-semibold"
                        >
                            <Play className="w-5 h-5 mr-2 fill-white" />
                            Start Mock Interview
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MockInterviewLanding;
