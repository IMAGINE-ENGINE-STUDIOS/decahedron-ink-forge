import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, FileText, Upload, Trash2, Download, Lock,
  FolderOpen, Building2, Users, FileCheck, Briefcase, File, LogOut, X, ExternalLink,
  Share2, Move, ChevronDown, ChevronRight, Copy, Folder,
  Target, TrendingUp, Calculator, Scale, ShieldCheck, HelpCircle,
  Presentation, BookOpen, ClipboardList, Phone, UserCheck,
} from 'lucide-react';
import LPGate from '@/components/dataroom/LPGate';

// Data room folder structure — per Jim's 6/1/2026 memo
// Order, names, and inclusions reflect his recommended revisions.
const CATEGORIES = [
  { id: '01-pitch-deck', label: 'Pitch Deck', icon: Presentation },
  { id: '02-team-cvs', label: 'Team CVs', icon: Users },
  { id: '03-track-record', label: 'Track Record', icon: TrendingUp },
  { id: '04-investment-memos', label: 'Investment Memos', icon: BookOpen },
  { id: '05-fund-model', label: 'Fund Model', icon: Calculator },
  { id: '06-legal-offering', label: 'Legal & Offering Documents', icon: Scale },
  { id: '07-operations', label: 'Operations Documents', icon: ShieldCheck },
  { id: '08-ddq', label: 'DD Questionnaire', icon: ClipboardList },
  { id: '09-references', label: 'References', icon: UserCheck },
  { id: '10-fund-contacts', label: 'Fund Contacts', icon: Phone },
  { id: '11-other', label: 'Other Documents', icon: File },
  // Admin-only internal library — hidden from LPs and share links
  { id: 'articles', label: 'Articles', icon: BookOpen, adminOnly: true },
];

const ADMIN_ONLY_CATEGORIES = new Set(CATEGORIES.filter(c => (c as any).adminOnly).map(c => c.id));





interface DataRoomDocument {
  id: string;
  name: string;
  category: string;
  subfolder: string | null;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

interface ShareLink {
  id: string;
  token: string;
  label: string | null;
  scope: string; // 'all' | 'category' | 'subfolder'
  category: string | null;
  subfolder: string | null;
  created_at: string;
}

const ADMIN_PASSWORD = 'VenturePartners';
const UNFILED = '__root__';

const DataRoom: React.FC = () => {
  const [documents, setDocuments] = useState<DataRoomDocument[]>([]);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState(CATEGORIES[0].id);
  const [uploadSubfolder, setUploadSubfolder] = useState('');
  const [lpAccess, setLpAccess] = useState(() => !!localStorage.getItem('lp_access_email'));
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState<string>('');
  const [moveDoc, setMoveDoc] = useState<DataRoomDocument | null>(null);
  const [moveCategory, setMoveCategory] = useState<string>(CATEGORIES[0].id);
  const [moveSubfolder, setMoveSubfolder] = useState<string>('');
  const [expandedSubfolders, setExpandedSubfolders] = useState<Record<string, boolean>>({});
  const [shareDialog, setShareDialog] = useState<null | { scope: 'all' | 'category' | 'subfolder'; category?: string; subfolder?: string; label: string }>(null);
  const [shareManagerOpen, setShareManagerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const shareToken = searchParams.get('share');
  const [activeShare, setActiveShare] = useState<ShareLink | null>(null);
  const [shareChecked, setShareChecked] = useState(!shareToken);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (isAdmin) fetchShareLinks();
  }, [isAdmin]);

  // Validate share token
  useEffect(() => {
    if (!shareToken) return;
    (async () => {
      const { data } = await supabase
        .from('data_room_share_links')
        .select('*')
        .eq('token', shareToken)
        .maybeSingle();
      if (data) {
        if (!data.expires_at || new Date(data.expires_at) > new Date()) {
          setActiveShare(data as ShareLink);
          if (data.scope !== 'all' && data.category) setSelectedCategory(data.category);
        }
      }
      setShareChecked(true);
    })();
  }, [shareToken]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('data_room_documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setDocuments((data as DataRoomDocument[]) || []);
    setLoading(false);
  };

  const fetchShareLinks = async () => {
    const { data } = await supabase
      .from('data_room_share_links')
      .select('*')
      .order('created_at', { ascending: false });
    setShareLinks((data as ShareLink[]) || []);
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
    const sub = uploadSubfolder.trim() || null;

    for (const file of Array.from(files)) {
      const subPart = sub ? `${sub.replace(/[^a-zA-Z0-9-_]/g, '_')}/` : '';
      const filePath = `${uploadCategory}/${subPart}${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('data-room').upload(filePath, file);
      if (uploadError) {
        toast({ title: `Failed to upload ${file.name}`, description: uploadError.message, variant: 'destructive' });
        continue;
      }
      const { error: dbError } = await supabase.from('data_room_documents').insert({
        name: file.name,
        category: uploadCategory,
        subfolder: sub,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
      });
      if (dbError) toast({ title: `Failed to save ${file.name} metadata`, variant: 'destructive' });
    }
    toast({ title: 'Files uploaded successfully' });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchDocuments();
  };

  const handleDelete = async (doc: DataRoomDocument) => {
    await supabase.storage.from('data-room').remove([doc.file_path]);
    const { error } = await supabase.from('data_room_documents').delete().eq('id', doc.id);
    if (error) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
      return;
    }
    toast({ title: 'Document deleted' });
    fetchDocuments();
  };

  const handleSaveMove = async () => {
    if (!moveDoc) return;
    const sub = moveSubfolder.trim() || null;
    const { error } = await supabase
      .from('data_room_documents')
      .update({ category: moveCategory, subfolder: sub })
      .eq('id', moveDoc.id);
    if (error) {
      toast({ title: 'Move failed', variant: 'destructive' });
      return;
    }
    toast({ title: 'Document moved' });
    setMoveDoc(null);
    fetchDocuments();
  };

  const handleDownload = (doc: DataRoomDocument) => {
    const { data } = supabase.storage.from('data-room').getPublicUrl(doc.file_path);
    window.open(data.publicUrl, '_blank');
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getCategoryIcon = (id: string) => CATEGORIES.find(c => c.id === id)?.icon || File;
  const getCategoryLabel = (id: string) => CATEGORIES.find(c => c.id === id)?.label || id;

  // Apply share scope filter
  const scopedDocs = useMemo(() => {
    // Hide admin-only categories from LP view and from any share link view
    const base = isAdmin && !activeShare
      ? documents
      : documents.filter(d => !ADMIN_ONLY_CATEGORIES.has(d.category));
    if (!activeShare) return base;
    if (activeShare.scope === 'all') return base;
    if (activeShare.scope === 'category') return base.filter(d => d.category === activeShare.category);
    if (activeShare.scope === 'subfolder')
      return base.filter(d => d.category === activeShare.category && d.subfolder === activeShare.subfolder);
    return base;
  }, [documents, activeShare, isAdmin]);


  const filteredDocs = selectedCategory
    ? scopedDocs.filter(d => d.category === selectedCategory)
    : scopedDocs;

  // Group filtered docs by subfolder for display
  const grouped = useMemo(() => {
    const map: Record<string, DataRoomDocument[]> = {};
    for (const d of filteredDocs) {
      const key = d.subfolder || UNFILED;
      (map[key] ||= []).push(d);
    }
    return map;
  }, [filteredDocs]);

  const allSubfoldersForCategory = (cat: string) =>
    Array.from(new Set(documents.filter(d => d.category === cat && d.subfolder).map(d => d.subfolder as string)));

  const handleLPLogout = () => {
    localStorage.removeItem('lp_access_email');
    setLpAccess(false);
  };

  const createShareLink = async () => {
    if (!shareDialog) return;
    const token = (crypto as any).randomUUID().replace(/-/g, '').slice(0, 22);
    const { data, error } = await supabase.from('data_room_share_links').insert({
      token,
      label: shareDialog.label || null,
      scope: shareDialog.scope,
      category: shareDialog.category || null,
      subfolder: shareDialog.subfolder || null,
    }).select().single();
    if (error) {
      toast({ title: 'Could not create share link', description: error.message, variant: 'destructive' });
      return;
    }
    const url = `${window.location.origin}/dataroom?share=${token}`;
    await navigator.clipboard.writeText(url).catch(() => {});
    toast({ title: 'Share link copied to clipboard', description: url });
    setShareDialog(null);
    fetchShareLinks();
  };

  const deleteShareLink = async (id: string) => {
    await supabase.from('data_room_share_links').delete().eq('id', id);
    fetchShareLinks();
  };

  const copyShareUrl = (token: string) => {
    const url = `${window.location.origin}/dataroom?share=${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: 'Link copied', description: url });
  };

  // Gate: allow if LP access, admin, or valid share token
  const gateOk = lpAccess || isAdmin || !!activeShare;

  if (!shareChecked) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-technical text-sm text-muted-foreground">VERIFYING.LINK...</div>;
  }

  if (!gateOk) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-technical tracking-wider text-foreground">[ INVESTOR.DATA.ROOM ]</h1>
                <p className="text-sm text-muted-foreground font-technical mt-1">DECAHEDRON VENTURES — CONFIDENTIAL DOCUMENTS</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="font-technical text-xs" onClick={() => setShowAdminLogin(!showAdminLogin)}>
              <Lock className="h-3 w-3 mr-1" />ADMIN
            </Button>
          </div>
          {showAdminLogin && (
            <div className="max-w-7xl mx-auto px-6 pb-4">
              <div className="flex items-center gap-3 max-w-sm">
                <Input type="password" placeholder="Admin password" value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="font-technical text-sm" />
                <Button size="sm" onClick={handleAdminLogin} className="font-technical text-xs">ENTER</Button>
              </div>
            </div>
          )}
        </header>
        <LPGate onAccessGranted={() => setLpAccess(true)} />
      </div>
    );
  }

  const subfolderKeys = Object.keys(grouped).sort((a, b) => (a === UNFILED ? -1 : b === UNFILED ? 1 : a.localeCompare(b)));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-technical tracking-wider text-foreground">[ INVESTOR.DATA.ROOM ]</h1>
              <p className="text-sm text-muted-foreground font-technical mt-1">
                {activeShare
                  ? `SHARED.VIEW — ${activeShare.label || activeShare.scope.toUpperCase()}`
                  : 'DECAHEDRON VENTURES — CONFIDENTIAL DOCUMENTS'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" className="font-technical text-xs" onClick={() => setShareManagerOpen(true)}>
                <Share2 className="h-3 w-3 mr-1" />LINKS ({shareLinks.length})
              </Button>
            )}
            {isAdmin && (
              <Button variant="outline" size="sm" className="font-technical text-xs"
                onClick={() => setShareDialog({ scope: 'all', label: 'Full Data Room' })}>
                <Share2 className="h-3 w-3 mr-1" />SHARE.ALL
              </Button>
            )}
            {!isAdmin && !activeShare && (
              <Button variant="outline" size="sm" className="font-technical text-xs" onClick={handleLPLogout}>
                <LogOut className="h-3 w-3 mr-1" />LOGOUT
              </Button>
            )}
            {!isAdmin ? (
              <Button variant="outline" size="sm" className="font-technical text-xs" onClick={() => setShowAdminLogin(!showAdminLogin)}>
                <Lock className="h-3 w-3 mr-1" />ADMIN
              </Button>
            ) : (
              <span className="text-xs font-technical text-primary bg-primary/10 px-3 py-1 border border-primary/20">ADMIN.MODE</span>
            )}
          </div>
        </div>
        {showAdminLogin && !isAdmin && (
          <div className="max-w-7xl mx-auto px-6 pb-4">
            <div className="flex items-center gap-3 max-w-sm">
              <Input type="password" placeholder="Admin password" value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="font-technical text-sm" />
              <Button size="sm" onClick={handleAdminLogin} className="font-technical text-xs">ENTER</Button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Principles banner removed per Jim's 6/1/2026 memo — internal language not for LP view */}

        {/* Featured Deck — Best Foot Forward */}
        {!activeShare && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
              <span className="font-technical text-[10px] tracking-[0.2em] text-primary/70">★ FEATURED.DOCUMENT</span>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
            </div>
            <button type="button"
              onClick={() => { setViewerTitle('Decahedron Ventures Fund I — Investment Presentation'); setViewerUrl('/Decahedron_Ventures_Fund_I.pdf'); }}
              className="relative w-full text-left block overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background hover:border-primary/60 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)] transition-all duration-300 group">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 0, transparent 12px)' }} />
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/40" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/40" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/40" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/40" />
              <div className="relative flex flex-col md:flex-row items-stretch">
                <div className="flex items-center justify-center md:w-48 p-8 bg-primary/10 border-b md:border-b-0 md:border-r border-primary/20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 blur-2xl group-hover:bg-primary/50 transition-colors" />
                    <div className="relative p-5 bg-background/80 backdrop-blur border border-primary/40 rounded">
                      <Briefcase className="h-10 w-10 text-primary" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                  <p className="font-technical text-[10px] tracking-[0.25em] text-primary mb-2">DECAHEDRON.VENTURES — FUND.I</p>
                  <h2 className="font-technical text-xl md:text-2xl tracking-wider text-foreground mb-2 group-hover:text-primary transition-colors">INVESTMENT.PRESENTATION</h2>
                  <p className="text-sm text-muted-foreground font-technical leading-relaxed mb-4 max-w-xl">The complete pitch deck — thesis, 10-factor criteria, sourcing engine, and fund economics.</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-technical text-muted-foreground tracking-wider">
                    <span>▸ 14.SLIDES</span><span>▸ PDF.FORMAT</span><span>▸ CONFIDENTIAL</span>
                  </div>
                </div>
                <div className="flex items-center justify-center md:w-56 p-6 md:p-8 md:border-l border-primary/20 bg-background/40">
                  <div className="flex items-center gap-3 px-5 py-3 bg-primary text-primary-foreground rounded font-technical text-xs tracking-[0.2em] group-hover:gap-5 transition-all shadow-lg">
                    <span>VIEW.DECK</span><span className="text-base">→</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Admin upload */}
        {isAdmin && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="font-technical text-sm tracking-wider flex items-center gap-2">
                <Upload className="h-4 w-4" />UPLOAD.DOCUMENTS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                  <Label className="font-technical text-xs uppercase">Category</Label>
                  <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-technical">
                    {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-technical text-xs uppercase">Subfolder (optional)</Label>
                  <Input value={uploadSubfolder} onChange={(e) => setUploadSubfolder(e.target.value)}
                    placeholder="e.g. Q4 2025" list="existing-subfolders"
                    className="font-technical text-sm w-48" />
                  <datalist id="existing-subfolders">
                    {allSubfoldersForCategory(uploadCategory).map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label className="font-technical text-xs uppercase">Files</Label>
                  <Input ref={fileInputRef} type="file" multiple onChange={handleUpload} disabled={uploading}
                    className="font-technical text-sm" />
                </div>
                {uploading && <span className="text-sm font-technical text-muted-foreground animate-pulse">UPLOADING...</span>}
              </div>
              <p className="text-xs text-muted-foreground font-technical mt-3">
                NOTE: You must be logged in at /admin for uploads to work (Supabase auth required for storage).
              </p>
            </CardContent>
          </Card>
        )}




        {/* Category carousel */}
        <div className="relative mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            <button
              onClick={() => setSelectedCategory(null)}
              disabled={!!activeShare && activeShare.scope !== 'all'}
              className={`snap-start flex flex-col items-center justify-center gap-1 w-[72px] h-[72px] p-2 border rounded-md font-technical text-[9px] transition-all hover:border-primary hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 ${
                selectedCategory === null ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card/40 text-foreground'
              }`}
            >
              <FolderOpen className="h-4 w-4" />
              <span className="text-center leading-tight">ALL</span>
              <span className="text-[8px] opacity-60">({scopedDocs.length})</span>
            </button>
            {CATEGORIES.map(cat => {
              if (ADMIN_ONLY_CATEGORIES.has(cat.id) && (!isAdmin || !!activeShare)) return null;
              const count = scopedDocs.filter(d => d.category === cat.id).length;
              if (activeShare && activeShare.scope !== 'all' && activeShare.category !== cat.id) return null;

              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`snap-start flex flex-col items-center justify-center gap-1 w-[72px] h-[72px] p-2 border rounded-md font-technical text-[9px] transition-all hover:border-primary hover:bg-primary/5 flex-shrink-0 ${
                    isActive ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card/40 text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-center leading-tight line-clamp-2">{cat.label}</span>
                  <span className="text-[8px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
        {isAdmin && selectedCategory && (
          <div className="flex justify-end mb-4">
            <Button size="sm" variant="outline" className="font-technical text-xs"
              onClick={() => setShareDialog({ scope: 'category', category: selectedCategory, label: getCategoryLabel(selectedCategory) })}>
              <Share2 className="h-3 w-3 mr-1" />SHARE.{getCategoryLabel(selectedCategory).toUpperCase()}
            </Button>
          </div>
        )}


        {/* Docs grouped by subfolder */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="font-technical text-sm text-muted-foreground">LOADING.DOCUMENTS...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="font-technical text-sm text-muted-foreground">NO.DOCUMENTS</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subfolderKeys.map(sub => {
              const docs = grouped[sub];
              const isRoot = sub === UNFILED;
              const expanded = expandedSubfolders[sub] ?? true;
              return (
                <div key={sub} className="border border-border rounded-lg overflow-hidden">
                  {!isRoot ? (
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border">
                      <button className="flex items-center gap-2 font-technical text-xs tracking-wider text-foreground"
                        onClick={() => setExpandedSubfolders(s => ({ ...s, [sub]: !expanded }))}>
                        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        <Folder className="h-3 w-3 text-primary" />
                        {sub.toUpperCase()} ({docs.length})
                      </button>
                      {isAdmin && selectedCategory && (
                        <Button size="sm" variant="ghost" className="font-technical text-[10px] h-7"
                          onClick={() => setShareDialog({ scope: 'subfolder', category: selectedCategory, subfolder: sub, label: `${getCategoryLabel(selectedCategory)} / ${sub}` })}>
                          <Share2 className="h-3 w-3 mr-1" />SHARE
                        </Button>
                      )}
                    </div>
                  ) : (
                    selectedCategory === null && Object.keys(grouped).length > 1 && (
                      <div className="px-4 py-2 bg-muted/10 border-b border-border font-technical text-[10px] tracking-wider text-muted-foreground">
                        UNFILED ({docs.length})
                      </div>
                    )
                  )}
                  {expanded && (
                    <div className="divide-y divide-border">
                      {docs.map(doc => {
                        const Icon = getCategoryIcon(doc.category);
                        return (
                          <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors group">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="p-2 bg-primary/5 rounded"><Icon className="h-5 w-5 text-primary" /></div>
                              <div className="min-w-0">
                                <p className="font-technical text-sm text-foreground truncate">{doc.name}</p>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                  <span className="text-xs font-technical text-muted-foreground">{getCategoryLabel(doc.category)}</span>
                                  {doc.subfolder && <><span className="text-xs text-muted-foreground">/</span><span className="text-xs font-technical text-primary/80">{doc.subfolder}</span></>}
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs font-technical text-muted-foreground">{formatFileSize(doc.file_size)}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs font-technical text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <Button variant="outline" size="sm" onClick={() => handleDownload(doc)} className="font-technical text-xs">
                                <Download className="h-3 w-3 mr-1" />DOWNLOAD
                              </Button>
                              {isAdmin && (
                                <>
                                  <Button variant="outline" size="sm" className="font-technical text-xs"
                                    onClick={() => { setMoveDoc(doc); setMoveCategory(doc.category); setMoveSubfolder(doc.subfolder || ''); }}>
                                    <Move className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleDelete(doc)}
                                    className="font-technical text-xs text-destructive hover:text-destructive">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <Dialog open={!!viewerUrl} onOpenChange={(open) => !open && setViewerUrl(null)}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 flex flex-col bg-card border-border">
          <DialogTitle className="sr-only">{viewerTitle}</DialogTitle>
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/60">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1.5 bg-primary/10 rounded"><FileText className="h-4 w-4 text-primary" /></div>
              <p className="font-technical text-xs tracking-wider text-foreground truncate">{viewerTitle}</p>
            </div>
            <div className="flex items-center gap-2">
              {viewerUrl && (
                <a href={viewerUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs font-technical hover:bg-accent transition-colors">
                  <ExternalLink className="h-3 w-3" />OPEN.IN.TAB
                </a>
              )}
              <button onClick={() => setViewerUrl(null)} className="p-1.5 border border-border rounded hover:bg-accent transition-colors" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-muted/20">
            {viewerUrl && <iframe src={`${viewerUrl}#view=FitH`} title={viewerTitle} className="w-full h-full border-0" />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Move dialog */}
      <Dialog open={!!moveDoc} onOpenChange={(o) => !o && setMoveDoc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-technical tracking-wider text-sm">MOVE.DOCUMENT</DialogTitle></DialogHeader>
          {moveDoc && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground font-technical truncate">{moveDoc.name}</p>
              <div className="space-y-2">
                <Label className="font-technical text-xs uppercase">Category</Label>
                <select value={moveCategory} onChange={(e) => setMoveCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-technical">
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-technical text-xs uppercase">Subfolder (optional)</Label>
                <Input value={moveSubfolder} onChange={(e) => setMoveSubfolder(e.target.value)}
                  list="move-subfolders" placeholder="e.g. Q4 2025" className="font-technical text-sm" />
                <datalist id="move-subfolders">
                  {allSubfoldersForCategory(moveCategory).map(s => <option key={s} value={s} />)}
                </datalist>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDoc(null)} className="font-technical text-xs">CANCEL</Button>
            <Button onClick={handleSaveMove} className="font-technical text-xs">SAVE.MOVE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create share link dialog */}
      <Dialog open={!!shareDialog} onOpenChange={(o) => !o && setShareDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-technical tracking-wider text-sm">CREATE.SHARE.LINK</DialogTitle></DialogHeader>
          {shareDialog && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded border border-border text-xs font-technical">
                <p className="text-muted-foreground">SCOPE: <span className="text-foreground">{shareDialog.scope.toUpperCase()}</span></p>
                {shareDialog.category && <p className="text-muted-foreground mt-1">CATEGORY: <span className="text-foreground">{getCategoryLabel(shareDialog.category)}</span></p>}
                {shareDialog.subfolder && <p className="text-muted-foreground mt-1">SUBFOLDER: <span className="text-foreground">{shareDialog.subfolder}</span></p>}
              </div>
              <div className="space-y-2">
                <Label className="font-technical text-xs uppercase">Label (internal)</Label>
                <Input value={shareDialog.label} onChange={(e) => setShareDialog({ ...shareDialog, label: e.target.value })} className="font-technical text-sm" />
              </div>
              <p className="text-[10px] text-muted-foreground font-technical">Anyone with this link can view the scoped documents without LP approval.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialog(null)} className="font-technical text-xs">CANCEL</Button>
            <Button onClick={createShareLink} className="font-technical text-xs">CREATE & COPY</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share links manager */}
      <Dialog open={shareManagerOpen} onOpenChange={setShareManagerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="font-technical tracking-wider text-sm">SHARE.LINKS</DialogTitle></DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {shareLinks.length === 0 && <p className="text-xs font-technical text-muted-foreground">No share links yet.</p>}
            {shareLinks.map(l => (
              <div key={l.id} className="flex items-center justify-between gap-3 p-3 border border-border rounded">
                <div className="min-w-0">
                  <p className="font-technical text-xs text-foreground truncate">{l.label || l.scope}</p>
                  <p className="text-[10px] font-technical text-muted-foreground">
                    {l.scope.toUpperCase()}
                    {l.category && ` · ${getCategoryLabel(l.category)}`}
                    {l.subfolder && ` / ${l.subfolder}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="font-technical text-[10px]" onClick={() => copyShareUrl(l.token)}>
                    <Copy className="h-3 w-3 mr-1" />COPY
                  </Button>
                  <Button size="sm" variant="outline" className="font-technical text-[10px] text-destructive" onClick={() => deleteShareLink(l.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataRoom;
