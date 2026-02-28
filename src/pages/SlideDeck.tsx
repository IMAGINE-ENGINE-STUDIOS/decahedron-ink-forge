import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, Minimize2, Play, Pause, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allSlides } from '@/components/slides/slideData';

const DECK_PASSWORD = 'VentureFund';

const SlideDeck = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = allSlides.length;

  // Calculate scale
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = rect.width / 1920;
      const scaleY = rect.height / 1080;
      setScale(Math.min(scaleX, scaleY));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isAuthenticated, isFullscreen]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DECK_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => (s + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((s) => (s - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!isAuthenticated) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
      else if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
      else if (e.key === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen, isAuthenticated]);

  const progress = ((currentSlide + 1) / totalSlides) * 100;
  const CurrentSlideComponent = allSlides[currentSlide];

  // Password Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-geometric-primary relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="relative bg-geometric-secondary/30 backdrop-blur-xl border border-geometric-accent/20 rounded-sm p-8">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 350">
              <path d="M10,10 L40,10 L40,15" fill="none" stroke="hsl(var(--geometric-accent))" strokeWidth="0.5" />
              <path d="M10,10 L10,40" fill="none" stroke="hsl(var(--geometric-accent))" strokeWidth="0.5" />
              <path d="M390,10 L360,10 L360,15" fill="none" stroke="hsl(var(--geometric-accent))" strokeWidth="0.5" />
              <path d="M390,10 L390,40" fill="none" stroke="hsl(var(--geometric-accent))" strokeWidth="0.5" />
              <path d="M10,340 L40,340" fill="none" stroke="hsl(var(--geometric-accent))" strokeWidth="0.5" />
              <path d="M10,340 L10,310" fill="none" stroke="hsl(var(--geometric-accent))" strokeWidth="0.5" />
              <path d="M390,340 L360,340" fill="none" stroke="hsl(var(--geometric-accent))" strokeWidth="0.5" />
              <path d="M390,340 L390,310" fill="none" stroke="hsl(var(--geometric-accent))" strokeWidth="0.5" />
            </svg>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-geometric-accent/20 bg-geometric-accent/5 mb-4">
                <Lock className="w-8 h-8 text-geometric-accent" />
              </div>
              <h1 className="font-technical text-[11px] tracking-[0.3em] text-geometric-accent/50 mb-2">[ PROTECTED.CONTENT ]</h1>
              <h2 className="font-display text-2xl text-primary-foreground">Fund I Pitch Deck</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-geometric-accent/5 border-geometric-accent/20 text-primary-foreground placeholder:text-geometric-accent/40 focus:border-geometric-accent focus:ring-geometric-accent/20"
                />
                {error && <p className="text-destructive text-sm mt-2 font-technical">{error}</p>}
              </div>
              <Button type="submit" className="w-full bg-geometric-accent/20 hover:bg-geometric-accent/30 text-primary-foreground font-technical tracking-wider border border-geometric-accent/20">
                Access Deck
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={() => navigate('/')} className="text-geometric-accent/50 hover:text-geometric-accent text-xs font-technical tracking-wider">
                <ArrowLeft className="mr-2 h-3 w-3" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-geometric-primary relative overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Progress Bar */}
      <div className="relative z-30 h-[3px] bg-geometric-secondary/30">
        <div className="h-full bg-geometric-accent/50 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <header className={`relative z-20 px-4 md:px-8 py-3 flex justify-between items-center ${isFullscreen ? 'absolute top-[3px] left-0 right-0' : ''}`}>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="font-technical text-[11px] tracking-wider uppercase text-geometric-accent/60 hover:text-geometric-accent hover:bg-geometric-accent/5 border border-geometric-accent/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit
        </Button>

        <div className="hidden md:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-geometric-accent/40 animate-pulse" />
          <span className="font-technical text-[11px] text-geometric-accent/40 tracking-[0.3em]">DECAHEDRON VENTURES</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost" size="icon"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`w-9 h-9 rounded-full border ${isAutoPlay ? 'border-geometric-accent/40 bg-geometric-accent/10 text-geometric-accent' : 'border-geometric-accent/15 text-geometric-accent/50 hover:text-geometric-accent hover:bg-geometric-accent/5'}`}
          >
            {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost" size="icon"
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full border border-geometric-accent/15 text-geometric-accent/50 hover:text-geometric-accent hover:bg-geometric-accent/5"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main Slide Area */}
      <main ref={containerRef} className={`relative z-10 flex-1 flex items-center justify-center px-4 md:px-20 ${isFullscreen ? 'pt-14' : ''}`}>
        {/* Prev */}
        <button onClick={prevSlide} className="absolute left-2 md:left-6 z-20 group">
          <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-geometric-accent/15 group-hover:border-geometric-accent/40 transition-all" />
            <ChevronLeft className="relative h-5 w-5 md:h-7 md:w-7 text-geometric-accent/40 group-hover:text-geometric-accent transition-colors" />
          </div>
        </button>

        {/* Slide */}
        <div className="relative" style={{ width: 1920 * scale, height: 1080 * scale }}>
          <div
            className="absolute origin-top-left rounded-sm overflow-hidden shadow-2xl"
            style={{ width: 1920, height: 1080, transform: `scale(${scale})` }}
          >
            <CurrentSlideComponent />
          </div>
        </div>

        {/* Next */}
        <button onClick={nextSlide} className="absolute right-2 md:right-6 z-20 group">
          <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-geometric-accent/15 group-hover:border-geometric-accent/40 transition-all" />
            <ChevronRight className="relative h-5 w-5 md:h-7 md:w-7 text-geometric-accent/40 group-hover:text-geometric-accent transition-colors" />
          </div>
        </button>
      </main>

      {/* Footer */}
      <footer className={`relative z-20 px-4 md:px-8 py-3 ${isFullscreen ? 'absolute bottom-0 left-0 right-0' : ''}`}>
        {/* Thumbnails */}
        <div className="flex justify-center items-center gap-1.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {allSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`flex-shrink-0 rounded-sm transition-all duration-300 flex items-center justify-center font-technical text-[9px] ${
                index === currentSlide
                  ? 'w-10 h-7 bg-geometric-accent/20 border border-geometric-accent/40 text-geometric-accent'
                  : 'w-7 h-5 bg-geometric-accent/5 border border-geometric-accent/10 text-geometric-accent/30 hover:text-geometric-accent/60 hover:bg-geometric-accent/10'
              }`}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>

        {/* Keyboard hints */}
        <div className="flex justify-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-geometric-accent/25 text-[9px] font-technical tracking-wider">
            <kbd className="px-1.5 py-0.5 bg-geometric-accent/5 rounded border border-geometric-accent/10">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-geometric-accent/5 rounded border border-geometric-accent/10">→</kbd>
            <span>NAVIGATE</span>
          </div>
          <div className="flex items-center gap-2 text-geometric-accent/25 text-[9px] font-technical tracking-wider">
            <kbd className="px-1.5 py-0.5 bg-geometric-accent/5 rounded border border-geometric-accent/10">F</kbd>
            <span>FULLSCREEN</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SlideDeck;
