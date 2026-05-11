import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, AlertCircle, Send, CheckCircle2, Clock, Info } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Feedback = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("feedback");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get("/feedback/my");
            setHistory(data);
        } catch (error) {
            console.error("Error fetching feedback history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/feedback", { title, description, type });
            toast.success("Feedback submitted successfully. Thank you!");
            setTitle("");
            setDescription("");
            setType("feedback");
            fetchHistory(); // Refresh list
        } catch (error) {
            toast.error("Failed to submit feedback. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "resolved": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "in_review": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    return (
        <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    Feedback & Support
                </h1>
                <p className="text-muted-foreground">
                    Have a question, found a bug, or have a suggestion? Let us know below.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submit Form */}
                <Card className="lg:col-span-1 bg-card/50 border-border backdrop-blur-sm h-fit">
                    <CardHeader>
                        <CardTitle>Submit Request</CardTitle>
                        <CardDescription>We typically respond within 24-48 hours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Category</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="bg-background/50 border-border">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="feedback">General Feedback</SelectItem>
                                        <SelectItem value="bug">Bug Report</SelectItem>
                                        <SelectItem value="complaint">Complaint</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Short Subject</Label>
                                <Input 
                                    id="title" 
                                    placeholder="Brief summary of the issue..." 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-background/50 border-border"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Details</Label>
                                <Textarea 
                                    id="description" 
                                    placeholder="Provide as much detail as possible..." 
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-background/50 border-border resize-none"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                                <Send className="w-4 h-4" />
                                {isSubmitting ? "Submitting..." : "Send Feedback"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* History */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        Your Submissions
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                        </div>
                    ) : history.length === 0 ? (
                        <Card className="bg-card/30 border-dashed border-border flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <Info className="w-10 h-10 mb-4 opacity-20" />
                            <p>No past submissions found.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item) => (
                                <Card key={item._id} className="bg-card/50 border-border">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="uppercase text-[10px]">
                                                    {item.type}
                                                </Badge>
                                                <Badge variant="outline" className={`capitalize font-medium ${getStatusColor(item.status)}`}>
                                                    {item.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{item.description}</p>
                                        
                                        {item.adminReply && (
                                            <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-lg flex gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-foreground">Official Response</p>
                                                    <p className="text-sm text-muted-foreground">{item.adminReply}</p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
