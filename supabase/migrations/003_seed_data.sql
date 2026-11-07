-- ==============================================================================
-- MARKETPLACE MULTICATEGORIA — MIGRATION 003: SEED DATA (PORTUGAL)
-- ==============================================================================

-- 1. PLATFORM DEFAULT SETTINGS
INSERT INTO platform_settings (
  id, platform_name, tagline, support_email, support_phone, currency, currency_symbol, default_language, timezone, commission_percentage
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'MARKETPLACE Portugal',
  'A sua plataforma de compra, venda e aluguer de viaturas, imóveis e produtos em Portugal',
  'contacto@marketplace.pt',
  '+351 210 999 888',
  'EUR',
  '€',
  'pt-PT',
  'Europe/Lisbon',
  3.50
) ON CONFLICT (id) DO NOTHING;

-- 2. PLANS DEFINITION (FREE, PREMIUM, BUSINESS)
INSERT INTO plans (id, code, name, price_monthly, price_yearly, max_active_listings, max_photos_per_listing, max_unique_clicks_per_month, max_contacts_per_month, included_monthly_highlights, listing_validity_days, allow_video, team_members_limit, priority_support)
VALUES
('11111111-1111-1111-1111-111111111111', 'free', 'Plano FREE', 0.00, 0.00, 2, 3, 5, 5, 0, 15, false, 1, false),
('22222222-2222-2222-2222-222222222222', 'premium', 'Plano PREMIUM', 19.90, 199.00, 20, 10, 500, 100, 2, 30, true, 3, false),
('33333333-3333-3333-3333-333333333333', 'business', 'Plano BUSINESS', 49.90, 499.00, 100, 20, 2000, 500, 10, 30, true, 10, true)
ON CONFLICT (code) DO NOTHING;

-- 3. CATEGORIES DEFINITION
INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Viaturas', 'viaturas', 'Carros, motas, comerciais e barcos', 'Car', 1),
('c1000000-0000-0000-0000-000000000002', 'Casas e Imóveis', 'imoveis', 'Apartamentos, moradias, terrenos e espaços comerciais', 'Home', 2),
('c1000000-0000-0000-0000-000000000003', 'Alugueres', 'alugueres', 'Aluguer de equipamentos, ferramentas e veículos por dia ou mês', 'Calendar', 3),
('c1000000-0000-0000-0000-000000000004', 'Cosméticos e Beleza', 'cosmeticos', 'Perfumaria, maquilhagem, cuidados e estética', 'Sparkles', 4),
('c1000000-0000-0000-0000-000000000005', 'Eletrónica e Informática', 'eletronica', 'Smartphones, computadores, áudio e fotografia', 'Laptop', 5),
('c1000000-0000-0000-0000-000000000006', 'Casa e Jardim', 'casa-jardim', 'Bricolage, ferramentas e jardinagem', 'Flower2', 6),
('c1000000-0000-0000-0000-000000000007', 'Mobiliário', 'mobiliario', 'Sofás, mesas, camas e decoração de interiores', 'Armchair', 7),
('c1000000-0000-0000-0000-000000000008', 'Eletrodomésticos', 'eletrodomesticos', 'Frigoríficos, máquinas de lavar e pequenos eletrodomésticos', 'Tv', 8),
('c1000000-0000-0000-0000-000000000009', 'Moda e Acessórios', 'moda', 'Vestuário, calçado, malas e relojoaria', 'Shirt', 9),
('c1000000-0000-0000-0000-000000000010', 'Desporto e Lazer', 'desporto', 'Bicicletas, fitness, campismo e pranchas', 'Bike', 10),
('c1000000-0000-0000-0000-000000000011', 'Serviços', 'servicos', 'Reparações, aulas, transporte e consultoria', 'Wrench', 11),
('c1000000-0000-0000-0000-000000000012', 'Diversos', 'diversos', 'Colecionismo, música, livros e outros artigos', 'Package', 12)
ON CONFLICT (slug) DO NOTHING;

-- 4. DELIVERY PARTNERS IN PORTUGAL
INSERT INTO delivery_partners (id, name, code, is_active, tracking_url_template) VALUES
('d1000000-0000-0000-0000-000000000001', 'CTT Expresso', 'ctt_expresso', true, 'https://appserver.ctt.pt/flashtracking/tracking.html?objects={tracking_code}'),
('d1000000-0000-0000-0000-000000000002', 'DPD Portugal', 'dpd_pt', true, 'https://www.dpdgroup.com/pt/mydpd/my-parcels/search?parcelNumber={tracking_code}'),
('d1000000-0000-0000-0000-000000000003', 'MRW Portugal', 'mrw_pt', true, 'https://www.mrw.pt/seguimento_envios/mrw_envio.asp?numero_envio={tracking_code}'),
('d1000000-0000-0000-0000-000000000004', 'Estafeta Próprio Marketplace', 'in_house', true, null)
ON CONFLICT (code) DO NOTHING;
