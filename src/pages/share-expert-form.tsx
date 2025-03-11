import { ExpertForm } from "../components/forms/expert-form";
import { FullLogo } from "../components/ui/full-logo";

export function ShareExpertFormPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b">
        <FullLogo size={30} darkMode={false} />
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Join Our Expert Network</h1>
            <p className="text-muted-foreground">
              Share your expertise with our community and help others succeed
            </p>
          </div>
          <ExpertForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 border-t mt-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NetWizBot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 