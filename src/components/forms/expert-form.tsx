import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { toast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ExpertFormData {
  fullName: string;
  companyName: string;
  sector: string;
  domain: string;
  role: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
  availability: "Open To help" | "Not available";
}

interface ExpertFormProps {
  onClose?: () => void;
}

export function ExpertForm({ onClose }: ExpertFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExpertFormData>({
    fullName: "",
    companyName: "",
    sector: "",
    domain: "",
    role: "",
    phone: "",
    email: "",
    linkedin: "",
    location: "",
    availability: "Open To help"
  });

  const availabilityOptions = [
    "Open To help",
    "Not available"
  ] as const;

  const sectorOptions = [
    "Technology",
    "Healthcare & Life Sciences",
    "Finance & Banking",
    "Education & EdTech",
    "Energy & Sustainability",
    "Consulting & Professional Services",
    "Corporate Leadership & Management",
    "Artificial Intelligence & Machine Learning",
    "Human Resources & Talent Management",
    "Government & Public Policy",
    "Retail & E-Commerce",
    "Manufacturing & Industrial Automation",
    "Logistics & Supply Chain",
    "Real Estate & Property Management",
    "Legal & Compliance",
    "Media & Entertainment",
    "Marketing & Advertising",
    "Cybersecurity & Data Protection",
    "Agriculture & FoodTech",
    "Aerospace & Defense",
    "Other"
  ] as const;

  const domainOptions = [
    "Software Development & Engineering",
    "Data Science & Analytics",
    "Cloud Computing & DevOps",
    "Cybersecurity & Information Security",
    "Digital Transformation & IT Strategy",
    "Financial Services & FinTech",
    "Investment & Wealth Management",
    "Healthcare Technology & Digital Health",
    "Biotechnology & Genomics",
    "Education Technology (EdTech)",
    "AI & Machine Learning",
    "Human-Computer Interaction & UI/UX",
    "Corporate Strategy & Operations",
    "Renewable Energy & Sustainable Technologies",
    "E-Commerce & Online Marketplaces",
    "Supply Chain Management & Logistics",
    "Real Estate & Urban Planning",
    "LegalTech & Regulatory Compliance",
    "Media Production & Content Creation",
    "Marketing Automation & Growth Hacking",
    "Other"
  ] as const;

  const validateForm = () => {
    // All fields are required now
    const requiredFields = Object.keys(formData);
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: "Validation Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    // Phone validation (WhatsApp format)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid phone number (E.164 format, e.g., +1234567890)",
        variant: "destructive"
      });
      return false;
    }

    // LinkedIn URL validation
    if (!formData.linkedin.includes('linkedin.com/')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid LinkedIn profile URL",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        phone: formData.phone.replace(/\D/g, '').startsWith('+') 
          ? formData.phone.replace(/\D/g, '') 
          : `+${formData.phone.replace(/\D/g, '')}`,
        linkedin: formData.linkedin.startsWith('http') 
          ? formData.linkedin 
          : `https://${formData.linkedin}`
      };

      const data = {
        type: "expert_submission",
        data: submissionData,
        metadata: {
          source: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: submissionData.submittedAt
        }
      };

      const response = await fetch(
        process.env.NODE_ENV === 'development' 
          ? 'http://localhost:9999/.netlify/functions/submit-expert'
          : '/.netlify/functions/submit-expert',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify(data)
        }
      ).catch(error => {
        console.error('Network error:', error);
        throw new Error(
          process.env.NODE_ENV === 'development'
            ? `Network error - Make sure Netlify Dev server is running (netlify dev): ${error.message}`
            : 'Network error - Please check your connection and try again'
        );
      });

      if (!response) {
        throw new Error('No response received from server');
      }

      const text = await response.text();
      console.log('Server response:', text);

      let responseData;
      try {
        responseData = text ? JSON.parse(text) : { success: false, message: 'Empty response from server' };
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error(`Server returned invalid JSON: ${text.substring(0, 100)}`);
      }

      if (!responseData.success) {
        throw new Error(
          responseData.message || 
          responseData.error || 
          `Submission failed with status ${response.status}`
        );
      }

      toast({
        title: "Success",
        description: "Thank you for joining our expert network! We'll be in touch soon.",
        variant: "default"
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to submit expert information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Join Our Expert Network</CardTitle>
        <CardDescription>
          Share your expertise and help others succeed. All fields are required to ensure the best matching with requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium">
                Company Name *
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sector" className="text-sm font-medium">
                Sector *
              </label>
              <Select
                value={formData.sector}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectorOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="domain" className="text-sm font-medium">
                Domain *
              </label>
              <Select
                value={formData.domain}
                onValueChange={(value) => setFormData(prev => ({ ...prev, domain: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your domain" />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role *
              </label>
              <input
                id="role"
                name="role"
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={formData.role}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone (WhatsApp) *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+1234567890"
                className="w-full p-2 border rounded-md"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-2 border rounded-md"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="linkedin" className="text-sm font-medium flex items-center gap-2">
                LinkedIn Profile *
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                required
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full p-2 border rounded-md"
                value={formData.linkedin}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500">Share your LinkedIn profile to enhance credibility and networking opportunities</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="City, Country"
                className="w-full p-2 border rounded-md"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="availability" className="text-sm font-medium">
                Availability *
              </label>
              <Select
                value={formData.availability}
                onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value as "Open To help" | "Not available" }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Join Network'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 