import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Download } from 'lucide-react';

export interface LPApplicationDetailRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  job_title: string | null;
  investment_amount: string | null;
  investment_focus: string[] | null;
  pitch_deck_url: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface Props {
  application: LPApplicationDetailRecord | null;
  onClose: () => void;
  onDownloadDeck?: (url: string, name: string) => void;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <p className="font-technical text-[10px] tracking-widest text-muted-foreground">{label}</p>
    <div className="text-sm mt-0.5">{children}</div>
  </div>
);

const LPApplicationDetail: React.FC<Props> = ({ application, onClose, onDownloadDeck }) => {
  if (!application) return null;
  const a = application;

  return (
    <Dialog open={!!application} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-technical text-primary">[ LP.APPLICATION ]</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{a.full_name}</h3>
              <p className="text-sm text-muted-foreground">
                {[a.job_title, a.company_name].filter(Boolean).join(' · ') || 'No organization provided'}
              </p>
            </div>
            <Badge variant="outline" className="uppercase font-technical text-[10px]">{a.status}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="EMAIL">
              <a href={`mailto:${a.email}`} className="text-primary hover:underline inline-flex items-center gap-1">
                <Mail className="h-3 w-3" /> {a.email}
              </a>
            </Field>
            <Field label="PHONE">
              {a.phone ? (
                <a href={`tel:${a.phone}`} className="text-primary hover:underline inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {a.phone}
                </a>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </Field>
            <Field label="INDICATIVE.COMMITMENT">
              <span className="font-technical">{a.investment_amount || '—'}</span>
            </Field>
            <Field label="SUBMITTED">
              {new Date(a.created_at).toLocaleString()}
            </Field>
          </div>

          <Field label="INVESTMENT.FOCUS">
            {a.investment_focus?.length ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {a.investment_focus.map((f, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </Field>

          <Field label="MESSAGE">
            <p className="whitespace-pre-wrap text-sm leading-relaxed rounded-md border bg-muted/30 p-3 mt-1">
              {a.message || 'No message provided.'}
            </p>
          </Field>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild size="sm" variant="outline" className="font-technical text-xs">
              <a href={`mailto:${a.email}`}>
                <Mail className="h-3 w-3 mr-1" /> REPLY
              </a>
            </Button>
            {a.pitch_deck_url && onDownloadDeck && (
              <Button
                size="sm"
                variant="outline"
                className="font-technical text-xs"
                onClick={() => onDownloadDeck(a.pitch_deck_url!, a.full_name)}
              >
                <Download className="h-3 w-3 mr-1" /> DOWNLOAD DECK
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LPApplicationDetail;
