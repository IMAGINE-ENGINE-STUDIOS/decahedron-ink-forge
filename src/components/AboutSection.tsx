import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import GeometricPattern from './GeometricPattern';
const AboutSection: React.FC = () => {
  return <section className="py-20 bg-background parchment-texture relative">
      {/* Background geometric elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10">
          <GeometricPattern variant="spiral" size="lg" className="animate-rotate" />
        </div>
        <div className="absolute bottom-10 left-10">
          <GeometricPattern variant="cube-array" size="lg" className="animate-float" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Our Mission
          </h2>
          <div className="w-24 h-px bg-geometric-primary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground leading-relaxed">At Decahedron Ventures, we believe in the power of mathematical precision to unlock infinite possibilities. Inspired by the ten faces of a decahedron, our investment philosophy is built on identifying ten or more transformative factors within startups—signals that highlight innovations positioned to deliver exponential growth.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="bg-card/30 backdrop-blur-sm border-geometric-secondary">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <GeometricPattern variant="dodecahedron" size="md" className="text-geometric-primary animate-geometric-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Investment Philosophy
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We seek companies that demonstrate the mathematical precision 
                    of sacred geometry—perfect balance, infinite growth potential, 
                    and the ability to create transformative change across industries.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/30 backdrop-blur-sm border-geometric-secondary">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <GeometricPattern variant="flower-of-life" size="md" className="text-geometric-primary animate-float" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Global Impact
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our portfolio companies are building the infrastructure of tomorrow—
                    from sustainable energy systems to space exploration technologies 
                    that will benefit humanity for generations to come.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics section */}
        
      </div>
    </section>;
};
export default AboutSection;