import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatrixSymbols from '@/components/MatrixSymbols';

const Deck = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
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

        <div className="font-technical text-xs text-geometric-secondary tracking-widest hidden md:block">
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
              Open PDF
            </Button>
          </a>
          <a href="/Decahedron_Ventures_Fund_I_Deck.pdf" download className="inline-flex">
            <Button
              size="sm"
              className="font-technical text-xs tracking-wider uppercase bg-geometric-primary hover:bg-geometric-primary/80"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
        </div>
      </header>

      {/* PDF Viewer with Fallback */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Embedded PDF */}
        <object
          data="/Decahedron_Ventures_Fund_I_Deck.pdf"
          type="application/pdf"
          className="w-full flex-1 min-h-[600px]"
        >
          {/* Fallback for browsers that can't display PDF */}
          <div className="flex flex-col items-center justify-center h-full py-20 px-6">
            <div className="max-w-lg text-center">
              <div className="w-24 h-24 mx-auto mb-8 border-2 border-geometric-primary/40 rounded-lg flex items-center justify-center animate-[geometric-pulse_3s_ease-in-out_infinite]">
                <FileText className="w-12 h-12 text-geometric-primary" />
              </div>
              
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Fund I Investment Deck
              </h2>
              
              <p className="text-muted-foreground mb-8">
                Your browser doesn't support embedded PDF viewing. Please download or open the deck using the buttons above.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/Decahedron_Ventures_Fund_I_Deck.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-technical text-xs tracking-wider uppercase border-technical-line hover:bg-technical-highlight/10 w-full"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </Button>
                </a>
                <a href="/Decahedron_Ventures_Fund_I_Deck.pdf" download className="inline-flex">
                  <Button
                    size="lg"
                    className="font-technical text-xs tracking-wider uppercase bg-geometric-primary hover:bg-geometric-primary/80 w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </object>
      </main>

      {/* Technical Footer */}
      <footer className="relative z-10 p-4 text-center font-technical text-[10px] text-geometric-secondary/40 tracking-[0.2em] bg-background/80 backdrop-blur-sm border-t border-technical-line/20">
        DECAHEDRON VENTURES FUND I | CONFIDENTIAL
      </footer>
    </div>
  );
};

export default Deck;
