import { useState } from "react";
import { Link } from "react-router-dom";
import { FullLogo } from "../components/ui/full-logo";
import { Button } from "../components/ui/button";

export function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#0A2647] text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <FullLogo size={36} darkMode={darkMode} />
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setDarkMode(!darkMode)}
            className={darkMode ? 'border-white text-white hover:bg-blue-900' : ''}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <FullLogo size={120} darkMode={darkMode} className="mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect Your Community Anonymously
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            NetWiz helps WhatsApp communities connect members anonymously for mentorship, advice, and collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className={darkMode ? 'border-white text-white hover:bg-blue-900' : ''}>
              <a href="https://github.com/blutrich/Netwiz" target="_blank" rel="noopener noreferrer">View on GitHub</a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`py-6 ${darkMode ? 'bg-[#051630]' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 NetWiz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 