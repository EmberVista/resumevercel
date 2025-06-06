export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          status: string
          stripe_payment_intent_id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: string
          id?: string
          status: string
          stripe_payment_intent_id: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          stripe_customer_id: string | null
          subscription_status: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          stripe_customer_id?: string | null
          subscription_status?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_status?: string
        }
        Relationships: []
      }
      resume_analyses: {
        Row: {
          analysis_result: Json
          ats_score: number
          created_at: string | null
          id: string
          job_description: string | null
          original_filename: string
          original_text: string
          user_id: string | null
        }
        Insert: {
          analysis_result: Json
          ats_score: number
          created_at?: string | null
          id?: string
          job_description?: string | null
          original_filename: string
          original_text: string
          user_id?: string | null
        }
        Update: {
          analysis_result?: Json
          ats_score?: number
          created_at?: string | null
          id?: string
          job_description?: string | null
          original_filename?: string
          original_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_generations: {
        Row: {
          analysis_id: string
          completed_at: string | null
          created_at: string | null
          docx_url: string | null
          generation_model: string | null
          id: string
          pdf_url: string | null
          rewritten_text: string | null
          status: string
          user_id: string
        }
        Insert: {
          analysis_id: string
          completed_at?: string | null
          created_at?: string | null
          docx_url?: string | null
          generation_model?: string | null
          id?: string
          pdf_url?: string | null
          rewritten_text?: string | null
          status?: string
          user_id: string
        }
        Update: {
          analysis_id?: string
          completed_at?: string | null
          created_at?: string | null
          docx_url?: string | null
          generation_model?: string | null
          id?: string
          pdf_url?: string | null
          rewritten_text?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_generations_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "resume_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_generations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const