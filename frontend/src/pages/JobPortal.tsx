import React, { useEffect, useState } from 'react';
import PageBackground from "@/components/layout/PageBackground";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Sparkles, User, FileText, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/jobs/JobCard";
import { Job, jobApi } from "@/lib/jobApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { toast } from "sonner";

const JobPortal: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [jobCount, setJobCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Resume logic state
    const [parsedResumeData, setParsedResumeData] = useState<any>(null);
    const [uploadingState, setUploadingState] = useState<'none' | 'profile' | 'upload'>('none');
    const [selectionMode, setSelectionMode] = useState<'none' | 'profile' | 'upload' | 'active'>('none');

    const calculateMatchScore = (job: any, skills: string[]) => {
        if (!skills || skills.length === 0) return 0;
        let matchCount = 0;
        const jobText = `${job.title} ${job.description || ''} ${job.requirements?.join(' ') || ''}`.toLowerCase();
        
        skills.forEach(skill => {
            if (jobText.includes(skill.toLowerCase())) {
                matchCount++;
            }
        });
        
        // Calculate percentage (max 100)
        return Math.min(100, Math.round((matchCount / Math.max(5, skills.length)) * 100));
    };

    const sortJobsByResume = (currentJobs: any[], resumeData: any) => {
        if (!resumeData || !resumeData.skills) return currentJobs;
        
        const jobsWithScores = currentJobs.map(job => ({
            ...job,
            matchScore: calculateMatchScore(job, resumeData.skills)
        }));
        
        return jobsWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    };

    const handleUseProfileResume = async () => {
        setUploadingState('profile');
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) {
                toast.error("Please log in to use your profile resume.");
                return;
            }
            const { token } = JSON.parse(userInfo);
            
            const { data } = await api.get("/upload/resume-profile", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setParsedResumeData(data.data);
                setSelectionMode('active');
                setJobs(prev => sortJobsByResume(prev, data.data));
                toast.success("Profile resume loaded! Jobs sorted by match.");
            }
        } catch (error: any) {
            console.error("Profile Resume Error:", error);
            toast.error(error.response?.data?.error || "No resume found in your profile.");
        } finally {
            setUploadingState('none');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingState('upload');
        const formData = new FormData();
        formData.append("resume", file);

        try {
            const { data } = await api.post("/upload/resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.success) {
                setParsedResumeData(data.data);
                setSelectionMode('active');
                setJobs(prev => sortJobsByResume(prev, data.data));
                toast.success("Resume parsed successfully! Jobs sorted by match.");
            }
        } catch (error: any) {
            console.error("Upload Error:", error);
            toast.error(error.response?.data?.error || "Failed to process resume.");
        } finally {
            setUploadingState('none');
        }
    };

    const fetchJobs = async (searchQuery?: string) => {
        try {
            setLoading(true);
            // We now always fetch "all" to show everything in one list
            const res = await jobApi.getJobs(searchQuery, 'all');

            if (res.success) {
                console.log(`[JobPortal] Successfully fetched ${res.count} jobs`);
                if (parsedResumeData) {
                    setJobs(sortJobsByResume(res.data, parsedResumeData));
                } else {
                    setJobs(res.data);
                }
                setJobCount(res.count);
                setError(null);
            } else {
                setError("Failed to fetch jobs. Please try again.");
            }
        } catch (error: any) {
            console.error("Error fetching jobs:", error);
            setError(error.message || "An unexpected error occurred while fetching jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(search);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchJobs(search);
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <PageBackground variant="subtle" />

            <main className="container max-w-6xl mx-auto px-4 py-8 relative z-10 pt-24 lg:pt-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-10 space-y-4"
                >
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 backdrop-blur-sm px-4 py-1">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Real-Time Job Vacancies
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Dream Job</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Explore opportunities from top Indian companies, Kerala IT parks, and Infopark-listed organizations.
                    </p>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto mb-8"
                >
                    <form onSubmit={handleSearch} className="relative flex items-center gap-2 max-w-2xl mx-auto">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Job title, company, or keywords..."
                                className="pl-12 h-14 rounded-full border-border/50 bg-background/50 backdrop-blur-sm shadow-sm hover:border-primary/50 focus:border-primary transition-all text-lg"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit" size="lg" className="h-14 rounded-full px-8 shadow-md">
                            Search
                        </Button>
                    </form>
                </motion.div>

                {/* Resume Upload / Sorting Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-4xl mx-auto mb-10"
                >
                    {selectionMode === 'none' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="cursor-pointer border-2 border-primary/10 hover:border-primary/30 transition-all bg-card/50 shadow-sm" onClick={handleUseProfileResume}>
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                        {uploadingState === 'profile' ? <Loader2 className="w-6 h-6 animate-spin" /> : <User className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Match Profile Resume</h3>
                                        <p className="text-sm text-muted-foreground">Sort jobs using your saved profile resume.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all bg-card/50 shadow-sm group">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={uploadingState !== 'none'}
                                />
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 group-hover:scale-110 transition-transform">
                                        {uploadingState === 'upload' ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Match New Resume</h3>
                                        <p className="text-sm text-muted-foreground">Upload a PDF to find matching jobs.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card className="border-2 border-primary/20 bg-primary/5 shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    <div>
                                        <p className="font-semibold text-foreground">Resume Match Active</p>
                                        <p className="text-sm text-muted-foreground">Jobs are sorted based on {parsedResumeData?.skills?.length || 0} extracted skills.</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                        setParsedResumeData(null);
                                        setSelectionMode('none');
                                        fetchJobs(search); // re-fetch to restore original order
                                    }}
                                >
                                    Clear Match
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>

                {/* Results count */}
                {!loading && jobs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-4xl mx-auto mb-4"
                    >
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{jobCount}</span> {jobCount === 1 ? 'opportunity' : 'opportunities'}
                            {search && <> matching "<span className="font-medium">{search}</span>"</>}
                        </p>
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-4xl mx-auto mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center"
                    >
                        <p>{error}</p>
                        <Button variant="outline" size="sm" className="mt-2 border-destructive/30 hover:bg-destructive/5" onClick={() => fetchJobs(search)}>
                            Retry
                        </Button>
                    </motion.div>
                )}

                {/* Job Listings Loop */}
                <div className="max-w-4xl mx-auto space-y-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20"
                            >
                                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                                <p className="text-muted-foreground animate-pulse">
                                    Fetching latest opportunities...
                                </p>
                            </motion.div>
                        ) : jobs.length > 0 ? (
                            <motion.div key="list" className="space-y-4">
                                {jobs.map((job, index) => (
                                    <div key={job.id}>
                                        <JobCard job={job} index={index} />
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20 bg-card/30 backdrop-blur-md rounded-2xl border border-border/50"
                            >
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                                <p className="text-muted-foreground">Try adjusting your search criteria or checking back later.</p>
                                <Button variant="outline" className="mt-6" onClick={() => { setSearch(''); fetchJobs(''); }}>
                                    Clear Search
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </main>
        </div>
    );
};

export default JobPortal;
