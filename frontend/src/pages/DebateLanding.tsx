import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Zap, Bot, BarChart3, Trophy, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db, auth } from '@/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend
);

const DebateLanding = () => {
    const navigate = useNavigate();

    const [debates, setDebates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebates = async () => {
            if (!auth.currentUser) {
                setLoading(false);
                return;
            }
            try {
                const q = query(
                    collection(db, "debates"),
                    where("userId", "==", auth.currentUser.uid),
                    orderBy("createdAt", "asc")
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDebates(data);
            } catch (error) {
                console.error("Error fetching past debates:", error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchDebates();
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const chartData = {
        labels: debates.map((_, i) => `Debate ${i + 1}`),
        datasets: [
            {
                label: 'Overall Score',
                data: debates.map(d => d.overallScore),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                tension: 0.4,
            }
        ]
    };

    const features = [
        {
            icon: <Bot className="w-5 h-5 text-blue-500" />,
            title: "Adaptive AI Opponent",
            description: "Face off against an AI that adapts to your arguments."
        },
        {
            icon: <Zap className="w-5 h-5 text-indigo-500" />,
            title: "Instant Verification",
            description: "Get immediate feedback on your argumentation style."
        },
        {
            icon: <BarChart3 className="w-5 h-5 text-cyan-500" />,
            title: "Performance Analytics",
            description: "Track your improvement over time with detailed scoring."
        }
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] font-sans relative bg-background">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden h-full fixed">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/40 via-background to-background" />
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-100/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-100/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <main className="flex-1 flex flex-col justify-center items-center relative p-4 z-10 w-full max-w-7xl mx-auto h-full">

                {/* Hero Content */}
                <div className="text-center w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center justify-center flex-grow pt-8">

                    {/* Badge */}
                    <div className="flex justify-center">
                        <Badge variant="outline" className="px-3 py-1 text-xs font-medium tracking-wide uppercase text-blue-600 border-blue-200 bg-blue-50/50 backdrop-blur-sm rounded-full shadow-sm">
                            <Trophy className="w-3 h-3 mr-1.5" />
                            AI-Powered Debate Platform
                        </Badge>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-foreground">
                        Master the Art of <br className="hidden md:block" />
                        <span className="relative inline-block">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                                Persuasion
                            </span>
                            <span className="absolute -bottom-1 left-0 right-0 h-3 bg-indigo-100/50 -rotate-1 -z-0 rounded-full blur-sm" />
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                        Challenge advanced AI opponents, sharpen your critical thinking, and receive comprehensive feedback to win every argument.
                    </p>

                    {/* CTA Button */}
                    <div className="pt-2 pb-6 flex flex-col items-center">
                        <Button
                            size="lg"
                            onClick={() => navigate('/dashboard/debate/topic')}
                            className="h-12 px-8 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all transform hover:scale-105 shadow-lg shadow-blue-200 ring-2 ring-blue-50"
                        >
                            <Play className="w-5 h-5 mr-2 fill-white" />
                            Start New Debate
                        </Button>
                        <p className="mt-3 text-xs text-muted-foreground flex items-center">
                            <Users className="w-3 h-3 inline mr-1" />
                            Join 10,000+ debaters improving daily
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mt-auto mb-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 px-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-5 rounded-xl bg-white/40 hover:bg-white border border-border/40 hover:border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm flex flex-col items-center text-center md:items-start md:text-left"
                        >
                            <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-base font-bold mb-1.5 text-foreground group-hover:text-blue-700 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-snug">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* --- Analytics Section --- */}
                {!loading && debates.length > 0 && (
                    <div className="w-full max-w-5xl mx-auto mb-16 p-6 rounded-2xl bg-white/40 border border-border/40 backdrop-blur-sm shadow-sm animate-in fade-in duration-1000">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="w-6 h-6 text-indigo-500" />
                            <h2 className="text-xl font-bold">Your Performance Over Time</h2>
                        </div>
                        <div className="h-64 w-full">
                            <Line data={chartData} options={{ maintainAspectRatio: false, scales: { y: { suggestedMin: 0, suggestedMax: 100 } } }} />
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default DebateLanding;
