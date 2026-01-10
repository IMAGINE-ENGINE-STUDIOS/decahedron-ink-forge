import React from 'react';
import InvestmentArea from './InvestmentArea';
import GeometricPattern from './GeometricPattern';
const InvestmentAreasSection: React.FC = () => {
  const investmentAreas = [{
    title: "Technology & Compute",
    description: "Advanced software, AI, autonomy, photonics, and emerging compute architectures that underpin next-generation digital and physical infrastructure.",
    icon: "technology" as const,
    pattern: "dodecahedron" as const
  }, {
    title: "Space Systems",
    description: "Orbital and ground-based space infrastructure, satellite systems, launch platforms, and space-enabled communications that extend global connectivity and operational reach.",
    icon: "space" as const,
    pattern: "spiral" as const
  }, {
    title: "Energy Systems",
    description: "Next-generation energy generation, storage, transmission, and grid technologies designed for resilience, efficiency, and long-term sustainability.",
    icon: "energy" as const,
    pattern: "cube-array" as const
  }, {
    title: "Smart Infrastructure",
    description: "Technologies enabling intelligent cities, mobility systems, industrial automation, sensing, and connected environments that operate at population scale.",
    icon: "smart-cities" as const,
    pattern: "flower-of-life" as const
  }, {
    title: "Core Infrastructure",
    description: "Foundational physical and digital infrastructure — from data transport and compute to manufacturing and logistics — that supports modern economies.",
    icon: "infrastructure" as const,
    pattern: "dodecahedron" as const
  }, {
    title: "Sustainability & Resilience",
    description: "Technologies that enhance environmental sustainability, resource efficiency, and system resilience across industrial and societal infrastructure.",
    icon: "sustainability" as const,
    pattern: "spiral" as const
  }];
  return <section className="py-20 bg-secondary/20 parchment-texture relative overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4 sm:mb-6">
            <img src="/lovable-uploads/a63ed1a5-f345-497c-b509-c24edcbbba15.png" alt="Decahedron Ventures logo" className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto mx-auto opacity-90 hover:opacity-100 transition-opacity duration-300" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 sm:mb-8">
            Investment Focus Areas
          </h2>
          <div className="w-24 sm:w-32 h-px bg-geometric-primary mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">We invest in interconnected technology domains where precision engineering, system integration, and long-term deployment matter most.</p>
        </div>

        {/* Investment areas grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {investmentAreas.map((area, index) => <div key={area.title} className="animate-fade-in" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <InvestmentArea {...area} />
            </div>)}
        </div>

      </div>
    </section>;
};
export default InvestmentAreasSection;