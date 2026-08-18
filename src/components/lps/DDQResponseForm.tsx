import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check } from 'lucide-react';
import { trackBrochurePixel } from '@/hooks/useBrochureTracking';

const PIXEL_PAGE = { index: -2, kicker: '[ DUE.DILIGENCE ]' };

const field =
  'w-full bg-background/50 border border-technical-line/50 rounded-sm px-2.5 py-1.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-geometric-primary/60 transition-colors';

const QUESTIONS = [
  { key: 'entity', label: 'Investing entity & jurisdiction', placeholder: 'Family office, LLC, Delaware…' },
  { key: 'mandate', label: 'Mandate & allocation to venture', placeholder: 'Target allocation, sectors, horizon…' },
  { key: 'diligence', label: 'Outstanding diligence questions', placeholder: 'Valuation policy, audit, references…' },
] as const;

const DDQResponseForm: React.FC = () => {
  const { toast } = useToast();
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company_name, setCompany] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!full_name.trim() || !email.trim()) {
      toast({ title: 'Name and email are required', variant: 'destructive' });
      return;
    }
    setSubmitting(true);

    const body = QUESTIONS.map((q) => `${q.label}:\n${(answers[q.key] || '—').trim()}`).join('\n\n');

    const { error } = await supabase.from('limited_partner_applications').insert({
      full_name: full_name.trim().slice(0, 120),
      email: email.trim().slice(0, 255),
      company_name: company_name.trim() ? company_name.trim().slice(0, 160) : null,
      job_title: 'DDQ Response',
      message: `[DDQ RESPONSE]\n\n${body}`.slice(0, 4000),
      status: 'pending',
    });

    setSubmitting(false);
    if (error) {
      toast({ title: 'Submission failed', description: error.message, variant: 'destructive' });
      return;
    }
    setDone(true);
    trackBrochurePixel('ddq_submit', PIXEL_PAGE.index, PIXEL_PAGE.kicker);
    toast({ title: 'DDQ response recorded', description: 'Added to the LP pipeline as Pending.' });
  };

  if (done) {
    return (
      <div className="flex items-center gap-3 border border-technical-line/40 bg-background/40 rounded-sm p-4">
        <div className="w-8 h-8 rounded-full border border-geometric-primary/50 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-geometric-primary" />
        </div>
        <p className="text-[13px] text-muted-foreground leading-snug">
          Your DDQ response is logged as a pending record in our LP pipeline. The partnership will follow up at {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
      <input className={field} value={full_name} onChange={(e) => setName(e.target.value)} placeholder="Full name *" />
      <input type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" />
      <input className={field} value={company_name} onChange={(e) => setCompany(e.target.value)} placeholder="Organization" />

      {QUESTIONS.map((q) => (
        <div key={q.key} className="md:col-span-3">
          <label className="font-technical text-[10px] tracking-[0.25em] uppercase text-geometric-secondary/70">
            {q.label}
          </label>
          <textarea
            rows={2}
            className={`${field} resize-none`}
            value={answers[q.key] || ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
            placeholder={q.placeholder}
          />
        </div>
      ))}

      <div className="md:col-span-3 flex items-center justify-between gap-4">
        <p className="text-[10px] text-muted-foreground/80 leading-snug max-w-md">
          Each response is saved as its own LP pipeline record with status <span className="text-foreground">Pending</span>.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="font-technical text-[12px] tracking-[0.2em] uppercase px-5 py-2 rounded-sm border border-geometric-primary/60 text-foreground bg-geometric-primary/10 hover:bg-geometric-primary/20 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit DDQ
        </button>
      </div>
    </form>
  );
};

export default DDQResponseForm;
