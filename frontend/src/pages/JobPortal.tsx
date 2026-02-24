import React, { useEffect, useState } from 'react';
import PageBackground from "@/components/layout/PageBackground";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Sparkles, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/jobs/JobCard";
import { Job, jobApi } from "@/lib/jobApi";
import { Badge } from "@/components/ui/badge";

const JobPortal: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filters = ["All", "Full-Time", "Internship", "Remote", "Senior Level"];

    const fetchJobs = async (searchQuery?: string) => {
        try {
            setLoading(true);
            const res = await jobApi.getJobs(searchQuery);
            if (res.success) {
                setJobs(res.data);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchJobs(search);
    };

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        if (filter === "All") {
            fetchJobs(search);
        } else {
            // Very simple frontend filtering for demonstration
            fetchJobs(search).then(() => {
                setJobs(prevJobs => prevJobs.filter(job =>
                    job.type.includes(filter) ||
                    job.experience.includes(filter) ||
                    job.location.includes(filter)
                ));
            });
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <PageBackground variant="subtle" />

            <main className="container max-w-6xl mx-auto px-4 py-8 relative z-10 pt-24 lg:pt-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-12 space-y-4"
                >
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 backdrop-blur-sm px-4 py-1">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Real-Time Job Vacancies
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Dream Job</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Explore opportunities from top tech companies and startups. Apply directly to secure your future.
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto mb-10"
                >
                    <form onSubmit={handleSearch} className="relative flex items-center gap-2 max-w-2xl mx-auto mb-6">
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

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-muted-foreground mr-2" />
                        {filters.map((filter) => (
                            <Button
                                key={filter}
                                variant={activeFilter === filter ? "default" : "outline"}
                                className={`rounded-full transition-all ${activeFilter === filter ? 'shadow-md' : 'hover:border-primary/50 bg-background/50 backdrop-blur-sm'}`}
                                onClick={() => handleFilterChange(filter)}
                                size="sm"
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                </motion.div>

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
                                <p className="text-muted-foreground animate-pulse">Fetching latest opportunities...</p>
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
                                <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
                                <Button variant="outline" className="mt-6" onClick={() => { setSearch(''); handleFilterChange('All'); }}>
                                    Clear Filters
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
