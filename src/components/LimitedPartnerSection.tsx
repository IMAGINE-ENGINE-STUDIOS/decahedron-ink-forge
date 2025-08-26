import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Users, TrendingUp, Shield } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LimitedPartnerSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    investmentAmount: '',
    investmentFocus: [] as string[],
    message: ''
  });
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const investmentFocusOptions = [
    'Analog Habitats',
    'Quantum Computing',
    'AR/VR/Simulation',
    'Artificial Intelligence',
    'Spaceports',
    'Aerospace Manufacturing',
    'Defense Systems',
    'Energy/Population Scale',
    'Telecommunications',
    'Photonics'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocusChange = (focus: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      investmentFocus: checked
        ? [...prev.investmentFocus, focus]
        : prev.investmentFocus.filter(f => f !== focus)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or PowerPoint file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB");
        return;
      }
      setPitchDeck(file);
    }
  };

  const uploadPitchDeck = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('pitch-decks')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload pitch deck if provided
      let pitchDeckUrl = null;
      if (pitchDeck) {
        pitchDeckUrl = await uploadPitchDeck(pitchDeck);
        if (!pitchDeckUrl) {
          toast.error("Failed to upload pitch deck. Please try again.");
          return;
        }
      }

      // Submit application
      const { error } = await supabase
        .from('limited_partner_applications')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          company_name: formData.companyName || null,
          job_title: formData.jobTitle || null,
          investment_amount: formData.investmentAmount || null,
          investment_focus: formData.investmentFocus.length > 0 ? formData.investmentFocus : null,
          pitch_deck_url: pitchDeckUrl,
          message: formData.message || null
        });

      if (error) {
        console.error('Error submitting application:', error);
        toast.error("Failed to submit application. Please try again.");
        return;
      }

      toast.success("Application submitted successfully! We'll be in touch soon.");
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        jobTitle: '',
        investmentAmount: '',
        investmentFocus: [],
        message: ''
      });
      setPitchDeck(null);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="limited-partner" className="relative min-h-screen py-20 overflow-hidden parchment-texture">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="lp-grid" width="2" height="2" patternUnits="userSpaceOnUse">
              <path d="M 2 0 L 0 0 0 2" fill="none" stroke="hsl(var(--technical-line))" strokeWidth="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lp-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="font-technical text-sm tracking-wider uppercase text-geometric-secondary mb-4">
            [ EXCLUSIVE PARTNERSHIP OPPORTUNITY ]
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
            BECOME A
            <span className="block text-technical-highlight mt-2">LIMITED PARTNER</span>
          </h2>
          <p className="font-technical text-sm text-geometric-primary max-w-3xl mx-auto leading-relaxed">
            Join our exclusive network of visionary investors and gain access to our Golden Ratio allocation model 
            across 10 high-growth markets. Partner with us to achieve 10x returns over 10 years.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="border border-technical-line bg-background/30 p-6 text-center">
            <TrendingUp className="w-12 h-12 text-technical-highlight mx-auto mb-4" />
            <div className="font-technical text-sm text-technical-highlight mb-2 tracking-wider uppercase">
              TARGET RETURNS
            </div>
            <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
              10x return potential over 10 years through our mathematically optimized allocation strategy
            </div>
          </div>
          <div className="border border-technical-line bg-background/30 p-6 text-center">
            <Shield className="w-12 h-12 text-technical-highlight mx-auto mb-4" />
            <div className="font-technical text-sm text-technical-highlight mb-2 tracking-wider uppercase">
              RISK MITIGATION
            </div>
            <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
              Diversified exposure across 10 high-growth sectors with Golden Ratio-based risk management
            </div>
          </div>
          <div className="border border-technical-line bg-background/30 p-6 text-center">
            <Users className="w-12 h-12 text-technical-highlight mx-auto mb-4" />
            <div className="font-technical text-sm text-technical-highlight mb-2 tracking-wider uppercase">
              EXCLUSIVE ACCESS
            </div>
            <div className="font-technical text-xs text-geometric-secondary leading-relaxed">
              Direct partnership with our managing team and priority access to premium investment opportunities
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="border border-technical-line bg-background/30 p-8">
          <div className="mb-8">
            <h3 className="font-technical text-lg text-technical-highlight mb-4 tracking-wider uppercase">
              [ PARTNERSHIP APPLICATION ]
            </h3>
            <div className="font-technical text-sm text-geometric-secondary">
              Complete the form below to begin the partnership process. All information is confidential and secure.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="font-technical text-sm text-technical-highlight mb-2 block tracking-wider uppercase">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="font-technical bg-background/50 border-technical-line text-geometric-primary"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-technical text-sm text-technical-highlight mb-2 block tracking-wider uppercase">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="font-technical bg-background/50 border-technical-line text-geometric-primary"
                  placeholder="your.email@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone" className="font-technical text-sm text-technical-highlight mb-2 block tracking-wider uppercase">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="font-technical bg-background/50 border-technical-line text-geometric-primary"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="companyName" className="font-technical text-sm text-technical-highlight mb-2 block tracking-wider uppercase">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="font-technical bg-background/50 border-technical-line text-geometric-primary"
                  placeholder="Your company or organization"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="jobTitle" className="font-technical text-sm text-technical-highlight mb-2 block tracking-wider uppercase">
                  Job Title / Position
                </Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="font-technical bg-background/50 border-technical-line text-geometric-primary"
                  placeholder="CEO, Managing Partner, etc."
                />
              </div>
              <div>
                <Label htmlFor="investmentAmount" className="font-technical text-sm text-technical-highlight mb-2 block tracking-wider uppercase">
                  Investment Range
                </Label>
                <Input
                  id="investmentAmount"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleInputChange}
                  className="font-technical bg-background/50 border-technical-line text-geometric-primary"
                  placeholder="$1M - $10M, $10M+, etc."
                />
              </div>
            </div>

            {/* Investment Focus */}
            <div>
              <Label className="font-technical text-sm text-technical-highlight mb-4 block tracking-wider uppercase">
                Investment Focus Areas (Select all that apply)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {investmentFocusOptions.map((focus) => (
                  <div key={focus} className="flex items-center space-x-2">
                    <Checkbox
                      id={focus}
                      checked={formData.investmentFocus.includes(focus)}
                      onCheckedChange={(checked) => handleFocusChange(focus, checked as boolean)}
                      className="border-technical-line"
                    />
                    <Label htmlFor={focus} className="font-technical text-xs text-geometric-primary cursor-pointer">
                      {focus}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch Deck Upload */}
            <div>
              <Label className="font-technical text-sm text-technical-highlight mb-2 block tracking-wider uppercase">
                Pitch Deck / Investment Presentation
              </Label>
              <div className="border border-technical-line bg-background/50 p-6 text-center">
                <Upload className="w-8 h-8 text-technical-highlight mx-auto mb-2" />
                <Label htmlFor="pitchDeck" className="font-technical text-xs text-geometric-primary cursor-pointer hover:text-technical-highlight transition-colors">
                  {pitchDeck ? pitchDeck.name : "Click to upload PDF or PowerPoint (Max 10MB)"}
                </Label>
                <Input
                  id="pitchDeck"
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message" className="font-technical text-sm text-technical-highlight mb-2 block tracking-wider uppercase">
                Additional Message
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="font-technical bg-background/50 border-technical-line text-geometric-primary"
                placeholder="Tell us about your investment goals and why you're interested in partnering with Decahedron Ventures..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="font-technical border border-technical-line text-technical-highlight hover:bg-technical-highlight hover:text-primary-foreground px-8 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-300"
                variant="outline"
              >
                {isSubmitting ? "[ SUBMITTING APPLICATION... ]" : "[ SUBMIT PARTNERSHIP APPLICATION ]"}
              </Button>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center border-t border-technical-line pt-8">
          <div className="font-technical text-xs text-geometric-secondary/60 tracking-[0.2em] mb-2">
            PARTNERSHIP.INQUIRIES | CONFIDENTIAL.PROCESSING | SECURE.TRANSMISSION
          </div>
          <div className="font-technical text-xs text-geometric-secondary/40">
            APPLICATIONS REVIEWED WITHIN 48-72 HOURS | DECAHEDRON VENTURES © 2025
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedPartnerSection;