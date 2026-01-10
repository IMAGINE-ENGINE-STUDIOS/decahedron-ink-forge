-- Create investors table for LP tracking
CREATE TABLE public.investors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    commitment TEXT NOT NULL DEFAULT '$0',
    status TEXT NOT NULL DEFAULT 'prospect',
    focus TEXT[] DEFAULT '{}',
    last_contact TIMESTAMP WITH TIME ZONE DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deals table for pipeline tracking
CREATE TABLE public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'sourcing',
    amount TEXT NOT NULL DEFAULT '$0',
    sector TEXT NOT NULL,
    probability INTEGER NOT NULL DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    lead_partner TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio companies table
CREATE TABLE public.portfolio_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    invested TEXT NOT NULL DEFAULT '$0',
    valuation TEXT NOT NULL DEFAULT '$0',
    multiple TEXT NOT NULL DEFAULT '1.0x',
    status TEXT NOT NULL DEFAULT 'active',
    sector TEXT,
    investment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fund stats table (single row for fund-level metrics)
CREATE TABLE public.fund_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_aum TEXT NOT NULL DEFAULT '$0',
    avg_check_size TEXT NOT NULL DEFAULT '$0',
    irr TEXT NOT NULL DEFAULT '0%',
    tvpi TEXT NOT NULL DEFAULT '1.0x',
    fund_name TEXT DEFAULT 'Fund I',
    vintage_year INTEGER DEFAULT 2024,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_stats ENABLE ROW LEVEL SECURITY;

-- Investors policies (admin only)
CREATE POLICY "Admins can view investors" ON public.investors FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert investors" ON public.investors FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update investors" ON public.investors FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete investors" ON public.investors FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Deals policies (admin only)
CREATE POLICY "Admins can view deals" ON public.deals FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert deals" ON public.deals FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update deals" ON public.deals FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete deals" ON public.deals FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Portfolio companies policies (admin only)
CREATE POLICY "Admins can view portfolio" ON public.portfolio_companies FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert portfolio" ON public.portfolio_companies FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update portfolio" ON public.portfolio_companies FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio" ON public.portfolio_companies FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Fund stats policies (admin only)
CREATE POLICY "Admins can view fund stats" ON public.fund_stats FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert fund stats" ON public.fund_stats FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update fund stats" ON public.fund_stats FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Add updated_at triggers
CREATE TRIGGER update_investors_updated_at BEFORE UPDATE ON public.investors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON public.portfolio_companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fund_stats_updated_at BEFORE UPDATE ON public.fund_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default fund stats row
INSERT INTO public.fund_stats (total_aum, avg_check_size, irr, tvpi, fund_name, vintage_year) 
VALUES ('$0', '$0', '0%', '1.0x', 'Decahedron Ventures Fund I', 2024);