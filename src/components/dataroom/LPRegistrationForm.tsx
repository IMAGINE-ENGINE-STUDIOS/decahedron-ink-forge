import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2 } from 'lucide-react';

const FOCUS_OPTIONS = [
  'AI / Machine Learning',
  'FinTech',
  'HealthTech',
  'CleanTech',
  'SaaS / Enterprise',
  'Consumer Tech',
  'Web3 / Blockchain',
  'Deep Tech',
];

interface LPRegistrationFormProps {
  onSubmitted: () => void;
}

const LPRegistrationForm: React.FC<LPRegistrationFormProps> = ({ onSubmitted }) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    company_name: '',
    job_title: '',
    investment_amount: '',
    message: '',
  });
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const toggleFocus = (focus: string) => {
    setSelectedFocus(prev =>
      prev.includes(focus) ? prev.filter(f => f !== focus) : [...prev, focus]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      toast({ title: 'Name and email are required', variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('limited_partner_applications')
      .insert({
        full_name: form.full_name,
        email: form.email,
        company_name: form.company_name || null,
        job_title: form.job_title || null,
        investment_amount: form.investment_amount || null,
        investment_focus: selectedFocus.length > 0 ? selectedFocus : null,
        message: form.message || null,
        status: 'pending',
      });

    setSubmitting(false);

    if (error) {
      toast({ title: 'Submission failed', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Application submitted', description: 'You will receive access once approved by an admin.' });
    onSubmitted();
  };

  return (
    <Card className="max-w-lg w-full border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="font-technical text-sm tracking-wider flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          LP.REGISTRATION
        </CardTitle>
        <p className="text-xs text-muted-foreground font-technical mt-1">
          Create your profile to request access to the investor data room.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-technical text-xs uppercase">Full Name *</Label>
              <Input
                value={form.full_name}
                onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                className="font-technical text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-technical text-xs uppercase">Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="font-technical text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-technical text-xs uppercase">Company</Label>
              <Input
                value={form.company_name}
                onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
                className="font-technical text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-technical text-xs uppercase">Job Title</Label>
              <Input
                value={form.job_title}
                onChange={e => setForm(p => ({ ...p, job_title: e.target.value }))}
                className="font-technical text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-technical text-xs uppercase">Investment Amount</Label>
            <Input
              value={form.investment_amount}
              onChange={e => setForm(p => ({ ...p, investment_amount: e.target.value }))}
              placeholder="e.g. $100,000 - $500,000"
              className="font-technical text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-technical text-xs uppercase">Investment Focus</Label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_OPTIONS.map(focus => (
                <button
                  key={focus}
                  type="button"
                  onClick={() => toggleFocus(focus)}
                  className={`px-3 py-1 text-xs font-technical border rounded transition-colors ${
                    selectedFocus.includes(focus)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-foreground'
                  }`}
                >
                  {focus}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-technical text-xs uppercase">Message (Optional)</Label>
            <Textarea
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              rows={3}
              className="font-technical text-sm"
            />
          </div>

          <Button type="submit" className="w-full font-technical text-xs tracking-wider" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            SUBMIT.APPLICATION
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LPRegistrationForm;
