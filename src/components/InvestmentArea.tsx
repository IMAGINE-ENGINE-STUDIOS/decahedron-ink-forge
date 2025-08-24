import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GeometricPattern from './GeometricPattern';

interface InvestmentAreaProps {
  title: string;
  description: string;
  icon: 'technology' | 'space' | 'energy' | 'smart-cities' | 'infrastructure' | 'sustainability';
  pattern: 'dodecahedron' | 'spiral' | 'cube-array' | 'flower-of-life';
}

const InvestmentArea: React.FC<InvestmentAreaProps> = ({ title, description, icon, pattern }) => {
  const getIconPath = () => {
    switch (icon) {
      case 'technology':
        return (
          <g fill="currentColor">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.66 5.66l4.24 4.24M1 12h6m6 0h6m-9.76-7.78l4.24 4.24m-5.66 5.66l4.24 4.24"/>
          </g>
        );
      case 'space':
        return (
          <g fill="currentColor">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
            <path d="M12 6l3 6-3 6-3-6z"/>
            <circle cx="12" cy="12" r="2"/>
          </g>
        );
      case 'energy':
        return (
          <g fill="currentColor">
            <path d="M13 2L3 14h5l-1 8 10-12h-5l1-8z"/>
            <circle cx="6" cy="6" r="1"/>
            <circle cx="18" cy="6" r="1"/>
            <circle cx="18" cy="18" r="1"/>
          </g>
        );
      case 'smart-cities':
        return (
          <g fill="currentColor">
            <rect x="2" y="14" width="4" height="8"/>
            <rect x="6" y="10" width="4" height="12"/>
            <rect x="10" y="6" width="4" height="16"/>
            <rect x="14" y="8" width="4" height="14"/>
            <rect x="18" y="12" width="4" height="10"/>
            <path d="M3 4h18v2H3z"/>
          </g>
        );
      case 'infrastructure':
        return (
          <g fill="currentColor">
            <path d="M12 2L2 8v12h4v-8h12v8h4V8L12 2z"/>
            <rect x="8" y="12" width="2" height="6"/>
            <rect x="14" y="12" width="2" height="6"/>
            <circle cx="12" cy="15" r="1"/>
          </g>
        );
      case 'sustainability':
        return (
          <g fill="currentColor">
            <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
            <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4"/>
            <circle cx="12" cy="8" r="1"/>
            <circle cx="12" cy="16" r="1"/>
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-geometric-secondary hover:bg-card/80 transition-all duration-300 group">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto relative">
          <svg className="w-12 h-12 text-geometric-primary" viewBox="0 0 24 24">
            {getIconPath()}
          </svg>
        </div>
        <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed text-center">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default InvestmentArea;