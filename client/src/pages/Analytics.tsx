import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Bird, TrendingUp, Calendar, Map } from "lucide-react";

interface Analytics {
  totalSpecies: number;
  totalSightings: number;
  topSpecies: Array<{ name: string; count: number; conservationStatus: string; lastObserved?: string }>;
  rareSpecies?: Array<{ name: string; count: number; conservationStatus: string; lastObserved?: string; status?: string }>;
  migrationData: Array<{ month: string; count: number }>;
  migrationData2025: Array<{ month: string; count: number }>;
  seasonalData: Array<{ season: string; count: number }>;
  statusDistribution?: Array<{ name: string; value: number }>;
}

interface TimelineData {
  year: number;
  monthly: Array<{ month: string; count: number }>;
  total: number;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
const STATUS_COLORS = ["#22c55e", "#f59e0b", "#ef4444"]; // green/orange/red for Resident/Migratory/Rare

// Map status to semantic color
const getStatusColor = (status?: string): string => {
  switch (status) {
    case "Resident":
      return "#22c55e"; // green
    case "Migratory":
      return "#f59e0b"; // orange
    case "Rare":
      return "#ef4444"; // red
    default:
      return "#3b82f6"; // blue default
  }
};

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeline, setTimeline] = useState<TimelineData>({
    year: 2025,
    monthly: [
      { month: "Jan", count: 0 },
      { month: "Feb", count: 0 },
      { month: "Mar", count: 0 },
      { month: "Apr", count: 0 },
      { month: "May", count: 0 },
      { month: "Jun", count: 0 },
      { month: "Jul", count: 0 },
      { month: "Aug", count: 0 },
      { month: "Sep", count: 0 },
      { month: "Oct", count: 0 },
      { month: "Nov", count: 0 },
      { month: "Dec", count: 0 }
    ],
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsRes, timelineRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/analytics/timeline?year=2025")
        ]);
        
        const analyticsData = await analyticsRes.json();
        const timelineData = await timelineRes.json();
        
        setAnalytics(analyticsData);
        setTimeline(timelineData || { year: 2025, monthly: [], total: 0 });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  // Fallback if data fails to load
  if (!analytics) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <p className="text-red-500">Failed to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold" data-testid="text-analytics-title">
              Migration & Analytics Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground" data-testid="text-analytics-subtitle">
            Comprehensive bird sighting trends and migration patterns
          </p>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader>
                <CardTitle className="text-sm">Total Species Observed</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">All-time totals (current dataset)</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold" data-testid="text-total-species">
                      {analytics.totalSpecies}
                    </p>
                  </div>
                  <Bird className="h-16 w-16 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader>
                <CardTitle className="text-sm">Total Sightings Recorded</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">All-time totals (current dataset)</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold" data-testid="text-total-sightings">
                      {analytics.totalSightings}
                    </p>
                  </div>
                  <Calendar className="h-16 w-16 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Species */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bird className="h-5 w-5 text-primary" />
                Top 5 Most Sighted Species
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topSpecies && analytics.topSpecies.length > 0 ? analytics.topSpecies.map((species, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    data-testid={`species-row-${idx}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-lg font-bold text-primary min-w-8">{idx + 1}.</div>
                      <div className="flex-1">
                        <p className="font-semibold">{species.name}</p>
                        <p className="text-xs text-muted-foreground">{species.conservationStatus}</p>
                        {species.lastObserved && (
                          <p className="text-xs text-muted-foreground mt-1">Last observed: {species.lastObserved}</p>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-blue-500">{species.count} sightings</Badge>
                  </div>
                )) : <p className="text-muted-foreground">No species data available</p>}
              </div>
            </CardContent>
          </Card>

          {/* Rare & Migratory Birds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bird className="h-5 w-5" style={{ color: "#ef4444" }} />
                Top 5 Rare & Migratory Birds
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.rareSpecies && analytics.rareSpecies.length > 0 ? (
                <div className="space-y-3">
                  {analytics.rareSpecies && analytics.rareSpecies.map((species, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      data-testid={`rare-species-row-${idx}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-lg font-bold min-w-8" style={{ color: getStatusColor(species.status) }}>
                          {idx + 1}.
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{species.name}</p>
                          <p className="text-xs text-muted-foreground">{species.conservationStatus}</p>
                          {species.status && (
                            <Badge
                              className="mt-1"
                              style={{ backgroundColor: getStatusColor(species.status), color: "white" }}
                            >
                              {species.status}
                            </Badge>
                          )}
                          {species.lastObserved && (
                            <p className="text-xs text-muted-foreground mt-1">Last observed: {species.lastObserved}</p>
                          )}
                        </div>
                      </div>
                      <Badge style={{ backgroundColor: getStatusColor(species.status), color: "white" }}>
                        {species.count} sightings
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground" data-testid="text-no-rare-species">
                  No rare/migratory sightings recorded in the current dataset.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Migration Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Migration Timeline (Monthly)
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">2025 (Jan-Dec) - Total: {timeline?.total || 0} sightings</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeline?.monthly || []} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bird Distribution by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bird className="h-5 w-5 text-primary" />
                Bird Species Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Resident", value: 87 },
                      { name: "Migratory", value: 42 }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => {
                      const total = 129;
                      const percent = ((value / total) * 100).toFixed(1);
                      return `${name}: ${percent}%`;
                    }}
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip formatter={(value: any) => {
                    const numValue = Number(value);
                    const total = 129;
                    const percent = ((numValue / total) * 100).toFixed(1);
                    return `${numValue} species (${percent}%)`;
                  }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Seasonal Distribution */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                Seasonal Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={(() => {
                      const months = timeline?.monthly || [];
                      return [
                        { season: "Winter (Jan-Feb)", count: (months[0]?.count || 0) + (months[1]?.count || 0) },
                        { season: "Summer (Mar-May)", count: (months[2]?.count || 0) + (months[3]?.count || 0) + (months[4]?.count || 0) },
                        { season: "Monsoon (Jun-Sep)", count: (months[5]?.count || 0) + (months[6]?.count || 0) + (months[7]?.count || 0) + (months[8]?.count || 0) },
                        { season: "Post-monsoon (Oct-Nov)", count: (months[9]?.count || 0) + (months[10]?.count || 0) },
                        { season: "Dec (Upcoming)", count: (months[11]?.count || 0) }
                      ];
                    })()}
                    dataKey="count"
                    nameKey="season"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ season, count }) => {
                      const total = timeline?.total || 0;
                      const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                      return `${season}: ${percent}%`;
                    }}
                  >
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => {
                    const numValue = Number(value);
                    const total = timeline?.total || 0;
                    const percent = total > 0 ? ((numValue / total) * 100).toFixed(1) : 0;
                    return `${numValue} sightings (${percent}%)`;
                  }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Status Distribution Pie Chart */}
        {analytics.statusDistribution && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bird className="h-5 w-5 text-primary" />
                Bird Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={analytics.statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => {
                      const total = analytics.statusDistribution!.reduce((sum, s) => sum + s.value, 0);
                      const percent = ((value / total) * 100).toFixed(1);
                      return `${name}: ${percent}%`;
                    }}
                  >
                    {analytics.statusDistribution.map((_, index) => (
                      <Cell key={`status-cell-${index}`} fill={STATUS_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => {
                    const numValue = Number(value);
                    const total = analytics.statusDistribution!.reduce((sum, s) => sum + s.value, 0);
                    const percent = ((numValue / total) * 100).toFixed(1);
                    return `${numValue} sightings (${percent}%)`;
                  }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Species Bar Chart */}
        {analytics.topSpecies && analytics.topSpecies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Species Sighting Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topSpecies} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  tick={({ x, y, payload }: any) => {
                    const label = payload.value as string;
                    const words = label.split(/\s+/);
                    return (
                      <g transform={`translate(${x},${y})`}>
                        {words.map((word: string, i: number) => (
                          <text 
                            key={i} 
                            x={0} 
                            y={i * 12} 
                            textAnchor="middle" 
                            fill="currentColor"
                            fontSize={12}
                          >
                            {word}
                          </text>
                        ))}
                      </g>
                    );
                  }}
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        )}

        {/* Migration Insights */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle>2025 Migration Insights (Jan-Dec)</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Timeline Total: {timeline?.total || 0} sightings | Overall Sanctuary: {analytics?.totalSightings || 8410} sightings ({analytics?.totalSpecies || 129} species)</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-2">Peak Activity Period (2025)</p>
                <p className="text-sm text-muted-foreground">
                  January-February and October-November show the highest bird sighting activity in 2025, indicating peak migration and wintering periods when birds from northern regions migrate to the sanctuary. December data will be available soon.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Conservation Focus</p>
                <p className="text-sm text-muted-foreground">
                  The sanctuary hosts {analytics?.totalSpecies || 129} bird species with {analytics?.totalSightings || 8410} recorded sightings. Spot-billed Pelicans, Painted Storks, and Eurasian Spoonbills are vulnerable species requiring special conservation attention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
