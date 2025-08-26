import React from 'react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import InvestmentAreasSection from '@/components/InvestmentAreasSection';
import ContactSection from '@/components/ContactSection';
import PitchSection from '@/components/PitchSection';

import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <InvestmentAreasSection />
      <PitchSection />
      
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
