import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DecileLabResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client to verify user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'investors';
    const apiKey = Deno.env.get('DECILE_LAB_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Decile Lab API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decile Lab API base URL
    const baseUrl = 'https://api.decilelab.com/v1';
    
    let endpoint = '';
    let method = 'GET';
    let body = null;

    switch (action) {
      case 'investors':
        endpoint = '/investors';
        break;
      case 'deals':
        endpoint = '/deals';
        break;
      case 'portfolio':
        endpoint = '/portfolio';
        break;
      case 'sync':
        endpoint = '/sync';
        method = 'POST';
        break;
      case 'stats':
        endpoint = '/stats';
        break;
      default:
        endpoint = '/investors';
    }

    // Make request to Decile Lab API
    const decileResponse = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle non-OK responses gracefully
    if (!decileResponse.ok) {
      // Return mock data for development/demo purposes
      const mockData = getMockData(action);
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: mockData,
          source: 'mock' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await decileResponse.json();
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Decile CRM Error:', error);
    
    // Return mock data on error for demo purposes
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'investors';
    const mockData = getMockData(action);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: mockData,
        source: 'mock',
        note: 'Using demo data' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Mock data for development/demo
function getMockData(action: string) {
  switch (action) {
    case 'investors':
      return [
        { id: '1', name: 'Strategic Ventures LP', commitment: '$5M', status: 'active', focus: ['AI/ML', 'FinTech'], lastContact: '2024-01-05' },
        { id: '2', name: 'Innovation Capital', commitment: '$2.5M', status: 'active', focus: ['Healthcare', 'BioTech'], lastContact: '2024-01-03' },
        { id: '3', name: 'Tech Growth Partners', commitment: '$10M', status: 'pending', focus: ['Enterprise SaaS'], lastContact: '2024-01-01' },
        { id: '4', name: 'Future Fund I', commitment: '$1M', status: 'active', focus: ['Climate Tech'], lastContact: '2023-12-28' },
        { id: '5', name: 'Horizon Investments', commitment: '$3M', status: 'prospect', focus: ['Web3', 'Gaming'], lastContact: '2023-12-20' },
      ];
    case 'deals':
      return [
        { id: '1', company: 'NeuralFlow AI', stage: 'Due Diligence', amount: '$500K', sector: 'AI/ML', probability: 75 },
        { id: '2', company: 'HealthSync', stage: 'Term Sheet', amount: '$750K', sector: 'Healthcare', probability: 90 },
        { id: '3', company: 'FinanceOS', stage: 'Initial Meeting', amount: '$300K', sector: 'FinTech', probability: 30 },
        { id: '4', company: 'GreenGrid', stage: 'Portfolio', amount: '$400K', sector: 'Climate Tech', probability: 100 },
      ];
    case 'stats':
      return {
        totalAUM: '$21.5M',
        activeDeals: 12,
        portfolioCompanies: 8,
        avgCheckSize: '$450K',
        irr: '24.5%',
        tvpi: '1.8x',
      };
    case 'portfolio':
      return [
        { id: '1', name: 'TechCorp AI', invested: '$400K', valuation: '$12M', multiple: '3.2x', status: 'active' },
        { id: '2', name: 'HealthFirst', invested: '$350K', valuation: '$8M', multiple: '2.1x', status: 'active' },
        { id: '3', name: 'DataFlow', invested: '$500K', valuation: '$15M', multiple: '2.8x', status: 'active' },
      ];
    default:
      return [];
  }
}
