import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RefreshCw, Users, ExternalLink, Building2, Calendar, Plus, Trash2, Edit, Download } from 'lucide-react';
import { useFundCRM, type Investor, type Deal, type PortfolioCompany } from '@/hooks/useFundCRM';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const INVESTOR_STATUSES = ['prospect', 'active', 'pending', 'committed', 'passed'];
const DEAL_STAGES = ['sourcing', 'screening', 'due diligence', 'term sheet', 'closing', 'portfolio', 'passed'];
const PORTFOLIO_STATUSES = ['active', 'exited', 'written off'];

export const InvestorCRM: React.FC = () => {
  const { 
    loading, error, 
    fetchInvestors, addInvestor, updateInvestor, deleteInvestor,
    fetchDeals, addDeal, updateDeal, deleteDeal,
    fetchPortfolio, addPortfolioCompany, updatePortfolioCompany, deletePortfolioCompany
  } = useFundCRM();

  const [investors, setInvestors] = useState<Investor[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioCompany[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Dialog states
  const [investorDialogOpen, setInvestorDialogOpen] = useState(false);
  const [dealDialogOpen, setDealDialogOpen] = useState(false);
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'investor' | 'deal' | 'portfolio'; id: string; name: string } | null>(null);

  // Form states
  const [newInvestor, setNewInvestor] = useState({ name: '', email: '', commitment: '', status: 'prospect', focus: '' });
  const [newDeal, setNewDeal] = useState({ company: '', stage: 'sourcing', amount: '', sector: '', probability: 50 });
  const [newPortfolio, setNewPortfolio] = useState({ name: '', invested: '', valuation: '', multiple: '1.0x', status: 'active', sector: '' });

  const loadData = async () => {
    const [investorData, dealData, portfolioData] = await Promise.all([
      fetchInvestors(),
      fetchDeals(),
      fetchPortfolio(),
    ]);

    setInvestors(investorData);
    setDeals(dealData);
    setPortfolio(portfolioData);
    setLastSync(new Date());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddInvestor = async () => {
    const result = await addInvestor({
      name: newInvestor.name,
      email: newInvestor.email || null,
      commitment: newInvestor.commitment || '$0',
      status: newInvestor.status,
      focus: newInvestor.focus ? newInvestor.focus.split(',').map(s => s.trim()) : [],
      last_contact: new Date().toISOString(),
      notes: null,
    });

    if (result) {
      toast.success('Investor added successfully');
      setInvestorDialogOpen(false);
      setNewInvestor({ name: '', email: '', commitment: '', status: 'prospect', focus: '' });
      loadData();
    }
  };

  const handleAddDeal = async () => {
    const result = await addDeal({
      company: newDeal.company,
      stage: newDeal.stage,
      amount: newDeal.amount || '$0',
      sector: newDeal.sector,
      probability: newDeal.probability,
      lead_partner: null,
      notes: null,
    });

    if (result) {
      toast.success('Deal added successfully');
      setDealDialogOpen(false);
      setNewDeal({ company: '', stage: 'sourcing', amount: '', sector: '', probability: 50 });
      loadData();
    }
  };

  const handleAddPortfolio = async () => {
    const result = await addPortfolioCompany({
      name: newPortfolio.name,
      invested: newPortfolio.invested || '$0',
      valuation: newPortfolio.valuation || '$0',
      multiple: newPortfolio.multiple || '1.0x',
      status: newPortfolio.status,
      sector: newPortfolio.sector || null,
      investment_date: new Date().toISOString(),
      notes: null,
    });

    if (result) {
      toast.success('Portfolio company added successfully');
      setPortfolioDialogOpen(false);
      setNewPortfolio({ name: '', invested: '', valuation: '', multiple: '1.0x', status: 'active', sector: '' });
      loadData();
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    let success = false;
    switch (itemToDelete.type) {
      case 'investor':
        success = await deleteInvestor(itemToDelete.id);
        break;
      case 'deal':
        success = await deleteDeal(itemToDelete.id);
        break;
      case 'portfolio':
        success = await deletePortfolioCompany(itemToDelete.id);
        break;
    }

    if (success) {
      toast.success(`${itemToDelete.name} deleted successfully`);
      loadData();
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleStatusChange = async (type: 'investor' | 'deal' | 'portfolio', id: string, newStatus: string) => {
    let success = false;
    switch (type) {
      case 'investor':
        success = await updateInvestor(id, { status: newStatus });
        break;
      case 'deal':
        success = await updateDeal(id, { stage: newStatus });
        break;
      case 'portfolio':
        success = await updatePortfolioCompany(id, { status: newStatus });
        break;
    }

    if (success) {
      toast.success('Status updated');
      loadData();
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).map(v => `"${v}"`).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'committed':
        return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'prospect':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'passed':
      case 'written off':
        return 'bg-red-500/10 text-red-700 border-red-500/30';
      case 'exited':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'portfolio':
      case 'closing':
        return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'term sheet':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'due diligence':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'passed':
        return 'bg-red-500/10 text-red-700 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-technical text-primary">[ FUND.CRM ]</CardTitle>
          {lastSync && (
            <p className="text-xs text-muted-foreground font-technical mt-1">
              Last refreshed: {lastSync.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button 
          onClick={loadData} 
          variant="outline" 
          size="sm" 
          disabled={loading}
          className="font-technical"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          REFRESH
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm text-destructive font-technical">{error}</p>
          </div>
        )}

        <Tabs defaultValue="investors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="investors" className="font-technical text-xs">
              <Users className="h-3 w-3 mr-1" />
              INVESTORS ({investors.length})
            </TabsTrigger>
            <TabsTrigger value="deals" className="font-technical text-xs">
              <Building2 className="h-3 w-3 mr-1" />
              DEALS ({deals.length})
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="font-technical text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              PORTFOLIO ({portfolio.length})
            </TabsTrigger>
          </TabsList>

          {/* INVESTORS TAB */}
          <TabsContent value="investors">
            <div className="flex justify-between items-center mb-4">
              <Dialog open={investorDialogOpen} onOpenChange={setInvestorDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="font-technical">
                    <Plus className="h-4 w-4 mr-1" /> ADD INVESTOR
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-technical">Add New Investor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name *</Label>
                      <Input value={newInvestor.name} onChange={e => setNewInvestor({...newInvestor, name: e.target.value})} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" value={newInvestor.email} onChange={e => setNewInvestor({...newInvestor, email: e.target.value})} />
                    </div>
                    <div>
                      <Label>Commitment</Label>
                      <Input placeholder="$100K" value={newInvestor.commitment} onChange={e => setNewInvestor({...newInvestor, commitment: e.target.value})} />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={newInvestor.status} onValueChange={v => setNewInvestor({...newInvestor, status: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {INVESTOR_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Focus Areas (comma-separated)</Label>
                      <Input placeholder="AI, Fintech, SaaS" value={newInvestor.focus} onChange={e => setNewInvestor({...newInvestor, focus: e.target.value})} />
                    </div>
                    <Button onClick={handleAddInvestor} disabled={!newInvestor.name || loading} className="w-full">
                      Add Investor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(investors, 'investors')}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>

            {investors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-technical">NO.INVESTORS.YET</p>
                <p className="text-xs text-muted-foreground mt-1">Add your first investor above</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-technical text-xs">NAME</TableHead>
                      <TableHead className="font-technical text-xs">COMMITMENT</TableHead>
                      <TableHead className="font-technical text-xs">STATUS</TableHead>
                      <TableHead className="font-technical text-xs">FOCUS</TableHead>
                      <TableHead className="font-technical text-xs">LAST CONTACT</TableHead>
                      <TableHead className="font-technical text-xs">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investors.map((investor) => (
                      <TableRow key={investor.id}>
                        <TableCell className="font-medium">{investor.name}</TableCell>
                        <TableCell className="font-technical">{investor.commitment}</TableCell>
                        <TableCell>
                          <Select value={investor.status} onValueChange={v => handleStatusChange('investor', investor.id, v)}>
                            <SelectTrigger className="w-28 h-7">
                              <Badge className={getStatusColor(investor.status)} variant="outline">
                                {investor.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {INVESTOR_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {investor.focus.slice(0, 2).map((f, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                            ))}
                            {investor.focus.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{investor.focus.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(investor.last_contact)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setItemToDelete({ type: 'investor', id: investor.id, name: investor.name }); setDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* DEALS TAB */}
          <TabsContent value="deals">
            <div className="flex justify-between items-center mb-4">
              <Dialog open={dealDialogOpen} onOpenChange={setDealDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="font-technical">
                    <Plus className="h-4 w-4 mr-1" /> ADD DEAL
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-technical">Add New Deal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Company Name *</Label>
                      <Input value={newDeal.company} onChange={e => setNewDeal({...newDeal, company: e.target.value})} />
                    </div>
                    <div>
                      <Label>Stage</Label>
                      <Select value={newDeal.stage} onValueChange={v => setNewDeal({...newDeal, stage: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {DEAL_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input placeholder="$250K" value={newDeal.amount} onChange={e => setNewDeal({...newDeal, amount: e.target.value})} />
                    </div>
                    <div>
                      <Label>Sector *</Label>
                      <Input placeholder="AI/ML" value={newDeal.sector} onChange={e => setNewDeal({...newDeal, sector: e.target.value})} />
                    </div>
                    <div>
                      <Label>Probability: {newDeal.probability}%</Label>
                      <Input type="range" min="0" max="100" value={newDeal.probability} onChange={e => setNewDeal({...newDeal, probability: parseInt(e.target.value)})} />
                    </div>
                    <Button onClick={handleAddDeal} disabled={!newDeal.company || !newDeal.sector || loading} className="w-full">
                      Add Deal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(deals, 'deals')}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>

            {deals.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-technical">NO.DEALS.YET</p>
                <p className="text-xs text-muted-foreground mt-1">Add your first deal above</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-technical text-xs">COMPANY</TableHead>
                      <TableHead className="font-technical text-xs">STAGE</TableHead>
                      <TableHead className="font-technical text-xs">AMOUNT</TableHead>
                      <TableHead className="font-technical text-xs">SECTOR</TableHead>
                      <TableHead className="font-technical text-xs">PROBABILITY</TableHead>
                      <TableHead className="font-technical text-xs">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell className="font-medium">{deal.company}</TableCell>
                        <TableCell>
                          <Select value={deal.stage} onValueChange={v => handleStatusChange('deal', deal.id, v)}>
                            <SelectTrigger className="w-32 h-7">
                              <Badge className={getStageColor(deal.stage)} variant="outline">
                                {deal.stage}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {DEAL_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="font-technical">{deal.amount}</TableCell>
                        <TableCell><Badge variant="outline">{deal.sector}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${deal.probability}%` }} />
                            </div>
                            <span className="text-xs font-technical">{deal.probability}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setItemToDelete({ type: 'deal', id: deal.id, name: deal.company }); setDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* PORTFOLIO TAB */}
          <TabsContent value="portfolio">
            <div className="flex justify-between items-center mb-4">
              <Dialog open={portfolioDialogOpen} onOpenChange={setPortfolioDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="font-technical">
                    <Plus className="h-4 w-4 mr-1" /> ADD COMPANY
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-technical">Add Portfolio Company</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Company Name *</Label>
                      <Input value={newPortfolio.name} onChange={e => setNewPortfolio({...newPortfolio, name: e.target.value})} />
                    </div>
                    <div>
                      <Label>Invested Amount</Label>
                      <Input placeholder="$250K" value={newPortfolio.invested} onChange={e => setNewPortfolio({...newPortfolio, invested: e.target.value})} />
                    </div>
                    <div>
                      <Label>Current Valuation</Label>
                      <Input placeholder="$2M" value={newPortfolio.valuation} onChange={e => setNewPortfolio({...newPortfolio, valuation: e.target.value})} />
                    </div>
                    <div>
                      <Label>Multiple</Label>
                      <Input placeholder="1.5x" value={newPortfolio.multiple} onChange={e => setNewPortfolio({...newPortfolio, multiple: e.target.value})} />
                    </div>
                    <div>
                      <Label>Sector</Label>
                      <Input placeholder="AI/ML" value={newPortfolio.sector} onChange={e => setNewPortfolio({...newPortfolio, sector: e.target.value})} />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={newPortfolio.status} onValueChange={v => setNewPortfolio({...newPortfolio, status: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PORTFOLIO_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddPortfolio} disabled={!newPortfolio.name || loading} className="w-full">
                      Add Company
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => exportToCSV(portfolio, 'portfolio')}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>

            {portfolio.length === 0 ? (
              <div className="text-center py-8">
                <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-technical">NO.PORTFOLIO.DATA</p>
                <p className="text-xs text-muted-foreground mt-1">Add your first portfolio company above</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-technical text-xs">COMPANY</TableHead>
                      <TableHead className="font-technical text-xs">INVESTED</TableHead>
                      <TableHead className="font-technical text-xs">VALUATION</TableHead>
                      <TableHead className="font-technical text-xs">MULTIPLE</TableHead>
                      <TableHead className="font-technical text-xs">STATUS</TableHead>
                      <TableHead className="font-technical text-xs">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell className="font-technical">{company.invested}</TableCell>
                        <TableCell className="font-technical">{company.valuation}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={parseFloat(company.multiple) >= 2 ? 'bg-green-500/10 text-green-700 border-green-500/30' : ''}
                          >
                            {company.multiple}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select value={company.status} onValueChange={v => handleStatusChange('portfolio', company.id, v)}>
                            <SelectTrigger className="w-28 h-7">
                              <Badge className={getStatusColor(company.status)} variant="outline">
                                {company.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {PORTFOLIO_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setItemToDelete({ type: 'portfolio', id: company.id, name: company.name }); setDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {itemToDelete?.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
