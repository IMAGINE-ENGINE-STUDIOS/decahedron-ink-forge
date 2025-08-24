import React from 'react';
import InvestmentArea from './InvestmentArea';
import GeometricPattern from './GeometricPattern';

const InvestmentAreasSection: React.FC = () => {
  const investmentAreas = [
    {
      title: "Technology",
      description: "Cutting-edge software, AI, blockchain, and emerging technologies that redefine digital infrastructure and human-computer interaction.",
      icon: "technology" as const,
      pattern: "dodecahedron" as const
    },
    {
      title: "Space",
      description: "Space exploration, satellite technology, launch systems, and commercial space applications that expand humanity's reach beyond Earth.",
      icon: "space" as const,
      pattern: "spiral" as const
    },
    {
      title: "Energy",
      description: "Renewable energy systems, energy storage, smart grids, and breakthrough technologies for sustainable power generation.",
      icon: "energy" as const,
      pattern: "cube-array" as const
    },
    {
      title: "Smart Cities",
      description: "Urban planning technologies, IoT infrastructure, transportation systems, and solutions that make cities more livable and efficient.",
      icon: "smart-cities" as const,
      pattern: "flower-of-life" as const
    },
    {
      title: "Infrastructure",
      description: "Physical and digital infrastructure investments that form the backbone of modern society and economic growth.",
      icon: "infrastructure" as const,
      pattern: "dodecahedron" as const
    },
    {
      title: "Sustainability",
      description: "Environmental technologies, carbon capture, waste management, and solutions for a more sustainable future.",
      icon: "sustainability" as const,
      pattern: "spiral" as const
    }
  ];

  return (
    <section className="py-20 bg-secondary/20 parchment-texture relative overflow-hidden">

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <GeometricPattern 
              variant="complex-geometric" 
              size="lg" 
              className="text-geometric-primary animate-geometric-pulse" 
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Investment Focus Areas
          </h2>
          <div className="w-32 h-px bg-geometric-primary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Six interconnected sectors where geometric precision meets transformative innovation, 
            creating a portfolio designed for exponential impact and sustainable growth.
          </p>
        </div>

        {/* Investment areas grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {investmentAreas.map((area, index) => (
            <div 
              key={area.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <InvestmentArea {...area} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default InvestmentAreasSection;