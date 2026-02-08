import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Mic, MicOff, Video, VideoOff } from 'lucide-react';

// Lazy load the 3D scene so imports don't crash the main bundle
const Scene = React.lazy(() => import('./Scene'));

// --- Error Boundary ---
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("3D Error Caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-900/50 rounded-lg border border-red-500 text-white w-full h-full flex flex-col items-center justify-center">
                    <h3 className="font-bold text-lg mb-2">3D Module Failed to Load</h3>
                    <p className="font-mono text-sm text-center max-w-lg whitespace-pre-wrap">
                        {this.state.error?.message || "Unknown error occurred"}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

const GD3DRoom = () => {
    const navigate = useNavigate();
    const [micOn, setMicOn] = React.useState(false);
    const [camOn, setCamOn] = React.useState(false);

    return (
        <div className="w-full h-screen bg-slate-950 flex flex-col relative text-white overflow-hidden">
            {/* Top Bar */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/group-discussion')} className="bg-slate-800 hover:bg-slate-700 border-slate-700">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Exit Session
                </Button>
                <div className="bg-slate-800/80 backdrop-blur px-4 py-1.5 rounded-full border border-slate-700 text-sm font-medium">
                    <span className="text-emerald-400 mr-2">●</span> Live Simulation
                </div>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 backdrop-blur-md p-2 rounded-full flex gap-2 border border-slate-700 shadow-2xl">
                <Button
                    variant={micOn ? "default" : "outline"}
                    size="icon"
                    className={`rounded-full w-12 h-12 border-slate-700 ${!micOn && 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                    onClick={() => setMicOn(!micOn)}
                >
                    {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
                <Button
                    variant={camOn ? "default" : "outline"}
                    size="icon"
                    className={`rounded-full w-12 h-12 border-slate-700 ${!camOn && 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                    onClick={() => setCamOn(!camOn)}
                >
                    {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
            </div>

            {/* 3D Scene Container */}
            <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-950">
                <ErrorBoundary>
                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
                            <span className="text-lg font-light tracking-wide">Initializing 3D Environment...</span>
                        </div>
                    }>
                        <Scene />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default GD3DRoom;
