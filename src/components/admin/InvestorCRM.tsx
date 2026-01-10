import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Users, ExternalLink, Building2, Calendar } from 'lucide-react';
import { useDecileCRM, type Investor, type Deal, type PortfolioCompany } from '@/hooks/useDecileCRM';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const InvestorCRM: React.FC = () => {
  const { loading, error, fetchInvestors, fetchDeals, fetchPortfolio, syncCRM } = useDecileCRM();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioCompany[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const loadData = async () => {
    const [investorData, dealData, portfolioData] = await Promise.all([
      fetchInvestors(),
      fetchDeals(),
      fetchPortfolio(),
    ]);

    if (investorData) setInvestors(investorData);
    if (dealData) setDeals(dealData);
    if (portfolioData) setPortfolio(portfolioData);
    setLastSync(new Date());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    await syncCRM();
    await loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'prospect':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'portfolio':
        return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'term sheet':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'due diligence':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-technical text-primary">[ DECILE.LAB.CRM ]</CardTitle>
          {lastSync && (
            <p className="text-xs text-muted-foreground font-technical mt-1">
              Last synced: {lastSync.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button 
          onClick={handleSync} 
          variant="outline" 
          size="sm" 
          disabled={loading}
          className="font-technical"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          SYNC
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

          <TabsContent value="investors">
            {investors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-technical">NO.INVESTORS.SYNCED</p>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investors.map((investor) => (
                      <TableRow key={investor.id}>
                        <TableCell className="font-medium">{investor.name}</TableCell>
                        <TableCell className="font-technical">{investor.commitment}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(investor.status)} variant="outline">
                            {investor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {investor.focus.slice(0, 2).map((f, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {f}
                              </Badge>
                            ))}
                            {investor.focus.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{investor.focus.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {investor.lastContact}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="deals">
            {deals.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-technical">NO.DEALS.SYNCED</p>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell className="font-medium">{deal.company}</TableCell>
                        <TableCell>
                          <Badge className={getStageColor(deal.stage)} variant="outline">
                            {deal.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-technical">{deal.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{deal.sector}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${deal.probability}%` }}
                              />
                            </div>
                            <span className="text-xs font-technical">{deal.probability}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="portfolio">
            {portfolio.length === 0 ? (
              <div className="text-center py-8">
                <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-technical">NO.PORTFOLIO.DATA</p>
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
                            className={
                              parseFloat(company.multiple) >= 2 
                                ? 'bg-green-500/10 text-green-700 border-green-500/30' 
                                : ''
                            }
                          >
                            {company.multiple}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(company.status)} variant="outline">
                            {company.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
