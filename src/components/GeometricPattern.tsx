import React from 'react';

interface GeometricPatternProps {
  variant?: 'dodecahedron' | 'spiral' | 'cube-array' | 'flower-of-life' | 'technical-blueprint' | 'technical-wireframe' | 'technical-corner';
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const getDodecahedronPath = () => (
    <g className="stroke-technical-highlight fill-none stroke-[0.5]">
      {/* Technical Dodecahedron outline */}
      <polygon points="50,5 85,22 98,52 85,88 50,105 15,88 2,52 15,22" className="animate-geometric-pulse stroke-[1]" />
      <polygon points="50,15 75,28 85,50 75,75 50,88 25,75 15,50 25,28" className="animate-float opacity-80" />
      {/* Inner core pentagon */}
      <polygon points="50,30 65,35 72,50 65,65 50,70 35,65 28,50 35,35" className="animate-rotate stroke-[1.5]" />
      {/* Technical connection grid */}
      <line x1="50" y1="5" x2="50" y2="30" className="animate-ink-flow stroke-technical-line" />
      <line x1="85" y1="22" x2="65" y2="35" className="animate-ink-flow stroke-technical-line" />
      <line x1="98" y1="52" x2="72" y2="50" className="animate-ink-flow stroke-technical-line" />
      <line x1="85" y1="88" x2="65" y2="65" className="animate-ink-flow stroke-technical-line" />
      <line x1="50" y1="105" x2="50" y2="70" className="animate-ink-flow stroke-technical-line" />
      <line x1="15" y1="88" x2="35" y2="65" className="animate-ink-flow stroke-technical-line" />
      <line x1="2" y1="52" x2="28" y2="50" className="animate-ink-flow stroke-technical-line" />
      <line x1="15" y1="22" x2="35" y2="35" className="animate-ink-flow stroke-technical-line" />
      {/* Technical vertex markers */}
      <circle cx="50" cy="5" r="1" className="fill-technical-highlight animate-geometric-pulse" />
      <circle cx="85" cy="22" r="1" className="fill-technical-highlight animate-geometric-pulse" />
      <circle cx="98" cy="52" r="1" className="fill-technical-highlight animate-geometric-pulse" />
      <circle cx="85" cy="88" r="1" className="fill-technical-highlight animate-geometric-pulse" />
      <circle cx="50" cy="105" r="1" className="fill-technical-highlight animate-geometric-pulse" />
      <circle cx="15" cy="88" r="1" className="fill-technical-highlight animate-geometric-pulse" />
      <circle cx="2" cy="52" r="1" className="fill-technical-highlight animate-geometric-pulse" />
      <circle cx="15" cy="22" r="1" className="fill-technical-highlight animate-geometric-pulse" />
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

  const getTechnicalBlueprintPath = () => (
    <g className="stroke-technical-highlight fill-none stroke-[0.5]">
      <rect x="20" y="20" width="60" height="60" className="stroke-[1] animate-geometric-pulse" />
      <rect x="30" y="30" width="40" height="40" className="stroke-[0.5] animate-float" />
      <circle cx="50" cy="50" r="15" className="stroke-[1] animate-rotate" />
      {/* Technical measurement lines */}
      <line x1="15" y1="20" x2="15" y2="80" className="stroke-technical-line stroke-[0.3]" />
      <line x1="20" y1="15" x2="80" y2="15" className="stroke-technical-line stroke-[0.3]" />
      {/* Dimension markers */}
      <text x="10" y="50" className="text-[3px] fill-technical-line">60</text>
      <text x="50" y="10" className="text-[3px] fill-technical-line">60</text>
    </g>
  );

  const getTechnicalWireframePath = () => (
    <g className="stroke-technical-highlight fill-none stroke-[0.5]">
      {/* 3D Wireframe structure */}
      <polygon points="30,20 70,20 80,30 40,30" className="animate-geometric-pulse" />
      <polygon points="30,20 30,60 40,70 40,30" className="animate-float" />
      <polygon points="70,20 70,60 80,70 80,30" className="animate-ink-flow" />
      <polygon points="30,60 70,60 80,70 40,70" className="animate-rotate" />
      {/* Connection lines */}
      <line x1="30" y1="20" x2="40" y2="30" className="stroke-technical-line" />
      <line x1="70" y1="20" x2="80" y2="30" className="stroke-technical-line" />
      <line x1="30" y1="60" x2="40" y2="70" className="stroke-technical-line" />
      <line x1="70" y1="60" x2="80" y2="70" className="stroke-technical-line" />
    </g>
  );

  const getTechnicalCornerPath = () => (
    <g className="stroke-technical-highlight fill-none stroke-[1]">
      <path d="M10,30 L10,10 L30,10" className="animate-geometric-pulse" />
      <path d="M70,10 L90,10 L90,30" className="animate-geometric-pulse" />
      <path d="M90,70 L90,90 L70,90" className="animate-geometric-pulse" />
      <path d="M30,90 L10,90 L10,70" className="animate-geometric-pulse" />
      <circle cx="50" cy="50" r="2" className="fill-technical-highlight animate-float" />
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
      case 'technical-blueprint':
        return getTechnicalBlueprintPath();
      case 'technical-wireframe':
        return getTechnicalWireframePath();
      case 'technical-corner':
        return getTechnicalCornerPath();
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