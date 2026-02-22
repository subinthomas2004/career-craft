import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building2, Search, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

// Define the interface based on our mongoose model
export interface Company {
    _id: string;
    name: string;
    description: string;
    logoUrl: string;
    createdAt: string;
}

const CompanyPrep = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/companies'); // Hits the configured API_URL
                setCompanies(response.data);
            } catch (error) {
                console.error("Failed to fetch companies", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 p-6 md:p-8 pt-20 lg:pt-8 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
                    <div className="space-y-2">
                        <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Company Preparation
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            Company-Specific Materials
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Access targeted preparation materials, previous year questions, and syllabi tailored for top product and service-based companies.
                        </p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search companies..."
                            className="pl-9 bg-card border-border/40 focus:border-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col justify-center items-center h-64 space-y-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-muted-foreground animate-pulse">Loading placement materials...</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredCompanies.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-card/40 rounded-2xl border border-dashed border-border/60">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No companies found</h3>
                        <p className="text-muted-foreground max-w-sm">
                            We couldn't find any companies matching "{searchQuery}". Try a different search term.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => setSearchQuery("")}
                        >
                            Clear Search
                        </Button>
                    </div>
                )}

                {/* Companies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {!isLoading && filteredCompanies.map((company, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={company._id}
                        >
                            <Card className="group h-full flex flex-col overflow-hidden bg-card/40 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] cursor-pointer">
                                <CardContent className="p-6 flex flex-col flex-1 relative">
                                    {/* Background decoration */}
                                    <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />

                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt={company.name} className="w-8 h-8 object-contain" />
                                            ) : (
                                                <Building2 className="w-7 h-7 text-primary" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 relative z-10 space-y-2">
                                        <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                                            {company.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                            {company.description || "Comprehensive placement preparation kits, interview questions, and syllabi."}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between relative z-10">
                                        <Badge variant="secondary" className="bg-primary/5 text-primary-foreground/70 hover:bg-primary/10">
                                            Prep Material
                                        </Badge>
                                        <Link to={`/dashboard/company-prep/${company._id}`}>
                                            <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyPrep;
