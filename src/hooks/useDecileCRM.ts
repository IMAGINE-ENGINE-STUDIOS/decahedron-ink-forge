import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Investor {
  id: string;
  name: string;
  commitment: string;
  status: string;
  focus: string[];
  lastContact: string;
}

export interface Deal {
  id: string;
  company: string;
  stage: string;
  amount: string;
  sector: string;
  probability: number;
}

export interface CRMStats {
  totalAUM: string;
  activeDeals: number;
  portfolioCompanies: number;
  avgCheckSize: string;
  irr: string;
  tvpi: string;
}

export interface PortfolioCompany {
  id: string;
  name: string;
  invested: string;
  valuation: string;
  multiple: string;
  status: string;
}

interface CRMResponse<T> {
  success: boolean;
  data: T;
  source?: string;
  note?: string;
  error?: string;
}

export const useDecileCRM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFromCRM = useCallback(async <T>(action: string): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `https://sugwwemxqozsfccweyxj.supabase.co/functions/v1/decile-crm?action=${action}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CRMResponse<T> = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error(`CRM fetch error (${action}):`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvestors = useCallback(() => fetchFromCRM<Investor[]>('investors'), [fetchFromCRM]);
  const fetchDeals = useCallback(() => fetchFromCRM<Deal[]>('deals'), [fetchFromCRM]);
  const fetchStats = useCallback(() => fetchFromCRM<CRMStats>('stats'), [fetchFromCRM]);
  const fetchPortfolio = useCallback(() => fetchFromCRM<PortfolioCompany[]>('portfolio'), [fetchFromCRM]);

  const syncCRM = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `https://sugwwemxqozsfccweyxj.supabase.co/functions/v1/decile-crm?action=sync`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchInvestors,
    fetchDeals,
    fetchStats,
    fetchPortfolio,
    syncCRM,
  };
};
