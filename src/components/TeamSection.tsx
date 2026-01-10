import React from 'react';
import { Linkedin } from 'lucide-react';
import khaliaPadilla from '@/assets/team/khalia-padilla.jpg';
import ricardoFont from '@/assets/team/ricardo-font.jpg';
import stevenLindgren from '@/assets/team/steven-lindgren.png';
import jamesStuber from '@/assets/team/james-stuber.jpg';

interface TeamMember {
  name: string;
  title: string;
  image: string;
  linkedin: string;
  imagePosition?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Khalia Padilla',
    title: 'Founder & Managing Partner',
    image: khaliaPadilla,
    linkedin: 'https://www.linkedin.com/in/khaliapadilla/',
    imagePosition: 'object-[center_15%]',
  },
  {
    name: 'Ricardo Font',
    title: 'Managing Partner',
    image: ricardoFont,
    linkedin: 'https://www.linkedin.com/in/ricardo-font-952034248/',
  },
  {
    name: 'Steven Lindgren',
    title: 'Managing Director',
    image: stevenLindgren,
    linkedin: 'https://www.linkedin.com/in/stevenlindgren/',
  },
  {
    name: 'James Stuber',
    title: 'Legal Counsel',
    image: jamesStuber,
    linkedin: 'https://www.linkedin.com/in/jamesstuber/',
  },
];

const TeamSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-geometric-primary/20 rotate-45 animate-[float_6s_ease-in-out_infinite]" 
          style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} 
        />
        <div className="absolute top-40 right-20 w-24 h-24 border border-geometric-secondary/30 animate-[rotate_20s_linear_infinite]" 
          style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} 
        />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-geometric-primary/5 animate-[geometric-pulse_4s_ease-in-out_infinite]" 
          style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} 
        />
        <div className="absolute bottom-20 right-1/3 w-16 h-16 border-2 border-geometric-accent/20 animate-[float_8s_ease-in-out_infinite_reverse]" 
          style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }} 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
            Leadership Team
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-geometric-primary to-geometric-secondary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experienced professionals driving innovation and strategic growth
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group text-center animate-fade-in"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Pentagon Image Container */}
              <div className="relative mb-6 mx-auto w-48 h-48 md:w-56 md:h-56">
                {/* Animated outer ring */}
                <div 
                  className="absolute inset-0 border-2 border-geometric-primary/30 group-hover:border-geometric-primary group-hover:scale-110 transition-all duration-500"
                  style={{ 
                    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                  }} 
                />
                
                {/* Pulsing background */}
                <div 
                  className="absolute inset-2 bg-gradient-to-br from-geometric-primary/10 to-geometric-secondary/10 group-hover:from-geometric-primary/20 group-hover:to-geometric-secondary/20 transition-all duration-500"
                  style={{ 
                    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                  }} 
                />
                
                {/* Image */}
                <div 
                  className="absolute inset-3 overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-500"
                  style={{ 
                    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                  }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${member.imagePosition || 'object-center'}`}
                  />
                </div>

                {/* LinkedIn Button */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#004182]"
                  aria-label={`${member.name}'s LinkedIn profile`}
                >
                  <Linkedin size={18} />
                </a>
              </div>

              {/* Name and Title */}
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-geometric-primary transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
                {member.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
