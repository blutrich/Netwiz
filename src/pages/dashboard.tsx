import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPage() {
  // Normally we would fetch this data from an API
  const stats = {
    totalRequests: 124,
    activeRequests: 12,
    successfulConnections: 87,
    communityMembers: 45,
  };

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
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-muted/50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Request #{i}</p>
                      <p className="text-sm text-muted-foreground">
                        Looking for help with technology integration
                      </p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Technology
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              ))}
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
              {[
                { name: "Technology", count: 45, percentage: 36 },
                { name: "Recruitment", count: 32, percentage: 26 },
                { name: "Funding", count: 24, percentage: 19 },
                { name: "Business", count: 15, percentage: 12 },
                { name: "Community", count: 8, percentage: 7 },
              ].map((category) => (
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
              ))}
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