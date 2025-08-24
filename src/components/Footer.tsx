import React from 'react';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import GeometricPattern from './GeometricPattern';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background border-t border-technical-line parchment-texture">
      {/* Technical Drawing Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
          {/* Grid Pattern */}
          <defs>
            <pattern id="footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
          
          {/* Technical Cube Structure */}
          <g transform="translate(100, 100)">
            {/* Base cubes */}
            {Array.from({ length: 8 }).map((_, i) => {
              const x = (i % 4) * 60;
              const y = Math.floor(i / 4) * 60;
              return (
                <g key={i} transform={`translate(${x}, ${y})`}>
                  {/* Cube faces */}
                  <polygon 
                    points="0,40 20,20 20,0 0,20" 
                    fill="none" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="1"
                  />
                  <polygon 
                    points="0,40 20,60 40,40 20,20" 
                    fill="none" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="1"
                  />
                  <polygon 
                    points="20,20 40,0 40,40 20,60" 
                    fill="none" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </g>
          
          {/* Additional geometric elements */}
          <g transform="translate(600, 150)">
            <circle r="80" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="1"/>
            <circle r="60" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.5"/>
            <circle r="40" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.5"/>
          </g>
          
          {/* Technical annotations */}
          <g transform="translate(900, 100)" className="font-technical text-xs">
            <line x1="0" y1="0" x2="80" y2="0" stroke="hsl(var(--technical-line))" strokeWidth="0.5"/>
            <line x1="0" y1="0" x2="0" y2="80" stroke="hsl(var(--technical-line))" strokeWidth="0.5"/>
            <text x="40" y="-5" textAnchor="middle" className="fill-technical-line text-[8px]">SCALE 1:1000</text>
            <text x="-5" y="40" textAnchor="middle" className="fill-technical-line text-[8px]" transform="rotate(-90, -5, 40)">ELEVATION</text>
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <GeometricPattern variant="dodecahedron" size="sm" className="mr-3 text-technical-highlight" />
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