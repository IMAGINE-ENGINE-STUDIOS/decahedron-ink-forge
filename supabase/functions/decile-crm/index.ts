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

    // If no API key configured, return static fund data
    if (!apiKey) {
      console.log('No DECILE_LAB_API_KEY configured, returning fund data');
      const fundData = getFundData(action);
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: fundData,
          source: 'fund_data' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Decile Lab API base URL - try multiple possible endpoints
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

    try {
      // Make request to Decile Lab API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const decileResponse = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses gracefully
      if (!decileResponse.ok) {
        console.log(`Decile Lab API returned ${decileResponse.status}, using fund data`);
        const fundData = getFundData(action);
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: fundData,
            source: 'fund_data',
            note: 'API unavailable, showing fund data'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const data = await decileResponse.json();
      
      return new Response(
        JSON.stringify({ success: true, data, source: 'decile_api' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (fetchError) {
      console.error('Decile Lab API fetch error:', fetchError);
      // Fall through to fund data
    }

    // Return fund data on any error
    const fundData = getFundData(action);
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: fundData,
        source: 'fund_data',
        note: 'Using fund data' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Decile CRM Error:', error);
    
    // Return fund data on error
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'investors';
    const fundData = getFundData(action);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: fundData,
        source: 'fund_data',
        note: 'Using fund data' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Decahedron Ventures Fund I data - replace with actual fund data
function getFundData(action: string) {
  switch (action) {
    case 'investors':
      return [
        { id: '1', name: 'Decahedron Ventures GP', commitment: '$1.5M', status: 'active', focus: ['AI/ML', 'Enterprise SaaS', 'FinTech'], lastContact: '2026-01-10' },
        { id: '2', name: 'Angel Syndicate I', commitment: '$500K', status: 'active', focus: ['AI/ML', 'Healthcare'], lastContact: '2026-01-08' },
        { id: '3', name: 'Strategic Family Office', commitment: '$750K', status: 'active', focus: ['Climate Tech', 'Enterprise SaaS'], lastContact: '2026-01-05' },
        { id: '4', name: 'Tech Executives Fund', commitment: '$250K', status: 'pending', focus: ['AI/ML', 'Developer Tools'], lastContact: '2026-01-03' },
        { id: '5', name: 'Emerging Markets LP', commitment: '$400K', status: 'prospect', focus: ['FinTech', 'Enterprise SaaS'], lastContact: '2025-12-28' },
      ];
    case 'deals':
      return [
        { id: '1', company: 'TechVenture AI', stage: 'Due Diligence', amount: '$150K', sector: 'AI/ML', probability: 75 },
        { id: '2', company: 'HealthOS Platform', stage: 'Term Sheet', amount: '$200K', sector: 'Healthcare', probability: 90 },
        { id: '3', company: 'FinFlow Systems', stage: 'Initial Meeting', amount: '$100K', sector: 'FinTech', probability: 35 },
        { id: '4', company: 'GreenEnergy Labs', stage: 'Partner Review', amount: '$175K', sector: 'Climate Tech', probability: 60 },
        { id: '5', company: 'DevTools Inc', stage: 'Portfolio', amount: '$125K', sector: 'Developer Tools', probability: 100 },
      ];
    case 'stats':
      return {
        totalAUM: '$3.4M',
        activeDeals: 8,
        portfolioCompanies: 3,
        avgCheckSize: '$150K',
        irr: '18.5%',
        tvpi: '1.4x',
      };
    case 'portfolio':
      return [
        { id: '1', name: 'DevTools Inc', invested: '$125K', valuation: '$2.5M', multiple: '1.6x', status: 'active' },
        { id: '2', name: 'DataSync AI', invested: '$100K', valuation: '$1.8M', multiple: '1.3x', status: 'active' },
        { id: '3', name: 'CloudFirst Platform', invested: '$150K', valuation: '$3.2M', multiple: '1.8x', status: 'active' },
      ];
    default:
      return [];
  }
}
