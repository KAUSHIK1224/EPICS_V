import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Bird, TrendingUp, Calendar, Map } from "lucide-react";

interface Analytics {
  totalSpecies: number;
  totalSightings: number;
  topSpecies: Array<{ name: string; count: number; conservationStatus: string }>;
  migrationData: Array<{ month: string; count: number }>;
  seasonalData: Array<{ season: string; count: number }>;
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        // Set demo data
        setAnalytics({
          totalSpecies: 45,
          totalSightings: 234,
          topSpecies: [
            { name: "Grey Heron", count: 42, conservationStatus: "Least Concern" },
            { name: "Painted Stork", count: 38, conservationStatus: "Vulnerable" },
            { name: "Spot-billed Pelican", count: 35, conservationStatus: "Vulnerable" },
            { name: "White Ibis", count: 28, conservationStatus: "Least Concern" },
            { name: "Black-headed Ibis", count: 25, conservationStatus: "Least Concern" },
          ],
          migrationData: [
            { month: "Jan", count: 32 },
            { month: "Feb", count: 28 },
            { month: "Mar", count: 18 },
            { month: "Apr", count: 12 },
            { month: "May", count: 8 },
            { month: "Jun", count: 15 },
            { month: "Jul", count: 22 },
            { month: "Aug", count: 25 },
            { month: "Sep", count: 30 },
            { month: "Oct", count: 35 },
            { month: "Nov", count: 38 },
            { month: "Dec", count: 40 },
          ],
          seasonalData: [
            { season: "Winter (Dec-Feb)", count: 100 },
            { season: "Summer (Mar-May)", count: 38 },
            { season: "Monsoon (Jun-Sep)", count: 92 },
            { season: "Post-monsoon (Oct-Nov)", count: 73 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <p className="text-muted-foreground">Loading analytics...</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Species Observed</p>
                  <p className="text-4xl font-bold" data-testid="text-total-species">
                    {analytics.totalSpecies}
                  </p>
                </div>
                <Bird className="h-16 w-16 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Sightings Recorded</p>
                  <p className="text-4xl font-bold" data-testid="text-total-sightings">
                    {analytics.totalSightings}
                  </p>
                </div>
                <Calendar className="h-16 w-16 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Species */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bird className="h-5 w-5 text-primary" />
              Top 5 Most Sighted Species
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topSpecies.map((species, idx) => (
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
                    </div>
                  </div>
                  <Badge className="bg-blue-500">{species.count} sightings</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Migration Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Migration Timeline (Monthly)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.migrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
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

          {/* Seasonal Distribution */}
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
                    data={analytics.seasonalData}
                    dataKey="count"
                    nameKey="season"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analytics.seasonalData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Species Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Species Sighting Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topSpecies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Migration Insights */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle>Migration Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-2">Peak Migration Period</p>
                <p className="text-sm text-muted-foreground">
                  December to February shows the highest bird sighting activity, indicating the peak migration period when birds from northern regions migrate to the sanctuary for wintering.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Conservation Focus</p>
                <p className="text-sm text-muted-foreground">
                  The data shows Painted Storks and Spot-billed Pelicans as vulnerable species requiring special conservation attention. Continued monitoring and habitat protection are essential.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
