import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useExperts, useRequests } from "../hooks/use-sheets-data";
import { Expert, Request } from "../lib/services/google-sheets";

export function DashboardPage() {
  const { experts, loading: expertsLoading } = useExperts();
  const { requests, loading: requestsLoading, stats: requestStats } = useRequests();
  const [categories, setCategories] = useState<{ name: string; count: number; percentage: number }[]>([]);
  
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to the NetWizBot admin dashboard. Here's an overview of your WhatsApp community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Requests" 
          value={stats.totalRequests} 
          description="All time requests" 
        />
        <StatsCard 
          title="Active Requests" 
          value={stats.activeRequests} 
          description="Currently being processed" 
        />
        <StatsCard 
          title="Successful Connections" 
          value={stats.successfulConnections} 
          description="Completed connections" 
        />
        <StatsCard 
          title="Community Members" 
          value={stats.communityMembers} 
          description="Registered members" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>
              The latest requests from community members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requests.length === 0 ? (
                <p className="text-muted-foreground">No requests found</p>
              ) : (
                // Show the 3 most recent requests
                requests.slice(0, 3).map((request) => (
                  <div key={request.requestId} className="p-3 bg-muted/50 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Request #{request.requestId}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.requestMessage}
                        </p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {request.sector || 'General'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Categories</CardTitle>
            <CardDescription>
              Distribution of requests by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.length === 0 ? (
                <p className="text-muted-foreground">No categories found</p>
              ) : (
                categories.map((category) => (
                  <div key={category.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category.name}</span>
                      <span className="font-medium">{category.count}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
}

function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
} 