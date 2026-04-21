import React from 'react';
import { Linkedin } from 'lucide-react';
import khaliaPadilla from '@/assets/team/khalia-padilla.jpg';
import ricardoFont from '@/assets/team/ricardo-font.jpg';
import jamesStuber from '@/assets/team/james-stuber.jpg';
import nMacdonnellUlsch from '@/assets/team/n-macdonnell-ulsch.jpg';
import dominicCatrambone from '@/assets/team/dominic-catrambone.jpg';

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
    title: 'Founder & Managing Partner',
    image: ricardoFont,
    linkedin: 'https://www.linkedin.com/in/ricardo-font-952034248/',
  },
  {
    name: 'Dominic Catrambone',
    title: 'Chief Financial Officer',
    image: dominicCatrambone,
    linkedin: 'https://www.linkedin.com/',
  },
  {
    name: 'James Stuber',
    title: 'Legal Counsel',
    image: jamesStuber,
    linkedin: 'https://www.linkedin.com/in/jamesstuber/',
  },
  {
    name: 'N. MacDonnell Ulsch',
    title: 'Senior Advisor',
    image: nMacdonnellUlsch,
    linkedin: 'https://www.linkedin.com/in/n-macdonnell-ulsch-38abb21/',
  },
];

const TeamSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 border border-geometric-primary rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-geometric-secondary rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
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
              className="group text-center"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Image Container */}
              <div className="relative mb-6 mx-auto">
                <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto overflow-hidden rounded-full border-4 border-border group-hover:border-geometric-primary transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ${member.imagePosition || 'object-center'}`}
                  />
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-0 w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full border-2 border-geometric-primary/20 scale-110 group-hover:scale-115 group-hover:border-geometric-primary/40 transition-all duration-500" />
                
                {/* LinkedIn Button */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#004182]"
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
