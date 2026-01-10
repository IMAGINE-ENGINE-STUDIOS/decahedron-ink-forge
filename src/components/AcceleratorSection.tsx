import React from 'react';
import { ExternalLink, Rocket, Users, Target, Presentation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GeometricPattern from '@/components/GeometricPattern';
import startupFactoryLogo from '@/assets/partners/startup-factory-hub.ico';

const benefits = [
  {
    icon: Rocket,
    title: 'FREE PROGRAM',
    description: 'No cost to participate in our comprehensive accelerator',
  },
  {
    icon: Users,
    title: 'EXPERT MENTORSHIP',
    description: 'Access guidance from seasoned industry leaders',
  },
  {
    icon: Target,
    title: 'INVESTOR NETWORK',
    description: 'Direct connections to our VC partners and angels',
  },
  {
    icon: Presentation,
    title: 'PITCH PREPARATION',
    description: 'Refine your presentation to investor-ready standards',
  },
];

const AcceleratorSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5">
        <GeometricPattern />
      </div>
      
      {/* Parchment texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="text-xs tracking-[0.3em] text-primary/60 font-mono">
              [ ACCELERATOR.PROGRAM ]
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Accelerate Your Path to Investment
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join our hybrid accelerator program to strengthen your startup and 
            <span className="text-primary font-semibold"> significantly increase your chances </span>
            of securing investment from Decahedron Ventures.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 group"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-mono text-sm font-semibold mb-2 tracking-wider">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Card */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            {/* Logo */}
            <div className="mb-6">
              <img 
                src={startupFactoryLogo} 
                alt="Startup Factory Hub" 
                className="h-16 w-16 mx-auto object-contain"
              />
            </div>
            
            <h3 className="text-2xl font-bold mb-3">
              Startup Factory Hub
            </h3>
            
            <p className="text-muted-foreground mb-6">
              Our partner accelerator program is designed to prepare founders for successful fundraising. 
              Completely free, with no equity required.
            </p>
            
            <Button 
              asChild
              size="lg"
              className="group"
            >
              <a 
                href="https://startupfactoryhub.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Apply Now — It's Free
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AcceleratorSection;
