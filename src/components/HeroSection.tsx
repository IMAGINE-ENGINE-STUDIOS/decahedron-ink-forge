import React from 'react';
import { Button } from "@/components/ui/button";
import GeometricPattern from './GeometricPattern';
import heroImage from '@/assets/hero-geometric.jpg';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden parchment-texture">
      {/* Background geometric patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20">
          <GeometricPattern variant="dodecahedron" size="lg" className="animate-float" />
        </div>
        <div className="absolute top-40 right-32">
          <GeometricPattern variant="spiral" size="md" className="animate-rotate" />
        </div>
        <div className="absolute bottom-40 left-32">
          <GeometricPattern variant="flower-of-life" size="md" className="animate-geometric-pulse" />
        </div>
        <div className="absolute bottom-20 right-20">
          <GeometricPattern variant="cube-array" size="lg" className="animate-float" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <GeometricPattern variant="dodecahedron" size="lg" className="opacity-20 animate-rotate" />
        </div>
      </div>

      {/* Hero content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Hero image */}
          <div className="mb-8 relative">
            <img 
              src={heroImage} 
              alt="Decahedron Ventures Geometric Pattern" 
              className="mx-auto max-w-md opacity-80 animate-ink-flow"
            />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Decahedron
            <span className="block text-geometric-primary">Ventures</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Leading venture capital firm focused on transformative technologies 
            that will shape the future of infrastructure and global innovation.
          </p>

          {/* Investment areas tagline */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm md:text-base text-geometric-secondary">
            <span className="border-b border-geometric-accent pb-1">Technology</span>
            <span className="border-b border-geometric-accent pb-1">Space</span>
            <span className="border-b border-geometric-accent pb-1">Energy</span>
            <span className="border-b border-geometric-accent pb-1">Smart Cities</span>
            <span className="border-b border-geometric-accent pb-1">Infrastructure</span>
            <span className="border-b border-geometric-accent pb-1">Sustainability</span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-medium"
            >
              Investment Portfolio
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-geometric-primary text-geometric-primary hover:bg-geometric-primary hover:text-primary-foreground px-8 py-4 text-lg font-medium"
            >
              Partner With Us
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative ink flow lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M0,50 Q25,30 50,50 T100,50" 
            fill="none" 
            stroke="hsl(var(--geometric-accent))" 
            strokeWidth="0.1" 
            className="animate-ink-flow opacity-30" 
          />
          <path 
            d="M0,60 Q30,40 60,60 T100,60" 
            fill="none" 
            stroke="hsl(var(--geometric-accent))" 
            strokeWidth="0.1" 
            className="animate-ink-flow opacity-20" 
            style={{animationDelay: '2s'}}
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;