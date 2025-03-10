import React, { useState } from "react";
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

export function CommunityPage() {
  const [sectorFilter, setSectorFilter] = useState<string | undefined>(undefined);
  const { experts, loading, error } = useExperts({
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
          <Button>Add Member</Button>
        </div>
      </div>

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
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {expert.linkedin && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(expert.linkedin, '_blank')}
                            >
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