export interface User {
  id: number;
  email: string;
  credits: number;
  is_admin: boolean;
  subscription_tier: string;
}

export interface Generation {
  id: number;
  type: 'voice' | 'image' | 'video' | 'thumbnail';
  prompt: string;
  result_url: string;
  credits_used: number;
  created_at: string;
}

export interface SiteSettings {
  primary_color: string;
  accent_color: string;
  hero_headline: string;
  hero_cta: string;
  theme: 'light' | 'dark';
}
