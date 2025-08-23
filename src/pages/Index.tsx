import React from 'react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import InvestmentAreasSection from '@/components/InvestmentAreasSection';

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <InvestmentAreasSection />
    </main>
  );
};

export default Index;
