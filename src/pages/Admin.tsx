import React from 'react';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

const AdminContent: React.FC = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-technical">AUTHENTICATING...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    const handleSignOut = async () => {
      await signOut();
    };

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-technical text-primary mb-2">[ ACCESS.DENIED ]</h1>
          <p className="text-muted-foreground font-technical mb-6">
            ADMIN.PRIVILEGES.REQUIRED
          </p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-primary text-primary font-technical text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            ← BACK TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

const Admin: React.FC = () => {
  return (
    <AuthProvider>
      <AdminContent />
    </AuthProvider>
  );
};

export default Admin;
