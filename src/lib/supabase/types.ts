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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_notes: {
        Row: {
          application_id: string
          author_id: string
          content: string
          created_at: string
          id: string
          is_private: boolean | null
          updated_at: string
        }
        Insert: {
          application_id: string
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_private?: boolean | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      application_answers: {
        Row: {
          answer_json: Json | null
          answer_text: string | null
          application_id: string
          created_at: string
          id: string
          question_id: string
        }
        Insert: {
          answer_json?: Json | null
          answer_text?: string | null
          application_id: string
          created_at?: string
          id?: string
          question_id: string
        }
        Update: {
          answer_json?: Json | null
          answer_text?: string | null
          application_id?: string
          created_at?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_answers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      application_status_history: {
        Row: {
          application_id: string
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["application_status"] | null
          id: string
          note: string | null
          to_status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          application_id: string
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["application_status"] | null
          id?: string
          note?: string | null
          to_status: Database["public"]["Enums"]["application_status"]
        }
        Update: {
          application_id?: string
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["application_status"] | null
          id?: string
          note?: string | null
          to_status?: Database["public"]["Enums"]["application_status"]
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          address: string | null
          availability: string | null
          cover_letter: string | null
          created_at: string
          email: string
          english_level: string | null
          first_name: string
          github_url: string | null
          headline: string | null
          id: string
          is_latam: boolean | null
          job_id: string
          last_name: string
          linkedin_url: string | null
          phone: string | null
          portfolio_url: string | null
          rating: number | null
          resume_filename: string | null
          resume_url: string | null
          salary_expectation: number | null
          source: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          availability?: string | null
          cover_letter?: string | null
          created_at?: string
          email: string
          english_level?: string | null
          first_name: string
          github_url?: string | null
          headline?: string | null
          id?: string
          is_latam?: boolean | null
          job_id: string
          last_name: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          rating?: number | null
          resume_filename?: string | null
          resume_url?: string | null
          salary_expectation?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          availability?: string | null
          cover_letter?: string | null
          created_at?: string
          email?: string
          english_level?: string | null
          first_name?: string
          github_url?: string | null
          headline?: string | null
          id?: string
          is_latam?: boolean | null
          job_id?: string
          last_name?: string
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          rating?: number | null
          resume_filename?: string | null
          resume_url?: string | null
          salary_expectation?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      job_questions: {
        Row: {
          id: string
          is_active: boolean | null
          is_required: boolean | null
          job_id: string
          question_id: string
          sort_order: number | null
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          job_id: string
          question_id: string
          sort_order?: number | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          job_id?: string
          question_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_questions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_count: number | null
          benefits: string[] | null
          category_id: string
          closed_at: string | null
          contract_type: Database["public"]["Enums"]["job_contract"]
          created_at: string
          created_by: string | null
          department: string | null
          id: string
          location: string
          modality: Database["public"]["Enums"]["job_modality"]
          preferred_qualifications: string[] | null
          published_at: string | null
          requirements: string[]
          responsibilities: string[]
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_period: string | null
          seniority: Database["public"]["Enums"]["job_seniority"]
          show_salary: boolean | null
          slug: string
          status: Database["public"]["Enums"]["job_status"]
          summary: string
          tech_stack: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          application_count?: number | null
          benefits?: string[] | null
          category_id: string
          closed_at?: string | null
          contract_type?: Database["public"]["Enums"]["job_contract"]
          created_at?: string
          created_by?: string | null
          department?: string | null
          id?: string
          location?: string
          modality?: Database["public"]["Enums"]["job_modality"]
          preferred_qualifications?: string[] | null
          published_at?: string | null
          requirements?: string[]
          responsibilities?: string[]
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          seniority?: Database["public"]["Enums"]["job_seniority"]
          show_salary?: boolean | null
          slug: string
          status?: Database["public"]["Enums"]["job_status"]
          summary: string
          tech_stack?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          application_count?: number | null
          benefits?: string[] | null
          category_id?: string
          closed_at?: string | null
          contract_type?: Database["public"]["Enums"]["job_contract"]
          created_at?: string
          created_by?: string | null
          department?: string | null
          id?: string
          location?: string
          modality?: Database["public"]["Enums"]["job_modality"]
          preferred_qualifications?: string[] | null
          published_at?: string | null
          requirements?: string[]
          responsibilities?: string[]
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          seniority?: Database["public"]["Enums"]["job_seniority"]
          show_salary?: boolean | null
          slug?: string
          status?: Database["public"]["Enums"]["job_status"]
          summary?: string
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category_id: string | null
          created_at: string
          helper_text: string | null
          id: string
          is_default: boolean | null
          options: Json | null
          placeholder: string | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          sort_order: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          helper_text?: string | null
          id?: string
          is_default?: boolean | null
          options?: Json | null
          placeholder?: string | null
          question_text: string
          question_type?: Database["public"]["Enums"]["question_type"]
          sort_order?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          helper_text?: string | null
          id?: string
          is_default?: boolean | null
          options?: Json | null
          placeholder?: string | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "job_categories"
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
      application_status:
        | "applied"
        | "screening"
        | "interview"
        | "technical_review"
        | "final_interview"
        | "offer"
        | "hired"
        | "rejected"
        | "withdrawn"
      job_contract:
        | "full_time_contractor"
        | "part_time_contractor"
        | "full_time_employee"
        | "part_time_employee"
      job_modality: "remote" | "hybrid" | "onsite"
      job_seniority: "junior" | "mid" | "senior" | "lead" | "principal"
      job_status: "draft" | "published" | "closed" | "archived"
      question_type:
        | "text"
        | "textarea"
        | "select"
        | "radio"
        | "checkbox"
        | "number"
        | "url"
        | "file"
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
      application_status: [
        "applied",
        "screening",
        "interview",
        "technical_review",
        "final_interview",
        "offer",
        "hired",
        "rejected",
        "withdrawn",
      ],
      job_contract: [
        "full_time_contractor",
        "part_time_contractor",
        "full_time_employee",
        "part_time_employee",
      ],
      job_modality: ["remote", "hybrid", "onsite"],
      job_seniority: ["junior", "mid", "senior", "lead", "principal"],
      job_status: ["draft", "published", "closed", "archived"],
      question_type: [
        "text",
        "textarea",
        "select",
        "radio",
        "checkbox",
        "number",
        "url",
        "file",
      ],
    },
  },
} as const

// ── Convenience type aliases ──────────────────────────────────────────────────
export type Profile         = Database['public']['Tables']['profiles']['Row']
export type Job             = Database['public']['Tables']['jobs']['Row']
export type JobCategory     = Database['public']['Tables']['job_categories']['Row']
export type Question        = Database['public']['Tables']['questions']['Row']
export type JobQuestion     = Database['public']['Tables']['job_questions']['Row']
export type Application     = Database['public']['Tables']['applications']['Row']
export type ApplicationAnswer = Database['public']['Tables']['application_answers']['Row']
export type AdminNote       = Database['public']['Tables']['admin_notes']['Row']
export type StatusHistory   = Database['public']['Tables']['application_status_history']['Row']

export type ApplicationStatus = Database['public']['Enums']['application_status']
export type JobStatus         = Database['public']['Enums']['job_status']
export type JobModality       = Database['public']['Enums']['job_modality']
export type JobSeniority      = Database['public']['Enums']['job_seniority']
export type JobContract       = Database['public']['Enums']['job_contract']
