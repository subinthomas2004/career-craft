import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/lib/jobApi";
import { Building2, MapPin, Clock, Briefcase, ExternalLink, GraduationCap, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface JobCardProps {
    job: Job;
    index: number;
}

const sourceConfig: Record<string, { label: string; className: string }> = {
    infopark: {
        label: '🏢 Infopark Kerala',
        className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    },
    jsearch: {
        label: '🇮🇳 India Jobs',
        className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
    },
    featured: {
        label: '⭐ Featured',
        className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    },
};

const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
    const source = sourceConfig[job.source || 'featured'] || sourceConfig.featured;

    const handleApply = () => {
        if (job.applyEmail) {
            window.open(`mailto:${job.applyEmail}?subject=Application for ${job.title}`, '_blank');
        } else if (job.applyLink) {
            window.open(job.applyLink, '_blank');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
        >
            <Card className="hover:shadow-lg transition-all duration-300 border border-border/50 group overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Logo Section */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary/50 flex items-center justify-center shrink-0 border border-border">
                            {job.logo ? (
                                <img
                                    src={job.logo}
                                    alt={`${job.company} logo`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>';
                                    }}
                                />
                            ) : (
                                <Building2 className="w-8 h-8 text-muted-foreground" />
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 space-y-3">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {job.title}
                                    </h3>
                                    <Badge variant="outline" className={`text-xs font-medium ${source.className}`}>
                                        {source.label}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                                    <Building2 className="w-4 h-4" />
                                    {job.company}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4" />
                                    {job.type}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <GraduationCap className="w-4 h-4" />
                                    {job.experience}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {job.requirements.slice(0, 3).map((req, i) => (
                                    <Badge key={i} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                        {req}
                                    </Badge>
                                ))}
                                {job.requirements.length > 3 && (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        +{job.requirements.length - 3} more
                                    </Badge>
                                )}
                            </div>

                            {/* Campus badge for Infopark jobs */}
                            {job.campus && (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                                    <MapPin className="w-3 h-3" />
                                    {job.campus}
                                </div>
                            )}
                        </div>

                        {/* Action Section */}
                        <div className="flex flex-col items-start md:items-end justify-between h-full space-y-4 md:space-y-0 w-full md:w-auto">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-accent/50 px-3 py-1 rounded-full w-full md:w-auto justify-center md:justify-start">
                                <Clock className="w-4 h-4 shrink-0" />
                                {job.postedDate}
                            </div>

                            <div className="w-full md:w-auto pt-4 md:pt-8 text-right">
                                <p className="text-lg font-bold text-foreground mb-3">{job.salary}</p>
                                <Button
                                    className="w-full md:w-auto group-hover:shadow-md transition-all h-10 px-6 bg-gradient-to-r from-primary to-primary/80"
                                    onClick={handleApply}
                                >
                                    {job.applyEmail ? (
                                        <>
                                            Email Resume
                                            <Mail className="w-4 h-4 ml-2" />
                                        </>
                                    ) : (
                                        <>
                                            Apply Now
                                            <ExternalLink className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default JobCard;
