import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useExperts, useRequests } from "../hooks/use-sheets-data";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { ExpertForm } from "../components/forms/expert-form";
import { toast } from "../components/ui/use-toast";

export function DashboardPage() {
  const { experts, loading: expertsLoading } = useExperts();
  const { requests, loading: requestsLoading } = useRequests();
  const [categories, setCategories] = useState<{ name: string; count: number; percentage: number }[]>([]);
  const [showExpertForm, setShowExpertForm] = useState(false);
  
  // Calculate dashboard stats
  const stats = {
    totalRequests: requests.length,
    activeRequests: requests.filter(r => r.status === 'expert_contacted' || r.status === 'matched').length,
    successfulConnections: requests.filter(r => r.status === 'completed').length,
    communityMembers: experts.length,
  };
  
  // Calculate category distribution
  useEffect(() => {
    if (requests.length > 0) {
      // Group requests by sector
      const sectorCounts: Record<string, number> = {};
      requests.forEach(request => {
        const sector = request.sector || 'Uncategorized';
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      });
      
      // Convert to array and calculate percentages
      const total = requests.length;
      const categoriesArray = Object.entries(sectorCounts).map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100)
      }));
      
      // Sort by count (descending)
      categoriesArray.sort((a, b) => b.count - a.count);
      
      setCategories(categoriesArray.slice(0, 5)); // Top 5 categories
    }
  }, [requests]);

  const handleShareForm = () => {
    const shareUrl = `${window.location.origin}/join-as-expert`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "The expert form link has been copied to your clipboard",
      });
    });
  };

  // Loading state
  if (expertsLoading || requestsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the NetWizBot admin dashboard. Here's an overview of your WhatsApp community.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successful Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successfulConnections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Community Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.communityMembers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest requests and connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Today</h3>
                <div className="overflow-y-auto max-h-[300px] pr-2">
                  {/* Activity items... */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Requests by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto max-h-[300px] pr-2">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                    <span className="text-sm truncate max-w-[150px] sm:max-w-full" title={category.name}>
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{category.count}</span>
                    <span className="text-xs text-muted-foreground">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-auto py-4 flex flex-col items-center justify-center" 
              variant="outline"
              onClick={() => setShowExpertForm(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="18" y1="8" x2="23" y2="13"></line>
                <line x1="23" y1="8" x2="18" y2="13"></line>
              </svg>
              <span className="text-sm font-medium">Add Expert</span>
            </Button>

            <Button 
              className="h-auto py-4 flex flex-col items-center justify-center" 
              variant="outline"
              onClick={handleShareForm}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              <span className="text-sm font-medium">Share Form</span>
            </Button>
            
            <Button className="h-auto py-4 flex flex-col items-center justify-center" variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <span className="text-sm font-medium">New Request</span>
            </Button>
            
            <Button className="h-auto py-4 flex flex-col items-center justify-center" variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span className="text-sm font-medium">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expert Form Dialog */}
      <Dialog open={showExpertForm} onOpenChange={setShowExpertForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Join Our Expert Network</DialogTitle>
            <DialogDescription>
              Fill out this form to become part of our expert community and help others with your expertise.
            </DialogDescription>
          </DialogHeader>
          <ExpertForm onClose={() => setShowExpertForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
} 