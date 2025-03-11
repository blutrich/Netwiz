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

interface ExpertFormProps {
  onClose?: () => void;
}

export function ExpertForm({ onClose }: ExpertFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    sector: "",
    domain: "",
    role: "",
    phone: "",
    email: "",
    linkedin: "",
    location: "",
    availability: ""
  });

  const availabilityOptions = [
    "1-2 hours per week",
    "3-5 hours per week",
    "5+ hours per week",
    "As needed",
    "Limited availability"
  ];

  const validateForm = () => {
    // Required fields
    const requiredFields = ['fullName', 'email', 'phone', 'sector', 'role', 'availability'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast({
          title: "Validation Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
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

    // LinkedIn URL validation (optional)
    if (formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid LinkedIn URL",
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
      const response = await fetch('https://hook.eu1.make.com/ax2go8kwme53tt4mswjomc82sevbk48f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      toast({
        title: "Success",
        description: "Expert information submitted successfully",
        variant: "success"
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit expert information. Please try again.",
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
        <CardTitle>Add New Expert</CardTitle>
        <CardDescription>
          Fill in the expert's information to add them to the network
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
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sector" className="text-sm font-medium">
                Sector *
              </label>
              <input
                id="sector"
                name="sector"
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={formData.sector}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="domain" className="text-sm font-medium">
                Domain
              </label>
              <input
                id="domain"
                name="domain"
                type="text"
                className="w-full p-2 border rounded-md"
                value={formData.domain}
                onChange={handleInputChange}
              />
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
              <label htmlFor="linkedin" className="text-sm font-medium">
                LinkedIn URL
              </label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                className="w-full p-2 border rounded-md"
                value={formData.linkedin}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
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
                onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}
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
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 