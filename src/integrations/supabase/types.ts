export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      contacts: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_room_documents: {
        Row: {
          category: string
          created_at: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          subfolder: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          subfolder?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          subfolder?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      data_room_share_links: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          label: string | null
          scope: string
          subfolder: string | null
          token: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          label?: string | null
          scope?: string
          subfolder?: string | null
          token: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          label?: string | null
          scope?: string
          subfolder?: string | null
          token?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          amount: string
          company: string
          created_at: string
          id: string
          lead_partner: string | null
          notes: string | null
          probability: number
          sector: string
          stage: string
          updated_at: string
        }
        Insert: {
          amount?: string
          company: string
          created_at?: string
          id?: string
          lead_partner?: string | null
          notes?: string | null
          probability?: number
          sector: string
          stage?: string
          updated_at?: string
        }
        Update: {
          amount?: string
          company?: string
          created_at?: string
          id?: string
          lead_partner?: string | null
          notes?: string | null
          probability?: number
          sector?: string
          stage?: string
          updated_at?: string
        }
        Relationships: []
      }
      fund_stats: {
        Row: {
          avg_check_size: string
          fund_name: string | null
          id: string
          irr: string
          total_aum: string
          tvpi: string
          updated_at: string
          vintage_year: number | null
        }
        Insert: {
          avg_check_size?: string
          fund_name?: string | null
          id?: string
          irr?: string
          total_aum?: string
          tvpi?: string
          updated_at?: string
          vintage_year?: number | null
        }
        Update: {
          avg_check_size?: string
          fund_name?: string | null
          id?: string
          irr?: string
          total_aum?: string
          tvpi?: string
          updated_at?: string
          vintage_year?: number | null
        }
        Relationships: []
      }
      industry_signals: {
        Row: {
          as_of: string | null
          created_at: string
          fetched_at: string
          id: string
          metric: string
          sector: string
          source: string
          unit: string | null
          updated_at: string
          value: number
          z_score: number | null
        }
        Insert: {
          as_of?: string | null
          created_at?: string
          fetched_at?: string
          id?: string
          metric: string
          sector: string
          source: string
          unit?: string | null
          updated_at?: string
          value: number
          z_score?: number | null
        }
        Update: {
          as_of?: string | null
          created_at?: string
          fetched_at?: string
          id?: string
          metric?: string
          sector?: string
          source?: string
          unit?: string | null
          updated_at?: string
          value?: number
          z_score?: number | null
        }
        Relationships: []
      }
      investors: {
        Row: {
          commitment: string
          created_at: string
          email: string | null
          focus: string[] | null
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          commitment?: string
          created_at?: string
          email?: string | null
          focus?: string[] | null
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          commitment?: string
          created_at?: string
          email?: string | null
          focus?: string[] | null
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      limited_partner_applications: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          investment_amount: string | null
          investment_focus: string[] | null
          job_title: string | null
          message: string | null
          phone: string | null
          pitch_deck_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          investment_amount?: string | null
          investment_focus?: string[] | null
          job_title?: string | null
          message?: string | null
          phone?: string | null
          pitch_deck_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          investment_amount?: string | null
          investment_focus?: string[] | null
          job_title?: string | null
          message?: string | null
          phone?: string | null
          pitch_deck_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      paper_equity_curve: {
        Row: {
          as_of: string
          id: string
          nav: number
          pnl: number
          portfolio_id: string
        }
        Insert: {
          as_of?: string
          id?: string
          nav: number
          pnl: number
          portfolio_id: string
        }
        Update: {
          as_of?: string
          id?: string
          nav?: number
          pnl?: number
          portfolio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_equity_curve_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "paper_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_portfolios: {
        Row: {
          created_at: string
          id: string
          name: string
          nav_current: number
          nav_start: number
          phi_exponent: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          nav_current?: number
          nav_start?: number
          phi_exponent?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          nav_current?: number
          nav_start?: number
          phi_exponent?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      paper_positions: {
        Row: {
          avg_cost: number
          id: string
          last_price: number | null
          market_value: number | null
          portfolio_id: string
          shares: number
          target_weight: number
          ticker: string
          updated_at: string
        }
        Insert: {
          avg_cost?: number
          id?: string
          last_price?: number | null
          market_value?: number | null
          portfolio_id: string
          shares?: number
          target_weight: number
          ticker: string
          updated_at?: string
        }
        Update: {
          avg_cost?: number
          id?: string
          last_price?: number | null
          market_value?: number | null
          portfolio_id?: string
          shares?: number
          target_weight?: number
          ticker?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_positions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "paper_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_trades: {
        Row: {
          executed_at: string
          id: string
          portfolio_id: string
          price: number
          qty: number
          rationale: Json | null
          side: string
          ticker: string
        }
        Insert: {
          executed_at?: string
          id?: string
          portfolio_id: string
          price: number
          qty: number
          rationale?: Json | null
          side: string
          ticker: string
        }
        Update: {
          executed_at?: string
          id?: string
          portfolio_id?: string
          price?: number
          qty?: number
          rationale?: Json | null
          side?: string
          ticker?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_trades_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "paper_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      pitch_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          pitch_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          pitch_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          pitch_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pitch_notes_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      pitches: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          email: string
          founder_name: string
          funding_target: string
          id: string
          pitch_deck_url: string | null
          sector: string
          stage: string
          status: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          email: string
          founder_name: string
          funding_target: string
          id?: string
          pitch_deck_url?: string | null
          sector: string
          stage: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          email?: string
          founder_name?: string
          funding_target?: string
          id?: string
          pitch_deck_url?: string | null
          sector?: string
          stage?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_companies: {
        Row: {
          created_at: string
          id: string
          invested: string
          investment_date: string | null
          multiple: string
          name: string
          notes: string | null
          sector: string | null
          status: string
          updated_at: string
          valuation: string
        }
        Insert: {
          created_at?: string
          id?: string
          invested?: string
          investment_date?: string | null
          multiple?: string
          name: string
          notes?: string | null
          sector?: string | null
          status?: string
          updated_at?: string
          valuation?: string
        }
        Update: {
          created_at?: string
          id?: string
          invested?: string
          investment_date?: string | null
          multiple?: string
          name?: string
          notes?: string | null
          sector?: string | null
          status?: string
          updated_at?: string
          valuation?: string
        }
        Relationships: []
      }
      public_company_scores: {
        Row: {
          cc_total: number | null
          created_at: string
          factor_scores: Json
          fetched_at: string
          id: string
          name: string | null
          sector: string | null
          source_payload: Json | null
          ticker: string
          updated_at: string
        }
        Insert: {
          cc_total?: number | null
          created_at?: string
          factor_scores?: Json
          fetched_at?: string
          id?: string
          name?: string | null
          sector?: string | null
          source_payload?: Json | null
          ticker: string
          updated_at?: string
        }
        Update: {
          cc_total?: number | null
          created_at?: string
          factor_scores?: Json
          fetched_at?: string
          id?: string
          name?: string | null
          sector?: string | null
          source_payload?: Json | null
          ticker?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
