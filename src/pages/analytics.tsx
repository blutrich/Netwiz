import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useExperts, useRequests } from "../hooks/use-sheets-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Sector
} from "recharts";

// Define colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AnalyticsPage() {
  const { experts, loading: expertsLoading } = useExperts();
  const { requests, loading: requestsLoading } = useRequests();
  const [weeklyData, setWeeklyData] = useState<{ day: string; requests: number; connections: number }[]>([]);
  const [categoryStats, setCategoryStats] = useState<{ name: string; count: number; successRate: number }[]>([]);
  const [topPerformers, setTopPerformers] = useState<{ name: string; connections: number; rating: number }[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [activePieIndex, setActivePieIndex] = useState(0);
  
  // Calculate metrics
  const totalRequests = requests.length;
  const successfulConnections = requests.filter(r => r.status === 'completed').length;
  const successRate = totalRequests > 0 ? Math.round((successfulConnections / totalRequests) * 100) : 0;
  
  // Calculate weekly data
  useEffect(() => {
    if (requests.length > 0) {
      // Get current date and start of week
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start from Monday
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Initialize data for each day of the week
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weekData = days.map(day => ({ day, requests: 0, connections: 0 }));
      
      // Filter requests based on timeframe
      let filteredRequests = requests;
      if (timeframe === 'week') {
        filteredRequests = requests.filter(req => {
          const reqDate = new Date(req.createdAt);
          return reqDate >= startOfWeek;
        });
      } else if (timeframe === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredRequests = requests.filter(req => {
          const reqDate = new Date(req.createdAt);
          return reqDate >= startOfMonth;
        });
      }
      
      // Count requests and connections by day
      filteredRequests.forEach(req => {
        try {
          const reqDate = new Date(req.createdAt);
          const dayIndex = (reqDate.getDay() + 6) % 7; // Convert to 0 = Monday, 1 = Tuesday, etc.
          
          if (dayIndex >= 0 && dayIndex < 7) {
            weekData[dayIndex].requests++;
            if (req.status === 'completed') {
              weekData[dayIndex].connections++;
            }
          }
        } catch (error) {
          console.error('Error parsing date:', req.createdAt, error);
        }
      });
      
      setWeeklyData(weekData);
    }
  }, [requests, timeframe]);
  
  // Calculate category stats
  useEffect(() => {
    if (requests.length > 0) {
      // Group requests by sector
      const sectorMap: Record<string, { total: number; completed: number }> = {};
      
      requests.forEach(req => {
        const sector = req.sector || 'Uncategorized';
        if (!sectorMap[sector]) {
          sectorMap[sector] = { total: 0, completed: 0 };
        }
        sectorMap[sector].total++;
        if (req.status === 'completed') {
          sectorMap[sector].completed++;
        }
      });
      
      // Convert to array and calculate success rates
      const stats = Object.entries(sectorMap).map(([name, { total, completed }]) => ({
        name,
        count: total,
        successRate: total > 0 ? Math.round((completed / total) * 100) : 0
      }));
      
      // Sort by count (descending)
      stats.sort((a, b) => b.count - a.count);
      
      setCategoryStats(stats.slice(0, 5)); // Top 5 categories
    }
  }, [requests]);
  
  // Calculate top performers
  useEffect(() => {
    if (requests.length > 0 && experts.length > 0) {
      // Count successful connections by helper
      const helperStats: Record<string, { connections: number; ratings: number[] }> = {};
      
      requests.forEach(req => {
        if (req.helperName && (req.status === 'completed' || req.status === 'matched')) {
          if (!helperStats[req.helperName]) {
            helperStats[req.helperName] = { connections: 0, ratings: [] };
          }
          helperStats[req.helperName].connections++;
          
          // Simulate ratings (in a real app, you'd have actual ratings)
          // This is just for demonstration purposes
          const simulatedRating = 4 + Math.random();
          helperStats[req.helperName].ratings.push(simulatedRating);
        }
      });
      
      // Convert to array and calculate average ratings
      const performers = Object.entries(helperStats).map(([name, { connections, ratings }]) => ({
        name,
        connections,
        rating: ratings.length > 0 
          ? parseFloat((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1))
          : 0
      }));
      
      // Sort by connections (descending)
      performers.sort((a, b) => b.connections - a.connections);
      
      setTopPerformers(performers.slice(0, 5)); // Top 5 performers
    }
  }, [requests, experts]);

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-600">Requests: {payload[0].value}</p>
          <p className="text-sm text-green-600">Connections: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  // Custom active shape for pie chart
  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-midAngle * Math.PI / 180);
    const cos = Math.cos(-midAngle * Math.PI / 180);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">
          {`${value} requests`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  // Loading state
  if (expertsLoading || requestsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Loading analytics data...</p>
      </div>
    );
  }

  // Prepare data for pie chart
  const pieData = categoryStats.map(category => ({
    name: category.name,
    value: category.count
  }));

  // Prepare data for top performers chart
  const performerChartData = topPerformers.map(performer => ({
    name: performer.name.split(' ')[0], // Use first name only for better display
    connections: performer.connections,
    rating: performer.rating
  }));

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
          <Button 
            variant={timeframe === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeframe('week')}
          >
            This Week
          </Button>
          <Button 
            variant={timeframe === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeframe('month')}
          >
            This Month
          </Button>
          <Button 
            variant={timeframe === 'all' ? 'default' : 'outline'}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Total Requests" 
          value={totalRequests.toString()} 
          change="+12%" 
          trend="up" 
          description="vs last period" 
        />
        <MetricCard 
          title="Successful Connections" 
          value={successfulConnections.toString()} 
          change="+8%" 
          trend="up" 
          description="vs last period" 
        />
        <MetricCard 
          title="Success Rate" 
          value={`${successRate}%`} 
          change="-3%" 
          trend="down" 
          description="vs last period" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {timeframe === 'week' ? 'Weekly Activity' : 
               timeframe === 'month' ? 'Monthly Activity' : 'All Time Activity'}
            </CardTitle>
            <CardDescription>
              Requests and successful connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyData.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No data available for this period</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend />
                    <Bar dataKey="requests" name="Requests" fill="#8884d8" />
                    <Bar dataKey="connections" name="Connections" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Distribution of requests by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryStats.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No category data available</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activePieIndex}
                      activeShape={renderActiveShape}
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Success rates by request category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryStats.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No category data available</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={categoryStats}
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="successRate" name="Success Rate (%)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Members with the most successful connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topPerformers.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">No performer data available</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performerChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="connections" name="Connections" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="rating" name="Rating" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
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
          {topPerformers.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No performer data available</p>
          ) : (
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
          )}
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