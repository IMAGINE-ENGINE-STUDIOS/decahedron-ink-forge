import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Users, 
  DollarSign, 
  Activity,
  Target,
  Briefcase
} from 'lucide-react';
import type { CRMStats } from '@/hooks/useDecileCRM';

interface DashboardOverviewProps {
  pitchCount: number;
  lpCount: number;
  contactCount: number;
  thisWeekCount: number;
  crmStats: CRMStats | null;
  crmLoading: boolean;
}

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subLabel?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}> = ({ label, value, icon, trend, trendValue, subLabel, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-card border-border',
    primary: 'bg-primary/5 border-primary/20',
    success: 'bg-green-500/5 border-green-500/20',
    warning: 'bg-amber-500/5 border-amber-500/20',
  };

  return (
    <Card className={`${variantStyles[variant]} border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-technical uppercase text-muted-foreground tracking-wider mb-2">
              {label}
            </p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subLabel && (
              <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>
            )}
            {trend && trendValue && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
              }`}>
                {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
                 trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  pitchCount,
  lpCount,
  contactCount,
  thisWeekCount,
  crmStats,
  crmLoading,
}) => {
  return (
    <div className="space-y-6">
      {/* Primary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Deal Flow"
          value={pitchCount}
          icon={<FileText className="h-5 w-5 text-primary" />}
          trend="up"
          trendValue={`${thisWeekCount} this week`}
          variant="primary"
        />
        <StatCard
          label="LP Pipeline"
          value={lpCount}
          icon={<Users className="h-5 w-5 text-primary" />}
          subLabel="Active applications"
        />
        <StatCard
          label="Total AUM"
          value={crmLoading ? '...' : (crmStats?.totalAUM || '$0')}
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          variant="success"
          subLabel="Under management"
        />
        <StatCard
          label="Active Deals"
          value={crmLoading ? '...' : (crmStats?.activeDeals || 0)}
          icon={<Target className="h-5 w-5 text-primary" />}
          subLabel="In pipeline"
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Portfolio"
          value={crmLoading ? '...' : (crmStats?.portfolioCompanies || 0)}
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          subLabel="Companies"
        />
        <StatCard
          label="Avg Check Size"
          value={crmLoading ? '...' : (crmStats?.avgCheckSize || '$0')}
          icon={<Activity className="h-5 w-5 text-primary" />}
        />
        <StatCard
          label="IRR"
          value={crmLoading ? '...' : (crmStats?.irr || '0%')}
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          variant="success"
        />
        <StatCard
          label="TVPI"
          value={crmLoading ? '...' : (crmStats?.tvpi || '0x')}
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  );
};
