import React, { useState, useRef, useLayoutEffect } from 'react';
import { ResumeData, TemplateId } from '@/types/resume';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe,
  Calendar,
  Circle
} from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateId;
  scale?: number;
}

export function ResumePreview({ data, template, scale = 1 }: ResumePreviewProps) {
  const masterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);

  const PAGE_HEIGHT_PX = 11 * 96; 

  useLayoutEffect(() => {
    if (contentRef.current) {
      const naturalHeight = contentRef.current.scrollHeight;
      if (naturalHeight > PAGE_HEIGHT_PX) {
        const compressionRatio = Math.max(0.3, (PAGE_HEIGHT_PX - 4) / naturalHeight);
        setFitScale(compressionRatio);
      } else {
        setFitScale(1);
      }
    }
  }, [data, template]);

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      case 'bold':
        return <BoldTemplate data={data} />;
      case 'tech':
        return <TechTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      case 'elegant':
        return <ElegantTemplate data={data} />;
      case 'compact':
        return <CompactTemplate data={data} />;
      case 'sidebar':
        return <SidebarTemplate data={data} />;
      case 'corporate':
        return <CorporateTemplate data={data} />;
      case 'designer':
        return <DesignerTemplate data={data} />;
      case 'clean':
        return <CleanTemplate data={data} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div className="flex justify-center" style={{ zoom: scale }}>
      <div 
        id="resume-preview" 
        ref={masterRef}
        className="bg-card shadow-xl relative overflow-hidden"
        style={{ 
          width: '8.5in', 
          height: '11in',
          fontFamily: 'Times New Roman, serif',
        }}
      >
        <div 
          ref={contentRef}
          className="h-full origin-top-left transition-all duration-300 ease-out"
          style={{ 
            transform: `scale(${fitScale})`,
            width: `${100 / fitScale}%`, // Inverse scaling to perfectly restore full-width visually
            height: fitScale < 1 ? 'max-content' : '100%' 
          }}
        >
          {renderTemplate()}
        </div>
        {fitScale < 1 && fitScale > 0.5 && (
          <div className="absolute bottom-2 right-4 px-2 py-1 text-[9px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-full pointer-events-none">
            Condensing to Fit (Scale {Math.round(fitScale * 100)}%)
          </div>
        )}
      </div>
    </div>
  );
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-12 text-[11pt] leading-relaxed" style={{ color: '#1a1a1a' }}>
      {/* Header */}
      <header className="text-center border-b-2 border-foreground pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-wide uppercase">
          {data.contact.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-sm">
          {data.contact.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {data.contact.email}
            </span>
          )}
          {data.contact.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {data.contact.phone}
            </span>
          )}
          {data.contact.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {data.contact.location}
            </span>
          )}
          {data.contact.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {data.contact.linkedin}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-muted-foreground pb-1 mb-3">
            Professional Summary
          </h2>
          <p className="text-justify">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-muted-foreground pb-1 mb-3">
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{exp.title}</h3>
                <span className="text-sm">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between text-sm italic">
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {exp.description.map((desc, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-xs mt-1.5">•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-muted-foreground pb-1 mb-3">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-sm">{edu.graduationDate}</span>
              </div>
              <div className="flex justify-between text-sm italic">
                <span>{edu.institution}</span>
                <span>{edu.location}</span>
              </div>
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-muted-foreground pb-1 mb-3">
            Skills
          </h2>
          <p>{data.skills.map(s => s.name).join(' • ')}</p>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-muted-foreground pb-1 mb-3">
            Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{proj.name}</h3>
                {proj.link && <span className="text-sm italic">{proj.link}</span>}
              </div>
              <p className="mt-1">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-sm mt-1"><strong>Tech:</strong> {proj.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-muted-foreground pb-1 mb-3">
            Certifications
          </h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between mb-1">
              <span className="font-medium">{cert.name}</span>
              <span className="text-sm">{cert.issuer} • {cert.date}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex min-h-[11in]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-1/3 bg-primary/10 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {data.contact.name || 'Your Name'}
          </h1>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-bold text-primary uppercase text-xs tracking-wider mb-2">
              Contact
            </h3>
            <div className="space-y-2 text-muted-foreground">
              {data.contact.email && <p>{data.contact.email}</p>}
              {data.contact.phone && <p>{data.contact.phone}</p>}
              {data.contact.location && <p>{data.contact.location}</p>}
            </div>
          </div>

          {data.skills.length > 0 && (
            <div>
              <h3 className="font-bold text-primary uppercase text-xs tracking-wider mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1">
                {data.skills.map(skill => (
                  <span 
                    key={skill.id} 
                    className="px-2 py-0.5 bg-primary/20 text-foreground rounded text-xs"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="font-bold text-primary uppercase text-xs tracking-wider mb-2">
                Languages
              </h3>
              {data.languages.map((lang, i) => (
                <p key={i} className="text-muted-foreground">
                  {lang.name} – {lang.proficiency}
                </p>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-1 mb-3">
              Profile
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-1 mb-3">
              Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-bold text-foreground">{exp.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-primary">{exp.company}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {exp.description.map((desc, i) => (
                    <li key={i}>• {desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-1 mb-3">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-bold text-foreground">{edu.degree} in {edu.field}</h3>
                  <span className="text-xs text-muted-foreground">{edu.graduationDate}</span>
                </div>
                <p className="text-sm text-primary">{edu.institution}</p>
              </div>
            ))}
          </section>
        )}
        {data.projects && data.projects.length > 0 && (
          <section className="mt-6 mb-6">
            <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-1 mb-3">
              Projects
            </h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-4">
                <h3 className="font-bold text-foreground">{proj.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs text-primary mt-1">Tech: {proj.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </section>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold text-primary border-b border-primary/30 pb-1 mb-3">
              Certifications
            </h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <p className="text-sm font-bold text-foreground">{cert.name}</p>
                <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.date}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-12 text-[11pt]" style={{ fontFamily: 'Helvetica, sans-serif', color: '#333' }}>
      <header className="mb-8">
        <h1 className="text-4xl font-light tracking-tight">
          {data.contact.name || 'Your Name'}
        </h1>
        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-8">
          <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium">{exp.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{exp.company}, {exp.location}</p>
              <ul className="space-y-1 text-sm">
                {exp.description.map((desc, i) => (
                  <li key={i}>— {desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {data.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Skills
            </h2>
            <p className="text-sm">{data.skills.map(s => s.name).join(', ')}</p>
          </section>
        )}
      </div>
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <h3 className="font-medium">{proj.name}</h3>
              <p className="text-sm text-muted-foreground">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-xs italic text-muted-foreground mt-1">{proj.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </section>
      )}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Certifications
          </h2>
          <ul className="space-y-1 text-sm">
            {data.certifications.map((cert) => (
              <li key={cert.id} className="text-muted-foreground">
                {cert.name} — {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ExecutiveTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-10" style={{ fontFamily: 'Georgia, serif' }}>
      <header className="flex items-start gap-6 border-b-4 border-primary pb-6 mb-6">
        {data.contact.photo && (
          <img 
            src={data.contact.photo} 
            alt={data.contact.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {data.contact.name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            {data.contact.email && <span>{data.contact.email}</span>}
            {data.contact.phone && <span>{data.contact.phone}</span>}
            {data.contact.location && <span>{data.contact.location}</span>}
          </div>
        </div>
      </header>

      {data.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-primary mb-3">Executive Summary</h2>
          <p className="text-muted-foreground italic leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-primary mb-4">Professional Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-6 pl-4 border-l-2 border-primary/30">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-bold text-foreground">{exp.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-primary font-medium">{exp.company}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {exp.description.map((desc, i) => (
                  <li key={i} className="flex gap-2">
                    <Circle className="w-1.5 h-1.5 mt-2 fill-primary text-primary flex-shrink-0" />
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {data.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-primary mb-3">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <p className="font-bold">{edu.degree} in {edu.field}</p>
                <p className="text-sm">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}

        {data.certifications.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-primary mb-3">Certifications</h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-muted-foreground">{cert.issuer}, {cert.date}</p>
              </div>
            ))}
          </section>
        )}
      </div>
      {data.projects && data.projects.length > 0 && (
        <section className="mt-6 mb-6">
          <h2 className="text-lg font-bold text-primary mb-4">Key Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-4 pl-4 border-l-2 border-primary/30">
              <h3 className="text-lg font-bold text-foreground">{proj.name}</h3>
              <p className="text-muted-foreground italic text-sm mb-1">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-xs text-primary">Technology Stack: {proj.technologies.join(', ')}</p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function BoldTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="min-h-[11in]" style={{ fontFamily: 'Arial Black, sans-serif' }}>
      <header className="bg-foreground text-background p-8">
        <h1 className="text-4xl font-black uppercase tracking-tight">
          {data.contact.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-6 mt-4 text-sm opacity-80">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
        </div>
      </header>

      <main className="p-8">
        {data.summary && (
          <section className="mb-8">
            <p className="text-lg leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
              {data.summary}
            </p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-foreground pb-2">
              Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-6">
                <h3 className="text-xl font-black uppercase">{exp.title}</h3>
                <div className="flex justify-between text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <span className="font-bold">{exp.company}</span>
                  <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="mt-3 space-y-1 text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {exp.description.map((desc, i) => (
                    <li key={i}>▪ {desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {data.education.length > 0 && (
            <section>
              <h2 className="text-xl font-black uppercase mb-3 border-b-4 border-foreground pb-2">
                Education
              </h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-3" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <p className="font-bold">{edu.degree}</p>
                  <p className="text-sm">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
                </div>
              ))}
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-black uppercase mb-3 border-b-4 border-foreground pb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                {data.skills.map(skill => (
                  <span 
                    key={skill.id} 
                    className="px-3 py-1 bg-foreground text-background text-sm font-bold"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
        {data.projects && data.projects.length > 0 && (
          <section className="mt-8 mb-8">
            <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-foreground pb-2">
              Featured Projects
            </h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-6">
                <h3 className="text-xl font-black uppercase">{proj.name}</h3>
                <p className="text-sm mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs font-bold mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Tech stack: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-foreground pb-2">
              Certifications
            </h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-3" style={{ fontFamily: 'Arial, sans-serif' }}>
                <p className="font-bold text-lg">{cert.name}</p>
                <p className="text-sm">{cert.issuer} | {cert.date}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function TechTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-8" style={{ fontFamily: 'Consolas, monospace', fontSize: '10pt' }}>
      <header className="mb-6 pb-4 border-b border-dashed border-muted-foreground">
        <div className="flex items-baseline gap-2">
          <span className="text-info">const</span>
          <h1 className="text-2xl font-bold text-foreground">
            {(data.contact.name || 'Developer').replace(/\s+/g, '_')}
          </h1>
          <span className="text-muted-foreground">= {'{'}</span>
        </div>
        <div className="pl-6 text-sm space-y-1 mt-2">
          {data.contact.email && (
            <p><span className="text-accent">email</span>: "{data.contact.email}",</p>
          )}
          {data.contact.phone && (
            <p><span className="text-accent">phone</span>: "{data.contact.phone}",</p>
          )}
          {data.contact.location && (
            <p><span className="text-accent">location</span>: "{data.contact.location}",</p>
          )}
          {data.contact.website && (
            <p><span className="text-accent">website</span>: "{data.contact.website}",</p>
          )}
        </div>
        <span className="text-muted-foreground">{'};'}</span>
      </header>

      {data.summary && (
        <section className="mb-6">
          <p className="text-muted-foreground">// {data.summary}</p>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-6">
          <p className="text-info mb-2">const skills = [</p>
          <div className="pl-6 flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={skill.id} className="text-accent">
                "{skill.name}"{i < data.skills.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground">];</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <p className="text-info mb-2">const experience = [</p>
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="pl-6 mb-4">
              <p className="text-muted-foreground">{'{'}</p>
              <div className="pl-4">
                <p><span className="text-accent">role</span>: "{exp.title}",</p>
                <p><span className="text-accent">company</span>: "{exp.company}",</p>
                <p><span className="text-accent">period</span>: "{exp.startDate} - {exp.current ? 'present' : exp.endDate}",</p>
                <p><span className="text-accent">highlights</span>: [</p>
                <div className="pl-4">
                  {exp.description.map((desc, i) => (
                    <p key={i} className="text-sm">"{desc}"{i < exp.description.length - 1 ? ',' : ''}</p>
                  ))}
                </div>
                <p>]</p>
              </div>
              <p className="text-muted-foreground">{'}'}{index < data.experience.length - 1 ? ',' : ''}</p>
            </div>
          ))}
          <p className="text-muted-foreground">];</p>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <p className="text-info mb-2">const education = [</p>
          {data.education.map((edu, index) => (
            <div key={edu.id} className="pl-6 mb-2">
              <p className="text-muted-foreground">{'{'}</p>
              <div className="pl-4">
                <p><span className="text-accent">degree</span>: "{edu.degree} in {edu.field}",</p>
                <p><span className="text-accent">school</span>: "{edu.institution}",</p>
                <p><span className="text-accent">year</span>: "{edu.graduationDate}"</p>
              </div>
              <p className="text-muted-foreground">{'}'}{index < data.education.length - 1 ? ',' : ''}</p>
            </div>
          ))}
          <p className="text-muted-foreground">];</p>
        </section>
      )}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <p className="text-info mb-2">const projects = [</p>
          {data.projects.map((proj, idx) => (
            <div key={proj.id} className="pl-6 mb-2">
              <p className="text-muted-foreground">{'{'}</p>
              <div className="pl-4">
                <p><span className="text-accent">name</span>: "{proj.name}",</p>
                <p><span className="text-accent">desc</span>: "{proj.description}"</p>
              </div>
              <p className="text-muted-foreground">{'}'}{idx < data.projects.length - 1 ? ',' : ''}</p>
            </div>
          ))}
          <p className="text-muted-foreground">];</p>
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section>
          <p className="text-info mb-2">const certifications = [</p>
          {data.certifications.map((cert, idx) => (
            <div key={cert.id} className="pl-6 mb-1">
              <p className="text-muted-foreground">{'{'} <span className="text-accent">n</span>: "{cert.name}", <span className="text-accent">d</span>: "{cert.date}" {'}'}{idx < data.certifications.length - 1 ? ',' : ''}</p>
            </div>
          ))}
          <p className="text-muted-foreground">];</p>
        </section>
      )}
    </div>
  );
}

function CreativeTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="min-h-[11in]" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <header className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-primary-foreground p-8">
        {data.contact.photo && (
          <img 
            src={data.contact.photo} 
            alt={data.contact.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-primary-foreground/30 mb-4"
          />
        )}
        <h1 className="text-3xl font-bold">
          {data.contact.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-90">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
        </div>
      </header>

      <main className="p-8">
        {data.summary && (
          <section className="mb-6">
            <p className="text-muted-foreground text-lg italic border-l-4 border-primary pl-4">
              {data.summary}
            </p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary"></span>
              Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-5 ml-10">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-foreground">{exp.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-primary font-medium">{exp.company}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {exp.description.map((desc, i) => (
                    <li key={i}>○ {desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {data.education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary"></span>
                Education
              </h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-3 ml-10">
                  <p className="font-bold">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
                </div>
              ))}
            </section>
          )}

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary"></span>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 ml-10">
                {data.skills.map(skill => (
                  <span 
                    key={skill.id} 
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
        {data.projects && data.projects.length > 0 && (
          <section className="mt-8 mb-6">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary"></span>
              Projects
            </h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-5 ml-10">
                <h3 className="font-bold text-foreground">{proj.name}</h3>
                <p className="text-sm text-muted-foreground">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs text-primary font-medium mt-1">Build Tools: {proj.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <section className="mt-8 mb-6">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary"></span>
              Certificates
            </h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-3 ml-10">
                <p className="font-bold text-foreground text-sm">{cert.name}</p>
                <p className="text-xs text-muted-foreground">{cert.issuer}, {cert.date}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function ProfessionalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-10" style={{ fontFamily: 'Cambria, serif', color: '#2d3748' }}>
      <header className="text-center mb-8 pb-4 border-b-2 border-primary">
        <h1 className="text-3xl font-bold text-foreground tracking-wide">
          {data.contact.name || 'Your Name'}
        </h1>
        <div className="flex justify-center gap-6 mt-3 text-sm text-muted-foreground">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
            Professional Summary
          </h2>
          <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
            Professional Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-foreground">{exp.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-primary font-medium">{exp.company} | {exp.location}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {exp.description.map((desc, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <p className="font-bold">{edu.degree} in {edu.field}</p>
                <p className="text-sm">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">
              Core Competencies
            </h2>
            <ul className="grid grid-cols-2 gap-1 text-sm">
              {data.skills.map(skill => (
                <li key={skill.id}>• {skill.name}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {data.projects && data.projects.length > 0 && (
        <section className="mt-8 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
            Selected Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-5">
              <h3 className="font-bold text-foreground">{proj.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
            Certifications
          </h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="mb-3 text-sm">
              <span className="font-bold">{cert.name}</span> — <span className="italic text-muted-foreground">{cert.issuer}, {cert.date}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function ElegantTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-12" style={{ fontFamily: 'Garamond, serif' }}>
      <header className="flex items-center gap-6 mb-8">
        {data.contact.photo && (
          <img 
            src={data.contact.photo} 
            alt={data.contact.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-muted"
          />
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-normal tracking-wide text-foreground">
            {data.contact.name || 'Your Name'}
          </h1>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            {data.contact.email && <span>{data.contact.email}</span>}
            {data.contact.phone && <span>{data.contact.phone}</span>}
          </div>
        </div>
      </header>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-muted-foreground to-transparent mb-8"></div>

      {data.summary && (
        <section className="mb-8">
          <p className="text-lg italic text-muted-foreground leading-relaxed">
            {data.summary}
          </p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-normal uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xl font-normal text-foreground">{exp.title}</h3>
                <span className="text-sm text-muted-foreground italic">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-primary">{exp.company}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-12">
        {data.education.length > 0 && (
          <section>
            <h2 className="text-lg font-normal uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <p className="text-lg">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.institution}, {edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-normal uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Expertise
            </h2>
            <p className="text-sm leading-relaxed">
              {data.skills.map(s => s.name).join(' · ')}
            </p>
          </section>
        )}
      </div>
      {data.projects && data.projects.length > 0 && (
        <section className="mt-12 mb-8">
          <h2 className="text-lg font-normal uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-6">
              <h3 className="text-xl font-normal text-foreground mb-1">{proj.name}</h3>
              <p className="text-sm italic text-muted-foreground leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-normal uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Certifications
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm font-normal">
            {data.certifications.map((cert) => (
              <div key={cert.id}>
                <p className="text-foreground font-medium">{cert.name}</p>
                <p className="text-xs italic text-muted-foreground">{cert.issuer} | {cert.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CompactTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-6 text-[9pt]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <header className="flex justify-between items-start mb-4 pb-2 border-b border-muted">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {data.contact.name || 'Your Name'}
          </h1>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          {data.contact.email && <p>{data.contact.email}</p>}
          {data.contact.phone && <p>{data.contact.phone}</p>}
          {data.contact.location && <p>{data.contact.location}</p>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-3">
          <p className="text-muted-foreground text-xs">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-3">
          <h2 className="text-xs font-bold uppercase bg-muted px-2 py-1 mb-2">Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs">{exp.title}</span>
                <span className="text-xs text-muted-foreground">
                  {exp.startDate}–{exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-xs text-primary">{exp.company}</p>
              <ul className="mt-1 space-y-0.5 text-xs">
                {exp.description.slice(0, 3).map((desc, i) => (
                  <li key={i}>• {desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-3 gap-4">
        {data.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase bg-muted px-2 py-1 mb-2">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-1 text-xs">
                <p className="font-bold">{edu.degree}</p>
                <p className="text-muted-foreground">{edu.institution}</p>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section className="col-span-2">
            <h2 className="text-xs font-bold uppercase bg-muted px-2 py-1 mb-2">Skills</h2>
            <p className="text-xs">{data.skills.map(s => s.name).join(', ')}</p>
          </section>
        )}
      </div>
      {data.projects && data.projects.length > 0 && (
        <section className="mt-3 mb-3">
          <h2 className="text-xs font-bold uppercase bg-muted px-2 py-1 mb-2">Projects</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-2 text-xs">
              <p className="font-bold text-foreground">{proj.name}</p>
              <p className="text-muted-foreground">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mt-3 mb-3">
          <h2 className="text-xs font-bold uppercase bg-muted px-2 py-1 mb-2">Certifications</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.certifications.map((cert) => (
              <p key={cert.id}>{cert.name} • <span className="italic text-muted-foreground">{cert.date}</span></p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// New Templates

function SidebarTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex min-h-[11in]" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-2/5 bg-primary/10 p-8">
        {data.contact.photo && (
          <img 
            src={data.contact.photo} 
            alt={data.contact.name}
            className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-primary/30"
          />
        )}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {data.contact.name || 'Your Name'}
          </h1>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-bold text-primary uppercase text-xs tracking-wider mb-3 border-b border-primary/30 pb-1">
              Contact
            </h3>
            <div className="space-y-2 text-muted-foreground">
              {data.contact.email && <p className="flex items-center gap-2"><Mail className="w-3 h-3" />{data.contact.email}</p>}
              {data.contact.phone && <p className="flex items-center gap-2"><Phone className="w-3 h-3" />{data.contact.phone}</p>}
              {data.contact.location && <p className="flex items-center gap-2"><MapPin className="w-3 h-3" />{data.contact.location}</p>}
            </div>
          </div>

          {data.skills.length > 0 && (
            <div>
              <h3 className="font-bold text-primary uppercase text-xs tracking-wider mb-3 border-b border-primary/30 pb-1">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span 
                    key={skill.id} 
                    className="px-2 py-1 bg-primary/20 text-foreground rounded-full text-xs"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div>
              <h3 className="font-bold text-primary uppercase text-xs tracking-wider mb-3 border-b border-primary/30 pb-1">
                Languages
              </h3>
              {data.languages.map((lang, i) => (
                <p key={i} className="text-muted-foreground text-sm mb-1">
                  {lang.name} – {lang.proficiency}
                </p>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-primary mb-3">About Me</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-primary mb-4">Experience</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between">
                  <h3 className="font-bold text-foreground">{exp.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-primary">{exp.company}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {exp.description.map((desc, i) => (
                    <li key={i}>• {desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-primary mb-3">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-bold text-foreground">{edu.degree} in {edu.field}</h3>
                <p className="text-sm text-muted-foreground">{edu.institution}, {edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.projects && data.projects.length > 0 && (
          <section className="mt-6 mb-6">
            <h2 className="text-lg font-bold text-primary mb-3">Projects</h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-4">
                <h3 className="font-bold text-foreground">{proj.name}</h3>
                <p className="text-sm text-muted-foreground">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mt-6 mb-6">
            <h2 className="text-lg font-bold text-primary mb-3">Certifications</h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-2 text-sm">
                <span className="font-bold">{cert.name}</span> — {cert.issuer}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function CorporateTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-10" style={{ fontFamily: 'Times New Roman, serif' }}>
      <header className="border-b-2 border-foreground pb-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-wide">
          {data.contact.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-6 mt-3 text-sm text-muted-foreground">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
          {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-2">
            Professional Summary
          </h2>
          <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
            Professional Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-foreground">{exp.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-sm font-medium">{exp.company}, {exp.location}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {exp.description.map((desc, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-3">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <p className="font-bold">{edu.degree} in {edu.field}</p>
                <p className="text-sm">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">{edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-3">
              Skills
            </h2>
            <p className="text-sm">{data.skills.map(s => s.name).join(' • ')}</p>
          </section>
        )}
      </div>
      {data.projects && data.projects.length > 0 && (
        <section className="mt-6 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
            Major Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-5">
              <h3 className="font-bold text-foreground">{proj.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mt-6 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
            Certifications
          </h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between mb-2 text-sm">
              <span>{cert.name}</span>
              <span className="italic text-muted-foreground">{cert.issuer} | {cert.date}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function DesignerTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex min-h-[11in]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Left Column */}
      <aside className="w-1/3 bg-gradient-to-b from-accent/30 to-accent/10 p-6">
        {data.contact.photo && (
          <img 
            src={data.contact.photo} 
            alt={data.contact.name}
            className="w-28 h-28 rounded-lg object-cover mx-auto mb-4"
          />
        )}
        
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-bold text-accent uppercase text-xs tracking-wider mb-3">
              Contact
            </h3>
            <div className="space-y-2 text-muted-foreground">
              {data.contact.email && <p>{data.contact.email}</p>}
              {data.contact.phone && <p>{data.contact.phone}</p>}
              {data.contact.location && <p>{data.contact.location}</p>}
              {data.contact.website && <p>{data.contact.website}</p>}
            </div>
          </div>

          {data.skills.length > 0 && (
            <div>
              <h3 className="font-bold text-accent uppercase text-xs tracking-wider mb-3">
                Expertise
              </h3>
              <div className="space-y-2">
                {data.skills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Right Column */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {data.contact.name || 'Your Name'}
          </h1>
          {data.summary && (
            <p className="text-muted-foreground mt-3 leading-relaxed">{data.summary}</p>
          )}
        </header>

        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent"></span>
              Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between">
                  <h3 className="font-bold text-foreground">{exp.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-accent text-sm">{exp.company}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {exp.description.map((desc, i) => (
                    <li key={i}>→ {desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent"></span>
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-bold text-foreground">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">{edu.institution}, {edu.graduationDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.projects && data.projects.length > 0 && (
          <section className="mt-8 mb-6">
            <h2 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent"></span>
              Projects
            </h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-5">
                <h3 className="font-bold text-foreground">{proj.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mt-8 mb-6">
            <h2 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-accent"></span>
              Licenses & Certs
            </h2>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-2 text-sm">
                <p className="font-bold text-foreground">{cert.name}</p>
                <p className="text-xs text-muted-foreground">{cert.issuer} - {cert.date}</p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function CleanTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-14" style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
      <header className="mb-10">
        <h1 className="text-4xl font-light text-foreground tracking-tight">
          {data.contact.name || 'Your Name'}
        </h1>
        <div className="flex gap-6 mt-3 text-sm text-muted-foreground">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
        </div>
      </header>

      {data.summary && (
        <section className="mb-10">
          <p className="text-muted-foreground">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-foreground">{exp.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-12">
        {data.education.length > 0 && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Skills
            </h2>
            <p className="text-sm text-muted-foreground">{data.skills.map(s => s.name).join(', ')}</p>
          </section>
        )}
      </div>
      {data.projects && data.projects.length > 0 && (
        <section className="mt-12 mb-10">
          <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Projects
          </h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mb-6">
              <h3 className="font-medium text-foreground mb-1">{proj.name}</h3>
              <p className="text-sm text-muted-foreground">{proj.description}</p>
            </div>
          ))}
        </section>
      )}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Certifications
          </h2>
          <div className="space-y-3">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="text-sm">
                <span className="text-foreground font-medium">{cert.name}</span>
                <span className="text-muted-foreground"> — {cert.issuer}, {cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
