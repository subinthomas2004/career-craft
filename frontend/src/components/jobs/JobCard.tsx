import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/lib/jobApi";
import { Building2, MapPin, Clock, Briefcase, ExternalLink, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface JobCardProps {
    job: Job;
    index: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card className="hover:shadow-lg transition-all duration-300 border border-border/50 group overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Logo Section */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary/50 flex items-center justify-center shrink-0 border border-border">
                            {job.logo ? (
                                <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
                            ) : (
                                <Building2 className="w-8 h-8 text-muted-foreground" />
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 space-y-3">
                            <div>
                                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {job.title}
                                </h3>
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
                                    onClick={() => window.open(job.applyLink, '_blank')}
                                >
                                    Apply Now
                                    <ExternalLink className="w-4 h-4 ml-2" />
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
