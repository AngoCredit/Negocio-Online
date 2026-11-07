-- ==============================================================================
-- MARKETPLACE MULTICATEGORIA — MIGRATION 001: INITIAL SCHEMA (POSTGRESQL / SUPABASE)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role_enum AS ENUM (
  'visitor',
  'buyer',
  'private_seller',
  'pro_seller',
  'seller_team',
  'courier',
  'moderator',
  'admin',
  'super_admin'
);

CREATE TYPE listing_status_enum AS ENUM (
  'draft',
  'pending_review',
  'active',
  'rejected',
  'expired',
  'sold',
  'archived'
);

CREATE TYPE listing_type_enum AS ENUM (
  'sale',
  'rental',
  'service',
  'direct_buy'
);

CREATE TYPE lead_status_enum AS ENUM (
  'novo',
  'contactado',
  'em_negociacao',
  'convertido',
  'perdido'
);

CREATE TYPE order_status_enum AS ENUM (
  'pending_payment',
  'paid',
  'preparing',
  'in_transit',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE delivery_status_enum AS ENUM (
  'pending',
  'awaiting_pickup',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed',
  'returned'
);

CREATE TYPE verification_status_enum AS ENUM (
  'unverified',
  'pending',
  'verified',
  'rejected',
  'suspended'
);

-- 2. PLATFORM SETTINGS
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_name TEXT NOT NULL DEFAULT 'MARKETPLACE Portugal',
  tagline TEXT DEFAULT 'A sua plataforma de compra, venda e aluguer em Portugal',
  support_email TEXT DEFAULT 'suporte@marketplace.pt',
  support_phone TEXT DEFAULT '+351 210 000 000',
  currency TEXT NOT NULL DEFAULT 'EUR',
  currency_symbol TEXT NOT NULL DEFAULT '€',
  default_language TEXT NOT NULL DEFAULT 'pt-PT',
  timezone TEXT NOT NULL DEFAULT 'Europe/Lisbon',
  logo_url TEXT,
  banner_headline TEXT DEFAULT 'Descubra milhares de oportunidades em Portugal',
  banner_subheadline TEXT DEFAULT 'De viaturas a imóveis, produtos e serviços perto de si.',
  commission_percentage NUMERIC(5,2) DEFAULT 3.50,
  enable_direct_buy BOOLEAN DEFAULT true,
  enable_rentals BOOLEAN DEFAULT true,
  enable_external_logistics BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES & ROLES
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role user_role_enum NOT NULL DEFAULT 'buyer',
  verification_status verification_status_enum NOT NULL DEFAULT 'unverified',
  tax_id TEXT, -- NIF em Portugal
  address_street TEXT,
  address_postal_code TEXT, -- Formato 0000-000
  address_city TEXT,
  address_district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role_enum NOT NULL,
  assigned_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT,
  commercial_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  logo_url TEXT,
  cover_url TEXT,
  nif TEXT,
  is_company BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  whatsapp_number TEXT,
  website_url TEXT,
  rating NUMERIC(3,2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seller_team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_title TEXT NOT NULL DEFAULT 'Colaborador',
  permissions JSONB DEFAULT '{"manage_listings": true, "manage_orders": true}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES & DYNAMIC ATTRIBUTES
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  requires_inspection BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(category_id, slug)
);

CREATE TABLE category_attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT NOT NULL, -- text, number, select, boolean, date
  options JSONB, -- Array de opções para campos select
  is_required BOOLEAN DEFAULT false,
  unit TEXT, -- e.g. km, cv, m², ml
  sort_order INTEGER DEFAULT 0
);

-- 5. LISTINGS
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  price_negotiable BOOLEAN DEFAULT false,
  listing_type listing_type_enum NOT NULL DEFAULT 'sale',
  status listing_status_enum NOT NULL DEFAULT 'active',
  is_featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMPTZ,
  
  -- Localização em Portugal
  district TEXT NOT NULL, -- Lisboa, Porto, Braga, etc.
  concelho TEXT NOT NULL,
  freguesia TEXT,
  postal_code TEXT,
  
  -- Condição & Logística
  condition TEXT, -- Novo, Como novo, Bom estado, Usado
  delivery_available BOOLEAN DEFAULT false,
  delivery_fee NUMERIC(8,2) DEFAULT 0.00,
  
  -- Aluguer específico
  rental_price_daily NUMERIC(10,2),
  rental_price_weekly NUMERIC(10,2),
  rental_price_monthly NUMERIC(10,2),
  rental_deposit NUMERIC(10,2),
  
  -- Métricas de uso e limites
  unique_clicks_count INTEGER DEFAULT 0,
  impressions_count INTEGER DEFAULT 0,
  contacts_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false
);

CREATE TABLE listing_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT
);

CREATE TABLE listing_attribute_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  attribute_slug TEXT NOT NULL,
  value_text TEXT,
  value_number NUMERIC,
  value_boolean BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, attribute_slug)
);

CREATE TABLE listing_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  visitor_ip_hash TEXT NOT NULL,
  user_agent TEXT,
  clicked_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, visitor_ip_hash, clicked_at)
);

CREATE TABLE listing_impressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  impression_date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 1,
  UNIQUE(listing_id, impression_date)
);

CREATE TABLE listing_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  channel TEXT NOT NULL, -- chat, phone, whatsapp, visit_request
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- 6. PLANS & SUBSCRIPTIONS
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- Free, Premium, Business
  code TEXT NOT NULL UNIQUE,
  price_monthly NUMERIC(8,2) NOT NULL DEFAULT 0.00,
  price_yearly NUMERIC(8,2) NOT NULL DEFAULT 0.00,
  max_active_listings INTEGER NOT NULL,
  max_photos_per_listing INTEGER NOT NULL,
  max_unique_clicks_per_month INTEGER NOT NULL,
  max_contacts_per_month INTEGER NOT NULL,
  included_monthly_highlights INTEGER NOT NULL DEFAULT 0,
  listing_validity_days INTEGER NOT NULL DEFAULT 30,
  allow_video BOOLEAN DEFAULT false,
  team_members_limit INTEGER DEFAULT 1,
  priority_support BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  billing_interval TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  status TEXT NOT NULL DEFAULT 'active', -- active, past_due, canceled
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscription_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cycle_month DATE NOT NULL,
  unique_clicks_used INTEGER DEFAULT 0,
  contacts_used INTEGER DEFAULT 0,
  active_listings_count INTEGER DEFAULT 0,
  highlights_used INTEGER DEFAULT 0,
  UNIQUE(subscription_id, cycle_month)
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  provider TEXT NOT NULL DEFAULT 'mbway_multibanco', -- mbway, multibanco, stripe, eur_transfer
  provider_tx_id TEXT,
  payment_type TEXT NOT NULL, -- subscription, highlight, order
  status TEXT NOT NULL DEFAULT 'completed', -- pending, completed, failed, refunded
  reference_data JSONB, -- entidade / referencia multibanco ou tel mbway
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL UNIQUE,
  nif TEXT,
  customer_name TEXT NOT NULL,
  customer_address TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  vat_amount NUMERIC(10,2) NOT NULL, -- 23% IVA em Portugal continental
  total NUMERIC(10,2) NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EXCLUSIVE SUPER ADMIN CRM MODULE
-- REGRA ABSOLUTA: Vendedores e Compradores NÃO têm acesso a estas tabelas!
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  customer_type TEXT NOT NULL, -- comprador, vendedor_particular, vendedor_pro, concessionaria, imobiliaria
  total_spent NUMERIC(12,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  total_listings INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_code TEXT NOT NULL UNIQUE,
  origin TEXT NOT NULL, -- formulario, visita_viatura, visita_imovel, reserva_aluguer, contacto_comercial
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  status lead_status_enum NOT NULL DEFAULT 'novo',
  assigned_admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  deal_value NUMERIC(12,2),
  preferred_date TIMESTAMPTZ,
  notes_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  author_admin_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_private_internal BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  assigned_admin_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES profiles(id),
  activity_type TEXT NOT NULL, -- chamada, email, reuniao, mudanca_etapa, nota
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INTERNAL CHAT & MESSAGING
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SHOPPING CART, ORDERS & CHECKOUT
CREATE TABLE shopping_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES shopping_carts(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, listing_id)
);

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Principal',
  recipient_name TEXT NOT NULL,
  street TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  concelho TEXT NOT NULL,
  district TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  seller_id UUID NOT NULL REFERENCES profiles(id),
  status order_status_enum NOT NULL DEFAULT 'paid',
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_fee NUMERIC(8,2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(8,2) DEFAULT 0.00,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- mbway, multibanco, cartao
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id),
  listing_title TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(10,2) NOT NULL
);

-- 10. LOGISTICS & DELIVERIES
CREATE TABLE delivery_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- CTT Expresso, DPD Portugal, MRW, In-House
  code TEXT NOT NULL UNIQUE,
  api_endpoint TEXT,
  is_active BOOLEAN DEFAULT true,
  tracking_url_template TEXT
);

CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  delivery_partner_id UUID REFERENCES delivery_partners(id),
  courier_id UUID REFERENCES profiles(id),
  tracking_code TEXT NOT NULL UNIQUE,
  status delivery_status_enum NOT NULL DEFAULT 'pending',
  pickup_address JSONB NOT NULL,
  delivery_address JSONB NOT NULL,
  estimated_delivery_date TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. REVIEWS & VERIFICATIONS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- cc_portugal, certidao_comercial, comprovativo_morada
  document_url TEXT NOT NULL,
  status verification_status_enum NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS, NOTIFICATIONS & CONSENT
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- message, lead, order, plan_limit, verification
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  terms_accepted BOOLEAN NOT NULL DEFAULT true,
  privacy_accepted BOOLEAN NOT NULL DEFAULT true,
  marketing_accepted BOOLEAN NOT NULL DEFAULT false,
  cookies_analytics BOOLEAN NOT NULL DEFAULT true,
  accepted_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX idx_listings_category ON listings(category_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_district ON listings(district);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_created ON listings(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned ON leads(assigned_admin_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_seller ON orders(seller_id);
