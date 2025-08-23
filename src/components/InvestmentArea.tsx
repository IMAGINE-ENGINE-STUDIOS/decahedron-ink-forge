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
          <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5zM12 4.18L18.18 7H5.82L12 4.18zM4 9h16v8H4V9zm4 2v4h8v-4H8z" 
                fill="currentColor" />
        );
      case 'space':
        return (
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
                fill="currentColor" />
        );
      case 'energy':
        return (
          <path d="M13 2L3 14h5l-1 8 10-12h-5l1-8z" fill="currentColor" />
        );
      case 'smart-cities':
        return (
          <path d="M17 16l-4-4V8.82C14.16 8.4 15 7.3 15 6c0-1.66-1.34-3-3-3S9 4.34 9 6c0 1.3.84 2.4 2 2.82V12l-4 4H3v5h5v-3.05l4-4.2 4 4.2V19h5v-5h-4z" 
                fill="currentColor" />
        );
      case 'infrastructure':
        return (
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                fill="currentColor" />
        );
      case 'sustainability':
        return (
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.4.82C7.14 17.06 9.3 12.38 16.54 9.8c1.48-.53 2.94-.8 4.46-.8v2l3-3-3-3v2c-2.21 0-4.4.4-6.54 1.2z" 
                fill="currentColor" />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="h-full bg-card/50 backdrop-blur-sm border-geometric-secondary hover:bg-card/80 transition-all duration-300 group">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto relative">
          <GeometricPattern 
            variant={pattern} 
            size="lg" 
            className="opacity-20 absolute inset-0 group-hover:opacity-40 transition-opacity duration-300" 
          />
          <svg className="w-12 h-12 text-geometric-primary relative z-10" viewBox="0 0 24 24">
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