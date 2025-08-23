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
      {/* Background geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-1/4">
          <GeometricPattern variant="dodecahedron" size="lg" className="animate-rotate" />
        </div>
        <div className="absolute bottom-20 right-1/4">
          <GeometricPattern variant="flower-of-life" size="lg" className="animate-float" />
        </div>
        <div className="absolute top-1/2 right-10">
          <GeometricPattern variant="cube-array" size="md" className="animate-geometric-pulse" />
        </div>
        <div className="absolute top-1/3 left-10">
          <GeometricPattern variant="spiral" size="md" className="animate-ink-flow" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <GeometricPattern 
              variant="dodecahedron" 
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

        {/* Call to action */}
        <div className="mt-20 text-center">
          <div className="bg-card/50 backdrop-blur-sm border border-geometric-secondary rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Shape the Future?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Whether you're an entrepreneur with a transformative vision or an investor 
              seeking exponential returns, let's explore the geometric possibilities together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
                Submit Your Pitch
              </button>
              <button className="border border-geometric-primary text-geometric-primary hover:bg-geometric-primary hover:text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentAreasSection;