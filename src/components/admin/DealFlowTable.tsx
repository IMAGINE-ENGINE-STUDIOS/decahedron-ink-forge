import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Download, 
  Mail, 
  Eye, 
  Filter, 
  Search,
  ChevronDown,
  ExternalLink 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface DealFlowTableProps {
  pitches: Pitch[];
  onRefresh: () => void;
}

export const DealFlowTable: React.FC<DealFlowTableProps> = ({ pitches, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const { toast } = useToast();

  const sectors = [...new Set(pitches.map(p => p.sector))];
  const statuses = [...new Set(pitches.map(p => p.status))];

  const filteredPitches = pitches.filter((pitch) => {
    const matchesSearch = 
      pitch.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pitch.founder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pitch.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || pitch.status === statusFilter;
    const matchesSector = !sectorFilter || pitch.sector === sectorFilter;

    return matchesSearch && matchesStatus && matchesSector;
  });

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
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'reviewing':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'due_diligence':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/30';
      case 'passed':
        return 'bg-red-500/10 text-red-700 border-red-500/30';
      case 'invested':
        return 'bg-green-500/10 text-green-700 border-green-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="font-technical text-primary">[ DEAL.FLOW ]</CardTitle>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48 font-technical text-sm"
                />
              </div>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-technical text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    {statusFilter || 'Status'}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Statuses
                  </DropdownMenuItem>
                  {statuses.map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sector Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-technical text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    {sectorFilter || 'Sector'}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSectorFilter(null)}>
                    All Sectors
                  </DropdownMenuItem>
                  {sectors.map((sector) => (
                    <DropdownMenuItem key={sector} onClick={() => setSectorFilter(sector)}>
                      {sector}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPitches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-technical">NO.MATCHING.PITCHES</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-technical text-xs">COMPANY</TableHead>
                    <TableHead className="font-technical text-xs">FOUNDER</TableHead>
                    <TableHead className="font-technical text-xs">SECTOR</TableHead>
                    <TableHead className="font-technical text-xs">STAGE</TableHead>
                    <TableHead className="font-technical text-xs">FUNDING</TableHead>
                    <TableHead className="font-technical text-xs">STATUS</TableHead>
                    <TableHead className="font-technical text-xs">DATE</TableHead>
                    <TableHead className="font-technical text-xs">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPitches.map((pitch) => (
                    <TableRow key={pitch.id} className="group">
                      <TableCell className="font-medium">{pitch.company_name}</TableCell>
                      <TableCell>{pitch.founder_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{pitch.sector}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{pitch.stage}</Badge>
                      </TableCell>
                      <TableCell className="font-technical text-sm">{pitch.funding_target}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(pitch.status)} variant="outline">
                          {pitch.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(pitch.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => setSelectedPitch(pitch)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            asChild
                          >
                            <a href={`mailto:${pitch.email}`}>
                              <Mail className="h-3 w-3" />
                            </a>
                          </Button>
                          {pitch.pitch_deck_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => downloadPitchDeck(pitch.pitch_deck_url!, pitch.company_name)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
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

      {/* Pitch Detail Dialog */}
      <Dialog open={!!selectedPitch} onOpenChange={() => setSelectedPitch(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-technical text-primary">
              [ {selectedPitch?.company_name} ]
            </DialogTitle>
          </DialogHeader>
          {selectedPitch && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-technical">FOUNDER</p>
                  <p className="font-medium">{selectedPitch.founder_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-technical">EMAIL</p>
                  <a href={`mailto:${selectedPitch.email}`} className="text-primary hover:underline flex items-center gap-1">
                    {selectedPitch.email}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-technical">SECTOR</p>
                  <Badge variant="outline">{selectedPitch.sector}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-technical">STAGE</p>
                  <Badge variant="secondary">{selectedPitch.stage}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-technical">FUNDING TARGET</p>
                  <p className="font-technical">{selectedPitch.funding_target}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-technical">STATUS</p>
                  <Badge className={getStatusColor(selectedPitch.status)} variant="outline">
                    {selectedPitch.status}
                  </Badge>
                </div>
              </div>
              
              {selectedPitch.description && (
                <div>
                  <p className="text-xs text-muted-foreground font-technical mb-2">DESCRIPTION</p>
                  <p className="text-sm">{selectedPitch.description}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {selectedPitch.pitch_deck_url && (
                  <Button 
                    onClick={() => downloadPitchDeck(selectedPitch.pitch_deck_url!, selectedPitch.company_name)}
                    className="font-technical"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    DOWNLOAD DECK
                  </Button>
                )}
                <Button variant="outline" className="font-technical" asChild>
                  <a href={`mailto:${selectedPitch.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    CONTACT
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
