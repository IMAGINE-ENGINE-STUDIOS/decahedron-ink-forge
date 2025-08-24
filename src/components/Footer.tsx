import React from 'react';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import GeometricPattern from './GeometricPattern';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background border-t border-technical-line parchment-texture">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
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
        </svg>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="flex justify-center mb-10">
          <img src="/lovable-uploads/a63ed1a5-f345-497c-b509-c24edcbbba15.png" alt="Decahedron Ventures logo" className="w-24 md:w-32 lg:w-36 h-auto opacity-90 hover:opacity-100 transition-opacity duration-300" />
        </div>
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