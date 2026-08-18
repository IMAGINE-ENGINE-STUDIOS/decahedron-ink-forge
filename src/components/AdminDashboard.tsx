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
  Target,
  FileDown,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useFundCRM, type FundStats } from '@/hooks/useFundCRM';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import BrochureAnalytics from '@/components/admin/BrochureAnalytics';
import { DealFlowTable } from '@/components/admin/DealFlowTable';
import { InvestorCRM } from '@/components/admin/InvestorCRM';
import { IndustryBreakdown } from '@/components/admin/IndustryBreakdown';
import LPSignupsDashboard from '@/components/admin/LPSignupsDashboard';
import LPPipelineBoard from '@/components/admin/LPPipelineBoard';
import LPApplicationDetail from '@/components/admin/LPApplicationDetail';

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

const LP_STATUSES = ['pending', 'reviewing', 'approved', 'declined'];

const AdminDashboard: React.FC = () => {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [lpApplications, setLpApplications] = useState<LPApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [fundStats, setFundStats] = useState<FundStats | null>(null);
  const [activeDeals, setActiveDeals] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [deleteConfirmLP, setDeleteConfirmLP] = useState<LPApplication | null>(null);
  const [detailLP, setDetailLP] = useState<LPApplication | null>(null);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { fetchFundStats, fetchDeals, fetchPortfolio, loading: crmLoading } = useFundCRM();

  useEffect(() => {
    fetchData();
    loadCRMStats();
  }, []);

  const loadCRMStats = async () => {
    const [stats, deals, portfolio] = await Promise.all([
      fetchFundStats(),
      fetchDeals(),
      fetchPortfolio(),
    ]);
    if (stats) setFundStats(stats);
    setActiveDeals(deals.filter(d => !['passed', 'portfolio'].includes(d.stage.toLowerCase())).length);
    setPortfolioCount(portfolio.filter(p => p.status === 'active').length);
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

  const updateLPStatus = async (lpId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('limited_partner_applications')
        .update({ status: newStatus })
        .eq('id', lpId);

      if (error) throw error;

      setLpApplications(prev => 
        prev.map(lp => lp.id === lpId ? { ...lp, status: newStatus } : lp)
      );

      toast({
        title: "Status Updated",
        description: `Changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update Failed",
        description: "Could not update status.",
        variant: "destructive",
      });
    }
  };

  const deleteLP = async (lp: LPApplication) => {
    try {
      const { error } = await supabase
        .from('limited_partner_applications')
        .delete()
        .eq('id', lp.id);

      if (error) throw error;

      setLpApplications(prev => prev.filter(l => l.id !== lp.id));
      setDeleteConfirmLP(null);

      toast({
        title: "Application Deleted",
        description: `${lp.full_name}'s application has been removed.`,
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the application.",
        variant: "destructive",
      });
    }
  };

  const exportLPsToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Title', 'Investment', 'Focus', 'Status', 'Date'];
    const rows = lpApplications.map(lp => [
      lp.full_name,
      lp.email,
      lp.phone || '',
      lp.company_name || '',
      lp.job_title || '',
      lp.investment_amount || '',
      (lp.investment_focus || []).join('; '),
      lp.status,
      formatDate(lp.created_at),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lp-applications-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Exported", description: `${lpApplications.length} applications exported to CSV.` });
  };

  const exportContactsToCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Message', 'Date'];
    const rows = contacts.map(c => [
      c.name,
      c.email,
      c.company,
      c.message.replace(/"/g, '""'),
      formatDate(c.created_at),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Exported", description: `${contacts.length} contacts exported to CSV.` });
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'reviewing':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'approved':
        return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'declined':
        return 'bg-red-500/10 text-red-700 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
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
          fundStats={fundStats}
          activeDeals={activeDeals}
          portfolioCount={portfolioCount}
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
          <TabsContent value="overview" className="space-y-6">
            <AnalyticsCharts pitches={pitches} />
            <BrochureAnalytics />
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
          <TabsContent value="lps" className="space-y-6">
            <LPPipelineBoard />

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-technical text-primary">[ LP.APPLICATIONS ]</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="font-technical text-xs"
                    onClick={exportLPsToCSV}
                  >
                    <FileDown className="h-3 w-3 mr-1" />
                    EXPORT CSV
                  </Button>
                </div>
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
                          <TableHead className="font-technical text-xs">ACTIONS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lpApplications.map((app) => (
                          <TableRow key={app.id} className="group">
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
                              <Select
                                value={app.status}
                                onValueChange={(value) => updateLPStatus(app.id, value)}
                              >
                                <SelectTrigger className={`w-28 h-7 text-xs ${getStatusColor(app.status)}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {LP_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{formatDate(app.created_at)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 font-technical text-[10px]"
                                  onClick={() => setDetailLP(app)}
                                >
                                  VIEW
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => setDeleteConfirmLP(app)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
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
                <div className="flex items-center justify-between">
                  <CardTitle className="font-technical text-primary">[ CONTACT.INQUIRIES ]</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="font-technical text-xs"
                    onClick={exportContactsToCSV}
                  >
                    <FileDown className="h-3 w-3 mr-1" />
                    EXPORT CSV
                  </Button>
                </div>
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

      {/* LP Application Detail */}
      <LPApplicationDetail
        application={detailLP}
        onClose={() => setDetailLP(null)}
        onDownloadDeck={downloadPitchDeck}
      />

      {/* Delete LP Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmLP} onOpenChange={() => setDeleteConfirmLP(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteConfirmLP?.full_name}'s application?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the LP application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirmLP && deleteLP(deleteConfirmLP)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
