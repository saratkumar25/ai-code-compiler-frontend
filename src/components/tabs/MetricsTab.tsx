import { useEffect, useState } from "react";
import { api, MetricsResponse } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from "lucide-react";

export function MetricsTab() {
  const [data, setData] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    api.getMetrics().then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="p-10 text-center"><Activity className="animate-spin mx-auto" /></div>;

  const { metrics } = data;
  const chartData = Object.entries(metrics.stageAverages || {}).map(([name, latency]) => ({
    name: name.replace(/([A-Z])/g, ' $1').trim(), // CamelCase to Title Case
    latency: latency
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{metrics.successRate}</div>
            <p className="text-xs text-muted-foreground">{metrics.successfulGenerations} successful</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.averageLatencyMs / 1000).toFixed(1)}s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repairs & Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{metrics.repairAttempts}</div>
            <p className="text-xs text-muted-foreground">{metrics.validationFailures} initial failures</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Average Stage Latency (ms)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
              />
              <Bar dataKey="latency" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
