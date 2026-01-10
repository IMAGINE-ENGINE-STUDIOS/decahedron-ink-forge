import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, Play, Pause, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const DECK_PASSWORD = 'VentureFund';

const Deck = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DECK_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const goToSlide = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
    setDirection(dir);
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length, 'next');
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length, 'prev');
  }, [currentSlide, goToSlide]);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const toggleAutoPlay = () => setIsAutoPlay(!isAutoPlay);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!isAuthenticated) return;
    
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
  }, [nextSlide, prevSlide, isFullscreen, isAuthenticated]);

  const progress = ((currentSlide + 1) / slides.length) * 100;

  // Password Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-geometric-primary/20 rounded-full blur-[100px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-geometric-secondary/20 rounded-full blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--geometric-primary) / 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--geometric-primary) / 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }} />
          </div>
        </div>

        {/* Password Form */}
        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-geometric-primary/20 via-transparent to-geometric-secondary/20 rounded-2xl blur-xl opacity-50" />
            
            {/* Form container */}
            <div className="relative bg-black/50 backdrop-blur-xl border border-white/20 rounded-xl p-8">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-geometric-primary" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-geometric-primary" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-geometric-secondary" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-geometric-secondary" />

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/20 bg-white/5 mb-4">
                  <Lock className="w-8 h-8 text-geometric-primary" />
                </div>
                <h1 className="font-technical text-xs tracking-[0.3em] text-white/50 mb-2">[ PROTECTED.CONTENT ]</h1>
                <h2 className="font-display text-2xl text-white">Fund I Pitch Deck</h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-geometric-primary focus:ring-geometric-primary/20"
                  />
                  {error && (
                    <p className="text-red-400 text-sm mt-2 font-technical">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-geometric-primary to-geometric-secondary hover:opacity-90 text-white font-technical tracking-wider"
                >
                  Access Deck
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-white/50 hover:text-white text-xs font-technical tracking-wider"
                >
                  <ArrowLeft className="mr-2 h-3 w-3" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black relative overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-geometric-primary/20 rounded-full blur-[100px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-geometric-secondary/20 rounded-full blur-[100px] animate-[float_10s_ease-in-out_infinite_reverse]" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--geometric-primary) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--geometric-primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Scanning line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-geometric-primary to-transparent animate-[scan_4s_linear_infinite]"
            style={{ top: '50%' }}
          />
        </div>
      </div>

      {/* Progress Bar - Top */}
      <div className="relative z-30 h-1 bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-geometric-primary via-geometric-secondary to-geometric-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]"
          style={{ left: `${progress - 5}%` }}
        />
      </div>

      {/* Navigation Header */}
      <header className={`relative z-20 px-4 md:px-8 py-4 flex justify-between items-center ${isFullscreen ? 'absolute top-1 left-0 right-0' : ''}`}>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="font-technical text-xs tracking-wider uppercase text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit
        </Button>

        {/* Center info */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-geometric-primary animate-pulse" />
            <span className="font-technical text-xs text-white/50 tracking-widest">DECAHEDRON VENTURES</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAutoPlay}
            className={`w-10 h-10 rounded-full border backdrop-blur-sm transition-all ${
              isAutoPlay 
                ? 'border-geometric-primary bg-geometric-primary/20 text-geometric-primary' 
                : 'border-white/20 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <a href="/Decahedron_Ventures_Fund_I_Deck.pdf" download>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full border border-white/20 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </header>

      {/* Main Slide Area */}
      <main className={`relative z-10 flex-1 flex items-center justify-center px-4 md:px-20 py-4 ${isFullscreen ? 'pt-16' : ''}`}>
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-8 z-20 group"
        >
          <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-geometric-primary/60 transition-all duration-300" />
            <div className="absolute inset-1 rounded-full bg-white/5 group-hover:bg-geometric-primary/10 backdrop-blur-sm transition-all duration-300" />
            <ChevronLeft className="relative h-6 w-6 md:h-8 md:w-8 text-white/60 group-hover:text-white transition-colors" />
          </div>
        </button>

        {/* Slide Container */}
        <div className="relative w-full max-w-6xl mx-auto">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-geometric-primary/20 via-transparent to-geometric-secondary/20 rounded-2xl blur-xl opacity-50" />
          
          {/* Slide frame */}
          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/20 shadow-2xl">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-geometric-primary z-10" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-geometric-primary z-10" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-geometric-secondary z-10" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-geometric-secondary z-10" />
            
            {/* Slide image */}
            <img
              key={currentSlide}
              src={slides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-contain bg-black animate-fade-in"
            />

            {/* Slide number overlay */}
            <div className="absolute bottom-4 right-4 font-technical text-xs text-white/40 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-8 z-20 group"
        >
          <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-geometric-primary/60 transition-all duration-300" />
            <div className="absolute inset-1 rounded-full bg-white/5 group-hover:bg-geometric-primary/10 backdrop-blur-sm transition-all duration-300" />
            <ChevronRight className="relative h-6 w-6 md:h-8 md:w-8 text-white/60 group-hover:text-white transition-colors" />
          </div>
        </button>
      </main>

      {/* Bottom Navigation */}
      <footer className={`relative z-20 px-4 md:px-8 py-4 ${isFullscreen ? 'absolute bottom-0 left-0 right-0' : ''}`}>
        {/* Thumbnail strip */}
        <div className="flex justify-center items-center gap-1 md:gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index, index > currentSlide ? 'next' : 'prev')}
              className={`relative flex-shrink-0 transition-all duration-300 rounded overflow-hidden ${
                index === currentSlide
                  ? 'w-16 md:w-24 h-10 md:h-14 ring-2 ring-geometric-primary ring-offset-2 ring-offset-black'
                  : 'w-10 md:w-16 h-6 md:h-10 opacity-40 hover:opacity-70 grayscale hover:grayscale-0'
              }`}
            >
              <img
                src={slide}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-t from-geometric-primary/30 to-transparent" />
              )}
            </button>
          ))}
        </div>

        {/* Keyboard hints */}
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-white/30 text-[10px] font-technical tracking-wider">
            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">←</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">→</kbd>
            <span>NAVIGATE</span>
          </div>
          <div className="flex items-center gap-2 text-white/30 text-[10px] font-technical tracking-wider">
            <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">F</kbd>
            <span>FULLSCREEN</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-50vh); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(50vh); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Deck;
