import React from 'react';
interface GeometricPatternProps {
  variant?: 'dodecahedron' | 'spiral' | 'cube-array' | 'flower-of-life' | 'technical-blueprint' | 'technical-wireframe' | 'technical-corner' | 'golden-spiral-grid';
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
  const getPythagoreanStarPath = () => {
    // Pentagon vertices for Pythagorean star (pentagram)
    const centerX = 50,
      centerY = 50,
      radius = 35;
    const vertices = Array.from({
      length: 5
    }, (_, i) => {
      const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    return <g className="stroke-technical-highlight fill-none stroke-[1]">
        {/* Outer pentagon construction */}
        <polygon points={vertices.map(v => `${v.x},${v.y}`).join(' ')} className="stroke-technical-line stroke-[0.3] opacity-40" />
        
        {/* Pythagorean star lines - each connects every second vertex */}
        <line x1={vertices[0].x} y1={vertices[0].y} x2={vertices[2].x} y2={vertices[2].y} className="animate-ink-flow stroke-[1.5]" style={{
        animationDelay: '0s'
      }} />
        <line x1={vertices[2].x} y1={vertices[2].y} x2={vertices[4].x} y2={vertices[4].y} className="animate-ink-flow stroke-[1.5]" style={{
        animationDelay: '0.5s'
      }} />
        <line x1={vertices[4].x} y1={vertices[4].y} x2={vertices[1].x} y2={vertices[1].y} className="animate-ink-flow stroke-[1.5]" style={{
        animationDelay: '1s'
      }} />
        <line x1={vertices[1].x} y1={vertices[1].y} x2={vertices[3].x} y2={vertices[3].y} className="animate-ink-flow stroke-[1.5]" style={{
        animationDelay: '1.5s'
      }} />
        <line x1={vertices[3].x} y1={vertices[3].y} x2={vertices[0].x} y2={vertices[0].y} className="animate-ink-flow stroke-[1.5]" style={{
        animationDelay: '2s'
      }} />

        {/* Golden ratio construction lines */}
        <line x1={centerX} y1={centerY} x2={vertices[0].x} y2={vertices[0].y} className="stroke-technical-line stroke-[0.2] opacity-30" />
        <line x1={centerX} y1={centerY} x2={vertices[2].x} y2={vertices[2].y} className="stroke-technical-line stroke-[0.2] opacity-30" />

        {/* Vertex markers */}
        {vertices.map((vertex, i) => <circle key={i} cx={vertex.x} cy={vertex.y} r="1.5" className="fill-technical-highlight animate-geometric-pulse" style={{
        animationDelay: `${i * 0.1}s`
      }} />)}
        
        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="2" className="fill-technical-highlight animate-float" />
      </g>;
  };
  const getSpiralPath = () => <g className="stroke-geometric-primary fill-none stroke-1">
      {/* Golden spiral */}
      <path d="M50,50 Q60,30 80,35 Q90,50 85,70 Q70,85 45,80 Q25,65 30,40 Q40,25 65,30 Q85,45 75,65" className="animate-geometric-pulse" />
      {/* Spiral dots */}
      <circle cx="50" cy="50" r="2" className="fill-geometric-primary animate-float" />
      <circle cx="65" cy="40" r="1.5" className="fill-geometric-secondary animate-float" style={{
      animationDelay: '0.5s'
    }} />
      <circle cx="75" cy="55" r="1" className="fill-geometric-secondary animate-float" style={{
      animationDelay: '1s'
    }} />
      <circle cx="70" cy="70" r="1.5" className="fill-geometric-secondary animate-float" style={{
      animationDelay: '1.5s'
    }} />
      <circle cx="45" cy="75" r="1" className="fill-geometric-secondary animate-float" style={{
      animationDelay: '2s'
    }} />
    </g>;
  const getCubeArrayPath = () => <g className="stroke-geometric-primary fill-none stroke-1">
      {/* 3D cube formation */}
      <g className="animate-float">
        <polygon points="30,40 50,30 70,40 50,50" />
        <polygon points="30,40 30,60 50,70 50,50" />
        <polygon points="50,50 70,40 70,60 50,70" />
      </g>
      <g className="animate-float" style={{
      animationDelay: '0.3s'
    }}>
        <polygon points="20,50 40,40 60,50 40,60" />
        <polygon points="20,50 20,70 40,80 40,60" />
        <polygon points="40,60 60,50 60,70 40,80" />
      </g>
      <g className="animate-float" style={{
      animationDelay: '0.6s'
    }}>
        <polygon points="40,20 60,10 80,20 60,30" />
        <polygon points="40,20 40,40 60,50 60,30" />
        <polygon points="60,30 80,20 80,40 60,50" />
      </g>
    </g>;
  const getFlowerOfLifePath = () => <g className="stroke-geometric-primary fill-none stroke-1">
      {/* Central circle */}
      <circle cx="50" cy="50" r="15" className="animate-geometric-pulse" />
      {/* Surrounding circles */}
      <circle cx="50" cy="35" r="15" className="animate-float" />
      <circle cx="63" cy="42.5" r="15" className="animate-float" style={{
      animationDelay: '0.2s'
    }} />
      <circle cx="63" cy="57.5" r="15" className="animate-float" style={{
      animationDelay: '0.4s'
    }} />
      <circle cx="50" cy="65" r="15" className="animate-float" style={{
      animationDelay: '0.6s'
    }} />
      <circle cx="37" cy="57.5" r="15" className="animate-float" style={{
      animationDelay: '0.8s'
    }} />
      <circle cx="37" cy="42.5" r="15" className="animate-float" style={{
      animationDelay: '1s'
    }} />
    </g>;
  const getTechnicalBlueprintPath = () => <g className="stroke-technical-highlight fill-none stroke-[0.5]">
      <rect x="20" y="20" width="60" height="60" className="stroke-[1] animate-geometric-pulse" />
      <rect x="30" y="30" width="40" height="40" className="stroke-[0.5] animate-float" />
      <circle cx="50" cy="50" r="15" className="stroke-[1] animate-rotate" />
      {/* Technical measurement lines */}
      <line x1="15" y1="20" x2="15" y2="80" className="stroke-technical-line stroke-[0.3]" />
      <line x1="20" y1="15" x2="80" y2="15" className="stroke-technical-line stroke-[0.3]" />
      {/* Dimension markers */}
      <text x="10" y="50" className="text-[3px] fill-technical-line">60</text>
      <text x="50" y="10" className="text-[3px] fill-technical-line">60</text>
    </g>;
  const getTechnicalWireframePath = () => <g className="stroke-technical-highlight fill-none stroke-[0.5]">
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
    </g>;
  const getTechnicalCornerPath = () => <g className="stroke-technical-highlight fill-none stroke-[1]">
      <path d="M10,30 L10,10 L30,10" className="animate-geometric-pulse" />
      <path d="M70,10 L90,10 L90,30" className="animate-geometric-pulse" />
      <path d="M90,70 L90,90 L70,90" className="animate-geometric-pulse" />
      <path d="M30,90 L10,90 L10,70" className="animate-geometric-pulse" />
      <circle cx="50" cy="50" r="2" className="fill-technical-highlight animate-float" />
    </g>;
  const getGoldenSpiralGridPath = () => <g className="fill-none">
      {/* Concentric construction circles */}
      <g className="stroke-technical-line">
        <circle cx="50" cy="50" r="46" className="stroke-[0.4]" />
        <circle cx="50" cy="50" r="36" className="stroke-[0.35]" />
        <circle cx="50" cy="50" r="26" className="stroke-[0.3]" />
        <circle cx="50" cy="50" r="16" className="stroke-[0.25]" />
      </g>

      {/* Golden rectangles (construction) */}
      <g className="stroke-technical-line">
        <rect x="18" y="18" width="64" height="64" className="stroke-[0.35]" />
        <rect x="18" y="50" width="40" height="32" className="stroke-[0.3]" />
        <rect x="58" y="18" width="24" height="24" className="stroke-[0.25]" />
        <rect x="58" y="42" width="24" height="40" className="stroke-[0.25]" />
      </g>

      {/* Logarithmic spiral approximation */}
      <path d="M22,78 Q36,62 38,50 Q40,38 50,36 Q62,34 70,44 Q78,54 74,66 Q70,78 56,80 Q44,82 34,74 Q26,68 22,58" className="stroke-technical-highlight stroke-[0.9]" />

      {/* Construction diagonals */}
      <g className="stroke-technical-line">
        <line x1="18" y1="18" x2="82" y2="82" className="stroke-[0.25]" />
        <line x1="18" y1="82" x2="82" y2="18" className="stroke-[0.25]" />
        <line x1="50" y1="4" x2="50" y2="96" className="stroke-[0.2]" />
        <line x1="4" y1="50" x2="96" y2="50" className="stroke-[0.2]" />
      </g>

      {/* Nodes */}
      <g className="fill-technical-highlight">
        <circle cx="50" cy="36" r="0.9" />
        <circle cx="62" cy="34" r="0.9" />
        <circle cx="70" cy="44" r="0.9" />
        <circle cx="74" cy="66" r="0.9" />
        <circle cx="56" cy="80" r="0.9" />
        <circle cx="34" cy="74" r="0.9" />
        <circle cx="22" cy="58" r="0.9" />
      </g>
    </g>;
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
      case 'golden-spiral-grid':
        return getGoldenSpiralGridPath();
      default:
        return getPythagoreanStarPath();
    }
  };
  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {getPattern()}
    </svg>
  );
};
export default GeometricPattern;