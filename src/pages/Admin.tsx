import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, Download, Mail, Building2, Calendar, FileText, User, MessageSquare } from 'lucide-react';
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

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  created_at: string;
}

const Admin: React.FC = () => {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch pitches
      const { data: pitchesData, error: pitchesError } = await supabase
        .from('pitches')
        .select('*')
        .order('created_at', { ascending: false });

      if (pitchesError) {
        console.error('Error fetching pitches:', pitchesError);
        toast({
          title: "Error",
          description: "Failed to load pitches. You may need to authenticate.",
          variant: "destructive",
        });
      } else {
        setPitches(pitchesData || []);
      }

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        toast({
          title: "Error",
          description: "Failed to load contacts. You may need to authenticate.",
          variant: "destructive",
        });
      } else {
        setContacts(contactsData || []);
      }
      
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPitchDeck = async (pitchDeckUrl: string, companyName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pitch-decks')
        .download(pitchDeckUrl);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${companyName}-pitch-deck.pdf`;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-technical-line bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-technical text-primary">
                [ ADMIN.DASHBOARD ]
              </h1>
              <p className="text-sm text-muted-foreground font-technical">
                SUBMISSION.MANAGEMENT.SYSTEM
              </p>
            </div>
            <Button 
              onClick={fetchData} 
              variant="outline" 
              className="font-technical"
            >
              REFRESH.DATA
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{pitches.length}</p>
                  <p className="text-xs text-muted-foreground font-technical uppercase">
                    Total Pitches
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{contacts.length}</p>
                  <p className="text-xs text-muted-foreground font-technical uppercase">
                    Total Contacts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {pitches.filter(p => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </p>
                  <p className="text-xs text-muted-foreground font-technical uppercase">
                    This Week
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {contacts.filter(c => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </p>
                  <p className="text-xs text-muted-foreground font-technical uppercase">
                    New Inquiries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pitches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pitches" className="font-technical">
              PITCH.SUBMISSIONS ({pitches.length})
            </TabsTrigger>
            <TabsTrigger value="contacts" className="font-technical">
              CONTACT.INQUIRIES ({contacts.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pitches">
            <Card>
              <CardHeader>
                <CardTitle className="font-technical text-primary">
                  [ PITCH.SUBMISSIONS ]
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pitches.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-technical">
                      NO.PITCHES.SUBMITTED.YET
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-technical">COMPANY</TableHead>
                          <TableHead className="font-technical">FOUNDER</TableHead>
                          <TableHead className="font-technical">EMAIL</TableHead>
                          <TableHead className="font-technical">SECTOR</TableHead>
                          <TableHead className="font-technical">STAGE</TableHead>
                          <TableHead className="font-technical">FUNDING</TableHead>
                          <TableHead className="font-technical">DECK</TableHead>
                          <TableHead className="font-technical">STATUS</TableHead>
                          <TableHead className="font-technical">SUBMITTED</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pitches.map((pitch) => (
                          <TableRow key={pitch.id}>
                            <TableCell className="font-medium">
                              {pitch.company_name}
                            </TableCell>
                            <TableCell>{pitch.founder_name}</TableCell>
                            <TableCell>
                              <a 
                                href={`mailto:${pitch.email}`}
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                <Mail className="h-3 w-3" />
                                {pitch.email}
                              </a>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{pitch.sector}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{pitch.stage}</Badge>
                            </TableCell>
                            <TableCell className="font-technical">
                              {pitch.funding_target}
                            </TableCell>
                            <TableCell>
                              {pitch.pitch_deck_url ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadPitchDeck(pitch.pitch_deck_url!, pitch.company_name)}
                                  className="h-8"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              ) : (
                                <span className="text-muted-foreground text-xs">No deck</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={pitch.status === 'pending' ? 'default' : 'secondary'}
                              >
                                {pitch.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(pitch.created_at)}
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
          
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle className="font-technical text-primary">
                  [ CONTACT.INQUIRIES ]
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contacts.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-technical">
                      NO.INQUIRIES.RECEIVED.YET
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <Card key={contact.id} className="border-technical-line">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h3 className="font-semibold">{contact.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <a 
                                    href={`mailto:${contact.email}`}
                                    className="text-primary hover:underline flex items-center gap-1"
                                  >
                                    <Mail className="h-3 w-3" />
                                    {contact.email}
                                  </a>
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {contact.company}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(contact.created_at)}
                            </div>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
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

export default Admin;