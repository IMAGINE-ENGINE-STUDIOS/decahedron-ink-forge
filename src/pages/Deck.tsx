import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatrixSymbols from '@/components/MatrixSymbols';

import slide1 from '@/assets/deck/slide-1.jpg';
import slide2 from '@/assets/deck/slide-2.jpg';
import slide3 from '@/assets/deck/slide-3.jpg';
import slide4 from '@/assets/deck/slide-4.jpg';
import slide5 from '@/assets/deck/slide-5.jpg';
import slide6 from '@/assets/deck/slide-6.jpg';
import slide7 from '@/assets/deck/slide-7.jpg';
import slide8 from '@/assets/deck/slide-8.jpg';
import slide9 from '@/assets/deck/slide-9.jpg';
import slide10 from '@/assets/deck/slide-10.jpg';
import slide11 from '@/assets/deck/slide-11.jpg';
import slide12 from '@/assets/deck/slide-12.jpg';
import slide13 from '@/assets/deck/slide-13.jpg';
import slide14 from '@/assets/deck/slide-14.jpg';

const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9, slide10, slide11, slide12, slide13, slide14];

const Deck = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  return (
    <div className={`min-h-screen bg-background relative overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Matrix Animation Background */}
      {!isFullscreen && <MatrixSymbols />}

      {/* Technical Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
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
      {!isFullscreen && (
        <>
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-geometric-primary/40 animate-[geometric-pulse_3s_ease-in-out_infinite]" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-geometric-secondary/40 animate-[geometric-pulse_3s_ease-in-out_infinite_0.5s]" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-geometric-secondary/40 animate-[geometric-pulse_3s_ease-in-out_infinite_1s]" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-geometric-primary/40 animate-[geometric-pulse_3s_ease-in-out_infinite_1.5s]" />
        </>
      )}

      {/* Navigation Header */}
      <header className={`relative z-20 p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-background/80 backdrop-blur-sm border-b border-technical-line/20 ${isFullscreen ? 'absolute top-0 left-0 right-0' : ''}`}>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="font-technical text-xs tracking-wider uppercase hover:bg-technical-highlight/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="font-technical text-xs text-geometric-secondary tracking-widest">
          SLIDE {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="font-technical text-xs tracking-wider uppercase border-technical-line hover:bg-technical-highlight/10"
          >
            {isFullscreen ? <Minimize2 className="mr-2 h-4 w-4" /> : <Maximize2 className="mr-2 h-4 w-4" />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
          <a href="/Decahedron_Ventures_Fund_I_Deck.pdf" download className="inline-flex">
            <Button
              size="sm"
              className="font-technical text-xs tracking-wider uppercase bg-geometric-primary hover:bg-geometric-primary/80"
            >
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </a>
        </div>
      </header>

      {/* Slide Viewer */}
      <main className={`relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 ${isFullscreen ? 'pt-20' : ''}`}>
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-2 md:left-6 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border border-technical-line/40 hover:bg-technical-highlight/10 hover:border-geometric-primary transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
        </Button>

        {/* Slide Container */}
        <div className="relative w-full max-w-5xl mx-auto aspect-video">
          {/* Slide Frame */}
          <div className="absolute inset-0 border-2 border-technical-line/30 rounded-lg overflow-hidden shadow-2xl bg-black">
            <img
              src={slides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className={`w-full h-full object-contain transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
            />
          </div>

          {/* Decorative corners */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-geometric-primary" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-r-2 border-t-2 border-geometric-primary" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-2 border-b-2 border-geometric-primary" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-geometric-primary" />
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-2 md:right-6 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border border-technical-line/40 hover:bg-technical-highlight/10 hover:border-geometric-primary transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
        </Button>
      </main>

      {/* Slide Thumbnails / Dots */}
      <footer className={`relative z-10 p-4 md:p-6 bg-background/80 backdrop-blur-sm border-t border-technical-line/20 ${isFullscreen ? 'absolute bottom-0 left-0 right-0' : ''}`}>
        <div className="flex justify-center items-center gap-2 md:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-300 ${
                index === currentSlide
                  ? 'w-10 md:w-12 h-2 bg-geometric-primary rounded-full'
                  : 'w-2 h-2 bg-technical-line/40 hover:bg-technical-line/70 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="text-center mt-3 font-technical text-[10px] text-geometric-secondary/50 tracking-widest">
          USE ← → ARROWS OR CLICK TO NAVIGATE | PRESS F FOR FULLSCREEN
        </div>
      </footer>
    </div>
  );
};

export default Deck;
