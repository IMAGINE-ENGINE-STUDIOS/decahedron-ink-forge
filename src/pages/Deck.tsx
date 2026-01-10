import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatrixSymbols from '@/components/MatrixSymbols';

const Deck = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Matrix Animation Background */}
      <MatrixSymbols />

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
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-geometric-primary/40 animate-[geometric-pulse_3s_ease-in-out_infinite]" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-geometric-secondary/40 animate-[geometric-pulse_3s_ease-in-out_infinite_0.5s]" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-geometric-secondary/40 animate-[geometric-pulse_3s_ease-in-out_infinite_1s]" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-geometric-primary/40 animate-[geometric-pulse_3s_ease-in-out_infinite_1.5s]" />

      {/* Navigation Header */}
      <header className="relative z-20 p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-background/80 backdrop-blur-sm border-b border-technical-line/20">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="font-technical text-xs tracking-wider uppercase hover:bg-technical-highlight/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="font-technical text-xs text-geometric-secondary tracking-widest">
          DECAHEDRON VENTURES FUND I DECK
        </div>

        <div className="flex gap-3">
          <a
            href="/Decahedron_Ventures_Fund_I_Deck.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button
              variant="outline"
              size="sm"
              className="font-technical text-xs tracking-wider uppercase border-technical-line hover:bg-technical-highlight/10"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
          </a>
          <a href="/Decahedron_Ventures_Fund_I_Deck.pdf" download className="inline-flex">
            <Button
              variant="outline"
              size="sm"
              className="font-technical text-xs tracking-wider uppercase border-technical-line hover:bg-technical-highlight/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="relative z-10 flex-1 h-[calc(100vh-80px)]">
        <iframe
          src="/Decahedron_Ventures_Fund_I_Deck.pdf"
          className="w-full h-full border-0"
          title="Decahedron Ventures Fund I Deck"
        />
      </main>
    </div>
  );
};

export default Deck;
