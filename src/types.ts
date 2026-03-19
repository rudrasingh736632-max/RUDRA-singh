export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  credits: number;
  is_admin: boolean;
  subscription_tier: string;
  created_at?: string;
  last_credit_reset?: string;
  referral_code?: string;
  referred_by?: string;
  referral_count?: number;
}

export interface Generation {
  id: string;
  userId?: string;
  type: 'voice' | 'image' | 'video' | 'thumbnail' | 'bg-remover' | 'script' | 'sfx' | 'music' | 'story';
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
