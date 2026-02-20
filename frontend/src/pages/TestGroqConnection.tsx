import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const TestGroqConnection = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'connected' | 'error'>('idle');
    const [limits, setLimits] = useState<any>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const { data } = await api.post('/groq/test', {
                message: userMessage.content
            });

            if (data.success) {
                setStatus('connected');
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
                if (data.limits) setLimits(data.limits);
            }
        } catch (error) {
            console.error("Error:", error);
            setStatus('error');
            setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to Groq API. Check backend console." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black/95 text-white p-8 flex items-center justify-center">
            <div className="flex gap-6 w-full max-w-5xl items-start">
                <Card className="flex-1 bg-black/40 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-orange-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-white">Groq API Test</CardTitle>
                                    <CardDescription className="text-white/60">Test connection with Llama 3 on Groq</CardDescription>
                                </div>
                            </div>
                            {status === 'connected' && (
                                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                    <CheckCircle2 className="w-4 h-4" /> Connected
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                                    <AlertCircle className="w-4 h-4" /> Error
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-[400px] overflow-y-auto w-full rounded-xl bg-white/5 p-4 space-y-4 border border-white/5">
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-2">
                                    <Bot className="w-12 h-12 opacity-20" />
                                    <p>Send a message to test the connection</p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-3 px-4 ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white/10 text-white/90 rounded-bl-none'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 rounded-2xl p-3 rounded-bl-none flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                                        <span className="text-xs text-white/50">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a test message..."
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                            />
                            <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-orange-500 hover:bg-orange-600">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Rate Limits Panel */}
                <Card className="w-80 bg-black/40 border-white/10 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Rate Limits</CardTitle>
                        <CardDescription className="text-white/60">Live usage stats</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!limits ? (
                            <div className="text-center text-white/30 py-8 text-sm">
                                Send a message to see rate limits
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <div className="text-xs font-medium text-white/50 uppercase tracking-wider">Requests (RPM)</div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-2xl font-bold text-white">{limits.remainingRequests}</span>
                                            <span className="text-xs text-white/50 mb-1">/ {limits.limitRequests}</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${(parseInt(limits.remainingRequests) / parseInt(limits.limitRequests)) * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-white/40 mt-2">Resets in {limits.resetRequests}</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-medium text-white/50 uppercase tracking-wider">Tokens (TPM)</div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-2xl font-bold text-white">{limits.remainingTokens}</span>
                                            <span className="text-xs text-white/50 mb-1">/ {limits.limitTokens}</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-purple-500 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${(parseInt(limits.remainingTokens) / parseInt(limits.limitTokens)) * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-white/40 mt-2">Resets in {limits.resetTokens}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TestGroqConnection;
