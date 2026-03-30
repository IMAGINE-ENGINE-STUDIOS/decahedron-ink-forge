import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, FileText, Upload, Trash2, Download, Lock, 
  FolderOpen, Building2, Users, FileCheck, Briefcase, File
} from 'lucide-react';

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
        {/* Investment Deck Quick Access */}
        <a
          href="/Decahedron_Ventures_Fund_I.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-5 mb-8 border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-technical text-sm text-foreground tracking-wider">INVESTMENT.PRESENTATION</p>
              <p className="text-xs text-muted-foreground font-technical mt-1">Decahedron Ventures Fund I — Pitch Deck (PDF)</p>
            </div>
          </div>
          <span className="font-technical text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            VIEW.PDF →
          </span>
        </a>

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
