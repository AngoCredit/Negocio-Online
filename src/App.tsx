import React, { useState, useEffect, useMemo } from 'react';
import { marketplaceStore } from './lib/store';
import {
  Profile,
  Listing,
  Category,
  Plan,
  Lead,
  LeadStatus,
  CrmNote,
  Conversation,
  Message,
  Order,
  PlatformSettings,
  UserRole
} from './types/database.types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { SearchFilters } from './components/SearchFilters';
import { SellerPortal } from './components/SellerPortal';
import { AdminPanel } from './components/AdminPanel';
import { ChatDrawer } from './components/ChatDrawer';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { Footer } from './components/Footer';
import {
  Sparkles,
  TrendingUp,
  Car,
  Home,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  Package
} from 'lucide-react';

export default function App() {
  // Global Store States
  const [currentUser, setCurrentUser] = useState<Profile>(marketplaceStore.getCurrentUser());
  const [allUsers, setAllUsers] = useState<Profile[]>(marketplaceStore.getAllUsers());
  const [settings, setSettings] = useState<PlatformSettings>(marketplaceStore.getPlatformSettings());
  const [categories, setCategories] = useState<Category[]>(marketplaceStore.getCategories());
  const [listings, setListings] = useState<Listing[]>(marketplaceStore.getListings());
  const [plans, setPlans] = useState<Plan[]>(marketplaceStore.getPlans());
  
  // Views: 'marketplace' | 'seller_portal' | 'admin_panel' | 'search'
  const [activeView, setActiveView] = useState<'marketplace' | 'seller_portal' | 'admin_panel' | 'search'>('marketplace');

  // Modals & Drawers
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // Cart & Favorites
  const [cartItems, setCartItems] = useState<{ listing: Listing; quantity: number }[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['list-1']);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [sellerType, setSellerType] = useState('all');
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  // Leads & CRM Notes
  const [leads, setLeads] = useState<Lead[]>(marketplaceStore.getLeads(currentUser.role));
  const [crmNotes, setCrmNotes] = useState<CrmNote[]>(marketplaceStore.getCrmNotes(undefined, currentUser.role));

  // Chat
  const [conversations, setConversations] = useState<Conversation[]>(marketplaceStore.getConversations(currentUser.id));
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Refresh user data & permissions when user changes
  useEffect(() => {
    marketplaceStore.setCurrentUser(currentUser);
    setLeads(marketplaceStore.getLeads(currentUser.role));
    setCrmNotes(marketplaceStore.getCrmNotes(undefined, currentUser.role));
    setConversations(marketplaceStore.getConversations(currentUser.id));
  }, [currentUser]);

  // Load chat messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      setChatMessages(marketplaceStore.getMessages(activeConversation.id));
    } else {
      setChatMessages([]);
    }
  }, [activeConversation]);

  // Deduplicated click registration & open detail
  const handleOpenListingDetail = (listing: Listing) => {
    marketplaceStore.registerListingClick(listing.id);
    setListings(marketplaceStore.getListings());
    setSelectedListing(listing);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // Add to cart
  const handleAddToCart = (listing: Listing) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.listing.id === listing.id);
      if (existing) {
        return prev.map(i => i.listing.id === listing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { listing, quantity: 1 }];
    });
    setCartDrawerOpen(true);
    if (selectedListing) setSelectedListing(null);
  };

  // Start chat with seller
  const handleStartChat = (listing: Listing) => {
    const conv = marketplaceStore.startOrGetConversation(listing, currentUser);
    setConversations(marketplaceStore.getConversations(currentUser.id));
    setActiveConversation(conv);
    setChatDrawerOpen(true);
    if (selectedListing) setSelectedListing(null);
  };

  // Send chat message
  const handleSendMessage = (conversationId: string, text: string) => {
    marketplaceStore.sendMessage(conversationId, currentUser, text);
    setChatMessages(marketplaceStore.getMessages(conversationId));
    setConversations(marketplaceStore.getConversations(currentUser.id));
  };

  // Request Visit / Lead generation
  const handleRequestVisit = (
    listing: Listing,
    data: { name: string; phone: string; email: string; date: string; notes: string; type: string }
  ) => {
    marketplaceStore.createPublicLead({
      origin: data.type as any,
      buyer_id: currentUser.id,
      buyer_name: data.name,
      buyer_email: data.email,
      buyer_phone: data.phone,
      seller_id: listing.seller_id,
      seller_name: listing.seller_name,
      listing_id: listing.id,
      listing_title: listing.title,
      status: 'novo',
      deal_value: listing.price,
      preferred_date: data.date,
      notes_summary: data.notes,
    });
    // Refresh leads if admin
    setLeads(marketplaceStore.getLeads(currentUser.role));
  };

  // Place Order
  const handleCreateOrder = (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>) => {
    const order = marketplaceStore.createOrder(orderData);
    return order;
  };

  // Seller publish ad
  const handlePublishListing = (data: Partial<Listing>) => {
    const newListing: Listing = {
      id: 'list-' + Date.now(),
      seller_id: currentUser.id,
      seller_name: currentUser.full_name,
      seller_is_pro: currentUser.role === 'pro_seller',
      seller_verified: currentUser.verification_status === 'verified',
      category_id: data.category_id || categories[0].id,
      category_slug: data.category_slug || categories[0].slug,
      title: data.title || 'Novo Anúncio',
      slug: (data.title || 'novo-anuncio').toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      description: data.description || '',
      price: data.price || 0,
      price_negotiable: data.price_negotiable || false,
      listing_type: data.listing_type || 'sale',
      status: 'active',
      is_featured: false,
      district: data.district || 'Lisboa',
      concelho: data.concelho || 'Lisboa',
      condition: data.condition || 'Usado',
      delivery_available: data.delivery_available || false,
      delivery_fee: data.delivery_fee || 0,
      images: data.images && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
      ],
      attributes: data.attributes || {},
      rental_price_daily: data.rental_price_daily,
      rental_price_weekly: data.rental_price_weekly,
      rental_deposit: data.rental_deposit,
      unique_clicks_count: 0,
      impressions_count: 0,
      contacts_count: 0,
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    marketplaceStore.saveListing(newListing);
    setListings(marketplaceStore.getListings());
  };

  const handleDeleteListing = (id: string) => {
    marketplaceStore.deleteListing(id);
    setListings(marketplaceStore.getListings());
  };

  const handleToggleHighlight = (id: string) => {
    const target = listings.find(l => l.id === id);
    if (target) {
      target.is_featured = !target.is_featured;
      marketplaceStore.saveListing(target);
      setListings([...marketplaceStore.getListings()]);
    }
  };

  const handleUpgradePlan = (planCode: 'premium' | 'business') => {
    marketplaceStore.upgradeSellerPlan(currentUser.id, planCode);
    alert(`Plano atualizado para ${planCode.toUpperCase()} com sucesso! Os seus novos limites foram aplicados.`);
  };

  // Super Admin actions
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    const target = leads.find(l => l.id === leadId);
    if (target) {
      target.status = status;
      marketplaceStore.saveLead(target, currentUser.role);
      setLeads([...marketplaceStore.getLeads(currentUser.role)]);
    }
  };

  const handleAddCrmNote = (leadId: string, content: string) => {
    marketplaceStore.addCrmNote({
      lead_id: leadId,
      author_admin_id: currentUser.id,
      author_name: currentUser.full_name,
      content,
      is_private_internal: true,
    }, currentUser.role);
    setCrmNotes([...marketplaceStore.getCrmNotes(undefined, currentUser.role)]);
  };

  const handleModerateListing = (listingId: string, action: 'approve' | 'reject' | 'highlight') => {
    const target = listings.find(l => l.id === listingId);
    if (!target) return;
    if (action === 'highlight') target.is_featured = !target.is_featured;
    if (action === 'reject') target.status = target.status === 'rejected' ? 'active' : 'rejected';
    marketplaceStore.saveListing(target);
    setListings([...marketplaceStore.getListings()]);
  };

  const handleUpdateUserRole = (userId: string, role: UserRole) => {
    const updated = allUsers.map(u => u.id === userId ? { ...u, role } : u);
    setAllUsers(updated);
    if (currentUser.id === userId) setCurrentUser({ ...currentUser, role });
  };

  const handleUpdatePlan = (plan: Plan) => {
    marketplaceStore.savePlan(plan);
    setPlans(marketplaceStore.getPlans());
  };

  const handleSaveSettings = (newSettings: PlatformSettings) => {
    marketplaceStore.savePlatformSettings(newSettings);
    setSettings(newSettings);
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (l.status !== 'active' && currentUser.role !== 'super_admin' && currentUser.role !== 'admin') {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = l.title.toLowerCase().includes(q);
        const matchesDesc = l.description.toLowerCase().includes(q);
        const matchesConcelho = l.concelho.toLowerCase().includes(q);
        const matchesDistrict = l.district.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesConcelho && !matchesDistrict) return false;
      }
      if (selectedCategorySlug && l.category_slug !== selectedCategorySlug) {
        return false;
      }
      if (selectedDistrict && l.district !== selectedDistrict) {
        return false;
      }
      if (minPrice && l.price < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice && l.price > parseFloat(maxPrice)) {
        return false;
      }
      if (condition && l.condition !== condition) {
        return false;
      }
      if (sellerType === 'particular' && l.seller_is_pro) return false;
      if (sellerType === 'pro' && !l.seller_is_pro) return false;
      if (deliveryOnly && !l.delivery_available) return false;
      if (verifiedOnly && !l.seller_verified) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'popular') return (b.unique_clicks_count || 0) - (a.unique_clicks_count || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [
    listings,
    searchQuery,
    selectedCategorySlug,
    selectedDistrict,
    minPrice,
    maxPrice,
    condition,
    sellerType,
    deliveryOnly,
    verifiedOnly,
    sortBy,
    currentUser.role
  ]);

  // Featured sections
  const featuredListings = listings.filter(l => l.is_featured && l.status === 'active');
  const vehicleListings = listings.filter(l => l.category_slug === 'viaturas' && l.status === 'active');
  const propertyListings = listings.filter(l => l.category_slug === 'imoveis' && l.status === 'active');
  const rentalListings = listings.filter(l => l.category_slug === 'alugueres' && l.status === 'active');

  const sellerPlanData = marketplaceStore.getSellerSubscription(currentUser.id);
  const myListings = listings.filter(l => l.seller_id === currentUser.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* 1. Master Header */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        settings={settings}
        activeView={activeView}
        onViewChange={setActiveView}
        onUserChange={setCurrentUser}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenChat={() => {
          setActiveConversation(conversations[0] || null);
          setChatDrawerOpen(true);
        }}
        unreadChatCount={conversations.filter(c => currentUser.id === c.buyer_id ? c.unread_buyer : c.unread_seller).length}
        onPublishClick={() => {
          setActiveView('seller_portal');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        onSearchSubmit={() => {
          setActiveView('search');
        }}
      />

      {/* 2. Category Navigation Bar */}
      <CategoryNav
        categories={categories}
        selectedCategorySlug={selectedCategorySlug}
        onSelectCategory={(slug) => {
          setSelectedCategorySlug(slug);
          if (activeView !== 'marketplace') setActiveView('marketplace');
        }}
      />

      {/* 3. Main Views */}
      <main className="flex-1">
        {/* ======================================================= */}
        {/* VIEW: SELLER PORTAL (STRICTLY NO CRM!) */}
        {/* ======================================================= */}
        {activeView === 'seller_portal' && (
          <SellerPortal
            currentUser={currentUser}
            myListings={myListings}
            categories={categories}
            sellerPlanData={sellerPlanData}
            onPublishListing={handlePublishListing}
            onDeleteListing={handleDeleteListing}
            onToggleHighlight={handleToggleHighlight}
            onUpgradePlan={handleUpgradePlan}
          />
        )}

        {/* ======================================================= */}
        {/* VIEW: SUPER ADMIN PANEL & EXCLUSIVE CRM */}
        {/* ======================================================= */}
        {activeView === 'admin_panel' && (
          currentUser.role === 'super_admin' || currentUser.role === 'admin' ? (
            <AdminPanel
              currentUser={currentUser}
              leads={leads}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onAddCrmNote={handleAddCrmNote}
              crmNotes={crmNotes}
              listings={listings}
              onModerateListing={handleModerateListing}
              allUsers={allUsers}
              onUpdateUserRole={handleUpdateUserRole}
              plans={plans}
              onUpdatePlan={handleUpdatePlan}
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          ) : (
            <div className="max-w-md mx-auto py-20 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Acesso Restrito</h2>
              <p className="text-xs text-slate-500 mt-2">
                O CRM e o Painel Administrativo são exclusivos de Super Admins. Vendedores e compradores não têm permissão.
              </p>
              <button
                onClick={() => setActiveView('marketplace')}
                className="mt-5 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Voltar ao Marketplace
              </button>
            </div>
          )
        )}

        {/* ======================================================= */}
        {/* VIEW: SEARCH & ADVANCED FILTERS */}
        {/* ======================================================= */}
        {activeView === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar Filters */}
              <div className="w-full lg:w-72 shrink-0">
                <SearchFilters
                  categories={categories}
                  selectedCategorySlug={selectedCategorySlug}
                  onSelectCategory={setSelectedCategorySlug}
                  selectedDistrict={selectedDistrict}
                  onSelectDistrict={setSelectedDistrict}
                  minPrice={minPrice}
                  onMinPriceChange={setMinPrice}
                  maxPrice={maxPrice}
                  onMaxPriceChange={setMaxPrice}
                  condition={condition}
                  onConditionChange={setCondition}
                  sellerType={sellerType}
                  onSellerTypeChange={setSellerType}
                  deliveryOnly={deliveryOnly}
                  onDeliveryOnlyChange={setDeliveryOnly}
                  verifiedOnly={verifiedOnly}
                  onVerifiedOnlyChange={setVerifiedOnly}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  onReset={() => {
                    setSearchQuery('');
                    setSelectedCategorySlug('');
                    setSelectedDistrict('');
                    setMinPrice('');
                    setMaxPrice('');
                    setCondition('');
                    setSellerType('all');
                    setDeliveryOnly(false);
                    setVerifiedOnly(false);
                    setSortBy('recent');
                  }}
                />
              </div>

              {/* Search Results */}
              <div className="flex-1 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      Resultados da Pesquisa ({filteredListings.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      {searchQuery ? `Palavra-chave: "${searchQuery}" • ` : ''}
                      {selectedDistrict ? `Distrito: ${selectedDistrict} • ` : 'Portugal inteiro • '}
                      {selectedCategorySlug ? `Categoria: ${categories.find(c => c.slug === selectedCategorySlug)?.name}` : 'Todas as categorias'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-semibold">Ordenar:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-100 rounded-xl px-2.5 py-1.5 border border-slate-200 font-bold cursor-pointer"
                    >
                      <option value="recent">Mais recentes</option>
                      <option value="price_asc">Menor Preço</option>
                      <option value="price_desc">Maior Preço</option>
                      <option value="popular">Mais populares</option>
                    </select>
                  </div>
                </div>

                {filteredListings.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">
                      Nenhum anúncio encontrado para estes filtros
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Tente alargar os critérios de pesquisa, escolher outro distrito ou remover os filtros de preço.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredListings.map((item) => (
                      <ListingCard
                        key={item.id}
                        listing={item}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={handleOpenListingDetail}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW: MAIN PUBLIC MARKETPLACE HOMEPAGE */}
        {/* ======================================================= */}
        {activeView === 'marketplace' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <HeroBanner
              settings={settings}
              onExploreCategory={(slug) => {
                setSelectedCategorySlug(slug);
                setActiveView('search');
              }}
              onPublishClick={() => setActiveView('seller_portal')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
              {/* Category Filter Active Pill */}
              {selectedCategorySlug && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-800 font-bold">
                      A filtrar por categoria: {categories.find(c => c.slug === selectedCategorySlug)?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCategorySlug('')}
                    className="text-xs text-emerald-700 font-bold underline hover:text-emerald-900 cursor-pointer"
                  >
                    Ver Todas as Categorias
                  </button>
                </div>
              )}

              {/* 1. ANÚNCIOS EM DESTAQUE (FEATURED) */}
              {featuredListings.length > 0 && !selectedCategorySlug && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Oportunidades em Destaque em Portugal
                      </h2>
                      <p className="text-xs text-slate-500">
                        Anúncios promovidos e verificados de vendedores profissionais e particulares.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveView('search')}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Ver todos <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {featuredListings.map((item) => (
                      <ListingCard
                        key={item.id}
                        listing={item}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={handleOpenListingDetail}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 2. VIATURAS EM DESTAQUE */}
              {vehicleListings.length > 0 && (!selectedCategorySlug || selectedCategorySlug === 'viaturas') && (
                <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                        <Car className="w-5 h-5 text-blue-600" />
                        Viaturas & Automóveis Rigorosamente Selecionados
                      </h2>
                      <p className="text-xs text-slate-500">
                        Com histórico comprovado, garantia e agendamento de test drive direto.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategorySlug('viaturas');
                        setActiveView('search');
                      }}
                      className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Ver todas as viaturas <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {vehicleListings.map((item) => (
                      <ListingCard
                        key={item.id}
                        listing={item}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={handleOpenListingDetail}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 3. IMÓVEIS EM DESTAQUE */}
              {propertyListings.length > 0 && (!selectedCategorySlug || selectedCategorySlug === 'imoveis') && (
                <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                        <Home className="w-5 h-5 text-emerald-600" />
                        Casas & Apartamentos em Portugal
                      </h2>
                      <p className="text-xs text-slate-500">
                        Imóveis para venda e arrendamento com certificados energéticos e marcação de visitas.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategorySlug('imoveis');
                        setActiveView('search');
                      }}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Ver todos os imóveis <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {propertyListings.map((item) => (
                      <ListingCard
                        key={item.id}
                        listing={item}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={handleOpenListingDetail}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 4. ALUGUERES */}
              {rentalListings.length > 0 && (!selectedCategorySlug || selectedCategorySlug === 'alugueres') && (
                <section className="bg-teal-50/50 p-6 rounded-3xl border border-teal-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-teal-950 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-teal-700" />
                        Alugueres de Veículos & Equipamentos por Período
                      </h2>
                      <p className="text-xs text-teal-800">
                        Aluguer por dia, semana ou mês com caução protegida e disponibilidade imediata.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategorySlug('alugueres');
                        setActiveView('search');
                      }}
                      className="text-xs font-bold text-teal-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Ver todos os alugueres <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rentalListings.map((item) => (
                      <ListingCard
                        key={item.id}
                        listing={item}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={handleOpenListingDetail}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 5. TODOS OS ANÚNCIOS RECENTES */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Anúncios Mais Recentes em Todo o País
                    </h2>
                    <p className="text-xs text-slate-500">
                      Produtos de eletrónica, cosméticos, mobiliário, eletrodomésticos e muito mais.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredListings.slice(0, 6).map((item) => (
                    <ListingCard
                      key={item.id}
                      listing={item}
                      isFavorite={favorites.includes(item.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={handleOpenListingDetail}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* 4. Listing Detail Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        currentUser={currentUser}
        isFavorite={selectedListing ? favorites.includes(selectedListing.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onStartChat={handleStartChat}
        onRequestVisit={handleRequestVisit}
      />

      {/* 5. Chat Drawer */}
      <ChatDrawer
        isOpen={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
        currentUser={currentUser}
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={setActiveConversation}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />

      {/* 6. Cart & Checkout Drawer */}
      <CartCheckoutDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={(id) => setCartItems(prev => prev.filter(i => i.listing.id !== id))}
        onUpdateQuantity={(id, q) => setCartItems(prev => prev.map(i => i.listing.id === id ? { ...i, quantity: q } : i))}
        onClearCart={() => setCartItems([])}
        currentUser={currentUser}
        onCreateOrder={handleCreateOrder}
      />

      {/* 7. Portuguese Compliance Footer */}
      <Footer
        settings={settings}
        onSelectCategory={(slug) => {
          setSelectedCategorySlug(slug);
          setActiveView('search');
        }}
      />
    </div>
  );
}
