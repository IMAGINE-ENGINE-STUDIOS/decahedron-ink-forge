import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import GeometricPattern from './GeometricPattern';

const PitchSection: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    founderName: '',
    email: '',
    sector: '',
    stage: '',
    fundingAmount: '',
    description: '',
    pitchDeck: null as File | null
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate pitch submission
    toast({
      title: "Pitch Submitted Successfully",
      description: "Your pitch has been received and will be reviewed by our investment committee within 2-3 weeks.",
    });
    setFormData({
      companyName: '',
      founderName: '',
      email: '',
      sector: '',
      stage: '',
      fundingAmount: '',
      description: '',
      pitchDeck: null
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        pitchDeck: file
      }));
    }
  };

  return (
    <section className="py-20 bg-secondary/10 parchment-texture relative">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10">
          <GeometricPattern variant="cube-array" size="lg" className="animate-float" />
        </div>
        <div className="absolute bottom-1/4 right-10">
          <GeometricPattern variant="flower-of-life" size="lg" className="animate-geometric-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="font-technical text-sm tracking-wider uppercase text-geometric-secondary mb-4">
              [ INVESTMENT.PROPOSAL.SUBMISSION ]
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              SUBMIT YOUR PITCH
            </h2>
            <div className="w-24 h-px bg-technical-line mx-auto mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Present your transformative technology to our investment committee. 
              All submissions undergo rigorous evaluation using our proprietary assessment matrix.
            </p>
          </div>

          {/* Pitch Form */}
          <Card className="bg-card/30 backdrop-blur-sm border-technical-line">
            <CardContent className="p-8">
              <div className="mb-8">
                <h3 className="font-technical text-lg font-semibold text-foreground mb-4 uppercase tracking-wider">
                  [ PITCH.SUBMISSION.PROTOCOL ]
                </h3>
                
                {/* Requirements */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-technical text-xs text-geometric-secondary">SERIES.A.READY</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-technical text-xs text-geometric-secondary">TECH.VALIDATED</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-technical text-xs text-geometric-secondary">SCALABLE.MODEL</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company & Founder Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                      COMPANY.NAME
                    </label>
                    <Input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="bg-background/50 border-technical-line font-technical"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                      FOUNDER.NAME
                    </label>
                    <Input
                      name="founderName"
                      value={formData.founderName}
                      onChange={handleChange}
                      required
                      className="bg-background/50 border-technical-line font-technical"
                      placeholder="Primary founder name"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                    CONTACT.EMAIL
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-technical-line font-technical"
                    placeholder="founder@company.com"
                  />
                </div>

                {/* Investment Details */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                      SECTOR.FOCUS
                    </label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
                      <SelectTrigger className="bg-background/50 border-technical-line font-technical">
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="space">Space</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                        <SelectItem value="smart-cities">Smart Cities</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="sustainability">Sustainability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                      FUNDING.STAGE
                    </label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
                      <SelectTrigger className="bg-background/50 border-technical-line font-technical">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B</SelectItem>
                        <SelectItem value="series-c">Series C+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                      FUNDING.TARGET
                    </label>
                    <Input
                      name="fundingAmount"
                      value={formData.fundingAmount}
                      onChange={handleChange}
                      required
                      className="bg-background/50 border-technical-line font-technical"
                      placeholder="$5M - $50M"
                    />
                  </div>
                </div>

                {/* Company Description */}
                <div>
                  <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                    TECHNOLOGY.DESCRIPTION
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-background/50 border-technical-line font-technical resize-none"
                    placeholder="Describe your technology, market opportunity, competitive advantage, and impact potential..."
                  />
                </div>

                {/* Pitch Deck Upload */}
                <div>
                  <label className="font-technical text-xs uppercase tracking-wider text-geometric-secondary mb-2 block">
                    PITCH.DECK.UPLOAD
                  </label>
                  <div className="border-2 border-dashed border-technical-line bg-background/30 p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="pitch-deck"
                    />
                    <label htmlFor="pitch-deck" className="cursor-pointer">
                      {formData.pitchDeck ? (
                        <div className="flex items-center justify-center">
                          <FileText className="w-6 h-6 text-technical-highlight mr-2" />
                          <span className="text-foreground font-medium">{formData.pitchDeck.name}</span>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-technical-highlight mx-auto mb-2" />
                          <div className="font-technical text-sm text-geometric-secondary">
                            DRAG.DROP.OR.CLICK.TO.UPLOAD
                          </div>
                          <div className="font-technical text-xs text-geometric-secondary/60 mt-1">
                            PDF, PPT, PPTX (MAX 10MB)
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submission Warning */}
                <div className="flex items-start p-4 bg-technical-highlight/5 border border-technical-line">
                  <AlertCircle className="w-5 h-5 text-technical-highlight mr-3 mt-0.5" />
                  <div className="font-technical text-xs text-geometric-secondary">
                    <strong>CONFIDENTIALITY.NOTICE:</strong> All submissions are protected under our standard NDA. 
                    Your intellectual property will be treated with the highest level of security and confidentiality.
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full font-technical bg-technical-highlight text-primary-foreground hover:bg-primary border border-technical-line py-6"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  [ SUBMIT.PITCH.TO.COMMITTEE ]
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PitchSection;