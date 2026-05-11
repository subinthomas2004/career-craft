import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useResume } from '@/context/ResumeContext';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import {
    createEmptyExperience,
    createEmptyEducation,
    createEmptySkill,
    generateId
} from '@/lib/resume-parser';
import { Experience, Education, Skill, Certification, Project } from '@/types/resume';

export function ResumeEditor() {
    const { resumeData, updateResumeData, setActiveStep } = useResume();
    const { toast } = useToast();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        contact: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: false,
        certifications: false,
    });
    const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

    const generateBulletPoint = async (expId: string, index: number, originalDesc: string, role: string, company: string) => {
        if (!originalDesc.trim()) {
            toast({ title: "Please enter some text first", variant: "destructive" });
            return;
        }

        const key = `${expId}-${index}`;
        setIsGenerating(prev => ({ ...prev, [key]: true }));

        try {
            const response = await api.post('/groq/resume/bullet', {
                role,
                company,
                description: originalDesc
            });

            if (response.data && response.data.success && response.data.bullet) {
                updateExperienceDescription(expId, index, response.data.bullet);
                toast({ title: "Bullet point optimized!" });
            }
        } catch (error) {
            console.error("Failed to generate bullet point:", error);
            toast({ title: "Failed to optimize bullet point", variant: "destructive" });
        } finally {
            setIsGenerating(prev => ({ ...prev, [key]: false }));
        }
    };

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Contact handlers
    const updateContact = (field: string, value: string) => {
        updateResumeData({
            contact: { ...resumeData.contact, [field]: value }
        });
    };

    // Summary handler
    const updateSummary = (value: string) => {
        updateResumeData({ summary: value });
    };

    // Experience handlers
    const addExperience = () => {
        updateResumeData({
            experience: [...resumeData.experience, createEmptyExperience()]
        });
    };

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        updateResumeData({
            experience: resumeData.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        });
    };

    const updateExperienceDescription = (expId: string, index: number, value: string) => {
        updateResumeData({
            experience: resumeData.experience.map(exp =>
                exp.id === expId
                    ? { ...exp, description: exp.description.map((d, i) => i === index ? value : d) }
                    : exp
            )
        });
    };

    const addExperienceBullet = (expId: string) => {
        updateResumeData({
            experience: resumeData.experience.map(exp =>
                exp.id === expId
                    ? { ...exp, description: [...exp.description, ''] }
                    : exp
            )
        });
    };

    const removeExperienceBullet = (expId: string, index: number) => {
        updateResumeData({
            experience: resumeData.experience.map(exp =>
                exp.id === expId
                    ? { ...exp, description: exp.description.filter((_, i) => i !== index) }
                    : exp
            )
        });
    };

    const removeExperience = (id: string) => {
        updateResumeData({
            experience: resumeData.experience.filter(exp => exp.id !== id)
        });
    };

    // Education handlers
    const addEducation = () => {
        updateResumeData({
            education: [...resumeData.education, createEmptyEducation()]
        });
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        updateResumeData({
            education: resumeData.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        });
    };

    const removeEducation = (id: string) => {
        updateResumeData({
            education: resumeData.education.filter(edu => edu.id !== id)
        });
    };

    // Skills handlers
    const addSkill = () => {
        updateResumeData({
            skills: [...resumeData.skills, createEmptySkill()]
        });
    };

    const updateSkill = (id: string, name: string) => {
        updateResumeData({
            skills: resumeData.skills.map(skill =>
                skill.id === id ? { ...skill, name } : skill
            )
        });
    };

    const removeSkill = (id: string) => {
        updateResumeData({
            skills: resumeData.skills.filter(skill => skill.id !== id)
        });
    };

    // Projects handlers
    const addProject = () => {
        const newProject: Project = {
            id: generateId(),
            name: '',
            description: '',
            technologies: [],
            link: '',
        };
        updateResumeData({
            projects: [...resumeData.projects, newProject]
        });
    };

    const updateProject = (id: string, field: keyof Project, value: any) => {
        updateResumeData({
            projects: resumeData.projects.map(proj =>
                proj.id === id ? { ...proj, [field]: value } : proj
            )
        });
    };

    const removeProject = (id: string) => {
        updateResumeData({
            projects: resumeData.projects.filter(proj => proj.id !== id)
        });
    };

    // Certifications handlers
    const addCertification = () => {
        const newCert: Certification = {
            id: generateId(),
            name: '',
            issuer: '',
            date: '',
        };
        updateResumeData({
            certifications: [...resumeData.certifications, newCert]
        });
    };

    const updateCertification = (id: string, field: keyof Certification, value: string) => {
        updateResumeData({
            certifications: resumeData.certifications.map(cert =>
                cert.id === id ? { ...cert, [field]: value } : cert
            )
        });
    };

    const removeCertification = (id: string) => {
        updateResumeData({
            certifications: resumeData.certifications.filter(cert => cert.id !== id)
        });
    };

    return (
        <div className="space-y-4 animate-fade-in pb-20">
            {/* Contact Information */}
            <Collapsible open={openSections.contact} onOpenChange={() => toggleSection('contact')}>
                <Card>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                                {openSections.contact ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={resumeData.contact.name}
                                    onChange={(e) => updateContact('name', e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={resumeData.contact.email}
                                    onChange={(e) => updateContact('email', e.target.value)}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={resumeData.contact.phone}
                                    onChange={(e) => updateContact('phone', e.target.value)}
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={resumeData.contact.location}
                                    onChange={(e) => updateContact('location', e.target.value)}
                                    placeholder="San Francisco, CA"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                                <Input
                                    id="linkedin"
                                    value={resumeData.contact.linkedin || ''}
                                    onChange={(e) => updateContact('linkedin', e.target.value)}
                                    placeholder="linkedin.com/in/johndoe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website (optional)</Label>
                                <Input
                                    id="website"
                                    value={resumeData.contact.website || ''}
                                    onChange={(e) => updateContact('website', e.target.value)}
                                    placeholder="johndoe.com"
                                />
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Professional Summary */}
            <Collapsible open={openSections.summary} onOpenChange={() => toggleSection('summary')}>
                <Card>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Professional Summary</CardTitle>
                                {openSections.summary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent>
                            <Textarea
                                value={resumeData.summary}
                                onChange={(e) => updateSummary(e.target.value)}
                                placeholder="Write a compelling 2-4 sentence summary of your professional background and key qualifications..."
                                className="min-h-[120px]"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                {resumeData.summary.length} characters • Aim for 200-400 characters
                            </p>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Experience */}
            <Collapsible open={openSections.experience} onOpenChange={() => toggleSection('experience')}>
                <Card>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Experience ({resumeData.experience.length})
                                </CardTitle>
                                {openSections.experience ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="space-y-6">
                            {resumeData.experience.map((exp, index) => (
                                <div key={exp.id} className="p-4 border rounded-lg space-y-4 relative">
                                    <div className="absolute top-2 right-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeExperience(exp.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Job Title</Label>
                                            <Input
                                                value={exp.title}
                                                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                                placeholder="Software Engineer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Company</Label>
                                            <Input
                                                value={exp.company}
                                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                                placeholder="Company Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                                value={exp.location}
                                                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                                placeholder="City, State"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1 space-y-2">
                                                <Label>Start Date</Label>
                                                <Input
                                                    value={exp.startDate}
                                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                                    placeholder="Jan 2020"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <Label>End Date</Label>
                                                <Input
                                                    value={exp.endDate}
                                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                                    placeholder="Dec 2022"
                                                    disabled={exp.current}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={exp.current}
                                            onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked)}
                                        />
                                        <Label>Currently working here</Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Responsibilities & Achievements</Label>
                                        {exp.description.map((desc, descIndex) => (
                                            <div key={descIndex} className="flex gap-2 items-center">
                                                <span className="text-muted-foreground">•</span>
                                                <Input
                                                    value={desc}
                                                    onChange={(e) => updateExperienceDescription(exp.id, descIndex, e.target.value)}
                                                    placeholder="Describe an achievement or responsibility (e.g. built a fast api)"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Optimize with AI"
                                                    disabled={isGenerating[`${exp.id}-${descIndex}`] || !desc}
                                                    onClick={() => generateBulletPoint(exp.id, descIndex, desc, exp.title, exp.company)}
                                                >
                                                    <Sparkles className={`w-4 h-4 text-primary ${isGenerating[`${exp.id}-${descIndex}`] ? 'animate-pulse' : ''}`} />
                                                </Button>
                                                {exp.description.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeExperienceBullet(exp.id, descIndex)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addExperienceBullet(exp.id)}
                                            className="mt-2"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Bullet Point
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Button onClick={addExperience} variant="outline" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Experience
                            </Button>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Education */}
            <Collapsible open={openSections.education} onOpenChange={() => toggleSection('education')}>
                <Card>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Education ({resumeData.education.length})
                                </CardTitle>
                                {openSections.education ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="space-y-6">
                            {resumeData.education.map((edu) => (
                                <div key={edu.id} className="p-4 border rounded-lg space-y-4 relative">
                                    <div className="absolute top-2 right-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeEducation(edu.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Degree</Label>
                                            <Input
                                                value={edu.degree}
                                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                                placeholder="Bachelor of Science"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Field of Study</Label>
                                            <Input
                                                value={edu.field}
                                                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                                placeholder="Computer Science"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Institution</Label>
                                            <Input
                                                value={edu.institution}
                                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                                placeholder="University Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                                value={edu.location}
                                                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                                placeholder="City, State"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Graduation Date</Label>
                                            <Input
                                                value={edu.graduationDate}
                                                onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                                                placeholder="May 2020"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GPA (optional)</Label>
                                            <Input
                                                value={edu.gpa || ''}
                                                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                                placeholder="3.8"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Button onClick={addEducation} variant="outline" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Education
                            </Button>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Skills */}
            <Collapsible open={openSections.skills} onOpenChange={() => toggleSection('skills')}>
                <Card>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Skills ({resumeData.skills.length})
                                </CardTitle>
                                {openSections.skills ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {resumeData.skills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full"
                                    >
                                        <Input
                                            value={skill.name}
                                            onChange={(e) => updateSkill(skill.id, e.target.value)}
                                            className="h-6 w-auto min-w-[80px] border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                                            placeholder="Skill name"
                                        />
                                        <button
                                            onClick={() => removeSkill(skill.id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={addSkill} variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Skill
                            </Button>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Certifications */}
            <Collapsible open={openSections.certifications} onOpenChange={() => toggleSection('certifications')}>
                <Card>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Certifications ({resumeData.certifications.length})
                                </CardTitle>
                                {openSections.certifications ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="space-y-4">
                            {resumeData.certifications.map((cert) => (
                                <div key={cert.id} className="flex gap-4 items-start p-3 border rounded-lg">
                                    <div className="flex-1 grid gap-3 sm:grid-cols-3">
                                        <Input
                                            value={cert.name}
                                            onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                            placeholder="Certification name"
                                        />
                                        <Input
                                            value={cert.issuer}
                                            onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                            placeholder="Issuing organization"
                                        />
                                        <Input
                                            value={cert.date}
                                            onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                            placeholder="Date obtained"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeCertification(cert.id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}

                            <Button onClick={addCertification} variant="outline" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Certification
                            </Button>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>

            {/* Projects */}
            <Collapsible open={openSections.projects} onOpenChange={() => toggleSection('projects')}>
                <Card>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Projects ({resumeData.projects.length})
                                </CardTitle>
                                {openSections.projects ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="space-y-6">
                            {resumeData.projects.map((proj) => (
                                <div key={proj.id} className="p-4 border rounded-lg space-y-4 relative">
                                    <div className="absolute top-2 right-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeProject(proj.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Project Name</Label>
                                            <Input
                                                value={proj.name}
                                                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                                placeholder="My Awesome Project"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Link (optional)</Label>
                                            <Input
                                                value={proj.link || ''}
                                                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                                                placeholder="github.com/user/project"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={proj.description}
                                            onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                            placeholder="Brief description of the project..."
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Technologies (comma-separated)</Label>
                                        <Input
                                            value={proj.technologies.join(', ')}
                                            onChange={(e) => updateProject(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                                            placeholder="React, Node.js, MongoDB"
                                        />
                                    </div>
                                </div>
                            ))}

                            <Button onClick={addProject} variant="outline" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Project
                            </Button>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>


        </div>
    );
}
