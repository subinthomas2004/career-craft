import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  data: ResumeData;
  template: number;
}

const ResumePreview = ({ data, template }: ResumePreviewProps) => {
  const { personalInfo, education, experience, projects, skills, certifications } = data;

  const skillLevelWidth = {
    beginner: "25%",
    intermediate: "50%",
    advanced: "75%",
    expert: "100%",
  };

  // Template styles
  const getTemplateStyles = () => {
    switch (template) {
      case 1: // Modern Professional
        return {
          header: "bg-primary text-primary-foreground",
          section: "border-l-4 border-primary pl-4",
          accent: "text-primary",
        };
      case 2: // Classic Elegant
        return {
          header: "border-b-2 border-foreground",
          section: "border-b border-border pb-2",
          accent: "text-foreground",
        };
      case 3: // Creative Bold
        return {
          header: "bg-gradient-to-r from-primary to-accent text-primary-foreground",
          section: "bg-muted/50 p-3 rounded-lg",
          accent: "text-primary font-bold",
        };
      case 4: // Tech Minimal
        return {
          header: "border-l-4 border-primary pl-4",
          section: "",
          accent: "text-primary font-mono",
        };
      case 5: // Executive
        return {
          header: "bg-foreground text-background",
          section: "border-t border-foreground/20 pt-3",
          accent: "text-foreground font-semibold",
        };
      case 6: // Fresh Graduate
        return {
          header: "bg-primary/10 border border-primary rounded-lg",
          section: "bg-primary/5 p-3 rounded",
          accent: "text-primary",
        };
      default:
        return {
          header: "bg-primary text-primary-foreground",
          section: "",
          accent: "text-primary",
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="bg-background text-foreground p-6 text-sm leading-relaxed min-h-[800px]" id="resume-preview">
      {/* Header */}
      <div className={cn("p-4 rounded-lg mb-6", styles.header)}>
        <h1 className="text-2xl font-bold mb-1">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.summary && (
          <p className="text-sm opacity-90 mt-2">{personalInfo.summary}</p>
        )}
        <div className="flex flex-wrap gap-4 mt-3 text-xs">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {personalInfo.portfolio}
            </span>
          )}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className={cn("text-lg font-bold mb-3", styles.accent)}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className={styles.section}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.position || "Position"}</h3>
                    <p className="text-muted-foreground">
                      {exp.company || "Company"} {exp.location && `• ${exp.location}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm mt-1">{exp.description}</p>
                )}
                {exp.achievements.filter(a => a).length > 0 && (
                  <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                    {exp.achievements.filter(a => a).map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className={cn("text-lg font-bold mb-3", styles.accent)}>
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className={styles.section}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <span>{edu.startDate} - {edu.endDate}</span>
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className={cn("text-lg font-bold mb-3", styles.accent)}>
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className={styles.section}>
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{proj.name}</h3>
                  {proj.link && (
                    <span className="text-xs flex items-center gap-1 text-primary">
                      <ExternalLink className="w-3 h-3" />
                      {proj.link}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-sm mt-1">{proj.description}</p>
                )}
                {proj.technologies.filter(t => t).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.filter(t => t).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className={cn("text-lg font-bold mb-3", styles.accent)}>
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <span className="text-sm flex-1">{skill.name}</span>
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: skillLevelWidth[skill.level] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className={cn("text-lg font-bold mb-3", styles.accent)}>
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <div>
                  <span className="font-medium">{cert.name}</span>
                  <span className="text-muted-foreground"> • {cert.issuer}</span>
                </div>
                <span className="text-xs text-muted-foreground">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
