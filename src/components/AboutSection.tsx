import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import GeometricPattern from './GeometricPattern';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-background parchment-texture relative">
      {/* Background geometric elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10">
          <GeometricPattern variant="spiral" size="lg" className="animate-rotate" />
        </div>
        <div className="absolute bottom-10 left-10">
          <GeometricPattern variant="cube-array" size="lg" className="animate-float" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 sm:mb-8">
            Our Mission
          </h2>
          <div className="w-16 sm:w-24 h-px bg-geometric-primary mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6">
            At Decahedron Ventures, we invest with precision in frontier technologies that move energy, data, and intelligence across Earth and orbit.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
            Inspired by the geometric rigor of the decahedron, our investment philosophy is built on identifying multiple, reinforcing signals within companies — technical, commercial, and systemic — that indicate the potential to build durable, scalable, infrastructure-grade businesses.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            We believe that transformational outcomes are not driven by hype, but by disciplined alignment between technology, deployment reality, and capital timing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <Card className="bg-card/30 backdrop-blur-sm border-geometric-secondary">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0">
                  <GeometricPattern variant="dodecahedron" size="md" className="text-geometric-primary animate-geometric-pulse" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                    Investment Philosophy
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                    We invest in early and growth-stage frontier technology companies where:
                  </p>
                  <ul className="text-sm sm:text-base text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
                    <li>Technical feasibility has been meaningfully validated</li>
                    <li>Differentiation is rooted in architecture, performance, or system-level advantage</li>
                    <li>There is a credible path from prototype to real-world deployment</li>
                  </ul>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-3">
                    Our focus is on companies capable of reshaping industries through step-change advances in how critical systems are built, operated, and scaled.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/30 backdrop-blur-sm border-geometric-secondary">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0">
                  <GeometricPattern variant="flower-of-life" size="md" className="text-geometric-primary animate-float" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                    Global Impact
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                    Decahedron Ventures invests globally, supporting companies across multiple continents that are building the foundational technologies of the next industrial era.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Our portfolio companies operate at the intersection of infrastructure, sustainability, and advanced systems, developing solutions that address long-term challenges in energy, communications, mobility, and space — with impact measured in decades, not quarters.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics section */}
        
      </div>
    </section>
  );
};

export default AboutSection;