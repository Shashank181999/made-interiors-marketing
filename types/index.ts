export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: 'linkedin' | 'google_maps' | 'website' | 'manual' | 'instagram';
  status: 'new' | 'contacted' | 'opened' | 'clicked' | 'replied' | 'cold';
  notes?: string;
  created_at: string;
  updated_at: string;
  last_contacted?: string;
  email_count: number;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  template_id: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leads_count: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  replied_count: number;
  created_at: string;
  scheduled_at?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'portfolio' | 'follow_up' | 'case_study' | 'offer';
  created_at: string;
}

export interface EmailLog {
  id: string;
  lead_id: string;
  campaign_id?: string;
  template_id: string;
  subject: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'new_lead' | 'no_open_3_days' | 'opened_no_click' | 'no_reply_5_days';
  action: 'send_email' | 'notify' | 'mark_cold';
  template_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_leads: number;
  new_leads_today: number;
  emails_sent_today: number;
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  active_campaigns: number;
}
