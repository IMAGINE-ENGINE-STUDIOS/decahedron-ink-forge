import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Pitch {
  id: string;
  sector: string;
  stage: string;
  status: string;
  funding_target: string;
  created_at: string;
}

interface IndustryBreakdownProps {
  pitches: Pitch[];
}

interface IndustryData {
  name: string;
  count: number;
  percentage: number;
  avgFunding: string;
  trend: 'up' | 'down' | 'neutral';
  recentCount: number;
}

export const IndustryBreakdown: React.FC<IndustryBreakdownProps> = ({ pitches }) => {
  const industryData: IndustryData[] = React.useMemo(() => {
    const industries: Record<string, { count: number; fundings: number[]; recentCount: number }> = {};
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    pitches.forEach((pitch) => {
      if (!industries[pitch.sector]) {
        industries[pitch.sector] = { count: 0, fundings: [], recentCount: 0 };
      }
      industries[pitch.sector].count++;

      // Parse funding target
      const fundingMatch = pitch.funding_target?.match(/\$?([\d.]+)([MK])?/i);
      if (fundingMatch) {
        let amount = parseFloat(fundingMatch[1]);
        if (fundingMatch[2]?.toUpperCase() === 'M') amount *= 1000000;
        if (fundingMatch[2]?.toUpperCase() === 'K') amount *= 1000;
        industries[pitch.sector].fundings.push(amount);
      }

      // Check if recent
      if (new Date(pitch.created_at).getTime() > oneWeekAgo) {
        industries[pitch.sector].recentCount++;
      }
    });

    const total = pitches.length || 1;

    return Object.entries(industries)
      .map(([name, data]) => {
        const avgFunding = data.fundings.length > 0
          ? data.fundings.reduce((a, b) => a + b, 0) / data.fundings.length
          : 0;

        const formatFunding = (amount: number) => {
          if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
          if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
          return `$${amount.toFixed(0)}`;
        };

        return {
          name,
          count: data.count,
          percentage: (data.count / total) * 100,
          avgFunding: formatFunding(avgFunding),
          trend: data.recentCount > 0 ? 'up' as const : 'neutral' as const,
          recentCount: data.recentCount,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [pitches]);

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-technical text-primary">[ INDUSTRY.ANALYSIS ]</CardTitle>
      </CardHeader>
      <CardContent>
        {industryData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-technical">NO.DATA.AVAILABLE</p>
          </div>
        ) : (
          <div className="space-y-4">
            {industryData.map((industry) => (
              <div key={industry.name} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-technical">
                      {industry.name}
                    </Badge>
                    {getTrendIcon(industry.trend)}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-technical text-muted-foreground">
                      {industry.count} pitch{industry.count !== 1 ? 'es' : ''}
                    </span>
                    {industry.recentCount > 0 && (
                      <Badge className="bg-green-500/10 text-green-700 border-green-500/30" variant="outline">
                        +{industry.recentCount} this week
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${industry.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-technical w-12 text-right">
                      {industry.percentage.toFixed(1)}%
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Avg. Funding Target: <span className="font-technical text-foreground">{industry.avgFunding}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
