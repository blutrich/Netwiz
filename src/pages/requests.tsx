import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useRequests } from "../hooks/use-sheets-data";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";

export function RequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { requests, loading, error, stats } = useRequests({
    filterByStatus: statusFilter as any,
  });

  // Status badge color mapping
  const statusColors = {
    expert_contacted: "bg-yellow-100 text-yellow-800",
    matched: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    expert_declined: "bg-red-100 text-red-800",
  };

  // Category color mapping for sectors
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

  // Format date from Excel date number if needed
  const formatDate = (dateStr: string) => {
    try {
      // Check if it's Excel serial date
      if (!isNaN(Number(dateStr)) && Number(dateStr) > 1000) {
        // Excel dates start at 1/1/1900, which is serial number 1
        const excelEpoch = new Date(1899, 11, 30).getTime();
        const daysSinceEpoch = Number(dateStr);
        const millisecondsSinceEpoch = daysSinceEpoch * 24 * 60 * 60 * 1000;
        return new Date(excelEpoch + millisecondsSinceEpoch);
      }
      // Try to parse as ISO string
      return new Date(dateStr);
    } catch (e) {
      return new Date(); // Return current date as fallback
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Requests</h1>
          <p className="text-muted-foreground">
            Manage anonymous requests from your community
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="expert_contacted">Expert Contacted</SelectItem>
              <SelectItem value="matched">Matched</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="expert_declined">Expert Declined</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expertContacted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Matched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.matched}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading requests...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Error loading requests: {error.message}
            </div>
          ) : requests.length === 0 ? (
            <div className="py-8 text-center">No requests found</div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.requestId} className="border rounded-lg p-4 transition-all hover:shadow-md">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {request.requestId.substring(0, 8)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            statusColors[request.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            sectorColors[request.sector as keyof typeof sectorColors] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.sector}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{request.requestMessage}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>From: {request.requesterPhone.replace('@c.us', '')}</span>
                        <span>
                          {formatDate(request.createdAt).toLocaleDateString()} at{" "}
                          {formatDate(request.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      {request.helperName && (
                        <div className="text-xs text-muted-foreground">
                          Expert: <span className="font-medium">{request.helperName}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {request.status === "expert_contacted" && (
                        <Button size="sm" variant="default">
                          Find More Experts
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 