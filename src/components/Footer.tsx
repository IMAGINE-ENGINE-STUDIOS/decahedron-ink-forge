import React from 'react';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import GeometricPattern from './GeometricPattern';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background border-t border-technical-line parchment-texture">
      {/* Enhanced Technical Drawing Background */}
      <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
            {/* Wide Technical Grid */}
            <defs>
              <pattern id="footer-grid-major" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.35"/>
              </pattern>
              <pattern id="footer-grid-minor" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.12"/>
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#footer-grid-minor)" />
            <rect width="100%" height="100%" fill="url(#footer-grid-major)" />

            {/* Concentric wide forms */}
            <g stroke="hsl(var(--technical-line))" fill="none">
              <circle cx="600" cy="200" r="180" strokeWidth="0.8" />
              <circle cx="600" cy="200" r="120" strokeWidth="0.6" />
              <circle cx="600" cy="200" r="60" strokeWidth="0.5" />
            </g>

            {/* Golden rectangles layout (logical proportioning) */}
            <g stroke="hsl(var(--technical-line))" fill="none">
              <rect x="120" y="60" width="292" height="180" strokeWidth="0.6" />
              <rect x="412" y="60" width="180" height="180" strokeWidth="0.4" />
              <rect x="592" y="60" width="112" height="112" strokeWidth="0.35" />
              <rect x="704" y="172" width="68" height="68" strokeWidth="0.3" />
              <rect x="772" y="172" width="42" height="42" strokeWidth="0.25" />
            </g>

            {/* Diagonals and centerlines */}
            <g stroke="hsl(var(--technical-line))" strokeWidth="0.3" fill="none">
              <line x1="0" y1="200" x2="1200" y2="200" />
              <line x1="600" y1="0" x2="600" y2="400" />
              <line x1="120" y1="60" x2="412" y2="240" />
              <line x1="412" y1="60" x2="120" y2="240" />
            </g>

            {/* Logarithmic spiral sweeping the footer */}
            <path 
              d="M140,300 Q260,220 340,200 Q420,180 520,190 Q640,200 700,230 Q780,270 860,230 Q940,190 1060,210"
              fill="none" stroke="hsl(var(--technical-highlight))" strokeWidth="1" />

            {/* Marker nodes along spiral */}
            <g fill="hsl(var(--technical-highlight))">
              <circle cx="260" cy="220" r="2" />
              <circle cx="340" cy="200" r="2" />
              <circle cx="520" cy="190" r="2" />
              <circle cx="700" cy="230" r="2" />
              <circle cx="860" cy="230" r="2" />
              <circle cx="1060" cy="210" r="2" />
            </g>

            {/* Subtle corner braces for structure */}
            <g stroke="hsl(var(--technical-line))" strokeWidth="0.5" fill="none">
              <path d="M20,80 L20,20 L80,20" />
              <path d="M1120,320 L1180,320 L1180,260" />
            </g>
          </svg>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <GeometricPattern variant="golden-spiral-grid" size="sm" className="mr-3 text-technical-highlight" />
              <h3 className="font-display text-2xl font-bold text-foreground">DECAHEDRON VENTURES</h3>
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