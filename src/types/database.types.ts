export type UserRole =
  | 'visitor'
  | 'buyer'
  | 'private_seller'
  | 'pro_seller'
  | 'seller_team'
  | 'courier'
  | 'moderator'
  | 'admin'
  | 'super_admin';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'suspended';

export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'rejected' | 'expired' | 'sold' | 'archived';

export type ListingType = 'sale' | 'rental' | 'service' | 'direct_buy';

export type LeadStatus = 'novo' | 'contactado' | 'em_negociacao' | 'convertido' | 'perdido';

export type OrderStatus = 'pending_payment' | 'paid' | 'preparing' | 'in_transit' | 'delivered' | 'cancelled' | 'refunded';

export type DeliveryStatus = 'pending' | 'preparing' | 'awaiting_pickup' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';

export interface Profile {
  id: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  verification_status: VerificationStatus;
  tax_id?: string; // NIF
  address_street?: string;
  address_postal_code?: string;
  address_city?: string;
  address_district?: string;
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  company_name?: string;
  commercial_name: string;
  slug: string;
  bio?: string;
  logo_url?: string;
  cover_url?: string;
  nif?: string;
  is_company: boolean;
  verified: boolean;
  whatsapp_number?: string;
  website_url?: string;
  rating: number;
  review_count: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  requires_inspection?: boolean;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface CategoryAttribute {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  options?: string[];
  is_required: boolean;
  unit?: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  seller_name?: string;
  seller_is_pro?: boolean;
  seller_verified?: boolean;
  category_id: string;
  category_slug?: string;
  subcategory_id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  price_negotiable: boolean;
  listing_type: ListingType;
  status: ListingStatus;
  is_featured: boolean;
  featured_until?: string;
  
  // Portugal Location
  district: string;
  concelho: string;
  freguesia?: string;
  postal_code?: string;
  
  // Condition & Logistics
  condition?: string; // Novo, Como novo, Bom estado, Usado
  delivery_available: boolean;
  delivery_fee: number;
  
  // Specific for Rentals
  rental_price_daily?: number;
  rental_price_weekly?: number;
  rental_price_monthly?: number;
  rental_deposit?: number;
  
  // Images & Media
  images: string[];
  video_url?: string;
  
  // Dynamic specs
  attributes: Record<string, string | number | boolean>;
  
  // Metrics & Limits
  unique_clicks_count: number;
  impressions_count: number;
  contacts_count: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  code: 'free' | 'premium' | 'business';
  name: string;
  price_monthly: number;
  price_yearly: number;
  max_active_listings: number;
  max_photos_per_listing: number;
  max_unique_clicks_per_month: number;
  max_contacts_per_month: number;
  included_monthly_highlights: number;
  listing_validity_days: number;
  allow_video: boolean;
  team_members_limit: number;
  priority_support: boolean;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  seller_id: string;
  plan_id: string;
  billing_interval: 'monthly' | 'yearly';
  status: 'active' | 'past_due' | 'canceled';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface SubscriptionUsage {
  id: string;
  subscription_id: string;
  seller_id: string;
  cycle_month: string;
  unique_clicks_used: number;
  contacts_used: number;
  active_listings_count: number;
  highlights_used: number;
}

export interface Customer {
  id: string;
  profile_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  customer_type: 'comprador' | 'vendedor_particular' | 'vendedor_pro' | 'concessionaria' | 'imobiliaria';
  total_spent: number;
  total_orders: number;
  total_listings: number;
  tags: string[];
  status: string;
  created_at: string;
}

export interface Lead {
  id: string;
  lead_code: string;
  origin: 'formulario' | 'visita_viatura' | 'visita_imovel' | 'reserva_aluguer' | 'contacto_comercial';
  buyer_id?: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  seller_id?: string;
  seller_name?: string;
  listing_id?: string;
  listing_title?: string;
  status: LeadStatus;
  assigned_admin_id?: string;
  assigned_admin_name?: string;
  deal_value?: number;
  preferred_date?: string;
  notes_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface CrmNote {
  id: string;
  lead_id?: string;
  customer_id?: string;
  author_admin_id: string;
  author_name: string;
  content: string;
  is_private_internal: boolean;
  created_at: string;
}

export interface CrmTask {
  id: string;
  lead_id: string;
  assigned_admin_id: string;
  title: string;
  due_date: string;
  is_completed: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_image: string;
  listing_price: number;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  last_message: string;
  last_message_at: string;
  unread_buyer: boolean;
  unread_seller: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  image_url?: string;
  created_at: string;
  is_read: boolean;
}

export interface OrderItem {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_image: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_method: 'mbway' | 'multibanco' | 'cartao';
  shipping_address: {
    recipient_name: string;
    street: string;
    postal_code: string;
    concelho: string;
    district: string;
    phone: string;
  };
  delivery_tracking_code?: string;
  delivery_status?: DeliveryStatus;
  delivery_partner_name?: string;
  created_at: string;
}

export interface Review {
  id: string;
  seller_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  listing_id?: string;
  rating: number; // 1-5
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface PlatformSettings {
  id: string;
  platform_name: string;
  tagline: string;
  support_email: string;
  support_phone: string;
  currency: string;
  currency_symbol: string;
  default_language: string;
  timezone: string;
  logo_url?: string;
  banner_headline: string;
  banner_subheadline: string;
  commission_percentage: number;
  enable_direct_buy: boolean;
  enable_rentals: boolean;
  enable_external_logistics: boolean;
}

export const PORTUGAL_DISTRICTS = [
  'Lisboa',
  'Porto',
  'Braga',
  'Setúbal',
  'Aveiro',
  'Faro (Algarve)',
  'Coimbra',
  'Leiria',
  'Santarém',
  'Viseu',
  'Viana do Castelo',
  'Vila Real',
  'Castelo Branco',
  'Guarda',
  'Évora',
  'Beja',
  'Bragança',
  'Portalegre',
  'Região Autónoma da Madeira',
  'Região Autónoma dos Açores',
] as const;
