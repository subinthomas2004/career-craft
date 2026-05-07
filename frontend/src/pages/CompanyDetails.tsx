import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Building2,
    ArrowLeft,
    Search,
    FileText,
    FileQuestion,
    BookOpen,
    Folder,
    Download,
    Eye,
    Loader2,
    ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Company } from "./CompanyPrep";
import { cn } from "@/lib/utils";

export interface Material {
    _id: string;
    title: string;
    type: string;
    cloudUrl: string;
}

const CompanyDetails = () => {
    const { id } = useParams();
    const [company, setCompany] = useState<Company | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");

    // PDF Viewer Modal
    const [selectedPdf, setSelectedPdf] = useState<Material | null>(null);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const [companyRes, materialsRes] = await Promise.all([
                    api.get(`/companies/${id}`),
                    api.get(`/companies/${id}/materials`)
                ]);
                setCompany(companyRes.data);
                setMaterials(materialsRes.data);
            } catch (error) {
                console.error("Failed to fetch company details", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchCompanyData();
    }, [id]);

    // Derived unique tabs based on material types
    const materialTypes = ["All", ...Array.from(new Set(materials.map(m => m.type)))];

    const filteredMaterials = materials.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "All" || material.type === activeTab;
        return matchesSearch && matchesTab;
    });

    const getIconForType = (type: string) => {
        switch (type) {
            case 'PYQ': return <FileQuestion className="w-5 h-5 text-amber-500" />;
            case 'Quiz': return <FileText className="w-5 h-5 text-blue-500" />;
            case 'Syllabus': return <BookOpen className="w-5 h-5 text-emerald-500" />;
            case 'Notes': return <BookOpen className="w-5 h-5 text-purple-500" />;
            default: return <Folder className="w-5 h-5 text-primary" />;
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case 'PYQ': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case 'Quiz': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case 'Syllabus': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case 'Notes': return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            default: return "bg-primary/10 text-primary border-primary/20";
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 p-6 md:p-8 min-h-screen flex items-center justify-center">
                <div className="flex flex-col justify-center items-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Loading {company?.name} materials...</p>
                </div>
            </div>
        );
    }

    if (!company) return <div>Company not found</div>;

    return (
        <div className="flex-1 p-6 md:p-8 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Navigation & Header */}
                <div className="space-y-6">


                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end bg-card/40 backdrop-blur-md p-6 rounded-3xl border border-border/40 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                                {company.logoUrl ? (
                                    <img src={company.logoUrl} alt={company.name} className="w-12 h-12 object-contain" />
                                ) : (
                                    <Building2 className="w-10 h-10 text-primary" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                                    {company.name}
                                </h1>
                                <p className="text-muted-foreground max-w-xl">
                                    {company.description || `Prepare specifically for ${company.name} with curated placement materials, previous year questions, and syllabi.`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 relative z-10">
                            <div className="text-center px-4 py-2 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50">
                                <div className="text-2xl font-bold text-primary">{materials.length}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Resources</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Main List */}
                    <div className="md:col-span-3 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/30 p-2 rounded-2xl border border-border/40">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                                <TabsList className="bg-transparent space-x-2">
                                    {materialTypes.map(type => (
                                        <TabsTrigger
                                            key={type}
                                            value={type}
                                            className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                                        >
                                            {type}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>

                            <div className="relative w-full sm:w-64 shrink-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search resources..."
                                    className="pl-9 bg-card border-border/40 focus:border-primary rounded-xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {filteredMaterials.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center p-12 text-center bg-card/20 rounded-3xl border border-dashed border-border/60"
                                    >
                                        <BookOpen className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                                        <p className="text-muted-foreground max-w-sm">
                                            We couldn't find any materials matching your criteria.
                                        </p>
                                    </motion.div>
                                ) : (
                                    filteredMaterials.map((material, index) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2, delay: index * 0.03 }}
                                            key={material._id}
                                        >
                                            <Card className="group overflow-hidden bg-card/40 backdrop-blur-sm border-border/40 hover:border-primary/30 transition-all duration-300">
                                                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                                                        getColorForType(material.type)
                                                    )}>
                                                        {getIconForType(material.type)}
                                                    </div>

                                                    <div className="flex-1 text-center sm:text-left">
                                                        <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                                                            {material.title}
                                                        </h3>
                                                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                                                            <Badge variant="outline" className={cn("text-xs border", getColorForType(material.type))}>
                                                                {material.type}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">PDF Document</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                                        <Button
                                                            variant="secondary"
                                                            className="w-full sm:w-auto bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors"
                                                            onClick={() => setSelectedPdf(material)}
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="shrink-0"
                                                            onClick={() => {
                                                                // Direct download link or open in new tab
                                                                window.open(material.cloudUrl, '_blank');
                                                            }}
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 hidden md:block">
                        <Card className="bg-card/40 backdrop-blur-sm border-border/40">
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    Prep Strategy
                                </h3>
                                <div className="space-y-4 text-sm text-muted-foreground">
                                    <p>
                                        <strong>1. Syllabus First:</strong> Review the syllabus document to understand the rounds.
                                    </p>
                                    <p>
                                        <strong>2. Core Concepts:</strong> Read through the theory notes.
                                    </p>
                                    <p>
                                        <strong>3. PYQs:</strong> Solve previous year questions (PYQs) to understand the pattern.
                                    </p>
                                    <p>
                                        <strong>4. Practice:</strong> Attempt quizzes to test your speed and accuracy.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>

            {/* Modern PDF Viewer Modal */}
            <Dialog open={!!selectedPdf} onOpenChange={(open) => !open && setSelectedPdf(null)}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl">
                    <DialogHeader className="p-4 border-b border-border/40 flex-row justify-between items-center shrink-0 bg-card/50">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center border",
                                getColorForType(selectedPdf?.type || 'Document')
                            )}>
                                {getIconForType(selectedPdf?.type || 'Document')}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold leading-none">{selectedPdf?.title}</DialogTitle>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-4 border", getColorForType(selectedPdf?.type || 'Document'))}>
                                        {selectedPdf?.type}
                                    </Badge>
                                    <span>{company?.name} Resource</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => window.open(selectedPdf?.cloudUrl, '_blank')}
                            className="gap-2 shrink-0 mr-8"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                        </Button>
                    </DialogHeader>

                    <div className="flex-1 w-full bg-muted/30 relative py-2 px-2 md:px-6">
                        {selectedPdf && (
                            <iframe
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedPdf.cloudUrl)}&embedded=true`}
                                title={selectedPdf.title}
                                className="w-full h-full rounded-xl shadow-lg border border-border/50 bg-white"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CompanyDetails;
