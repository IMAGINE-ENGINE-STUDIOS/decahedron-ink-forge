import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Investor {
  id: string;
  name: string;
  email: string | null;
  commitment: string;
  status: string;
  focus: string[];
  last_contact: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  company: string;
  stage: string;
  amount: string;
  sector: string;
  probability: number;
  lead_partner: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCompany {
  id: string;
  name: string;
  invested: string;
  valuation: string;
  multiple: string;
  status: string;
  sector: string | null;
  investment_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FundStats {
  id: string;
  total_aum: string;
  avg_check_size: string;
  irr: string;
  tvpi: string;
  fund_name: string | null;
  vintage_year: number | null;
  updated_at: string;
}

export const useFundCRM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Investors
  const fetchInvestors = useCallback(async (): Promise<Investor[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('investors')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return (data || []) as Investor[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch investors';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addInvestor = useCallback(async (investor: Omit<Investor, 'id' | 'created_at' | 'updated_at'>): Promise<Investor | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('investors')
        .insert(investor)
        .select()
        .single();

      if (insertError) throw insertError;
      return data as Investor;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add investor';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateInvestor = useCallback(async (id: string, updates: Partial<Investor>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('investors')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update investor';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInvestor = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('investors')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete investor';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deals
  const fetchDeals = useCallback(async (): Promise<Deal[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      return (data || []) as Deal[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch deals';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addDeal = useCallback(async (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at'>): Promise<Deal | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('deals')
        .insert(deal)
        .select()
        .single();

      if (insertError) throw insertError;
      return data as Deal;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add deal';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDeal = useCallback(async (id: string, updates: Partial<Deal>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('deals')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update deal';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDeal = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete deal';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Portfolio Companies
  const fetchPortfolio = useCallback(async (): Promise<PortfolioCompany[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('portfolio_companies')
        .select('*')
        .order('investment_date', { ascending: false });

      if (fetchError) throw fetchError;
      return (data || []) as PortfolioCompany[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch portfolio';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addPortfolioCompany = useCallback(async (company: Omit<PortfolioCompany, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioCompany | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('portfolio_companies')
        .insert(company)
        .select()
        .single();

      if (insertError) throw insertError;
      return data as PortfolioCompany;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add portfolio company';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePortfolioCompany = useCallback(async (id: string, updates: Partial<PortfolioCompany>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('portfolio_companies')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update portfolio company';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePortfolioCompany = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('portfolio_companies')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete portfolio company';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fund Stats
  const fetchFundStats = useCallback(async (): Promise<FundStats | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('fund_stats')
        .select('*')
        .limit(1)
        .single();

      if (fetchError) throw fetchError;
      return data as FundStats;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch fund stats';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFundStats = useCallback(async (updates: Partial<FundStats>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Get the current stats row ID first
      const { data: currentStats } = await supabase
        .from('fund_stats')
        .select('id')
        .limit(1)
        .single();

      if (!currentStats) {
        throw new Error('No fund stats found');
      }

      const { error: updateError } = await supabase
        .from('fund_stats')
        .update(updates)
        .eq('id', currentStats.id);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update fund stats';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    // Investors
    fetchInvestors,
    addInvestor,
    updateInvestor,
    deleteInvestor,
    // Deals
    fetchDeals,
    addDeal,
    updateDeal,
    deleteDeal,
    // Portfolio
    fetchPortfolio,
    addPortfolioCompany,
    updatePortfolioCompany,
    deletePortfolioCompany,
    // Fund Stats
    fetchFundStats,
    updateFundStats,
  };
};
