import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatrixSymbols from '@/components/MatrixSymbols';

const deckSlides = [
  {
    title: 'DECAHEDRON VENTURES FUND I',
    subtitle: 'Deep Tech, Space, and Quantum Fund',
    content: 'Investing at the Frontier of Strategic Technologies',
    details: ['Seed – Series A', 'Target Fund Size: $100M', '2026 Vintage'],
  },
  {
    title: 'WHY NOW',
    subtitle: 'Techno-Industrial Renaissance (2025–2035)',
    content: 'Strategic prioritization of AI, autonomy, space, semiconductors, and quantum',
    details: [
      'AI reducing engineering & prototyping cycles by 10×',
      'Government & enterprise procurement shifting to commercial-first models',
    ],
  },
  {
    title: 'OUR MISSION',
    subtitle: 'Investment Philosophy',
    content: 'Invest in early and growth-stage companies that demonstrate strong differentiation factors and breakthrough innovation.',
    details: [
      'Potential to reshape and transform entire industries',
      'At least $1M ARR target',
      'Back technical founders building the strategic technology leaders of the 2030s',
    ],
  },
  {
    title: 'FOCUS AREAS',
    subtitle: 'Strategic Technology Sectors',
    content: 'Engineering capital for systems that move energy, data, and intelligence across Earth and orbit',
    details: [
      'SPACE: Orbital & ground infrastructure, space-based communications',
      'DEEP TECH: Robotics, autonomy, advanced sensing, custom silicon',
      'QUANTUM: Quantum-enabled sensing, optical interconnects for AI compute',
    ],
  },
  {
    title: 'MARKET CONTEXT',
    subtitle: 'Timing & Opportunity',
    content: 'The convergence of multiple technological revolutions creates unprecedented investment opportunities.',
    details: [
      'Global semiconductor market exceeding $600B',
      'Space economy projected to reach $1T by 2030',
      'Quantum computing market growing at 25%+ CAGR',
    ],
  },
  {
    title: 'FUND STRUCTURE',
    subtitle: 'Investment Parameters',
    content: 'Disciplined capital deployment with strategic focus',
    details: [
      'Target Fund Size: $100M',
      'Initial Check Size: $500K - $3M',
      'Follow-on Reserves: 40%',
      'Target Portfolio: 20-25 companies',
    ],
  },
];

const Deck = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % deckSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + deckSlides.length) % deckSlides.length);
  };

  const slide = deckSlides[currentSlide];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Matrix Animation Background */}
      <MatrixSymbols />

      {/* Technical Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="deck-grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#deck-grid)" />
        </svg>
      </div>

      {/* Animated Corner Elements */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-geometric-primary/40 animate-[geometric-pulse_3s_ease-in-out_infinite]" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-geometric-secondary/40 animate-[geometric-pulse_3s_ease-in-out_infinite_0.5s]" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-geometric-secondary/40 animate-[geometric-pulse_3s_ease-in-out_infinite_1s]" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-geometric-primary/40 animate-[geometric-pulse_3s_ease-in-out_infinite_1.5s]" />

      {/* Navigation Header */}
      <header className="relative z-20 p-6 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="font-technical text-xs tracking-wider uppercase hover:bg-technical-highlight/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex gap-3">
          <a
            href="/Decahedron_Ventures_Fund_I_Deck.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button
              variant="outline"
              className="font-technical text-xs tracking-wider uppercase border-technical-line hover:bg-technical-highlight/10"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View PDF
            </Button>
          </a>
          <a href="/Decahedron_Ventures_Fund_I_Deck.pdf" download className="inline-flex">
            <Button
              variant="outline"
              className="font-technical text-xs tracking-wider uppercase border-technical-line hover:bg-technical-highlight/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
        </div>
      </header>

      {/* Main Deck Content */}
      <main className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        {/* Slide Counter */}
        <div className="font-technical text-xs text-geometric-secondary mb-8 tracking-widest">
          [ SLIDE {String(currentSlide + 1).padStart(2, '0')} / {String(deckSlides.length).padStart(2, '0')} ]
        </div>

        {/* Slide Content */}
        <div
          key={currentSlide}
          className="max-w-4xl w-full text-center animate-fade-in"
        >
          {/* Decorative Line */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-geometric-primary to-transparent mx-auto mb-8" />

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-4 tracking-tight">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <div className="font-technical text-sm md:text-base text-technical-highlight mb-8 tracking-wider uppercase">
            {slide.subtitle}
          </div>

          {/* Content */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {slide.content}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {slide.details.map((detail, index) => (
              <div
                key={index}
                className="border border-technical-line bg-background/50 backdrop-blur-sm p-4 hover:border-geometric-primary/60 transition-colors duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="font-technical text-xs text-geometric-primary tracking-wide">
                  {detail}
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Line */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-geometric-secondary to-transparent mx-auto mt-12" />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-6 mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={prevSlide}
            className="font-technical border-technical-line hover:bg-technical-highlight/10 w-14 h-14"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Slide Dots */}
          <div className="flex gap-2">
            {deckSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-geometric-primary scale-125'
                    : 'bg-technical-line/40 hover:bg-technical-line/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={nextSlide}
            className="font-technical border-technical-line hover:bg-technical-highlight/10 w-14 h-14"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Keyboard Hint */}
        <div className="font-technical text-[10px] text-geometric-secondary/50 mt-6 tracking-widest">
          USE ARROWS TO NAVIGATE
        </div>
      </main>

      {/* Technical Footer */}
      <footer className="relative z-10 p-6 text-center font-technical text-[10px] text-geometric-secondary/40 tracking-[0.2em]">
        DECAHEDRON VENTURES FUND I | CONFIDENTIAL
      </footer>
    </div>
  );
};

export default Deck;
