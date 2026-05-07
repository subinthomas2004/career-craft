import React, { useEffect, useState } from 'react';
import PageBackground from "@/components/layout/PageBackground";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/jobs/JobCard";
import { Job, jobApi } from "@/lib/jobApi";
import { Badge } from "@/components/ui/badge";

const JobPortal: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [jobCount, setJobCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = async (searchQuery?: string) => {
        try {
            setLoading(true);
            // We now always fetch "all" to show everything in one list
            const res = await jobApi.getJobs(searchQuery, 'all');

            if (res.success) {
                console.log(`[JobPortal] Successfully fetched ${res.count} jobs`);
                setJobs(res.data);
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
                                    Fetching latest opportunities from India and Infopark Kerala...
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
