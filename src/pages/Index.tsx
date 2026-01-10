import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import InvestmentAreasSection from '@/components/InvestmentAreasSection';
import TeamSection from '@/components/TeamSection';
import ContactSection from '@/components/ContactSection';
import PitchSection from '@/components/PitchSection';
import AcceleratorSection from '@/components/AcceleratorSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen relative">
      <Link 
        to="/admin" 
        className="fixed top-4 right-4 z-50 p-2 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
        aria-label="Admin login"
      >
        <KeyRound className="h-4 w-4" />
      </Link>
      <HeroSection />
      <AboutSection />
      <InvestmentAreasSection />
      <TeamSection />
      <PitchSection />
      <AcceleratorSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
