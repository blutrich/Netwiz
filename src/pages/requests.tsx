import { useState } from "react";
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
    <div className="space-y-6 p-2 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Requests</h1>
      <p className="text-muted-foreground">
        View and manage requests from your community members.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.expertContacted || 0) + (stats?.matched || 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? Math.round((stats.completed / stats.total) * 100) || 0 : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <CardTitle>Request Management</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select 
              value={statusFilter || "all"} 
              onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)}
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
            <Button variant="outline" onClick={() => setStatusFilter(undefined)}>
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading requests...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading requests: {error.message || String(error)}</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p>No requests found matching the current filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Date</th>
                    <th className="text-left p-2 font-medium">Request</th>
                    <th className="text-left p-2 font-medium hidden md:table-cell">Category</th>
                    <th className="text-left p-2 font-medium">Status</th>
                    <th className="text-left p-2 font-medium hidden sm:table-cell">Expert</th>
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.requestId} className="border-b">
                      <td className="p-2">{formatDate(request.createdAt).toLocaleDateString()}</td>
                      <td className="p-2">{request.requestMessage}</td>
                      <td className="p-2 hidden md:table-cell">{request.sector}</td>
                      <td className="p-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            statusColors[request.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-2 hidden sm:table-cell">{request.helperName}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {request.status === "expert_contacted" && (
                            <Button size="sm" variant="default">
                              Find More Experts
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