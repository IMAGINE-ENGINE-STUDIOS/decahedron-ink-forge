import React from 'react';

interface GeometricPatternProps {
  variant?: 'dodecahedron' | 'spiral' | 'cube-array' | 'flower-of-life';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GeometricPattern: React.FC<GeometricPatternProps> = ({ 
  variant = 'dodecahedron', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const getDodecahedronPath = () => (
    <g className="stroke-geometric-primary fill-none stroke-1">
      {/* Dodecahedron outline */}
      <polygon points="50,10 80,25 95,55 80,85 50,100 20,85 5,55 20,25" className="animate-geometric-pulse" />
      <polygon points="50,20 70,30 80,50 70,70 50,80 30,70 20,50 30,30" className="animate-float" />
      {/* Inner pentagon */}
      <polygon points="50,35 60,40 65,50 60,60 50,65 40,60 35,50 40,40" className="animate-rotate" />
      {/* Connection lines */}
      <line x1="50" y1="10" x2="50" y2="35" className="animate-ink-flow" />
      <line x1="80" y1="25" x2="60" y2="40" className="animate-ink-flow" />
      <line x1="95" y1="55" x2="65" y2="50" className="animate-ink-flow" />
      <line x1="80" y1="85" x2="60" y2="60" className="animate-ink-flow" />
      <line x1="50" y1="100" x2="50" y2="65" className="animate-ink-flow" />
      <line x1="20" y1="85" x2="40" y2="60" className="animate-ink-flow" />
      <line x1="5" y1="55" x2="35" y2="50" className="animate-ink-flow" />
      <line x1="20" y1="25" x2="40" y2="40" className="animate-ink-flow" />
    </g>
  );

  const getSpiralPath = () => (
    <g className="stroke-geometric-primary fill-none stroke-1">
      {/* Golden spiral */}
      <path d="M50,50 Q60,30 80,35 Q90,50 85,70 Q70,85 45,80 Q25,65 30,40 Q40,25 65,30 Q85,45 75,65" className="animate-geometric-pulse" />
      {/* Spiral dots */}
      <circle cx="50" cy="50" r="2" className="fill-geometric-primary animate-float" />
      <circle cx="65" cy="40" r="1.5" className="fill-geometric-secondary animate-float" style={{animationDelay: '0.5s'}} />
      <circle cx="75" cy="55" r="1" className="fill-geometric-secondary animate-float" style={{animationDelay: '1s'}} />
      <circle cx="70" cy="70" r="1.5" className="fill-geometric-secondary animate-float" style={{animationDelay: '1.5s'}} />
      <circle cx="45" cy="75" r="1" className="fill-geometric-secondary animate-float" style={{animationDelay: '2s'}} />
    </g>
  );

  const getCubeArrayPath = () => (
    <g className="stroke-geometric-primary fill-none stroke-1">
      {/* 3D cube formation */}
      <g className="animate-float">
        <polygon points="30,40 50,30 70,40 50,50" />
        <polygon points="30,40 30,60 50,70 50,50" />
        <polygon points="50,50 70,40 70,60 50,70" />
      </g>
      <g className="animate-float" style={{animationDelay: '0.3s'}}>
        <polygon points="20,50 40,40 60,50 40,60" />
        <polygon points="20,50 20,70 40,80 40,60" />
        <polygon points="40,60 60,50 60,70 40,80" />
      </g>
      <g className="animate-float" style={{animationDelay: '0.6s'}}>
        <polygon points="40,20 60,10 80,20 60,30" />
        <polygon points="40,20 40,40 60,50 60,30" />
        <polygon points="60,30 80,20 80,40 60,50" />
      </g>
    </g>
  );

  const getFlowerOfLifePath = () => (
    <g className="stroke-geometric-primary fill-none stroke-1">
      {/* Central circle */}
      <circle cx="50" cy="50" r="15" className="animate-geometric-pulse" />
      {/* Surrounding circles */}
      <circle cx="50" cy="35" r="15" className="animate-float" />
      <circle cx="63" cy="42.5" r="15" className="animate-float" style={{animationDelay: '0.2s'}} />
      <circle cx="63" cy="57.5" r="15" className="animate-float" style={{animationDelay: '0.4s'}} />
      <circle cx="50" cy="65" r="15" className="animate-float" style={{animationDelay: '0.6s'}} />
      <circle cx="37" cy="57.5" r="15" className="animate-float" style={{animationDelay: '0.8s'}} />
      <circle cx="37" cy="42.5" r="15" className="animate-float" style={{animationDelay: '1s'}} />
    </g>
  );

  const getPattern = () => {
    switch (variant) {
      case 'spiral':
        return getSpiralPath();
      case 'cube-array':
        return getCubeArrayPath();
      case 'flower-of-life':
        return getFlowerOfLifePath();
      default:
        return getDodecahedronPath();
    }
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClasses[size]} ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {getPattern()}
    </svg>
  );
};

export default GeometricPattern;