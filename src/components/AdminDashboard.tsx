import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Download, 
  Mail, 
  Building2, 
  LogOut, 
  Users, 
  MessageSquare, 
  RefreshCw,
  BarChart3,
  Briefcase,
  TrendingUp,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useDecileCRM, type CRMStats } from '@/hooks/useDecileCRM';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { DealFlowTable } from '@/components/admin/DealFlowTable';
import { InvestorCRM } from '@/components/admin/InvestorCRM';
import { IndustryBreakdown } from '@/components/admin/IndustryBreakdown';

interface Pitch {
  id: string;
  company_name: string;
  founder_name: string;
  email: string;
  sector: string;
  stage: string;
  funding_target: string;
  description: string;
  pitch_deck_url: string | null;
  status: string;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  created_at: string;
}

interface LPApplication {
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

const AdminDashboard: React.FC = () => {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [lpApplications, setLpApplications] = useState<LPApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [crmStats, setCrmStats] = useState<CRMStats | null>(null);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { fetchStats, loading: crmLoading } = useDecileCRM();

  useEffect(() => {
    fetchData();
    loadCRMStats();
  }, []);

  const loadCRMStats = async () => {
    const stats = await fetchStats();
    if (stats) setCrmStats(stats);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [pitchesRes, contactsRes, lpRes] = await Promise.all([
        supabase.from('pitches').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('limited_partner_applications').select('*').order('created_at', { ascending: false }),
      ]);

      if (pitchesRes.error) throw pitchesRes.error;
      if (contactsRes.error) throw contactsRes.error;
      if (lpRes.error) throw lpRes.error;

      setPitches(pitchesRes.data || []);
      setContacts(contactsRes.data || []);
      setLpApplications(lpRes.data || []);
      
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPitchDeck = async (pitchDeckUrl: string, name: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pitch-decks')
        .download(pitchDeckUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}-pitch-deck.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the pitch deck.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully logged out.",
    });
  };

  const thisWeekCount = pitches.filter(p => 
    new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length + lpApplications.filter(l => 
    new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-technical">LOADING.INTELLIGENCE.DATA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-technical text-primary flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  [ INTELLIGENCE.CENTER ]
                </h1>
                <p className="text-sm text-muted-foreground font-technical">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => { fetchData(); loadCRMStats(); }} 
                variant="outline" 
                className="font-technical"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                REFRESH
              </Button>
              <Button 
                onClick={handleSignOut} 
                variant="ghost" 
                className="font-technical text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                LOGOUT
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Stats */}
        <DashboardOverview 
          pitchCount={pitches.length}
          lpCount={lpApplications.length}
          contactCount={contacts.length}
          thisWeekCount={thisWeekCount}
          crmStats={crmStats}
          crmLoading={crmLoading}
        />

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="font-technical text-xs">
              <BarChart3 className="h-3 w-3 mr-1 hidden sm:block" />
              ANALYTICS
            </TabsTrigger>
            <TabsTrigger value="deals" className="font-technical text-xs">
              <Briefcase className="h-3 w-3 mr-1 hidden sm:block" />
              DEAL FLOW
            </TabsTrigger>
            <TabsTrigger value="crm" className="font-technical text-xs">
              <TrendingUp className="h-3 w-3 mr-1 hidden sm:block" />
              CRM
            </TabsTrigger>
            <TabsTrigger value="lps" className="font-technical text-xs">
              <Users className="h-3 w-3 mr-1 hidden sm:block" />
              LPs
            </TabsTrigger>
            <TabsTrigger value="industries" className="font-technical text-xs">
              <Building2 className="h-3 w-3 mr-1 hidden sm:block" />
              INDUSTRIES
            </TabsTrigger>
            <TabsTrigger value="contacts" className="font-technical text-xs">
              <MessageSquare className="h-3 w-3 mr-1 hidden sm:block" />
              CONTACTS
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="overview">
            <AnalyticsCharts pitches={pitches} />
          </TabsContent>

          {/* Deal Flow Tab */}
          <TabsContent value="deals">
            <DealFlowTable pitches={pitches} onRefresh={fetchData} />
          </TabsContent>

          {/* CRM Tab */}
          <TabsContent value="crm">
            <InvestorCRM />
          </TabsContent>

          {/* LP Applications Tab */}
          <TabsContent value="lps">
            <Card>
              <CardHeader>
                <CardTitle className="font-technical text-primary">[ LP.APPLICATIONS ]</CardTitle>
              </CardHeader>
              <CardContent>
                {lpApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-technical">NO.APPLICATIONS.YET</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-technical text-xs">NAME</TableHead>
                          <TableHead className="font-technical text-xs">EMAIL</TableHead>
                          <TableHead className="font-technical text-xs">COMPANY</TableHead>
                          <TableHead className="font-technical text-xs">INVESTMENT</TableHead>
                          <TableHead className="font-technical text-xs">FOCUS</TableHead>
                          <TableHead className="font-technical text-xs">DECK</TableHead>
                          <TableHead className="font-technical text-xs">STATUS</TableHead>
                          <TableHead className="font-technical text-xs">DATE</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lpApplications.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.full_name}</TableCell>
                            <TableCell>
                              <a href={`mailto:${app.email}`} className="text-primary hover:underline flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {app.email}
                              </a>
                            </TableCell>
                            <TableCell>{app.company_name || '-'}</TableCell>
                            <TableCell className="font-technical">{app.investment_amount || '-'}</TableCell>
                            <TableCell>
                              {app.investment_focus?.map((focus, i) => (
                                <Badge key={i} variant="outline" className="mr-1 mb-1 text-xs">{focus}</Badge>
                              )) || '-'}
                            </TableCell>
                            <TableCell>
                              {app.pitch_deck_url ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadPitchDeck(app.pitch_deck_url!, app.full_name)}
                                  className="h-7"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              ) : (
                                <span className="text-muted-foreground text-xs">No deck</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={app.status === 'pending' ? 'default' : 'secondary'}>
                                {app.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{formatDate(app.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Industries Tab */}
          <TabsContent value="industries">
            <IndustryBreakdown pitches={pitches} />
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle className="font-technical text-primary">[ CONTACT.INQUIRIES ]</CardTitle>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-technical">NO.INQUIRIES.YET</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <Card key={contact.id} className="border-border">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">{contact.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <a href={`mailto:${contact.email}`} className="text-primary hover:underline flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {contact.email}
                                </a>
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {contact.company}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground font-technical">
                              {formatDate(contact.created_at)}
                            </span>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
