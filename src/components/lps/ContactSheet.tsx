import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Phone, Check } from 'lucide-react';
import { trackBrochurePixel } from '@/hooks/useBrochureTracking';

const PIXEL_PAGE = { index: -1, kicker: '[ LP.SIGN-UP ]' };

const Fold: React.FC<{ children: React.ReactNode; i?: number; className?: string }> = ({
  children, i = 0, className,
}) => (
  <motion.div
    initial={{ opacity: 0, rotateX: -55, y: 12 }}
    animate={{ opacity: 1, rotateX: 0, y: 0 }}
    transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: [0.65, 0.05, 0.36, 1] }}
    style={{ transformOrigin: 'top center' }}
    className={className}
  >
    {children}
  </motion.div>
);

const field =
  'w-full bg-background/50 border border-technical-line/50 rounded-sm px-2.5 py-1.5 text-[14px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-geometric-primary/60 transition-colors';

const TICKETS = ['$1M – $2.5M', '$2.5M – $5M', '$5M – $10M', '$10M+'];

const ContactSheet: React.FC = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    full_name: '', email: '', company_name: '', job_title: '', message: '',
  });
  const [ticket, setTicket] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  // Pixel: the reader actually reached the sign-up sheet.
  useEffect(() => {
    trackBrochurePixel('contact_view', PIXEL_PAGE.index, PIXEL_PAGE.kicker);
  }, []);

  const markStart = () => {
    if (started.current) return;
    started.current = true;
    trackBrochurePixel('contact_start', PIXEL_PAGE.index, PIXEL_PAGE.kicker);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    { markStart(); setForm((f) => ({ ...f, [k]: e.target.value })); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      toast({ title: 'Name and email are required', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('limited_partner_applications').insert({
      full_name: form.full_name,
      email: form.email,
      company_name: form.company_name || null,
      job_title: form.job_title || null,
      investment_amount: ticket || null,
      message: form.message || null,
      status: 'pending',
    });
    if (error) {
      setSubmitting(false);
      toast({ title: 'Submission failed', description: error.message, variant: 'destructive' });
      return;
    }

    // Notify the partnership inbox (non-blocking for the applicant).
    try {
      const { error: mailError } = await supabase.functions.invoke('notify-lp-application', {
        body: {
          full_name: form.full_name,
          email: form.email,
          company_name: form.company_name || null,
          job_title: form.job_title || null,
          investment_amount: ticket || null,
          message: form.message || null,
          source: 'LP Brochure — Contact Sheet',
        },
      });
      if (mailError) console.error('LP notification email failed:', mailError);
    } catch (err) {
      console.error('LP notification email failed:', err);
    }

    setSubmitting(false);
    setDone(true);
    trackBrochurePixel('contact_submit', PIXEL_PAGE.index, PIXEL_PAGE.kicker);
    toast({ title: 'Request received', description: 'Our team will be in touch shortly.' });
  };

  return (
    <div className="flex flex-col h-full">
      <Fold>
        <h2 className="font-display text-3xl md:text-[42px] leading-[0.95] text-foreground mb-2">
          Request LP Materials
        </h2>
        <p className="text-[15px] md:text-[17px] text-muted-foreground max-w-3xl leading-snug">
          Accredited investors and institutions can register below to receive the Private Placement Memorandum,
          subscription documents, and access to the Decahedron data room.
        </p>
        <div className="w-14 h-px bg-geometric-primary/60 mt-4 mb-4" />
      </Fold>

      <Fold i={1} className="flex flex-wrap gap-x-6 gap-y-1.5 mb-4">
        <a href="mailto:info@decahedronventures.com" onClick={() => trackBrochurePixel('contact_click', PIXEL_PAGE.index, PIXEL_PAGE.kicker)} className="flex items-center gap-2 font-technical text-[13px] tracking-wider text-foreground hover:text-geometric-primary transition-colors">
          <Mail className="w-4 h-4 text-geometric-secondary" /> info@decahedronventures.com
        </a>
        <a href="tel:+14077604873" onClick={() => trackBrochurePixel('contact_click', PIXEL_PAGE.index, PIXEL_PAGE.kicker)} className="flex items-center gap-2 font-technical text-[13px] tracking-wider text-foreground hover:text-geometric-primary transition-colors">
          <Phone className="w-4 h-4 text-geometric-secondary" /> 407 760-4873
        </a>
      </Fold>

      {done ? (
        <Fold i={2} className="flex-1 flex flex-col items-center justify-center text-center border border-technical-line/40 bg-background/40 rounded-sm p-6">
          <div className="w-10 h-10 rounded-full border border-geometric-primary/50 flex items-center justify-center mb-3">
            <Check className="w-5 h-5 text-geometric-primary" />
          </div>
          <h3 className="font-display text-[22px] text-foreground mb-1.5">Thank you</h3>
          <p className="text-[13px] text-muted-foreground max-w-sm leading-relaxed">
            Your request has been logged. A member of the partnership will follow up at {form.email} with next steps.
          </p>
        </Fold>
      ) : (
        <Fold i={2} className="flex-1 min-h-0">
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div>
              <label className="font-technical text-[11px] tracking-[0.25em] uppercase text-geometric-secondary/70">Full Name *</label>
              <input className={field} value={form.full_name} onChange={set('full_name')} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="font-technical text-[11px] tracking-[0.25em] uppercase text-geometric-secondary/70">Email *</label>
              <input type="email" className={field} value={form.email} onChange={set('email')} placeholder="jane@family.office" />
            </div>
            <div>
              <label className="font-technical text-[11px] tracking-[0.25em] uppercase text-geometric-secondary/70">Organization</label>
              <input className={field} value={form.company_name} onChange={set('company_name')} placeholder="Family office / Institution" />
            </div>
            <div>
              <label className="font-technical text-[11px] tracking-[0.25em] uppercase text-geometric-secondary/70">Title</label>
              <input className={field} value={form.job_title} onChange={set('job_title')} placeholder="Managing Director" />
            </div>

            <div className="md:col-span-2">
              <div className="font-technical text-[11px] tracking-[0.25em] uppercase text-geometric-secondary/70 mb-1.5">Indicative Commitment</div>
              <div className="flex flex-wrap gap-1.5">
                {TICKETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTicket(ticket === t ? '' : t)}
                    className={`font-technical text-[12px] tracking-wider px-2.5 py-1 rounded-sm border transition-colors ${
                      ticket === t
                        ? 'border-geometric-primary/70 text-foreground bg-geometric-primary/10'
                        : 'border-technical-line/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="font-technical text-[11px] tracking-[0.25em] uppercase text-geometric-secondary/70">Message</label>
              <textarea rows={2} className={`${field} resize-none`} value={form.message} onChange={set('message')} placeholder="Areas of interest, timeline, questions…" />
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-0.5">
              <p className="text-[10px] text-muted-foreground/80 leading-snug max-w-sm">
                Offered only to accredited investors under Rule 506(b). Submitting this form is not a commitment.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="font-technical text-[12px] tracking-[0.2em] uppercase px-5 py-2 rounded-sm border border-geometric-primary/60 text-foreground bg-geometric-primary/10 hover:bg-geometric-primary/20 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Request Access
              </button>
            </div>
          </form>
        </Fold>
      )}
    </div>
  );
};

export default ContactSheet;
