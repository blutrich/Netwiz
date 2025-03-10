import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AnalyticsPage() {
  // Mock data - normally this would come from an API
  const weeklyData = [
    { day: "Mon", requests: 12, connections: 8 },
    { day: "Tue", requests: 18, connections: 12 },
    { day: "Wed", requests: 15, connections: 10 },
    { day: "Thu", requests: 22, connections: 15 },
    { day: "Fri", requests: 14, connections: 9 },
    { day: "Sat", requests: 8, connections: 5 },
    { day: "Sun", requests: 10, connections: 7 },
  ];

  const categoryStats = [
    { name: "Technology", count: 45, successRate: 82 },
    { name: "Recruitment", count: 32, successRate: 75 },
    { name: "Funding", count: 24, successRate: 68 },
    { name: "Business", count: 15, successRate: 80 },
    { name: "Community", count: 8, successRate: 88 },
  ];

  const topPerformers = [
    { name: "David Cohen", connections: 24, rating: 4.8 },
    { name: "Sarah Johnson", connections: 18, rating: 4.7 },
    { name: "Oren Tal", connections: 15, rating: 4.9 },
    { name: "Tamar Shapira", connections: 12, rating: 4.6 },
    { name: "Maya Levi", connections: 8, rating: 4.5 },
  ];

  // Calculate max values for scaling
  const maxRequests = Math.max(...weeklyData.map(item => item.requests));
  const maxConnections = Math.max(...weeklyData.map(item => item.connections));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Performance metrics and insights for your community
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">This Week</Button>
          <Button variant="outline">This Month</Button>
          <Button variant="outline">All Time</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Requests" 
          value="124" 
          change="+12%" 
          trend="up" 
          description="vs last period" 
        />
        <MetricCard 
          title="Successful Connections" 
          value="87" 
          change="+8%" 
          trend="up" 
          description="vs last period" 
        />
        <MetricCard 
          title="Success Rate" 
          value="70%" 
          change="-3%" 
          trend="down" 
          description="vs last period" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>
              Requests and successful connections this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-end justify-between">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center space-y-1">
                    <div 
                      className="w-8 bg-primary/30" 
                      style={{ 
                        height: `${(day.requests / maxRequests) * 200}px` 
                      }} 
                    />
                    <div 
                      className="w-8 bg-primary" 
                      style={{ 
                        height: `${(day.connections / maxConnections) * 200}px` 
                      }} 
                    />
                  </div>
                  <span className="text-sm">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/30" />
                <span className="text-sm">Requests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary" />
                <span className="text-sm">Connections</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Success rates by request category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span>{category.name}</span>
                      <span className="text-muted-foreground">({category.count})</span>
                    </div>
                    <span className="font-medium">{category.successRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${category.successRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Members</CardTitle>
          <CardDescription>
            Members with the most successful connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPerformers.map((performer, index) => (
              <div 
                key={performer.name} 
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center text-xs font-bold bg-primary/10 text-primary rounded-full w-6 h-6">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{performer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {performer.connections} connections
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-500 mr-1">★</span>
                  {performer.rating}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
}

function MetricCard({ title, value, change, trend, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <span
            className={`text-xs ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 