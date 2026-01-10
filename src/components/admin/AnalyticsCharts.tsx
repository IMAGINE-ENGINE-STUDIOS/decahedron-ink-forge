import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

interface Pitch {
  id: string;
  sector: string;
  stage: string;
  status: string;
  created_at: string;
}

interface AnalyticsChartsProps {
  pitches: Pitch[];
}

const COLORS = [
  'hsl(0, 0%, 15%)',
  'hsl(0, 0%, 30%)',
  'hsl(0, 0%, 45%)',
  'hsl(0, 0%, 60%)',
  'hsl(0, 0%, 75%)',
  'hsl(44, 25%, 50%)',
];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ pitches }) => {
  // Sector breakdown
  const sectorData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    pitches.forEach((p) => {
      counts[p.sector] = (counts[p.sector] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [pitches]);

  // Stage breakdown
  const stageData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    pitches.forEach((p) => {
      counts[p.stage] = (counts[p.stage] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [pitches]);

  // Weekly submissions trend (last 8 weeks)
  const weeklyData = React.useMemo(() => {
    const weeks: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekKey = `W${8 - i}`;
      weeks[weekKey] = 0;
    }

    pitches.forEach((p) => {
      const pitchDate = new Date(p.created_at);
      const weeksAgo = Math.floor((now.getTime() - pitchDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weeksAgo < 8) {
        const weekKey = `W${8 - weeksAgo}`;
        weeks[weekKey] = (weeks[weekKey] || 0) + 1;
      }
    });

    return Object.entries(weeks).map(([week, count]) => ({ week, count }));
  }, [pitches]);

  // Status funnel
  const statusData = React.useMemo(() => {
    const statusOrder = ['pending', 'reviewing', 'due_diligence', 'passed', 'invested'];
    const counts: Record<string, number> = {};
    
    pitches.forEach((p) => {
      const status = p.status.toLowerCase().replace(' ', '_');
      counts[status] = (counts[status] || 0) + 1;
    });

    return statusOrder
      .filter(status => counts[status])
      .map(status => ({
        name: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: counts[status] || 0,
      }));
  }, [pitches]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sector Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="font-technical text-sm">[ SECTOR.DISTRIBUTION ]</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {sectorData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(44, 33%, 97%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stage Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="font-technical text-sm">[ STAGE.BREAKDOWN ]</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 85%)" />
                <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100} 
                  tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(44, 33%, 97%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="value" fill="hsl(0, 0%, 15%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="font-technical text-sm">[ SUBMISSION.TREND ]</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 85%)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(44, 33%, 97%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(0, 0%, 15%)" 
                  fill="hsl(0, 0%, 15%)" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="font-technical text-sm">[ PIPELINE.FUNNEL ]</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 85%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(44, 33%, 97%)',
                    border: '1px solid hsl(0, 0%, 15%)',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="value" fill="hsl(0, 0%, 30%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
