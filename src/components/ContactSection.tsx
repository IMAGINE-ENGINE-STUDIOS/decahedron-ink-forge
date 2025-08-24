import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import GeometricPattern from './GeometricPattern';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message Transmitted",
      description: "Your inquiry has been received. Our team will respond within 24 hours.",
    });
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="py-20 bg-background parchment-texture relative">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10">
          <GeometricPattern variant="dodecahedron" size="lg" className="animate-rotate" />
        </div>
        <div className="absolute bottom-10 left-10">
          <GeometricPattern variant="spiral" size="lg" className="animate-float" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="font-technical text-sm tracking-wider uppercase text-geometric-secondary mb-4">
              [ COMMUNICATION.PROTOCOL ]
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              INITIATE CONTACT
            </h2>
            <div className="w-24 h-px bg-technical-line mx-auto mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Establish direct communication channels with our investment team. 
              All transmissions are encrypted and processed within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-card/30 backdrop-blur-sm border-technical-line">
              <CardContent className="p-8">
                <h3 className="font-technical text-lg font-semibold text-foreground mb-6 uppercase tracking-wider">
                  [ SECURE.TRANSMISSION.FORM ]
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                        CONTACT.NAME
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-technical-line font-technical"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                        EMAIL.ADDRESS
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-technical-line font-technical"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                      ORGANIZATION
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="bg-background/50 border-technical-line font-technical"
                      placeholder="Company or organization"
                    />
                  </div>
                  
                  <div>
                    <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                      MESSAGE.CONTENT
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-background/50 border-technical-line font-technical resize-none"
                      placeholder="Describe your inquiry, investment opportunity, or partnership proposal..."
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full font-technical bg-technical-highlight text-primary-foreground hover:bg-primary border border-technical-line"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    [ TRANSMIT.MESSAGE ]
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Direct Contact */}
              <Card className="bg-card/30 backdrop-blur-sm border-technical-line">
                <CardContent className="p-8">
                  <h3 className="font-technical text-lg font-semibold text-foreground mb-6 uppercase tracking-wider">
                    [ DIRECT.CHANNELS ]
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-technical-highlight/10 border border-technical-line flex items-center justify-center mr-4">
                        <Mail className="w-5 h-5 text-technical-highlight" />
                      </div>
                      <div>
                        <div className="font-technical text-xs uppercase tracking-wider text-geometric-secondary">
                          PRIMARY.EMAIL
                        </div>
                        <div className="text-foreground font-medium">contact@decahedronvc.com</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-technical-highlight/10 border border-technical-line flex items-center justify-center mr-4">
                        <Phone className="w-5 h-5 text-technical-highlight" />
                      </div>
                      <div>
                        <div className="font-technical text-xs uppercase tracking-wider text-geometric-secondary">
                          SECURE.LINE
                        </div>
                        <div className="text-foreground font-medium">+1 (555) DECA-001</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-technical-highlight/10 border border-technical-line flex items-center justify-center mr-4">
                        <MapPin className="w-5 h-5 text-technical-highlight" />
                      </div>
                      <div>
                        <div className="font-technical text-xs uppercase tracking-wider text-geometric-secondary">
                          HQ.COORDINATES
                        </div>
                        <div className="text-foreground font-medium">San Francisco, CA</div>
                        <div className="font-technical text-xs text-geometric-secondary">37.7749°N, 122.4194°W</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="bg-card/30 backdrop-blur-sm border-technical-line">
                <CardContent className="p-8">
                  <h3 className="font-technical text-lg font-semibold text-foreground mb-6 uppercase tracking-wider">
                    [ RESPONSE.METRICS ]
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-technical text-xs text-geometric-secondary">INITIAL.RESPONSE</span>
                      <span className="text-foreground font-medium">&lt; 24 HOURS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-technical text-xs text-geometric-secondary">PITCH.REVIEW</span>
                      <span className="text-foreground font-medium">2-3 WEEKS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-technical text-xs text-geometric-secondary">PARTNERSHIP.EVAL</span>
                      <span className="text-foreground font-medium">4-6 WEEKS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;