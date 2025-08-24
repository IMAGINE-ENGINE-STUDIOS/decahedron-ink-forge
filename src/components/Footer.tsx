import React from 'react';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import GeometricPattern from './GeometricPattern';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background border-t border-technical-line parchment-texture">
      {/* Enhanced Golden Ratio Technical Drawing Background */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
          {/* Refined Technical Grid */}
          <defs>
            <pattern id="footer-grid-major" width="48" height="30" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 30" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.25"/>
            </pattern>
            <pattern id="footer-grid-minor" width="12" height="7.5" patternUnits="userSpaceOnUse">
              <path d="M 12 0 L 0 0 0 7.5" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.08"/>
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#footer-grid-minor)" />
          <rect width="100%" height="100%" fill="url(#footer-grid-major)" />

          {/* Golden Ratio Composition - Center */}
          <g stroke="hsl(var(--technical-line))" fill="none">
            {/* Main golden rectangle (1.618:1 ratio) */}
            <rect x="300" y="75" width="324" height="200" strokeWidth="0.8" />
            <rect x="300" y="75" width="200" height="200" strokeWidth="0.6" />
            <rect x="500" y="75" width="124" height="124" strokeWidth="0.4" />
            <rect x="500" y="199" width="76" height="76" strokeWidth="0.3" />
            <rect x="576" y="199" width="48" height="48" strokeWidth="0.25" />
            
            {/* Fibonacci spiral construction arcs */}
            <path d="M 300 275 Q 400 275 400 175" strokeWidth="0.5" />
            <path d="M 400 175 Q 500 175 500 199" strokeWidth="0.4" />
            <path d="M 500 199 Q 524 199 524 223" strokeWidth="0.35" />
            <path d="M 524 223 Q 548 223 548 247" strokeWidth="0.3" />
          </g>

          {/* Symmetrical Side Compositions */}
          {/* Left geometric cluster */}
          <g stroke="hsl(var(--technical-line))" fill="none" strokeWidth="0.4">
            <circle cx="150" cy="120" r="60" />
            <circle cx="150" cy="120" r="37" />
            <circle cx="150" cy="120" r="23" />
            <polygon points="150,60 185,97 185,143 150,180 115,143 115,97" strokeWidth="0.3" />
            <polygon points="150,83 173,106 173,134 150,157 127,134 127,106" strokeWidth="0.25" />
          </g>

          {/* Right geometric cluster */}
          <g stroke="hsl(var(--technical-line))" fill="none" strokeWidth="0.4">
            <circle cx="1050" cy="280" r="80" />
            <circle cx="1050" cy="280" r="50" />
            <circle cx="1050" cy="280" r="30" />
            <rect x="1010" y="240" width="80" height="80" strokeWidth="0.3" />
            <rect x="1025" y="255" width="50" height="50" strokeWidth="0.25" />
          </g>

          {/* Connecting Golden Spiral */}
          <path 
            d="M100,350 Q200,300 300,275 Q450,250 600,260 Q750,270 900,290 Q1000,310 1100,300"
            fill="none" stroke="hsl(var(--technical-highlight))" strokeWidth="1.2" 
            opacity="0.8"
          />

          {/* Sacred geometry nodes */}
          <g fill="hsl(var(--technical-highlight))">
            <circle cx="300" cy="275" r="2.5" />
            <circle cx="400" cy="175" r="2" />
            <circle cx="500" cy="199" r="1.8" />
            <circle cx="600" cy="260" r="2.2" />
            <circle cx="900" cy="290" r="2" />
            <circle cx="1100" cy="300" r="2.5" />
          </g>

          {/* Symmetrical Corner Elements */}
          <g stroke="hsl(var(--technical-line))" strokeWidth="0.4" fill="none">
            {/* Top corners */}
            <path d="M30,30 L60,30 L60,60 L45,60 L45,45 L30,45 Z" />
            <path d="M1170,30 L1140,30 L1140,60 L1155,60 L1155,45 L1170,45 Z" />
            
            {/* Bottom corners */}
            <path d="M30,370 L60,370 L60,340 L45,340 L45,355 L30,355 Z" />
            <path d="M1170,370 L1140,370 L1140,340 L1155,340 L1155,355 L1170,355 Z" />
          </g>

          {/* Additional Golden Ratio Subdivisions */}
          <g stroke="hsl(var(--technical-line))" strokeWidth="0.15" fill="none" opacity="0.6">
            <line x1="185" y1="75" x2="185" y2="275" />
            <line x1="370" y1="75" x2="370" y2="275" />
            <line x1="444" y1="75" x2="444" y2="275" />
            <line x1="300" y1="123" x2="624" y2="123" />
            <line x1="300" y1="151" x2="624" y2="151" />
            <line x1="300" y1="227" x2="624" y2="227" />
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="mr-4 p-2 border border-technical-line rounded-sm bg-background/30">
                <img 
                  src="/lovable-uploads/8c7ffe90-ee6b-4968-96c0-d1898523f0f4.png" 
                  alt="Decahedron Ventures Logo" 
                  className="w-8 h-8 object-contain filter brightness-110"
                />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">DECAHEDRON VENTURES</h3>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Advanced capital deployment for next-generation infrastructure. 
              Targeting high-impact technological solutions across six core sectors.
            </p>
            
            {/* Technical Specifications */}
            <div className="font-technical text-xs space-y-2 text-geometric-secondary">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-technical-highlight rounded-full mr-3"></span>
                <span>FUND.VERSION: V2.1.STABLE</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-technical-highlight rounded-full mr-3"></span>
                <span>AUM.STATUS: $2.5B.DEPLOYED</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-technical-highlight rounded-full mr-3"></span>
                <span>PORTFOLIO.COUNT: 150+.ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Investment Regions */}
          <div>
            <h4 className="font-technical text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">
              [ GLOBAL OPERATIONS ]
            </h4>
            <div className="space-y-4">
              {[
                { region: "United States", code: "USA", status: "PRIMARY.HQ" },
                { region: "Japan", code: "JPN", status: "TECH.HUB" },
                { region: "Latin America", code: "LAT", status: "EMERGING.MKTS" },
                { region: "Europe", code: "EUR", status: "INNOVATION.CTR" }
              ].map((location) => (
                <div key={location.code} className="flex items-center group">
                  <MapPin className="w-4 h-4 text-technical-highlight mr-3" />
                  <div>
                    <div className="text-foreground font-medium">{location.region}</div>
                    <div className="font-technical text-xs text-geometric-secondary">
                      {location.code} | {location.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-technical text-sm font-semibold text-foreground mb-6 uppercase tracking-wider">
              [ CONTACT.PROTOCOL ]
            </h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-technical-highlight mr-3" />
                <span className="text-muted-foreground font-technical text-sm">contact@decahedronvc.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-technical-highlight mr-3" />
                <span className="text-muted-foreground font-technical text-sm">+1.555.DECA.001</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h5 className="font-technical text-xs text-geometric-secondary mb-3 uppercase tracking-wider">
                NETWORK.LINKS
              </h5>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 border border-technical-line bg-background/50 hover:bg-technical-highlight hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Footer Bar */}
        <div className="border-t border-technical-line pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-technical text-xs text-geometric-secondary mb-4 md:mb-0">
              © 2024 DECAHEDRON.VENTURES | ALL.RIGHTS.RESERVED | PROTOCOL.v2.1
            </div>
            <div className="flex items-center space-x-6 font-technical text-xs">
              <a href="#" className="text-geometric-secondary hover:text-technical-highlight transition-colors">
                PRIVACY.POLICY
              </a>
              <a href="#" className="text-geometric-secondary hover:text-technical-highlight transition-colors">
                TERMS.SERVICE
              </a>
              <a href="#" className="text-geometric-secondary hover:text-technical-highlight transition-colors">
                INVESTMENT.DISCLAIMER
              </a>
            </div>
          </div>
          
          {/* Technical Coordinates */}
          <div className="mt-4 text-center font-technical text-xs text-geometric-secondary/60 tracking-[0.2em]">
            SYS.TIMESTAMP: {new Date().toISOString()} | STATUS: OPERATIONAL | UPTIME: 99.9%
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;