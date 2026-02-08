import { ResumeProvider, useResume } from '@/context/ResumeContext';
import { TemplateGallery } from '@/components/resume-builder/TemplateGallery';
import { ResumeAnalyzer as ResumeAnalyzerComponent } from '@/components/resume-builder/ResumeAnalyzer';
import { ResumeBuilder } from '@/components/resume-builder/ResumeBuilder';
import { ExportPanel } from '@/components/resume-builder/ExportPanel';
// import { DashboardLayout } from '@/components/layout/DashboardLayout';

function ResumePageContent() {
  const { activeStep } = useResume();

  // Render the appropriate component based on the active step
  const renderStep = () => {
    switch (activeStep) {
      case 'template':
        return <TemplateGallery />;
      case 'analyze':
      case 'upload':
        // The ResumeAnalyzer component handles both upload and analyze views
        return <ResumeAnalyzerComponent />;
      case 'edit':
        return <ResumeBuilder />;
      case 'export':
        return <ExportPanel />;
      default:
        return <ResumeAnalyzerComponent />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background font-sans text-foreground animate-fade-in">
      {renderStep()}
    </div>
  );
}

const ResumeAnalyzerPage = () => {
  return (
    <ResumeProvider>
      <ResumePageContent />
    </ResumeProvider>
  );
};

export default ResumeAnalyzerPage;
