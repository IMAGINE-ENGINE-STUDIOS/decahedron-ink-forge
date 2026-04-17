import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, FileText, Upload, Trash2, Download, Lock, 
  FolderOpen, Building2, Users, FileCheck, Briefcase, File, LogOut, X, ExternalLink
} from 'lucide-react';
import LPGate from '@/components/dataroom/LPGate';

const CATEGORIES = [
  { id: 'lp-agreements', label: 'LP Agreements', icon: FileCheck },
  { id: 'company-profiles', label: 'Company Profiles', icon: Building2 },
  { id: 'team-cvs', label: 'Team CVs', icon: Users },
  { id: 'fund-documents', label: 'Fund Documents', icon: Briefcase },
  { id: 'other', label: 'Other', icon: File },
];

interface DataRoomDocument {
  id: string;
  name: string;
  category: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

const ADMIN_PASSWORD = 'VenturePartners';

const DataRoom: React.FC = () => {
  const [documents, setDocuments] = useState<DataRoomDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState(CATEGORIES[0].id);
  const [lpAccess, setLpAccess] = useState(() => !!localStorage.getItem('lp_access_email'));
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('data_room_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      toast({ title: 'Admin access granted' });
    } else {
      toast({ title: 'Invalid password', variant: 'destructive' });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      const filePath = `${uploadCategory}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('data-room')
        .upload(filePath, file);

      if (uploadError) {
        toast({ title: `Failed to upload ${file.name}`, description: uploadError.message, variant: 'destructive' });
        continue;
      }

      const { error: dbError } = await supabase
        .from('data_room_documents')
        .insert({
          name: file.name,
          category: uploadCategory,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
        });

      if (dbError) {
        toast({ title: `Failed to save ${file.name} metadata`, variant: 'destructive' });
      }
    }

    toast({ title: 'Files uploaded successfully' });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchDocuments();
  };

  const handleDelete = async (doc: DataRoomDocument) => {
    const { error: storageError } = await supabase.storage
      .from('data-room')
      .remove([doc.file_path]);

    if (storageError) {
      toast({ title: 'Failed to delete file', variant: 'destructive' });
      return;
    }

    const { error: dbError } = await supabase
      .from('data_room_documents')
      .delete()
      .eq('id', doc.id);

    if (dbError) {
      toast({ title: 'Failed to delete record', variant: 'destructive' });
      return;
    }

    toast({ title: 'Document deleted' });
    fetchDocuments();
  };

  const handleDownload = (doc: DataRoomDocument) => {
    const { data } = supabase.storage
      .from('data-room')
      .getPublicUrl(doc.file_path);

    window.open(data.publicUrl, '_blank');
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredDocs = selectedCategory
    ? documents.filter(d => d.category === selectedCategory)
    : documents;

  const getCategoryIcon = (categoryId: string) => {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    return cat ? cat.icon : File;
  };

  const getCategoryLabel = (categoryId: string) => {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    return cat ? cat.label : categoryId;
  };

  const handleLPLogout = () => {
    localStorage.removeItem('lp_access_email');
    setLpAccess(false);
  };

  if (!lpAccess && !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-technical tracking-wider text-foreground">
                  [ INVESTOR.DATA.ROOM ]
                </h1>
                <p className="text-sm text-muted-foreground font-technical mt-1">
                  DECAHEDRON VENTURES — CONFIDENTIAL DOCUMENTS
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="font-technical text-xs"
              onClick={() => setShowAdminLogin(!showAdminLogin)}
            >
              <Lock className="h-3 w-3 mr-1" />
              ADMIN
            </Button>
          </div>
          {showAdminLogin && (
            <div className="max-w-7xl mx-auto px-6 pb-4">
              <div className="flex items-center gap-3 max-w-sm">
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="font-technical text-sm"
                />
                <Button size="sm" onClick={handleAdminLogin} className="font-technical text-xs">
                  ENTER
                </Button>
              </div>
            </div>
          )}
        </header>
        <LPGate onAccessGranted={() => setLpAccess(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-technical tracking-wider text-foreground">
                [ INVESTOR.DATA.ROOM ]
              </h1>
              <p className="text-sm text-muted-foreground font-technical mt-1">
                DECAHEDRON VENTURES — CONFIDENTIAL DOCUMENTS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="font-technical text-xs"
                onClick={handleLPLogout}
              >
                <LogOut className="h-3 w-3 mr-1" />
                LOGOUT
              </Button>
            )}
            {!isAdmin ? (
              <Button
                variant="outline"
                size="sm"
                className="font-technical text-xs"
                onClick={() => setShowAdminLogin(!showAdminLogin)}
              >
                <Lock className="h-3 w-3 mr-1" />
                ADMIN
              </Button>
            ) : (
              <span className="text-xs font-technical text-primary bg-primary/10 px-3 py-1 border border-primary/20">
                ADMIN.MODE
              </span>
            )}
          </div>
        </div>

        {/* Admin login panel */}
        {showAdminLogin && !isAdmin && (
          <div className="max-w-7xl mx-auto px-6 pb-4">
            <div className="flex items-center gap-3 max-w-sm">
              <Input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="font-technical text-sm"
              />
              <Button size="sm" onClick={handleAdminLogin} className="font-technical text-xs">
                ENTER
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Investment Deck — Featured */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
            <span className="font-technical text-[10px] tracking-[0.2em] text-primary/70">
              ★ FEATURED.DOCUMENT
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
          </div>

          <button
            type="button"
            onClick={() => {
              setViewerTitle('Decahedron Ventures Fund I — Investment Presentation');
              setViewerUrl('/Decahedron_Ventures_Fund_I.pdf');
            }}
            className="relative w-full text-left block overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background hover:border-primary/60 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)] transition-all duration-300 group"
          >
            {/* Decorative geometric pattern */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                 style={{
                   backgroundImage: 'repeating-linear-gradient(45deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 0, transparent 12px)'
                 }}
            />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/40" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/40" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/40" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/40" />

            <div className="relative flex flex-col md:flex-row items-stretch">
              {/* Left: Icon panel */}
              <div className="flex items-center justify-center md:w-48 p-8 bg-primary/10 border-b md:border-b-0 md:border-r border-primary/20">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-2xl group-hover:bg-primary/50 transition-colors" />
                  <div className="relative p-5 bg-background/80 backdrop-blur border border-primary/40 rounded">
                    <Briefcase className="h-10 w-10 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Middle: Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                <p className="font-technical text-[10px] tracking-[0.25em] text-primary mb-2">
                  DECAHEDRON.VENTURES — FUND.I
                </p>
                <h2 className="font-technical text-xl md:text-2xl tracking-wider text-foreground mb-2 group-hover:text-primary transition-colors">
                  INVESTMENT.PRESENTATION
                </h2>
                <p className="text-sm text-muted-foreground font-technical leading-relaxed mb-4 max-w-xl">
                  The complete pitch deck — thesis, 10-factor criteria, sourcing engine, and fund economics.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-technical text-muted-foreground tracking-wider">
                  <span>▸ 14.SLIDES</span>
                  <span>▸ PDF.FORMAT</span>
                  <span>▸ CONFIDENTIAL</span>
                </div>
              </div>

              {/* Right: CTA */}
              <div className="flex items-center justify-center md:w-56 p-6 md:p-8 md:border-l border-primary/20 bg-background/40">
                <div className="flex items-center gap-3 px-5 py-3 bg-primary text-primary-foreground rounded font-technical text-xs tracking-[0.2em] group-hover:gap-5 transition-all shadow-lg">
                  <span>VIEW.DECK</span>
                  <span className="text-base">→</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Admin Upload Section */}
        {isAdmin && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="font-technical text-sm tracking-wider flex items-center gap-2">
                <Upload className="h-4 w-4" />
                UPLOAD.DOCUMENTS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                  <Label className="font-technical text-xs uppercase">Category</Label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-technical"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-technical text-xs uppercase">Files</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleUpload}
                    disabled={uploading}
                    className="font-technical text-sm"
                  />
                </div>
                {uploading && (
                  <span className="text-sm font-technical text-muted-foreground animate-pulse">
                    UPLOADING...
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-technical mt-3">
                NOTE: You must be logged in at /admin for uploads to work (Supabase auth required for storage).
              </p>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="font-technical text-xs"
          >
            <FolderOpen className="h-3 w-3 mr-1" />
            ALL ({documents.length})
          </Button>
          {CATEGORIES.map(cat => {
            const count = documents.filter(d => d.category === cat.id).length;
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="font-technical text-xs"
              >
                <Icon className="h-3 w-3 mr-1" />
                {cat.label.toUpperCase()} ({count})
              </Button>
            );
          })}
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="font-technical text-sm text-muted-foreground">LOADING.DOCUMENTS...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-technical text-sm text-muted-foreground">
              {documents.length === 0 ? 'NO.DOCUMENTS.UPLOADED.YET' : 'NO.DOCUMENTS.IN.THIS.CATEGORY'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredDocs.map(doc => {
              const Icon = getCategoryIcon(doc.category);
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/30 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-2 bg-primary/5 rounded">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-technical text-sm text-foreground truncate">{doc.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-technical text-muted-foreground">
                          {getCategoryLabel(doc.category)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-technical text-muted-foreground">
                          {formatFileSize(doc.file_size)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-technical text-muted-foreground">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="font-technical text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      DOWNLOAD
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doc)}
                        className="font-technical text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataRoom;
