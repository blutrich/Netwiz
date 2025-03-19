import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useExperts } from "../hooks/use-sheets-data";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "../components/ui/dialog";
import { ExpertForm } from "../components/forms/expert-form";
import { toast } from "../components/ui/use-toast";

export function CommunityPage() {
  const [sectorFilter, setSectorFilter] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [showEnrichData, setShowEnrichData] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { experts, loading, error, refreshExperts } = useExperts({
    filterBySector: sectorFilter,
  });

  // Colors for different sectors
  const sectorColors = {
    Technology: "bg-purple-100 text-purple-800",
    Consultant: "bg-green-100 text-green-800",
    "Chief of Staff": "bg-blue-100 text-blue-800",
    COO: "bg-indigo-100 text-indigo-800",
    Hightech: "bg-pink-100 text-pink-800",
    Education: "bg-amber-100 text-amber-800",
    Finance: "bg-cyan-100 text-cyan-800",
    Health: "bg-emerald-100 text-emerald-800",
    Energy: "bg-violet-100 text-violet-800",
    AI: "bg-rose-100 text-rose-800",
  };

  // Status badge color mapping for availability
  const availabilityColors = {
    "Open To help": "bg-green-100 text-green-800",
    "Available for Consulting": "bg-green-100 text-green-800",
    "Looking for Collaborations": "bg-blue-100 text-blue-800",
    "love_to_help": "bg-green-100 text-green-800",
  };

  // Function to handle opening enriched data dialog
  const handleOpenEnrichData = (index: number) => {
    setSelectedExpert(index);
    setShowEnrichData(true);
  };

  // Function to handle opening edit dialog
  const handleOpenEditDialog = (index: number) => {
    setSelectedExpert(index);
    const expert = experts[index];
    setEditFormData({
      fullName: expert.fullName,
      companyName: expert.companyName,
      sector: expert.sector,
      domain: expert.domain,
      role: expert.role,
      phone: expert.phone,
      email: expert.email,
      linkedin: expert.linkedin,
      location: expert.location,
      availability: expert.availability
    });
    setShowEditDialog(true);
  };

  // Handle input changes in edit form
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes in edit form
  const handleSelectChange = (name: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for editing expert
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!editFormData.fullName || !editFormData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would call an API to update the Google Sheet
      // For this demonstration, we'll use a mock update with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close dialog and show success message
      setShowEditDialog(false);
      toast({
        title: "Expert Updated",
        description: `${editFormData.fullName}'s information has been updated successfully. Note: In this demo, changes are not persisted to Google Sheets.`,
        variant: "default"
      });
      
      // In a real implementation, you would refresh the data here
      if (refreshExperts) {
        refreshExperts();
      }
    } catch (error) {
      console.error("Error updating expert:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the expert information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectorOptions = [
    "Technology",
    "Consultant",
    "Chief of Staff",
    "COO",
    "Hightech",
    "Education",
    "Finance",
    "Health",
    "Energy",
    "AI"
  ];

  const availabilityOptions = [
    "Open To help",
    "Available for Consulting",
    "Looking for Collaborations",
    "love_to_help",
    "Not available"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Members</h1>
          <p className="text-muted-foreground">
            Manage your community experts and their areas of expertise
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={sectorFilter}
            onValueChange={(value) => setSectorFilter(value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="Consultant">Consultant</SelectItem>
              <SelectItem value="Chief of Staff">Chief of Staff</SelectItem>
              <SelectItem value="COO">COO</SelectItem>
              <SelectItem value="Hightech">Hightech</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)}>Add Member</Button>
        </div>
      </div>

      {/* Expert Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Community Member</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new expert to your community network.
            </DialogDescription>
          </DialogHeader>
          <ExpertForm onClose={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Expert Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Community Member</DialogTitle>
            <DialogDescription>
              Update the information for this community member
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
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
                  value={editFormData.fullName}
                  onChange={handleEditInputChange}
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
                  value={editFormData.companyName}
                  onChange={handleEditInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sector" className="text-sm font-medium">
                  Sector *
                </label>
                <Select
                  value={editFormData.sector}
                  onValueChange={(value) => handleSelectChange("sector", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sector" />
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
                <input
                  id="domain"
                  name="domain"
                  type="text"
                  required
                  className="w-full p-2 border rounded-md"
                  value={editFormData.domain}
                  onChange={handleEditInputChange}
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
                  value={editFormData.role}
                  onChange={handleEditInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full p-2 border rounded-md"
                  value={editFormData.phone}
                  onChange={handleEditInputChange}
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
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="linkedin" className="text-sm font-medium">
                  LinkedIn Profile *
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  required
                  className="w-full p-2 border rounded-md"
                  value={editFormData.linkedin}
                  onChange={handleEditInputChange}
                />
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
                  className="w-full p-2 border rounded-md"
                  value={editFormData.location}
                  onChange={handleEditInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="availability" className="text-sm font-medium">
                  Availability *
                </label>
                <Select
                  value={editFormData.availability}
                  onValueChange={(value) => handleSelectChange("availability", value)}
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

            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Enriched Data Dialog */}
      <Dialog open={showEnrichData} onOpenChange={setShowEnrichData}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center">
              {selectedExpert !== null && experts[selectedExpert] && (
                <>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold mr-2">
                    {experts[selectedExpert].fullName.charAt(0)}
                  </div>
                  <span>Profile: {experts[selectedExpert].fullName}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Comprehensive profile information and enriched data about this community member
            </DialogDescription>
          </DialogHeader>
          
          {selectedExpert !== null && experts[selectedExpert] && (
            <div className="mt-4 space-y-6">
              {/* Header Section with Summary */}
              <div className="flex flex-col md:flex-row gap-6 p-4 bg-card rounded-lg border">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                    {experts[selectedExpert].fullName.charAt(0)}
                  </div>
                </div>
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{experts[selectedExpert].fullName}</h3>
                    {experts[selectedExpert].sector && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        sectorColors[experts[selectedExpert].sector as keyof typeof sectorColors] ||
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {experts[selectedExpert].sector}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{experts[selectedExpert].role} at {experts[selectedExpert].companyName}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {experts[selectedExpert].domain && (
                      <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {experts[selectedExpert].domain}
                      </span>
                    )}
                    {experts[selectedExpert].location && (
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-800 rounded-full flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {experts[selectedExpert].location}
                      </span>
                    )}
                    {experts[selectedExpert].availability && (
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                        availabilityColors[experts[selectedExpert].availability as keyof typeof availabilityColors] ||
                        "bg-gray-100 text-gray-800"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {experts[selectedExpert].availability}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Enriched Data Section */}
              <div className="bg-muted/40 p-5 rounded-lg border space-y-1">
                <h4 className="font-semibold text-lg border-b pb-2 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Learn more
                </h4>
                {experts[selectedExpert].enrichData ? (
                  <div className="space-y-4">
                    {experts[selectedExpert].enrichData.split('\n\n').map((paragraph, idx) => {
                      // Check if paragraph appears to be a section heading (ends with a colon)
                      if (paragraph.trim().endsWith(':')) {
                        return (
                          <div key={idx} className="mt-6 first:mt-0">
                            <h5 className="text-md font-semibold text-primary flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {paragraph}
                            </h5>
                          </div>
                        );
                      }
                      
                      // Check if paragraph contains key-value pairs (with ":")
                      else if (paragraph.includes(':')) {
                        const lines = paragraph.split('\n');
                        return (
                          <div key={idx} className="bg-card rounded-md p-3 shadow-sm hover:shadow-md transition-shadow">
                            {lines.map((line, lineIdx) => {
                              const [key, ...valueParts] = line.split(':');
                              const value = valueParts.join(':').trim();
                              
                              if (key && value) {
                                return (
                                  <div key={lineIdx} className="flex flex-col sm:flex-row py-1.5 border-b last:border-0">
                                    <span className="font-medium text-muted-foreground w-full sm:w-1/3">{key.trim()}:</span>
                                    <span className="w-full sm:w-2/3">{value}</span>
                                  </div>
                                );
                              } else {
                                return <p key={lineIdx} className="py-1">{line}</p>;
                              }
                            })}
                          </div>
                        );
                      }
                      
                      // Handle bullet points
                      else if (paragraph.includes('• ') || paragraph.includes('* ')) {
                        const items = paragraph.split('\n').map(item => 
                          item.trim().replace(/^[•*]\s*/, '')
                        );
                        
                        return (
                          <div key={idx} className="bg-card rounded-md p-3 shadow-sm">
                            <ul className="list-disc pl-5 space-y-1.5">
                              {items.map((item, itemIdx) => (
                                <li key={itemIdx} className="text-sm">{item}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      
                      // Regular paragraph
                      else {
                        return (
                          <div key={idx} className="bg-card rounded-md p-3 shadow-sm">
                            <p className="text-sm leading-relaxed">
                              {paragraph}
                            </p>
                          </div>
                        );
                      }
                    })}
                    
                    {/* Links section - detect and format URLs */}
                    {experts[selectedExpert].enrichData.includes('http') && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Related Links
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {experts[selectedExpert].enrichData.split(/\s+/).filter(word => 
                            word.startsWith('http') || word.startsWith('www.')
                          ).map((url, idx) => (
                            <a 
                              key={idx}
                              href={url.startsWith('www.') ? `https://${url}` : url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground italic">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No additional data available
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm border-b pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Information
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="font-medium block">Email:</span>
                        <a href={`mailto:${experts[selectedExpert].email}`} className="text-primary hover:underline">
                          {experts[selectedExpert].email}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <span className="font-medium block">Phone:</span>
                        <a href={`tel:${experts[selectedExpert].phone}`} className="hover:underline">
                          {experts[selectedExpert].phone}
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <span className="font-medium block">Location:</span>
                        {experts[selectedExpert].location}
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm border-b pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Professional Details
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <span className="font-medium block">Company:</span>
                        {experts[selectedExpert].companyName}
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <span className="font-medium block">Sector:</span>
                        {experts[selectedExpert].sector}
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <span className="font-medium block">Domain:</span>
                        {experts[selectedExpert].domain}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                {experts[selectedExpert].linkedin && (
                  <Button 
                    variant="default" 
                    className="bg-[#0077b5] hover:bg-[#006699]"
                    onClick={() => window.open(experts[selectedExpert].linkedin, '_blank')}
                  >
                    <svg 
                      className="w-4 h-4 mr-2" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    View LinkedIn Profile
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenEditDialog(selectedExpert)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading community members...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Error loading members: {error.message}
            </div>
          ) : experts.length === 0 ? (
            <div className="py-8 text-center">No community members found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Company</th>
                    <th className="text-left p-3 font-medium">Sector</th>
                    <th className="text-left p-3 font-medium">Contact</th>
                    <th className="text-left p-3 font-medium">Location</th>
                    <th className="text-left p-3 font-medium">Availability</th>
                    <th className="text-left p-3 font-medium">Enriched Data</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experts.map((expert, index) => (
                    <tr key={expert.phone || index} className="border-b">
                      <td className="p-3">
                        <div className="font-medium">{expert.fullName}</div>
                        <div className="text-sm text-muted-foreground">{expert.role}</div>
                      </td>
                      <td className="p-3 text-sm">{expert.companyName}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              sectorColors[expert.sector as keyof typeof sectorColors] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {expert.sector}
                          </span>
                          {expert.domain && (
                            <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                              {expert.domain}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{expert.phone}</div>
                        <div className="text-sm text-muted-foreground">{expert.email}</div>
                      </td>
                      <td className="p-3 text-sm">{expert.location}</td>
                      <td className="p-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            availabilityColors[expert.availability as keyof typeof availabilityColors] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {expert.availability}
                        </span>
                      </td>
                      <td className="p-3">
                        {expert.enrichData ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleOpenEnrichData(index)}
                          >
                            View Details
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">No data</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenEditDialog(index)}
                          >
                            Edit
                          </Button>
                          {expert.linkedin && (
                            <Button 
                              variant="default" 
                              size="sm"
                              className="bg-[#0077b5] hover:bg-[#006699]"
                              onClick={() => window.open(expert.linkedin, '_blank')}
                            >
                              <svg 
                                className="w-4 h-4 mr-2" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                              </svg>
                              LinkedIn
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 