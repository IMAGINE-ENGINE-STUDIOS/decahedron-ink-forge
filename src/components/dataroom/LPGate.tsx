import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Lock, LogIn, Clock, ShieldCheck, KeyRound } from 'lucide-react';
import LPRegistrationForm from './LPRegistrationForm';

interface LPGateProps {
  onAccessGranted: () => void;
}

const LP_PASSWORD = 'VentureFund';

const LPGate: React.FC<LPGateProps> = ({ onAccessGranted }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handlePasswordSubmit = () => {
    if (password === LP_PASSWORD) {
      localStorage.setItem('lp_access_email', 'password-access');
      onAccessGranted();
    } else {
      toast({ title: 'Invalid password', variant: 'destructive' });
    }
  };

  const handleEmailCheck = async () => {
    if (!email) {
      toast({ title: 'Please enter your email', variant: 'destructive' });
      return;
    }

    setChecking(true);
    const { data, error } = await supabase
      .from('limited_partner_applications')
      .select('status')
      .eq('email', email.trim().toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1);

    setChecking(false);

    if (error || !data || data.length === 0) {
      toast({ title: 'No application found for this email', description: 'Please register first.', variant: 'destructive' });
      setMode('register');
      return;
    }

    const status = data[0].status;
    if (status === 'approved') {
      localStorage.setItem('lp_access_email', email.trim().toLowerCase());
      onAccessGranted();
    } else if (status === 'pending') {
      setPendingMessage(true);
    } else {
      toast({ title: 'Application status: ' + status, description: 'Please contact us for more information.', variant: 'destructive' });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <Card className="max-w-md w-full border-border bg-card text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <Clock className="h-10 w-10 mx-auto text-muted-foreground" />
            <h2 className="font-technical text-sm tracking-wider">APPLICATION.SUBMITTED</h2>
            <p className="text-sm text-muted-foreground font-technical">
              Your application is under review. You will be notified once approved.
              Return to this page and enter your email to check your status.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="font-technical text-xs mt-4"
              onClick={() => { setSubmitted(false); setMode('login'); }}
            >
              CHECK.STATUS
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pendingMessage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <Card className="max-w-md w-full border-border bg-card text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <Clock className="h-10 w-10 mx-auto text-muted-foreground" />
            <h2 className="font-technical text-sm tracking-wider">PENDING.APPROVAL</h2>
            <p className="text-sm text-muted-foreground font-technical">
              Your application is being reviewed by the fund administrators.
              You'll gain access once approved.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      {mode === 'login' ? (
        <Card className="max-w-md w-full border-border bg-card">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto p-4 bg-primary/5 rounded-full w-fit mb-3">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-technical text-sm tracking-wider">
              INVESTOR.DATA.ROOM
            </CardTitle>
            <p className="text-xs text-muted-foreground font-technical mt-1">
              Access restricted to approved Limited Partners
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEmailCheck()}
                className="font-technical text-sm"
              />
              <Button
                onClick={handleEmailCheck}
                className="w-full font-technical text-xs tracking-wider"
                disabled={checking}
              >
                <ShieldCheck className="h-3.5 w-3.5 mr-2" />
                {checking ? 'VERIFYING...' : 'ACCESS.DATA.ROOM'}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-technical">or use access password</span>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
                className="font-technical text-sm"
              />
              <Button
                variant="secondary"
                onClick={handlePasswordSubmit}
                className="w-full font-technical text-xs tracking-wider"
              >
                <KeyRound className="h-3.5 w-3.5 mr-2" />
                UNLOCK.WITH.PASSWORD
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-technical">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setMode('register')}
              className="w-full font-technical text-xs tracking-wider"
            >
              <LogIn className="h-3.5 w-3.5 mr-2" />
              REQUEST.ACCESS
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <LPRegistrationForm onSubmitted={() => setSubmitted(true)} />
          <button
            onClick={() => setMode('login')}
            className="text-xs font-technical text-muted-foreground hover:text-foreground transition-colors block mx-auto"
          >
            ← Already registered? Check your status
          </button>
        </div>
      )}
    </div>
  );
};

export default LPGate;
