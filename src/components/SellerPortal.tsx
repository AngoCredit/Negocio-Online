import React, { useState } from 'react';
import {
  Package,
  PlusCircle,
  Eye,
  MousePointer,
  PhoneCall,
  Crown,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Upload,
  ArrowUpRight,
  ExternalLink,
  Car,
  Home,
  Calendar,
  Layers
} from 'lucide-react';
import { Listing, Profile, Plan, Subscription, SubscriptionUsage, Category, PORTUGAL_DISTRICTS } from '../types/database.types';

interface SellerPortalProps {
  currentUser: Profile;
  myListings: Listing[];
  categories: Category[];
  sellerPlanData: { subscription: Subscription; plan: Plan; usage: SubscriptionUsage };
  onPublishListing: (listingData: Partial<Listing>) => void;
  onDeleteListing: (id: string) => void;
  onToggleHighlight: (id: string) => void;
  onUpgradePlan: (planCode: 'premium' | 'business') => void;
}

export const SellerPortal: React.FC<SellerPortalProps> = ({
  currentUser,
  myListings,
  categories,
  sellerPlanData,
  onPublishListing,
  onDeleteListing,
  onToggleHighlight,
  onUpgradePlan,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'publish' | 'my_listings' | 'plans' | 'orders'>('dashboard');

  const { plan, usage } = sellerPlanData;
  const activeCount = myListings.filter(l => l.status === 'active').length;
  const isListingLimitReached = activeCount >= plan.max_active_listings;

  // Form State for Publish
  const [catSlug, setCatSlug] = useState('viaturas');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [district, setDistrict] = useState('Lisboa');
  const [concelho, setConcelho] = useState('Lisboa');
  const [condition, setCondition] = useState('Usado');
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState('0');
  
  // Specific dynamic fields
  const [attributes, setAttributes] = useState<Record<string, any>>({
    brand: 'BMW',
    model: 'Série 1 116 d',
    year: 2020,
    km: 74000,
    fuel: 'Diesel',
    gearbox: 'Manual',
    power_cv: 116,
  });

  // Rental specific
  const [rentalDaily, setRentalDaily] = useState('');
  const [rentalWeekly, setRentalWeekly] = useState('');
  const [rentalDeposit, setRentalDeposit] = useState('');

  // Photos
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [publishSuccess, setPublishSuccess] = useState('');
  const [publishError, setPublishError] = useState('');

  const handleAddImage = () => {
    if (!newImageUrl) return;
    if (images.length >= plan.max_photos_per_listing) {
      setPublishError(`O seu plano ${plan.name} permite no máximo ${plan.max_photos_per_listing} fotos por anúncio. Efetue upgrade para adicionar mais!`);
      return;
    }
    setImages([...images, newImageUrl]);
    setNewImageUrl('');
    setPublishError('');
  };

  const handleCategoryChange = (slug: string) => {
    setCatSlug(slug);
    // Reset specific attributes with defaults
    if (slug === 'viaturas') {
      setAttributes({ brand: 'Audi', model: 'A3', year: 2021, km: 45000, fuel: 'Diesel', gearbox: 'Manual', power_cv: 150 });
    } else if (slug === 'imoveis') {
      setAttributes({ property_type: 'Apartamento', typology: 'T2', area_m2: 95, bedrooms: 2, bathrooms: 1, energy_certificate: 'B', transaction_type: 'Venda' });
    } else if (slug === 'alugueres') {
      setAttributes({ equipment_type: 'Ferramenta Industrial', capacity_people: 1, min_days: 1 });
    } else if (slug === 'cosmeticos') {
      setAttributes({ brand: 'Rituals', volume_ml: '250ml', product_type: 'Cuidados de Corpo', expiry_date: '2027-06' });
    } else {
      setAttributes({});
    }
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListingLimitReached) {
      setPublishError(`Atingiu o limite de ${plan.max_active_listings} anúncios ativos do ${plan.name}. Efetue upgrade para publicar mais.`);
      return;
    }

    const selectedCategory = categories.find(c => c.slug === catSlug) || categories[0];
    const newAd: Partial<Listing> = {
      title,
      description,
      price: parseFloat(price) || 0,
      category_id: selectedCategory.id,
      category_slug: selectedCategory.slug,
      district,
      concelho,
      condition,
      delivery_available: deliveryAvailable,
      delivery_fee: parseFloat(deliveryFee) || 0,
      listing_type: catSlug === 'alugueres' ? 'rental' : 'sale',
      rental_price_daily: parseFloat(rentalDaily) || undefined,
      rental_price_weekly: parseFloat(rentalWeekly) || undefined,
      rental_deposit: parseFloat(rentalDeposit) || undefined,
      attributes,
      images,
      seller_id: currentUser.id,
      seller_name: currentUser.full_name,
      seller_is_pro: currentUser.role === 'pro_seller',
      seller_verified: currentUser.verification_status === 'verified',
    };

    onPublishListing(newAd);
    setPublishSuccess('Anúncio publicado com sucesso no Marketplace Portugal!');
    setTimeout(() => {
      setPublishSuccess('');
      setActiveTab('my_listings');
      // Reset fields
      setTitle('');
      setDescription('');
      setPrice('');
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Portal Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Área do Vendedor
            </h1>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
              {currentUser.role === 'pro_seller' ? 'Profissional' : 'Particular'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão operacional dos seus anúncios, métricas de visualização e encomendas em Portugal.
          </p>
        </div>

        {/* Current Plan Indicator & Upgrade Button */}
        <div className="flex items-center gap-3 bg-white p-2 sm:px-4 sm:py-2.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{plan.name}</span>
              <span className="text-[11px] font-semibold text-emerald-600">
                {plan.price_monthly === 0 ? 'Gratuito' : `${plan.price_monthly} €/mês`}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {activeCount} de {plan.max_active_listings} anúncios ativos
            </div>
          </div>
          {plan.code !== 'business' && (
            <button
              onClick={() => setActiveTab('plans')}
              className="ml-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Fazer Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto py-4 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'dashboard', label: 'Dashboard & Estatísticas', icon: TrendingUp },
          { id: 'publish', label: 'Publicar Anúncio', icon: PlusCircle },
          { id: 'my_listings', label: `Os Meus Anúncios (${myListings.length})`, icon: Package },
          { id: 'plans', label: 'Planos & Limites', icon: Crown },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 pt-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-medium block">Anúncios Ativos</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-slate-900">{activeCount}</span>
                <span className="text-xs text-slate-400">Máx: {plan.max_active_listings}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${isListingLimitReached ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (activeCount / plan.max_active_listings) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-medium block">Cliques Únicos no Ciclo</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-slate-900">{usage.unique_clicks_used}</span>
                <span className="text-xs text-slate-400">Limite: {plan.max_unique_clicks_per_month}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (usage.unique_clicks_used / plan.max_unique_clicks_per_month) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-medium block">Contactos Recebidos</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-slate-900">{usage.contacts_used}</span>
                <span className="text-xs text-slate-400">Limite: {plan.max_contacts_per_month}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (usage.contacts_used / plan.max_contacts_per_month) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-slate-500 text-xs font-medium block">Destaques Disponíveis</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-amber-600">
                  {Math.max(0, plan.included_monthly_highlights - usage.highlights_used)}
                </span>
                <span className="text-xs text-slate-400">Incluídos: {plan.included_monthly_highlights}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                {plan.included_monthly_highlights > 0 ? 'Destaque no topo da homepage' : 'Disponível no Plano Premium'}
              </p>
            </div>
          </div>

          {/* Quick Action Banner */}
          {isListingLimitReached && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Atingiu o limite de anúncios ativos do {plan.name}
                  </h4>
                  <p className="text-xs text-amber-700">
                    Faça upgrade para o Plano Premium (19,90 €/mês) para ter até 20 anúncios e 10 fotos por anúncio.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('plans')}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Ver Planos
              </button>
            </div>
          )}

          {/* Recent Listings Mini Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Os Seus Anúncios Recentes
              </h3>
              <button
                onClick={() => setActiveTab('publish')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Publicar Novo
              </button>
            </div>

            {myListings.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl">
                <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">Ainda não publicou nenhum anúncio.</p>
                <button
                  onClick={() => setActiveTab('publish')}
                  className="mt-3 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Começar a Vender
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myListings.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.price.toLocaleString('pt-PT')} € • {item.concelho}, {item.district}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">
                        {item.unique_clicks_count || 0} cliques
                      </span>
                      {item.is_featured ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Destaque
                        </span>
                      ) : (
                        <button
                          onClick={() => onToggleHighlight(item.id)}
                          className="text-[11px] text-emerald-700 hover:underline font-semibold cursor-pointer"
                        >
                          Destacar
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteListing(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PUBLISH LISTING */}
      {activeTab === 'publish' && (
        <div className="max-w-3xl mx-auto pt-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">
              Publicar Novo Anúncio
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Preencha os dados do seu anúncio com informação rigorosa para os compradores em Portugal.
            </p>

            {publishSuccess && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {publishSuccess}
              </div>
            )}

            {publishError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 text-xs p-4 rounded-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                {publishError}
              </div>
            )}

            <form onSubmit={handlePublishSubmit} className="space-y-6">
              {/* Category selector */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  1. Selecione a Categoria Principal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCategoryChange(c.slug)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                        catSlug === c.slug
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  2. Título & Descrição Detalhada
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: BMW 116 d Pack M 2021 Nacional ou Apartamento T2 com Garagem"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <textarea
                  rows={4}
                  required
                  placeholder="Descreva o estado, revisões, opcionais, garantia, detalhes importantes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category-Specific Dynamic Fields */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Campos Específicos para {categories.find(c => c.slug === catSlug)?.name}
                </h4>

                {catSlug === 'viaturas' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Marca</label>
                      <input
                        type="text"
                        value={attributes.brand || ''}
                        onChange={(e) => setAttributes({ ...attributes, brand: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Modelo</label>
                      <input
                        type="text"
                        value={attributes.model || ''}
                        onChange={(e) => setAttributes({ ...attributes, model: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Ano</label>
                      <input
                        type="number"
                        value={attributes.year || 2021}
                        onChange={(e) => setAttributes({ ...attributes, year: Number(e.target.value) })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Quilometragem (km)</label>
                      <input
                        type="number"
                        value={attributes.km || 50000}
                        onChange={(e) => setAttributes({ ...attributes, km: Number(e.target.value) })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Combustível</label>
                      <select
                        value={attributes.fuel || 'Diesel'}
                        onChange={(e) => setAttributes({ ...attributes, fuel: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      >
                        <option>Diesel</option>
                        <option>Gasolina</option>
                        <option>Híbrido Plug-in</option>
                        <option>Elétrico</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Caixa</label>
                      <select
                        value={attributes.gearbox || 'Manual'}
                        onChange={(e) => setAttributes({ ...attributes, gearbox: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      >
                        <option>Manual</option>
                        <option>Automática</option>
                      </select>
                    </div>
                  </div>
                )}

                {catSlug === 'imoveis' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Tipo de Imóvel</label>
                      <select
                        value={attributes.property_type || 'Apartamento'}
                        onChange={(e) => setAttributes({ ...attributes, property_type: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      >
                        <option>Apartamento</option>
                        <option>Moradia</option>
                        <option>Terreno</option>
                        <option>Espaço Comercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Tipologia</label>
                      <select
                        value={attributes.typology || 'T2'}
                        onChange={(e) => setAttributes({ ...attributes, typology: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      >
                        <option>T0</option>
                        <option>T1</option>
                        <option>T2</option>
                        <option>T3</option>
                        <option>T4+</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Área Útil (m²)</label>
                      <input
                        type="number"
                        value={attributes.area_m2 || 90}
                        onChange={(e) => setAttributes({ ...attributes, area_m2: Number(e.target.value) })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Certificado Energético</label>
                      <select
                        value={attributes.energy_certificate || 'A'}
                        onChange={(e) => setAttributes({ ...attributes, energy_certificate: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      >
                        <option>A+</option>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                        <option>D</option>
                        <option>Isento</option>
                      </select>
                    </div>
                  </div>
                )}

                {catSlug === 'alugueres' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Preço Diário (€)</label>
                      <input
                        type="number"
                        placeholder="50"
                        value={rentalDaily}
                        onChange={(e) => setRentalDaily(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Preço Semanal (€)</label>
                      <input
                        type="number"
                        placeholder="280"
                        value={rentalWeekly}
                        onChange={(e) => setRentalWeekly(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Caução Obrigatória (€)</label>
                      <input
                        type="number"
                        placeholder="300"
                        value={rentalDeposit}
                        onChange={(e) => setRentalDeposit(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Preço de Venda (€)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 15000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Distrito em Portugal
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white cursor-pointer"
                  >
                    {PORTUGAL_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Concelho
                  </label>
                  <input
                    type="text"
                    required
                    value={concelho}
                    onChange={(e) => setConcelho(e.target.value)}
                    placeholder="Ex: Cascais, Matosinhos, Sintra"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Photos & Plan Limit Checking */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Fotos do Anúncio ({images.length} / {plan.max_photos_per_listing} permitidas no {plan.name})
                  </label>
                  {images.length >= plan.max_photos_per_listing && (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                      Limite de fotos atingido
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    placeholder="URL de fotografia (https://images.unsplash.com/...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    disabled={images.length >= plan.max_photos_per_listing}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 disabled:bg-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={images.length >= plan.max_photos_per_listing}
                    className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Adicionar Foto
                  </button>
                </div>

                {/* Preview thumbnails */}
                <div className="flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-200">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery options */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Envio / Entrega Disponível</span>
                  <span className="text-[11px] text-slate-500">Permite ao comprador encomendar com envio CTT / DPD</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryAvailable}
                    onChange={(e) => setDeliveryAvailable(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isListingLimitReached}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-black py-3.5 rounded-2xl shadow-md transition-all cursor-pointer"
              >
                {isListingLimitReached ? 'Limite de Anúncios Atingido (Faça Upgrade)' : 'Confirmar e Publicar Anúncio'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MY LISTINGS */}
      {activeTab === 'my_listings' && (
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Gerir os Seus Anúncios ({myListings.length})
            </h3>
            <button
              onClick={() => setActiveTab('publish')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Publicar Novo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-16/9 bg-slate-100">
                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.status === 'active' ? 'Ativo' : item.status}
                      </span>
                      {item.is_featured && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Destaque
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-lg font-black text-slate-900">
                      {item.price.toLocaleString('pt-PT')} €
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {item.concelho}, {item.district}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onToggleHighlight(item.id)}
                    className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {item.is_featured ? 'Remover Destaque' : 'Ativar Destaque'}
                  </button>
                  <button
                    onClick={() => onDeleteListing(item.id)}
                    className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PLANS & MONETIZATION */}
      {activeTab === 'plans' && (
        <div className="pt-6 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl font-black text-slate-900">
              Planos Comerciais para Vendedores em Portugal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Aumente as suas vendas com maior visibilidade, mais fotos e equipa de utilizadores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FREE PLAN */}
            <div className={`bg-white rounded-3xl p-6 border transition-all ${plan.code === 'free' ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">Plano FREE</h3>
                {plan.code === 'free' && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Plano Atual
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-3xl font-black text-slate-900">0 €</span>
                <span className="text-xs text-slate-500">/mês</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4 mb-6">
                <li className="flex items-center gap-2">✓ Até 2 anúncios ativos</li>
                <li className="flex items-center gap-2">✓ 3 fotos por anúncio</li>
                <li className="flex items-center gap-2">✓ Até 5 cliques únicos mensais</li>
                <li className="flex items-center gap-2">✓ Até 5 contactos mensais</li>
                <li className="flex items-center gap-2 text-slate-400">✗ Sem vídeos</li>
                <li className="flex items-center gap-2 text-slate-400">✗ Sem destaques gratuitos</li>
              </ul>
              {plan.code === 'free' ? (
                <button disabled className="w-full bg-slate-100 text-slate-500 text-xs font-bold py-2.5 rounded-xl">
                  Plano Ativo
                </button>
              ) : (
                <button
                  onClick={() => onUpgradePlan('premium')}
                  className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Regressar ao Free
                </button>
              )}
            </div>

            {/* PREMIUM PLAN */}
            <div className={`bg-white rounded-3xl p-6 border relative transition-all ${plan.code === 'premium' ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-lg' : 'border-slate-200 hover:border-slate-300'}`}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full">
                Mais Popular
              </span>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">Plano PREMIUM</h3>
                {plan.code === 'premium' && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Plano Atual
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-3xl font-black text-slate-900">19,90 €</span>
                <span className="text-xs text-slate-500">/mês</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4 mb-6">
                <li className="flex items-center gap-2 font-bold text-slate-900">✓ Até 20 anúncios ativos</li>
                <li className="flex items-center gap-2">✓ 10 fotos por anúncio</li>
                <li className="flex items-center gap-2">✓ Até 500 cliques únicos mensais</li>
                <li className="flex items-center gap-2">✓ Até 100 contactos mensais</li>
                <li className="flex items-center gap-2">✓ Suporte a Vídeos</li>
                <li className="flex items-center gap-2 font-bold text-emerald-700">✓ 2 Destaques mensais incluídos</li>
                <li className="flex items-center gap-2">✓ Até 3 colaboradores de equipa</li>
              </ul>
              <button
                onClick={() => onUpgradePlan('premium')}
                className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer ${
                  plan.code === 'premium' ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                }`}
              >
                {plan.code === 'premium' ? 'Plano Atual Ativo' : 'Escolher Plano Premium'}
              </button>
            </div>

            {/* BUSINESS PLAN */}
            <div className={`bg-white rounded-3xl p-6 border transition-all ${plan.code === 'business' ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-lg' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">Plano BUSINESS</h3>
                {plan.code === 'business' && (
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Plano Atual
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-3xl font-black text-slate-900">49,90 €</span>
                <span className="text-xs text-slate-500">/mês</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4 mb-6">
                <li className="flex items-center gap-2 font-bold text-slate-900">✓ Até 100 anúncios ativos</li>
                <li className="flex items-center gap-2">✓ 20 fotos por anúncio</li>
                <li className="flex items-center gap-2">✓ Até 2.000 cliques únicos mensais</li>
                <li className="flex items-center gap-2">✓ Até 500 contactos mensais</li>
                <li className="flex items-center gap-2">✓ Suporte a Vídeos</li>
                <li className="flex items-center gap-2 font-bold text-purple-700">✓ 10 Destaques mensais incluídos</li>
                <li className="flex items-center gap-2">✓ Até 10 colaboradores de equipa</li>
                <li className="flex items-center gap-2">✓ Suporte prioritário por telefone</li>
              </ul>
              <button
                onClick={() => onUpgradePlan('business')}
                className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer ${
                  plan.code === 'business' ? 'bg-purple-50 text-purple-700' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                }`}
              >
                {plan.code === 'business' ? 'Plano Atual Ativo' : 'Escolher Plano Business'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
