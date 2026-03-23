// Extended domain types for new entities (clients, employees, audit_logs)
// These complement the auto-generated supabase/types.ts

export interface Client {
  id: string
  name: string
  company_address: string | null
  company_phone: string | null
  website: string | null
  primary_contact_name: string | null
  primary_contact_email: string | null
  primary_contact_phone: string | null
  secondary_contact_name: string | null
  secondary_contact_email: string | null
  secondary_contact_phone: string | null
  status: 'active' | 'archived'
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
  archived_at: string | null
  archived_by: string | null
}

export interface Employee {
  id: string
  full_name: string
  email: string
  phone: string | null
  address: string | null
  linkedin_url: string | null
  role_title: string
  role_category: string | null
  seniority: string | null
  start_date: string | null
  employment_type: string | null
  monthly_salary_usd: number | null
  client_id: string
  source_application_id: string | null
  status: 'active' | 'inactive'
  is_archived: boolean
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
  archived_at: string | null
  archived_by: string | null
  // Joined relations (optional)
  clients?: { id: string; name: string } | null
}

export interface ClientNote {
  id: string
  client_id: string
  author_id: string
  content: string
  is_private: boolean | null
  created_at: string
  updated_at: string
  // Joined
  profiles?: { full_name: string | null; email: string } | null
}

export interface AuditLog {
  id: string
  entity_type: string
  entity_id: string
  action: string
  performed_by: string | null
  performed_at: string
  metadata: Record<string, unknown> | null
  // Joined
  profiles?: { full_name: string | null; email: string } | null
}

export interface StatusHistoryEntry {
  id: string
  application_id: string
  from_status: string | null
  to_status: string
  changed_by: string | null
  note: string | null
  created_at: string
  // Joined
  profiles?: { full_name: string | null; email: string } | null
}

export interface HirePayload {
  client_id: string
  role_title: string
  role_category: string
  seniority: string
  start_date: string
  employment_type: string
  monthly_salary_usd: number
}
