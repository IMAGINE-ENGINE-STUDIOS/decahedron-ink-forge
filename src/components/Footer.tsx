import React from 'react';
import { Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import GeometricPattern from './GeometricPattern';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background border-t border-technical-line parchment-texture">
      {/* Enhanced Technical Drawing Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
          {/* Grid Pattern */}
          <defs>
            <pattern id="footer-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.3"/>
            </pattern>
            <pattern id="footer-fine-grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-fine-grid)" />
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
          
          {/* Isometric Cube Structure - Left Side */}
          <g transform="translate(50, 80)">
            {Array.from({ length: 15 }).map((_, i) => {
              const row = Math.floor(i / 5);
              const col = i % 5;
              const x = col * 25 + row * 12.5;
              const y = row * 15;
              const height = 20 + (i % 3) * 10;
              return (
                <g key={i} transform={`translate(${x}, ${y})`}>
                  {/* Isometric cube */}
                  <polygon 
                    points={`0,${height} 12.5,${height-7.5} 25,${height} 12.5,${height+7.5}`}
                    fill="none" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="0.5"
                  />
                  <polygon 
                    points={`12.5,${height-7.5} 25,${height} 25,${height-20} 12.5,${height-27.5}`}
                    fill="none" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="0.5"
                  />
                  <polygon 
                    points={`0,${height} 12.5,${height-7.5} 12.5,${height-27.5} 0,${height-20}`}
                    fill="none" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="0.5"
                  />
                  <polygon 
                    points={`0,${height-20} 12.5,${height-27.5} 25,${height-20} 12.5,${height-12.5}`}
                    fill="none" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="0.3"
                  />
                </g>
              );
            })}
          </g>

          {/* Central Decahedron Structure */}
          <g transform="translate(400, 120)">
            {/* Dodecahedron wireframe */}
            <circle r="60" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.8"/>
            <circle r="45" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.5"/>
            <circle r="30" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.3"/>
            
            {/* Pentagon faces */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const radius = 40;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <g key={i} transform={`translate(${x}, ${y})`}>
                  <polygon 
                    points="0,-8 7.6,-2.5 4.7,6.5 -4.7,6.5 -7.6,-2.5"
                    fill="none" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="0.4"
                  />
                </g>
              );
            })}
            
            {/* Center structure */}
            <polygon 
              points="0,-15 14.3,-4.6 8.8,12.1 -8.8,12.1 -14.3,-4.6"
              fill="none" 
              stroke="hsl(var(--technical-highlight))" 
              strokeWidth="0.8"
            />
          </g>

          {/* Technical Pyramid Structures - Right Side */}
          <g transform="translate(650, 100)">
            {Array.from({ length: 12 }).map((_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              const x = col * 40;
              const y = row * 35;
              const size = 15 + (i % 2) * 5;
              return (
                <g key={i} transform={`translate(${x}, ${y})`}>
                  {/* Pyramid structure */}
                  <polygon 
                    points={`0,${size} ${size},${size} ${size/2},0`}
                    fill="none" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="0.5"
                  />
                  <line 
                    x1="0" y1={size} x2={size/2} y2="0" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="0.3"
                  />
                  <line 
                    x1={size} y1={size} x2={size/2} y2="0" 
                    stroke="hsl(var(--technical-line))" 
                    strokeWidth="0.3"
                  />
                </g>
              );
            })}
          </g>
          
          {/* Technical Dimensions and Annotations */}
          <g transform="translate(900, 80)" className="font-technical text-xs">
            <line x1="0" y1="0" x2="120" y2="0" stroke="hsl(var(--technical-line))" strokeWidth="0.8"/>
            <line x1="0" y1="0" x2="0" y2="120" stroke="hsl(var(--technical-line))" strokeWidth="0.8"/>
            
            {/* Dimension lines */}
            <line x1="10" y1="-5" x2="10" y2="5" stroke="hsl(var(--technical-highlight))" strokeWidth="0.5"/>
            <line x1="110" y1="-5" x2="110" y2="5" stroke="hsl(var(--technical-highlight))" strokeWidth="0.5"/>
            <line x1="10" y1="0" x2="110" y2="0" stroke="hsl(var(--technical-highlight))" strokeWidth="0.3"/>
            
            <line x1="-5" y1="10" x2="5" y2="10" stroke="hsl(var(--technical-highlight))" strokeWidth="0.5"/>
            <line x1="-5" y1="110" x2="5" y2="110" stroke="hsl(var(--technical-highlight))" strokeWidth="0.5"/>
            <line x1="0" y1="10" x2="0" y2="110" stroke="hsl(var(--technical-highlight))" strokeWidth="0.3"/>
            
            <text x="60" y="-10" textAnchor="middle" className="fill-technical-line text-[6px]">SCALE 1:1000</text>
            <text x="-10" y="60" textAnchor="middle" className="fill-technical-line text-[6px]" transform="rotate(-90, -10, 60)">ELEVATION</text>
            <text x="130" y="5" className="fill-technical-highlight text-[6px]">100.0m</text>
            <text x="5" y="125" className="fill-technical-highlight text-[6px]">100.0m</text>
          </g>

          {/* Connection Lines */}
          <g stroke="hsl(var(--technical-line))" strokeWidth="0.2" fill="none">
            <path d="M200,120 Q350,100 400,120"/>
            <path d="M460,120 Q550,140 650,120"/>
            <line x1="100" y1="200" x2="400" y2="180"/>
            <line x1="460" y1="180" x2="750" y2="200"/>
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