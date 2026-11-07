-- ==============================================================================
-- MARKETPLACE MULTICATEGORIA — MIGRATION 002: ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 1. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION current_user_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_role(required_role user_role_enum)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid() AND (role = required_role OR role = 'super_admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_super()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 2. ENABLE RLS ON SENSITIVE TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- CRM EXCLUSIVAS (ADMIN ONLY)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;

-- CHAT
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ORDERS & DELIVERIES
ALTER TABLE shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES POLICIES
-- Anyone can view public profile details; only owner or admin can edit
CREATE POLICY "Public profiles are readable" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (is_admin_or_super());

-- 4. LISTINGS POLICIES
-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings" ON listings
  FOR SELECT USING (status = 'active' OR is_admin_or_super() OR seller_id = current_user_profile_id());

-- Sellers can insert listings if active subscription allows
CREATE POLICY "Sellers can insert own listings" ON listings
  FOR INSERT WITH CHECK (seller_id = current_user_profile_id());

-- Sellers can update their own listings
CREATE POLICY "Sellers can update own listings" ON listings
  FOR UPDATE USING (seller_id = current_user_profile_id() OR is_admin_or_super());

-- Sellers can delete own listings
CREATE POLICY "Sellers can delete own listings" ON listings
  FOR DELETE USING (seller_id = current_user_profile_id() OR is_admin_or_super());

-- 5. FAVORITES POLICIES
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (user_id = current_user_profile_id());

-- 6. SUBSCRIPTIONS POLICIES
CREATE POLICY "Sellers can view own subscriptions" ON subscriptions
  FOR SELECT USING (seller_id = current_user_profile_id() OR is_admin_or_super());

CREATE POLICY "Admins can manage all subscriptions" ON subscriptions
  FOR ALL USING (is_admin_or_super());

-- 7. CRM POLICIES (STRICT REGRA ABSOLUTA)
-- Vendedores, Compradores e Entregadores NUNCA têm acesso ao CRM!
CREATE POLICY "CRM Customers: Admins only" ON customers
  FOR ALL USING (is_admin_or_super());

CREATE POLICY "CRM Leads: Admins only" ON leads
  FOR ALL USING (is_admin_or_super());

CREATE POLICY "CRM Notes: Admins only" ON crm_notes
  FOR ALL USING (is_admin_or_super());

CREATE POLICY "CRM Tasks: Admins only" ON crm_tasks
  FOR ALL USING (is_admin_or_super());

CREATE POLICY "CRM Activities: Admins only" ON crm_activities
  FOR ALL USING (is_admin_or_super());

-- 8. CHAT & MESSAGING POLICIES
CREATE POLICY "Users can view conversations they belong to" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = conversations.id AND user_id = current_user_profile_id()
    ) OR is_admin_or_super()
  );

CREATE POLICY "Members can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = current_user_profile_id()
    ) OR is_admin_or_super()
  );

CREATE POLICY "Members can send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = current_user_profile_id() AND
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id AND user_id = current_user_profile_id()
    )
  );

-- 9. SHOPPING CART & ORDERS POLICIES
CREATE POLICY "Users own their cart" ON shopping_carts
  FOR ALL USING (user_id = current_user_profile_id());

CREATE POLICY "Buyers and sellers can view their relevant orders" ON orders
  FOR SELECT USING (
    buyer_id = current_user_profile_id() OR
    seller_id = current_user_profile_id() OR
    is_admin_or_super()
  );

CREATE POLICY "Couriers can view assigned deliveries" ON deliveries
  FOR SELECT USING (
    courier_id = current_user_profile_id() OR
    is_admin_or_super() OR
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = deliveries.order_id AND (orders.buyer_id = current_user_profile_id() OR orders.seller_id = current_user_profile_id())
    )
  );

-- 10. NOTIFICATIONS POLICIES
CREATE POLICY "Users view own notifications" ON notifications
  FOR ALL USING (user_id = current_user_profile_id());
