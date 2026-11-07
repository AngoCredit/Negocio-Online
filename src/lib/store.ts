import {
  Profile,
  SellerProfile,
  Category,
  Listing,
  Plan,
  Subscription,
  SubscriptionUsage,
  Lead,
  LeadStatus,
  CrmNote,
  CrmTask,
  Conversation,
  Message,
  Order,
  Review,
  PlatformSettings,
  UserRole,
} from '../types/database.types';

const INITIAL_SETTINGS: PlatformSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  platform_name: 'MARKETPLACE Portugal',
  tagline: 'A sua plataforma nacional de compra, venda e aluguer',
  support_email: 'suporte@marketplace.pt',
  support_phone: '+351 210 999 888',
  currency: 'EUR',
  currency_symbol: '€',
  default_language: 'pt-PT',
  timezone: 'Europe/Lisbon',
  banner_headline: 'Compre, Venda e Alugue em Portugal',
  banner_subheadline: 'Milhares de viaturas, imóveis, serviços e produtos verificados de particulares e empresas.',
  commission_percentage: 3.5,
  enable_direct_buy: true,
  enable_rentals: true,
  enable_external_logistics: true,
};

const INITIAL_PLANS: Plan[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    code: 'free',
    name: 'Plano FREE',
    price_monthly: 0,
    price_yearly: 0,
    max_active_listings: 2,
    max_photos_per_listing: 3,
    max_unique_clicks_per_month: 5,
    max_contacts_per_month: 5,
    included_monthly_highlights: 0,
    listing_validity_days: 15,
    allow_video: false,
    team_members_limit: 1,
    priority_support: false,
    is_active: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    code: 'premium',
    name: 'Plano PREMIUM',
    price_monthly: 19.90,
    price_yearly: 199.00,
    max_active_listings: 20,
    max_photos_per_listing: 10,
    max_unique_clicks_per_month: 500,
    max_contacts_per_month: 100,
    included_monthly_highlights: 2,
    listing_validity_days: 30,
    allow_video: true,
    team_members_limit: 3,
    priority_support: false,
    is_active: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    code: 'business',
    name: 'Plano BUSINESS',
    price_monthly: 49.90,
    price_yearly: 499.00,
    max_active_listings: 100,
    max_photos_per_listing: 20,
    max_unique_clicks_per_month: 2000,
    max_contacts_per_month: 500,
    included_monthly_highlights: 10,
    listing_validity_days: 30,
    allow_video: true,
    team_members_limit: 10,
    priority_support: true,
    is_active: true,
  },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Viaturas', slug: 'viaturas', icon: 'Car', sort_order: 1, is_active: true, description: 'Carros, motas, comerciais e barcos' },
  { id: 'cat-2', name: 'Casas e Imóveis', slug: 'imoveis', icon: 'Home', sort_order: 2, is_active: true, description: 'Apartamentos, moradias e terrenos' },
  { id: 'cat-3', name: 'Alugueres', slug: 'alugueres', icon: 'Calendar', sort_order: 3, is_active: true, description: 'Aluguer diário, semanal ou mensal' },
  { id: 'cat-4', name: 'Cosméticos e Beleza', slug: 'cosmeticos', icon: 'Sparkles', sort_order: 4, is_active: true, description: 'Perfumaria, cuidados de pele e cabelo' },
  { id: 'cat-5', name: 'Eletrónica e Informática', slug: 'eletronica', icon: 'Laptop', sort_order: 5, is_active: true, description: 'Smartphones, computadores e gadgets' },
  { id: 'cat-6', name: 'Casa e Jardim', slug: 'casa-jardim', icon: 'Flower2', sort_order: 6, is_active: true, description: 'Ferramentas, plantas e exteriores' },
  { id: 'cat-7', name: 'Mobiliário', slug: 'mobiliario', icon: 'Armchair', sort_order: 7, is_active: true, description: 'Sofás, camas e arrumação' },
  { id: 'cat-8', name: 'Eletrodomésticos', slug: 'eletrodomesticos', icon: 'Tv', sort_order: 8, is_active: true, description: 'Frigoríficos, máquinas e cozinha' },
  { id: 'cat-9', name: 'Moda e Acessórios', slug: 'moda', icon: 'Shirt', sort_order: 9, is_active: true, description: 'Roupas, calçado e malas' },
  { id: 'cat-10', name: 'Desporto e Lazer', slug: 'desporto', icon: 'Bike', sort_order: 10, is_active: true, description: 'Bicicletas, camping e fitness' },
  { id: 'cat-11', name: 'Serviços', slug: 'servicos', icon: 'Wrench', sort_order: 11, is_active: true, description: 'Obras, aulas, reparações' },
  { id: 'cat-12', name: 'Diversos', slug: 'diversos', icon: 'Package', sort_order: 12, is_active: true, description: 'Livros, arte e colecionáveis' },
];

const INITIAL_USERS: Profile[] = [
  {
    id: 'user-admin',
    full_name: 'António Ribeiro (Super Admin)',
    email: 'admin@marketplace.pt',
    phone: '+351 912 345 678',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'super_admin',
    verification_status: 'verified',
    tax_id: 'PT509123456',
    address_district: 'Lisboa',
    address_city: 'Lisboa',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-01-10T09:00:00Z',
  },
  {
    id: 'user-pro-seller',
    full_name: 'AutoPremium Concessionária',
    email: 'vendas@autopremium.pt',
    phone: '+351 925 111 222',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    role: 'pro_seller',
    verification_status: 'verified',
    tax_id: 'PT514987654',
    address_district: 'Porto',
    address_city: 'Matosinhos',
    created_at: '2026-01-15T11:00:00Z',
    updated_at: '2026-01-15T11:00:00Z',
  },
  {
    id: 'user-seller-private',
    full_name: 'João Pedro Santos',
    email: 'joao.santos@email.pt',
    phone: '+351 933 444 555',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'private_seller',
    verification_status: 'verified',
    tax_id: 'PT234567890',
    address_district: 'Braga',
    address_city: 'Braga',
    created_at: '2026-02-01T14:00:00Z',
    updated_at: '2026-02-01T14:00:00Z',
  },
  {
    id: 'user-buyer',
    full_name: 'Mariana Duarte',
    email: 'mariana.duarte@email.pt',
    phone: '+351 961 777 888',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'buyer',
    verification_status: 'verified',
    address_district: 'Lisboa',
    address_city: 'Cascais',
    created_at: '2026-02-10T16:00:00Z',
    updated_at: '2026-02-10T16:00:00Z',
  },
  {
    id: 'user-courier',
    full_name: 'Ricardo Neves (Estafeta)',
    email: 'estafeta@marketplace.pt',
    phone: '+351 919 000 111',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'courier',
    verification_status: 'verified',
    address_district: 'Lisboa',
    address_city: 'Lisboa',
    created_at: '2026-02-12T10:00:00Z',
    updated_at: '2026-02-12T10:00:00Z',
  },
];

const INITIAL_SELLER_PROFILES: SellerProfile[] = [
  {
    id: 'sp-1',
    user_id: 'user-pro-seller',
    commercial_name: 'AutoPremium Concessionária Matosinhos',
    company_name: 'AutoPremium Comércio de Automóveis Lda',
    slug: 'autopremium-matosinhos',
    bio: 'Mais de 15 anos no mercado com viaturas rigorosamente selecionadas, revisões na marca e garantia de 36 meses.',
    nif: '514987654',
    is_company: true,
    verified: true,
    whatsapp_number: '+351925111222',
    website_url: 'https://autopremium.pt',
    rating: 4.9,
    review_count: 38,
    created_at: '2026-01-15T11:00:00Z',
  },
  {
    id: 'sp-2',
    user_id: 'user-seller-private',
    commercial_name: 'João Pedro Santos (Particular)',
    slug: 'joao-pedro-santos',
    bio: 'Venda de artigos pessoais em excelente estado de conservação.',
    is_company: false,
    verified: true,
    whatsapp_number: '+351933444555',
    rating: 5.0,
    review_count: 7,
    created_at: '2026-02-01T14:00:00Z',
  },
];

const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'list-1',
    seller_id: 'user-pro-seller',
    seller_name: 'AutoPremium Matosinhos',
    seller_is_pro: true,
    seller_verified: true,
    category_id: 'cat-1',
    category_slug: 'viaturas',
    title: 'Mercedes-Benz A 180 d AMG Line Pack Noite Auto',
    slug: 'mercedes-benz-a180d-amg-line-2021',
    description: 'Viatura nacional em estado irrepreensível, com histórico completo na marca. Pack Desportivo AMG Line exterior e interior, Jantes 18", Faróis LED High Performance, Sistema MBUX com navegação em realidade aumentada, sensores 360º com câmara de marcha-atrás. Garantia total de 24 meses.',
    price: 26850,
    price_negotiable: true,
    listing_type: 'sale',
    status: 'active',
    is_featured: true,
    district: 'Porto',
    concelho: 'Matosinhos',
    condition: 'Como novo',
    delivery_available: true,
    delivery_fee: 150,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    ],
    attributes: {
      brand: 'Mercedes-Benz',
      model: 'Classe A 180 d',
      year: 2021,
      km: 56200,
      fuel: 'Diesel',
      gearbox: 'Automática 7G-DCT',
      power_cv: 116,
      body_type: 'Hatchback',
    },
    unique_clicks_count: 242,
    impressions_count: 1420,
    contacts_count: 18,
    expires_at: '2026-12-31T23:59:59Z',
    created_at: '2026-10-15T10:00:00Z',
    updated_at: '2026-10-15T10:00:00Z',
  },
  {
    id: 'list-2',
    seller_id: 'user-admin',
    seller_name: 'Imobiliária Prime Lisbon',
    seller_is_pro: true,
    seller_verified: true,
    category_id: 'cat-2',
    category_slug: 'imoveis',
    title: 'Apartamento T3 Renovado com Terraço Privativo — Parque das Nações',
    slug: 'apartamento-t3-parque-das-nacoes-lisboa',
    description: 'Excecional apartamento T3 no Parque das Nações com vista panorâmica sobre o Rio Tejo. Área bruta de 168m² mais terraço privativo de 42m². Cozinha totalmente equipada com eletrodomésticos Bosch classe A+++, suíte principal com closet, 2 lugares de garagem e arrecadação. Edifício moderno com 2 elevadores e segurança 24h.',
    price: 685000,
    price_negotiable: false,
    listing_type: 'sale',
    status: 'active',
    is_featured: true,
    district: 'Lisboa',
    concelho: 'Lisboa',
    freguesia: 'Parque das Nações',
    condition: 'Como novo',
    delivery_available: false,
    delivery_fee: 0,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    ],
    attributes: {
      property_type: 'Apartamento',
      typology: 'T3',
      area_m2: 168,
      bedrooms: 3,
      bathrooms: 2,
      energy_certificate: 'A',
      transaction_type: 'Venda',
      parking_spaces: 2,
    },
    unique_clicks_count: 489,
    impressions_count: 3120,
    contacts_count: 34,
    expires_at: '2026-12-31T23:59:59Z',
    created_at: '2026-10-18T14:30:00Z',
    updated_at: '2026-10-18T14:30:00Z',
  },
  {
    id: 'list-3',
    seller_id: 'user-seller-private',
    seller_name: 'João Pedro Santos',
    seller_is_pro: false,
    seller_verified: true,
    category_id: 'cat-3',
    category_slug: 'alugueres',
    title: 'Autocaravana Fiat Ducato 4 Lugares — Pronta para Roadtrip Portugal',
    slug: 'aluguer-autocaravana-fiat-ducato-algarve',
    description: 'Alugue a autocaravana ideal para descobrir as praias da Costa Vicentina e serras de Portugal. 4 lugares de viagem e dormida, cama de casal fixa + cama basculante, painel solar, depósito água 120L, casa de banho com duche quente independente, cozinha com frigorífico grande e fogão. Inclui mesa exterior e 4 cadeiras.',
    price: 95,
    price_negotiable: false,
    listing_type: 'rental',
    status: 'active',
    is_featured: true,
    district: 'Faro (Algarve)',
    concelho: 'Faro',
    condition: 'Excelente estado',
    delivery_available: false,
    delivery_fee: 0,
    rental_price_daily: 95,
    rental_price_weekly: 590,
    rental_price_monthly: 1950,
    rental_deposit: 800,
    images: [
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513311068348-19c8fbdc0bb6?auto=format&fit=crop&w=1000&q=80',
    ],
    attributes: {
      equipment_type: 'Autocaravana Perfilada',
      capacity_people: 4,
      fuel: 'Diesel',
      included_km_per_day: '200 km/dia',
      min_days: 3,
    },
    unique_clicks_count: 180,
    impressions_count: 980,
    contacts_count: 12,
    expires_at: '2026-12-31T23:59:59Z',
    created_at: '2026-10-20T09:15:00Z',
    updated_at: '2026-10-20T09:15:00Z',
  },
  {
    id: 'list-4',
    seller_id: 'user-seller-private',
    seller_name: 'João Pedro Santos',
    seller_is_pro: false,
    seller_verified: true,
    category_id: 'cat-4',
    category_slug: 'cosmeticos',
    title: 'Kit Anti-Idade Sérum Reparador Botânico 50ml + Creme Rico Noturno',
    slug: 'kit-anti-idade-serum-reparador-botanico',
    description: 'Novo e selado de fábrica. Fórmula vegan com ácido hialurónico triplo e esqualano vegetal para hidratação intensiva e redução de linhas finas. Ideal para peles secas a maduras. Fabricado em laboratório certificado europeu.',
    price: 49.90,
    price_negotiable: false,
    listing_type: 'direct_buy',
    status: 'active',
    is_featured: false,
    district: 'Braga',
    concelho: 'Braga',
    condition: 'Novo',
    delivery_available: true,
    delivery_fee: 3.90,
    images: [
      'https://images.unsplash.com/photo-1608248597359-52e6f43e5c70?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    ],
    attributes: {
      brand: 'Botanical Lab PT',
      volume_ml: '50ml + 50ml',
      product_type: 'Tratamento de Rosto',
      skin_type: 'Todos os tipos',
      expiry_date: '2027-11',
    },
    unique_clicks_count: 67,
    impressions_count: 530,
    contacts_count: 5,
    expires_at: '2026-12-31T23:59:59Z',
    created_at: '2026-10-22T11:00:00Z',
    updated_at: '2026-10-22T11:00:00Z',
  },
  {
    id: 'list-5',
    seller_id: 'user-pro-seller',
    seller_name: 'TechStore Lisboa',
    seller_is_pro: true,
    seller_verified: true,
    category_id: 'cat-5',
    category_slug: 'eletronica',
    title: 'Apple MacBook Pro 14" M3 Pro 18GB RAM 512GB SSD Space Black',
    slug: 'apple-macbook-pro-14-m3-pro-18gb-512gb',
    description: 'Portátil em estado imaculado, bateria a 98% de saúde com apenas 34 ciclos. Inclui caixa original com todos os acessórios e fatura com garantia Apple válida em Portugal. Ecrã Liquid Retina XDR de 120Hz.',
    price: 1890,
    price_negotiable: false,
    listing_type: 'direct_buy',
    status: 'active',
    is_featured: true,
    district: 'Lisboa',
    concelho: 'Lisboa',
    condition: 'Como novo',
    delivery_available: true,
    delivery_fee: 6.50,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
    ],
    attributes: {
      brand: 'Apple',
      processor: 'Apple M3 Pro',
      ram_gb: 18,
      storage_ssd: '512GB',
      screen_size: '14.2 polegadas',
    },
    unique_clicks_count: 310,
    impressions_count: 2200,
    contacts_count: 24,
    expires_at: '2026-12-31T23:59:59Z',
    created_at: '2026-10-24T18:00:00Z',
    updated_at: '2026-10-24T18:00:00Z',
  },
  {
    id: 'list-6',
    seller_id: 'user-seller-private',
    seller_name: 'João Pedro Santos',
    seller_is_pro: false,
    seller_verified: true,
    category_id: 'cat-7',
    category_slug: 'mobiliario',
    title: 'Sofá Chaiselongue 3 Lugares Tecido Antimancha Cinza Claro',
    slug: 'sofa-chaiselongue-3-lugares-cinza',
    description: 'Sofá moderno e muito confortável com chaiselongue reversível. Tecido impermeável e fácil de limpar. Dimensões: 260cm x 160cm. Menos de 1 ano de uso, sem nódoas ou desgaste.',
    price: 420,
    price_negotiable: true,
    listing_type: 'sale',
    status: 'active',
    is_featured: false,
    district: 'Coimbra',
    concelho: 'Coimbra',
    condition: 'Como novo',
    delivery_available: true,
    delivery_fee: 30.00,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    ],
    attributes: {
      material: 'Tecido Antimancha',
      seats: 3,
      color: 'Cinza Claro',
      dimensions: '260x160x90 cm',
    },
    unique_clicks_count: 94,
    impressions_count: 610,
    contacts_count: 8,
    expires_at: '2026-12-31T23:59:59Z',
    created_at: '2026-10-26T12:00:00Z',
    updated_at: '2026-10-26T12:00:00Z',
  },
];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    seller_id: 'user-pro-seller',
    plan_id: '33333333-3333-3333-3333-333333333333', // Business
    billing_interval: 'monthly',
    status: 'active',
    current_period_start: '2026-10-01T00:00:00Z',
    current_period_end: '2026-11-30T23:59:59Z',
    cancel_at_period_end: false,
  },
  {
    id: 'sub-2',
    seller_id: 'user-seller-private',
    plan_id: '11111111-1111-1111-1111-111111111111', // Free
    billing_interval: 'monthly',
    status: 'active',
    current_period_start: '2026-10-01T00:00:00Z',
    current_period_end: '2026-11-15T23:59:59Z',
    cancel_at_period_end: false,
  },
];

const INITIAL_USAGE: SubscriptionUsage[] = [
  {
    id: 'usage-1',
    subscription_id: 'sub-1',
    seller_id: 'user-pro-seller',
    cycle_month: '2026-11-01',
    unique_clicks_used: 552,
    contacts_used: 42,
    active_listings_count: 2,
    highlights_used: 2,
  },
  {
    id: 'usage-2',
    subscription_id: 'sub-2',
    seller_id: 'user-seller-private',
    cycle_month: '2026-11-01',
    unique_clicks_used: 3,
    contacts_used: 2,
    active_listings_count: 3,
    highlights_used: 0,
  },
];

// CRM EXCLUSIVO DO SUPER ADMIN
const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    lead_code: 'LEAD-2026-001',
    origin: 'visita_viatura',
    buyer_id: 'user-buyer',
    buyer_name: 'Mariana Duarte',
    buyer_email: 'mariana.duarte@email.pt',
    buyer_phone: '+351 961 777 888',
    seller_id: 'user-pro-seller',
    seller_name: 'AutoPremium Matosinhos',
    listing_id: 'list-1',
    listing_title: 'Mercedes-Benz A 180 d AMG Line',
    status: 'em_negociacao',
    assigned_admin_id: 'user-admin',
    assigned_admin_name: 'António Ribeiro',
    deal_value: 26850,
    preferred_date: '2026-11-05T15:00:00Z',
    notes_summary: 'Cliente muito interessada. Solicitou simulação de financiamento a 84 meses e retoma de Renault Clio 2018.',
    created_at: '2026-10-28T14:10:00Z',
    updated_at: '2026-11-01T10:30:00Z',
  },
  {
    id: 'lead-2',
    lead_code: 'LEAD-2026-002',
    origin: 'visita_imovel',
    buyer_id: 'user-buyer',
    buyer_name: 'Mariana Duarte',
    buyer_email: 'mariana.duarte@email.pt',
    buyer_phone: '+351 961 777 888',
    seller_id: 'user-admin',
    seller_name: 'Imobiliária Prime Lisbon',
    listing_id: 'list-2',
    listing_title: 'Apartamento T3 Parque das Nações',
    status: 'contactado',
    assigned_admin_id: 'user-admin',
    assigned_admin_name: 'António Ribeiro',
    deal_value: 685000,
    preferred_date: '2026-11-08T11:00:00Z',
    notes_summary: 'Visita agendada para sábado de manhã com o cônjuge. Pré-aprovação bancária já emitida pelo BPI.',
    created_at: '2026-10-29T16:45:00Z',
    updated_at: '2026-10-30T09:20:00Z',
  },
  {
    id: 'lead-3',
    lead_code: 'LEAD-2026-003',
    origin: 'reserva_aluguer',
    buyer_name: 'Gonçalo Pires',
    buyer_email: 'goncalo.pires@gmail.com',
    buyer_phone: '+351 918 222 333',
    seller_id: 'user-seller-private',
    seller_name: 'João Pedro Santos',
    listing_id: 'list-3',
    listing_title: 'Autocaravana Fiat Ducato 4 Lugares',
    status: 'novo',
    assigned_admin_id: 'user-admin',
    assigned_admin_name: 'António Ribeiro',
    deal_value: 665,
    preferred_date: '2026-11-14T09:00:00Z',
    notes_summary: 'Pretende alugar por 7 dias para circuito pelo Alentejo litoral. A aguardar envio de documento de identificação.',
    created_at: '2026-11-01T18:00:00Z',
    updated_at: '2026-11-01T18:00:00Z',
  },
  {
    id: 'lead-4',
    lead_code: 'LEAD-2026-004',
    origin: 'contacto_comercial',
    buyer_name: 'Pedro Alvim',
    buyer_email: 'pedro.alvim@empresa.pt',
    buyer_phone: '+351 922 444 666',
    status: 'convertido',
    assigned_admin_id: 'user-admin',
    assigned_admin_name: 'António Ribeiro',
    deal_value: 499,
    notes_summary: 'Subscrição anual do Plano Business fechada e faturada.',
    created_at: '2026-10-10T11:00:00Z',
    updated_at: '2026-10-15T15:00:00Z',
  },
];

const INITIAL_CRM_NOTES: CrmNote[] = [
  {
    id: 'note-1',
    lead_id: 'lead-1',
    author_admin_id: 'user-admin',
    author_name: 'António Ribeiro (Admin)',
    content: 'Contactei a cliente por telefone às 10h. Mostrou grande interesse. Encaminhei os dados da retoma para peritagem na concessionária.',
    is_private_internal: true,
    created_at: '2026-10-30T10:15:00Z',
  },
  {
    id: 'note-2',
    lead_id: 'lead-2',
    author_admin_id: 'user-admin',
    author_name: 'António Ribeiro (Admin)',
    content: 'Confirmada a visita com o proprietário do imóvel para dia 8. Certificado energético e planta enviados por email.',
    is_private_internal: true,
    created_at: '2026-10-31T17:30:00Z',
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    listing_id: 'list-5',
    listing_title: 'Apple MacBook Pro 14" M3 Pro',
    listing_image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80',
    listing_price: 1890,
    buyer_id: 'user-buyer',
    buyer_name: 'Mariana Duarte',
    seller_id: 'user-pro-seller',
    seller_name: 'TechStore Lisboa',
    last_message: 'Bom dia! O portátil ainda tem fatura com IVA discriminado?',
    last_message_at: '2026-11-01T16:20:00Z',
    unread_buyer: false,
    unread_seller: true,
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_id: 'user-buyer',
    sender_name: 'Mariana Duarte',
    content: 'Olá! Tenho muito interesse no MacBook. Está em perfeito estado visual?',
    created_at: '2026-11-01T15:30:00Z',
    is_read: true,
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-1',
    sender_id: 'user-pro-seller',
    sender_name: 'TechStore Lisboa',
    content: 'Boa tarde Mariana! Sim, sem qualquer risco nem marcas. Como novo na caixa.',
    created_at: '2026-11-01T15:45:00Z',
    is_read: true,
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-1',
    sender_id: 'user-buyer',
    sender_name: 'Mariana Duarte',
    content: 'Bom dia! O portátil ainda tem fatura com IVA discriminado?',
    created_at: '2026-11-01T16:20:00Z',
    is_read: false,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    order_number: 'PT-2026-8812',
    buyer_id: 'user-buyer',
    buyer_name: 'Mariana Duarte',
    seller_id: 'user-seller-private',
    seller_name: 'João Pedro Santos',
    status: 'paid',
    items: [
      {
        id: 'item-1',
        listing_id: 'list-4',
        listing_title: 'Kit Anti-Idade Sérum Reparador Botânico',
        listing_image: 'https://images.unsplash.com/photo-1608248597359-52e6f43e5c70?auto=format&fit=crop&w=200&q=80',
        unit_price: 49.90,
        quantity: 1,
        total_price: 49.90,
      },
    ],
    subtotal: 49.90,
    shipping_fee: 3.90,
    total: 53.80,
    payment_method: 'mbway',
    shipping_address: {
      recipient_name: 'Mariana Duarte',
      street: 'Avenida da Liberdade 120, 3º Dto',
      postal_code: '1250-142',
      concelho: 'Lisboa',
      district: 'Lisboa',
      phone: '+351 961 777 888',
    },
    delivery_tracking_code: 'CTT-PT-99881122',
    delivery_status: 'in_transit',
    delivery_partner_name: 'CTT Expresso',
    created_at: '2026-10-30T11:20:00Z',
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    seller_id: 'user-pro-seller',
    author_id: 'user-buyer',
    author_name: 'Carlos Oliveira',
    author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'Comprei uma viatura aqui e todo o processo foi 5 estrelas! Transparência total e entrega pontual.',
    is_verified_purchase: true,
    created_at: '2026-10-12T14:00:00Z',
  },
];

// Helper to load or persist into localStorage
class LocalStore {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`mkt_pt_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`mkt_pt_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage quota exceeded or unavailable', e);
    }
  }

  // Current session & auth
  getCurrentUser(): Profile {
    return this.get<Profile>('current_user', INITIAL_USERS[0]); // Defaults to super_admin for testing
  }

  setCurrentUser(user: Profile): void {
    this.set('current_user', user);
  }

  getAllUsers(): Profile[] {
    return this.get<Profile[]>('users', INITIAL_USERS);
  }

  getPlatformSettings(): PlatformSettings {
    return this.get<PlatformSettings>('settings', INITIAL_SETTINGS);
  }

  savePlatformSettings(settings: PlatformSettings): void {
    this.set('settings', settings);
  }

  getCategories(): Category[] {
    return this.get<Category[]>('categories', INITIAL_CATEGORIES);
  }

  saveCategory(cat: Category): void {
    const list = this.getCategories();
    const idx = list.findIndex(c => c.id === cat.id);
    if (idx >= 0) list[idx] = cat;
    else list.push(cat);
    this.set('categories', list);
  }

  deleteCategory(id: string): void {
    const list = this.getCategories().filter(c => c.id !== id);
    this.set('categories', list);
  }

  getPlans(): Plan[] {
    return this.get<Plan[]>('plans', INITIAL_PLANS);
  }

  savePlan(plan: Plan): void {
    const list = this.getPlans();
    const idx = list.findIndex(p => p.id === plan.id);
    if (idx >= 0) list[idx] = plan;
    else list.push(plan);
    this.set('plans', list);
  }

  getListings(): Listing[] {
    return this.get<Listing[]>('listings', INITIAL_LISTINGS);
  }

  saveListing(listing: Listing): void {
    const list = this.getListings();
    const idx = list.findIndex(l => l.id === listing.id);
    if (idx >= 0) list[idx] = listing;
    else list.unshift(listing);
    this.set('listings', list);
  }

  deleteListing(id: string): void {
    const list = this.getListings().filter(l => l.id !== id);
    this.set('listings', list);
  }

  // Deduplicated click counter
  registerListingClick(listingId: string): void {
    const viewedKey = `viewed_${listingId}_${new Date().toISOString().slice(0, 10)}`;
    if (sessionStorage.getItem(viewedKey)) return;
    sessionStorage.setItem(viewedKey, '1');

    const listings = this.getListings();
    const item = listings.find(l => l.id === listingId);
    if (item) {
      item.unique_clicks_count = (item.unique_clicks_count || 0) + 1;
      this.saveListing(item);
    }
  }

  // CRM LEADS (SUPER ADMIN EXCLUSIVE)
  getLeads(currentRole: UserRole): Lead[] {
    // ENFORCE ABSOLUTE RULE: Sellers and buyers cannot access CRM!
    if (currentRole !== 'super_admin' && currentRole !== 'admin') {
      return [];
    }
    return this.get<Lead[]>('leads', INITIAL_LEADS);
  }

  saveLead(lead: Lead, currentRole: UserRole): void {
    if (currentRole !== 'super_admin' && currentRole !== 'admin') {
      throw new Error('Acesso negado: o CRM é de acesso restrito ao Super Admin.');
    }
    const list = this.getLeads('super_admin');
    const idx = list.findIndex(l => l.id === lead.id);
    if (idx >= 0) list[idx] = lead;
    else list.unshift(lead);
    this.set('leads', list);
  }

  createPublicLead(leadData: Omit<Lead, 'id' | 'lead_code' | 'created_at' | 'updated_at'>): Lead {
    const lead: Lead = {
      ...leadData,
      id: 'lead-' + Date.now(),
      lead_code: `LEAD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const all = this.get<Lead[]>('leads', INITIAL_LEADS);
    all.unshift(lead);
    this.set('leads', all);
    return lead;
  }

  getCrmNotes(leadId?: string, currentRole?: UserRole): CrmNote[] {
    if (currentRole && currentRole !== 'super_admin' && currentRole !== 'admin') {
      return [];
    }
    const notes = this.get<CrmNote[]>('crm_notes', INITIAL_CRM_NOTES);
    if (leadId) return notes.filter(n => n.lead_id === leadId);
    return notes;
  }

  addCrmNote(note: Omit<CrmNote, 'id' | 'created_at'>, currentRole: UserRole): CrmNote {
    if (currentRole !== 'super_admin' && currentRole !== 'admin') {
      throw new Error('Acesso negado: o CRM é exclusivo do Super Admin.');
    }
    const newNote: CrmNote = {
      ...note,
      id: 'note-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    const notes = this.getCrmNotes(undefined, 'super_admin');
    notes.unshift(newNote);
    this.set('crm_notes', notes);
    return newNote;
  }

  // Conversations & Chat
  getConversations(userId: string): Conversation[] {
    const list = this.get<Conversation[]>('conversations', INITIAL_CONVERSATIONS);
    return list.filter(c => c.buyer_id === userId || c.seller_id === userId);
  }

  getMessages(conversationId: string): Message[] {
    const msgs = this.get<Message[]>('messages', INITIAL_MESSAGES);
    return msgs.filter(m => m.conversation_id === conversationId);
  }

  sendMessage(conversationId: string, sender: Profile, content: string): Message {
    const msg: Message = {
      id: 'msg-' + Date.now(),
      conversation_id: conversationId,
      sender_id: sender.id,
      sender_name: sender.full_name,
      content,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    const allMsgs = this.get<Message[]>('messages', INITIAL_MESSAGES);
    allMsgs.push(msg);
    this.set('messages', allMsgs);

    // Update conversation last message
    const convs = this.get<Conversation[]>('conversations', INITIAL_CONVERSATIONS);
    const conv = convs.find(c => c.id === conversationId);
    if (conv) {
      conv.last_message = content;
      conv.last_message_at = msg.created_at;
      if (sender.id === conv.buyer_id) conv.unread_seller = true;
      else conv.unread_buyer = true;
      this.set('conversations', convs);
    }
    return msg;
  }

  startOrGetConversation(listing: Listing, buyer: Profile): Conversation {
    const convs = this.get<Conversation[]>('conversations', INITIAL_CONVERSATIONS);
    let conv = convs.find(c => c.listing_id === listing.id && c.buyer_id === buyer.id);
    if (!conv) {
      conv = {
        id: 'conv-' + Date.now(),
        listing_id: listing.id,
        listing_title: listing.title,
        listing_image: listing.images[0] || '',
        listing_price: listing.price,
        buyer_id: buyer.id,
        buyer_name: buyer.full_name,
        seller_id: listing.seller_id,
        seller_name: listing.seller_name || 'Vendedor',
        last_message: 'Iniciou contacto sobre o anúncio',
        last_message_at: new Date().toISOString(),
        unread_buyer: false,
        unread_seller: true,
      };
      convs.unshift(conv);
      this.set('conversations', convs);
    }
    return conv;
  }

  // Orders
  getOrders(userId: string, role: UserRole): Order[] {
    const list = this.get<Order[]>('orders', INITIAL_ORDERS);
    if (role === 'super_admin' || role === 'admin') return list;
    if (role === 'courier') return list;
    return list.filter(o => o.buyer_id === userId || o.seller_id === userId);
  }

  createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>): Order {
    const order: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      order_number: `PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
    };
    const list = this.get<Order[]>('orders', INITIAL_ORDERS);
    list.unshift(order);
    this.set('orders', list);
    return order;
  }

  // Subscriptions & Usage
  getSellerSubscription(sellerId: string): { subscription: Subscription; plan: Plan; usage: SubscriptionUsage } {
    const subs = this.get<Subscription[]>('subscriptions', INITIAL_SUBSCRIPTIONS);
    const plans = this.getPlans();
    const usages = this.get<SubscriptionUsage[]>('subscription_usage', INITIAL_USAGE);

    let sub = subs.find(s => s.seller_id === sellerId);
    if (!sub) {
      sub = {
        id: 'sub-' + sellerId,
        seller_id: sellerId,
        plan_id: plans[0].id, // FREE by default
        billing_interval: 'monthly',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancel_at_period_end: false,
      };
      subs.push(sub);
      this.set('subscriptions', subs);
    }

    const plan = plans.find(p => p.id === sub.plan_id) || plans[0];
    let usage = usages.find(u => u.seller_id === sellerId);
    if (!usage) {
      usage = {
        id: 'usage-' + sellerId,
        subscription_id: sub.id,
        seller_id: sellerId,
        cycle_month: new Date().toISOString().slice(0, 7) + '-01',
        unique_clicks_used: 1,
        contacts_used: 1,
        active_listings_count: this.getListings().filter(l => l.seller_id === sellerId && l.status === 'active').length,
        highlights_used: 0,
      };
      usages.push(usage);
      this.set('subscription_usage', usages);
    }
    return { subscription: sub, plan, usage };
  }

  upgradeSellerPlan(sellerId: string, planCode: 'free' | 'premium' | 'business'): void {
    const plans = this.getPlans();
    const targetPlan = plans.find(p => p.code === planCode) || plans[1];
    const subs = this.get<Subscription[]>('subscriptions', INITIAL_SUBSCRIPTIONS);
    const idx = subs.findIndex(s => s.seller_id === sellerId);
    if (idx >= 0) {
      subs[idx].plan_id = targetPlan.id;
      subs[idx].current_period_start = new Date().toISOString();
      subs[idx].current_period_end = new Date(Date.now() + 30 * 86400000).toISOString();
    } else {
      subs.push({
        id: 'sub-' + sellerId,
        seller_id: sellerId,
        plan_id: targetPlan.id,
        billing_interval: 'monthly',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancel_at_period_end: false,
      });
    }
    this.set('subscriptions', subs);
  }

  // Reviews
  getSellerReviews(sellerId: string): Review[] {
    const reviews = this.get<Review[]>('reviews', INITIAL_REVIEWS);
    return reviews.filter(r => r.seller_id === sellerId);
  }

  addReview(review: Omit<Review, 'id' | 'created_at'>): Review {
    const rev: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    const reviews = this.get<Review[]>('reviews', INITIAL_REVIEWS);
    reviews.unshift(rev);
    this.set('reviews', reviews);
    return rev;
  }
}

export const marketplaceStore = new LocalStore();
