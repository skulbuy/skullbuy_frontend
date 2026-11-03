export type UserRole = 'buyer' | 'seller' | 'ambassador' | 'vendor' | 'admin';
export type VerificationStatus = 'not_verified' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: number | string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  profile_picture?: string;
  phone?: string;
  role: UserRole;
  campus: string;
  campus_name?: string;
  university?: string;
  campus_area?: string;
  matric_no?: string;
  department?: string;
  level_of_study?: string;
  student_id_verified?: VerificationStatus;
  is_verified?: boolean;
  id_card_image?: string;
  points?: number;
  wallet_balance?: number;
  daily_streak?: number;
  longest_streak?: number;
  last_reward_date?: string;
  signup_bonus_claimed?: number;
  has_onboarded?: number;
  created_at?: string;
}

export interface CampusLocation {
  id: number;
  university_id?: number;
  university_code: string;
  name: string;
  campus_type: string;
  state: string;
  city: string;
  lat?: number;
  lng?: number;
  description?: string;
  active: boolean;
}

export interface University {
  id?: number;
  name: string;
  short_name: string;
  city: string;
  state: string;
  student_count: number;
  logo_url?: string;
  type?: 'Federal' | 'State' | 'Private' | string;
  campuses_json?: string;
  campuses?: Array<{ name: string; city: string; state?: string; lat: number; lng: number; campus_type?: string; description?: string }>;
  lat?: number;
  lng?: number;
  status?: string;
}

export interface Meetup {
  id: number;
  title: string;
  description: string;
  category: string;
  university?: string;
  university_code?: string;
  campus_name?: string;
  venue_name?: string;
  state?: string;
  location?: string;
  date_time?: string;
  meetup_date?: string;
  meetup_time?: string;
  image_url?: string;
  organizer_name?: string;
  organizer_role?: string;
  is_featured?: boolean;
  max_participants?: number;
  attendee_count?: number;
  attendees_count?: number;
  is_registered?: boolean;
  has_rsvped?: boolean;
  lat?: number;
  lng?: number;
  distance_km?: number;
  created_at?: string;
}

export interface Order {
  id: number | string;
  order_number?: string;
  buyer_id: number | string;
  seller_id: number | string;
  listing_id: number | string;
  quantity: number;
  total_amount: number;
  fulfilment_type: 'pickup' | 'delivery' | string;
  fulfilment_location?: string;
  fulfilment_address?: string;
  pickup_code?: string;
  payment_method?: string;
  status: 'pending' | 'escrow_locked' | 'completed' | 'cancelled' | string;
  created_at?: string;
}

export interface DailyStreakStatus {
  todayClaimed: boolean;
  streak: number;
  longest_streak: number;
  last_reward_date: string | null;
  today_date: string;
  reward_amount: number;
  history: Array<{
    id: number;
    user_id: number;
    reward_date: string;
    amount: number;
    streak_count: number;
    created_at: string;
  }>;
}

export interface Community {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: 'university' | 'gadgets' | 'hostel' | 'business' | 'deals' | string;
  university: string;
  image_url: string;
  is_official: boolean;
  member_count: number;
  live_member_count?: number;
  is_member?: boolean;
  latest_message?: string;
  latest_message_time?: string;
  created_at: string;
}

export interface CommunityMessage {
  id: number;
  community_id: number;
  user_id: number;
  content: string;
  is_pinned: boolean;
  is_announcement: boolean;
  sender_name: string;
  sender_role: UserRole;
  sender_department?: string;
  sender_verified?: VerificationStatus;
  sender_university?: string;
  created_at: string;
}

export interface CommunityPromotion {
  id: number;
  community_id?: number;
  listing_id: number;
  badge: 'Featured' | 'Sponsored' | 'Student Deal' | 'Verified Vendor';
  discount_label?: string;
  active: boolean;
  listing_title: string;
  listing_price: number;
  listing_image: string;
  listing_condition: 'New' | 'Fairly Used';
  campus_location: string;
  seller_id: number;
  seller_name: string;
  seller_verified?: VerificationStatus;
  seller_university?: string;
}

export interface WalletTransaction {
  id: number;
  user_id: number;
  type: 'credit' | 'debit';
  amount: number;
  reference: string;
  description: string;
  payment_method: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export interface Category {
  id: number | string;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
}

export interface Listing {
  id: number | string;
  seller_id: number | string;
  seller_name: string;
  seller_email?: string;
  seller_phone?: string;
  seller_verified?: VerificationStatus;
  seller_role?: UserRole;
  seller_department?: string;
  seller_area?: string;
  seller_joined?: string;
  category_id: number | string;
  category_name?: string;
  category_slug?: string;
  title: string;
  description: string;
  price: number;
  condition?: 'New' | 'Fairly Used' | string;
  is_negotiable?: boolean;
  is_boosted?: boolean;
  status: 'active' | 'sold' | 'withdrawn' | 'suspended' | string;
  campus?: string;
  campus_location?: string;
  university?: string;
  campus_name?: string;
  image_url: string;
  images?: string[];
  is_rental?: boolean;
  rental_period?: string; // 'per day', 'per week', 'per semester', 'per event'
  lat?: number;
  lng?: number;
  views?: number;
  is_nationwide_fallback?: boolean;
  created_at: string;
}

export interface SkulBoxCycle {
  id: number;
  name: string;
  cycle_month: string;
  close_date: string;
  delivery_window: string;
  status: 'open' | 'closed' | 'fulfilment' | 'completed';
  notes?: string;
}

export interface SkulBoxContribution {
  id: number;
  subscription_id: number;
  user_id: number;
  amount: number;
  payment_method: string;
  payment_reference: string;
  status: string;
  created_at: string;
}

export interface SkulBoxSubscription {
  id: number;
  user_id: number;
  cycle_id: number;
  cycle_name?: string;
  cycle_status?: string;
  close_date?: string;
  delivery_window?: string;
  package_type: '25k' | '50k';
  package_name: string;
  total_amount: number;
  paid_amount: number;
  payment_plan: 'one_time' | 'daily';
  status: 'active' | 'completed' | 'cancelled';
  delivery_location: string;
  created_at: string;
  contributions?: SkulBoxContribution[];
}

export interface Chat {
  id: number;
  listing_id: number;
  listing_title: string;
  listing_price: number;
  listing_image: string;
  listing_status: string;
  buyer_id: number;
  seller_id: number;
  buyer_name: string;
  seller_name: string;
  buyer_area?: string;
  seller_area?: string;
  last_message: string;
  updated_at: string;
}

export interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  offer_amount?: number;
  offer_status?: 'none' | 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  link?: string;
  type: 'info' | 'success' | 'alert' | 'message' | 'reward';
  is_read: boolean;
  created_at: string;
}

export interface PointsLedgerItem {
  id: number;
  user_id: number;
  amount: number;
  reason: string;
  created_at: string;
}

export interface AdminMetrics {
  totalUsers: number;
  verifiedUsers: number;
  pendingVerifications: number;
  activeListings: number;
  soldListings: number;
  pendingReports: number;
  totalSkulboxSubscribers: number;
  totalSkulboxContributions: number;
  reportingDateWAT: string;
}
