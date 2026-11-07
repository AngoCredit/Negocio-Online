import React, { useState } from 'react';
import {
  X,
  MapPin,
  Truck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Phone,
  Share2,
  Flag,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  ShoppingBag,
  ExternalLink,
  Car,
  Home,
  Clock,
  Sparkles
} from 'lucide-react';
import { Listing, Profile } from '../types/database.types';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  currentUser: Profile;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddToCart: (listing: Listing) => void;
  onStartChat: (listing: Listing) => void;
  onRequestVisit: (listing: Listing, data: { name: string; phone: string; email: string; date: string; notes: string; type: string }) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  currentUser,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onStartChat,
  onRequestVisit,
}) => {
  if (!listing) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitType, setVisitType] = useState(
    listing.category_slug === 'viaturas' ? 'visita_viatura' :
    listing.category_slug === 'imoveis' ? 'visita_imovel' :
    listing.category_slug === 'alugueres' ? 'reserva_aluguer' : 'formulario'
  );
  const [visitorName, setVisitorName] = useState(currentUser.full_name);
  const [visitorEmail, setVisitorEmail] = useState(currentUser.email);
  const [visitorPhone, setVisitorPhone] = useState(currentUser.phone || '+351 9');
  const [preferredDate, setPreferredDate] = useState('');
  const [rentalDays, setRentalDays] = useState(3);
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const images = listing.images && listing.images.length > 0 ? listing.images : [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80'
  ];

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestVisit(listing, {
      name: visitorName,
      email: visitorEmail,
      phone: visitorPhone,
      date: preferredDate,
      notes: notes + (listing.category_slug === 'alugueres' ? ` | Duração pretendida: ${rentalDays} dias` : ''),
      type: visitType,
    });
    setSuccessMessage('Pedido registado com sucesso! A nossa equipa e o vendedor entrarão em contacto.');
    setTimeout(() => {
      setShowVisitForm(false);
      setSuccessMessage('');
    }, 2800);
  };

  const renderDynamicSpecsTable = () => {
    const attr = listing.attributes || {};
    const entries = Object.entries(attr);
    if (entries.length === 0) return null;

    const translateKey = (k: string) => {
      const dict: Record<string, string> = {
        brand: 'Marca',
        model: 'Modelo',
        year: 'Ano de Registo',
        km: 'Quilometragem',
        fuel: 'Combustível',
        gearbox: 'Caixa de Velocidades',
        power_cv: 'Potência',
        body_type: 'Tipo de Carroçaria',
        property_type: 'Tipo de Imóvel',
        typology: 'Tipologia',
        area_m2: 'Área Útil',
        bedrooms: 'Quartos',
        bathrooms: 'Casas de Banho',
        energy_certificate: 'Certificado Energético',
        transaction_type: 'Finalidade',
        parking_spaces: 'Lugares de Estacionamento',
        equipment_type: 'Tipo de Equipamento',
        capacity_people: 'Capacidade',
        included_km_per_day: 'Km Incluídos',
        min_days: 'Estadia Mínima',
        volume_ml: 'Volume',
        product_type: 'Tipo de Artigo',
        skin_type: 'Tipo de Pele',
        expiry_date: 'Validade',
        processor: 'Processador',
        ram_gb: 'Memória RAM',
        storage_ssd: 'Armazenamento',
        screen_size: 'Tamanho de Ecrã',
        material: 'Material',
        seats: 'Lugares',
        dimensions: 'Dimensões',
        color: 'Cor',
      };
      return dict[k] || k.replace(/_/g, ' ');
    };

    return (
      <div className="mt-6">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Especificações & Características
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map(([key, val]) => (
            <div key={key} className="bg-slate-50 border border-slate-200/70 rounded-xl p-3">
              <span className="text-[11px] text-slate-500 font-medium block capitalize">
                {translateKey(key)}
              </span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block truncate">
                {String(val)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Carousel */}
        <div className="relative aspect-16/9 bg-slate-950 overflow-hidden group">
          <img
            src={images[activeImageIdx]}
            alt={listing.title}
            className="w-full h-full object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                {activeImageIdx + 1} de {images.length} fotos
              </div>
            </>
          )}
        </div>

        {/* Thumbnails row */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 bg-slate-100 overflow-x-auto border-b border-slate-200">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIdx === i ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Details & Actions Body */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: Info & Description */}
            <div className="flex-1">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {listing.is_featured && (
                  <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" /> Destaque
                  </span>
                )}
                {listing.listing_type === 'rental' && (
                  <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Aluguer
                  </span>
                )}
                {listing.delivery_available && (
                  <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" /> Entrega em Portugal
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  Publicado em {new Date(listing.created_at).toLocaleDateString('pt-PT')}
                </span>
              </div>

              {/* Title & Price */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {listing.title}
              </h1>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-700 tracking-tight">
                  {formatPrice(listing.price)}
                </span>
                {listing.listing_type === 'rental' && (
                  <span className="text-sm font-semibold text-slate-500">por dia</span>
                )}
                {listing.price_negotiable && (
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    Preço negociável
                  </span>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {listing.freguesia ? `${listing.freguesia}, ` : ''}
                  {listing.concelho}, Distrito de {listing.district}
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Descrição do Anúncio
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Dynamic Specs Table */}
              {renderDynamicSpecsTable()}

              {/* Rental pricing table if rental */}
              {listing.listing_type === 'rental' && (
                <div className="mt-6 bg-teal-50/70 border border-teal-200 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-700" /> Tarifário de Aluguer
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                      <span className="text-slate-500 text-[10px] block">Diário</span>
                      <strong className="text-teal-900 text-sm font-black">{formatPrice(listing.rental_price_daily || listing.price)}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                      <span className="text-slate-500 text-[10px] block">Semanal</span>
                      <strong className="text-teal-900 text-sm font-black">{listing.rental_price_weekly ? formatPrice(listing.rental_price_weekly) : 'Sob consulta'}</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                      <span className="text-slate-500 text-[10px] block">Caução</span>
                      <strong className="text-teal-900 text-sm font-black">{listing.rental_deposit ? formatPrice(listing.rental_deposit) : '0 €'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Seller & Action Box */}
            <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
              {/* Seller Profile Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Informação do Vendedor
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"
                      alt={listing.seller_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                      {listing.seller_name || 'Vendedor'}
                      {listing.seller_verified && (
                        <span title="Verificado">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </h5>
                    <p className="text-xs text-slate-500">
                      {listing.seller_is_pro ? 'Vendedor Profissional' : 'Vendedor Particular'}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>4.9 (38 avaliações)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Perfil Verificado
                  </span>
                  <span className="text-[11px] text-slate-400">Desde 2026</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                {/* Specific Action for Cars or Real Estate or Rentals */}
                {listing.category_slug === 'viaturas' && (
                  <button
                    onClick={() => {
                      setVisitType('visita_viatura');
                      setShowVisitForm(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Car className="w-4 h-4 text-emerald-400" />
                    <span>Agendar Test Drive / Visita</span>
                  </button>
                )}

                {listing.category_slug === 'imoveis' && (
                  <button
                    onClick={() => {
                      setVisitType('visita_imovel');
                      setShowVisitForm(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Home className="w-4 h-4 text-emerald-400" />
                    <span>Pedir Visita ao Imóvel</span>
                  </button>
                )}

                {listing.category_slug === 'alugueres' && (
                  <button
                    onClick={() => {
                      setVisitType('reserva_aluguer');
                      setShowVisitForm(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-teal-200" />
                    <span>Reservar Período de Aluguer</span>
                  </button>
                )}

                {/* Direct Buy / Add to Cart for standard goods */}
                {listing.listing_type !== 'rental' && listing.category_slug !== 'viaturas' && listing.category_slug !== 'imoveis' && (
                  <button
                    onClick={() => onAddToCart(listing)}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Comprar com Entrega ({formatPrice(listing.price)})</span>
                  </button>
                )}

                {/* Internal Chat */}
                <button
                  onClick={() => onStartChat(listing)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Chat em Direto com o Vendedor</span>
                </button>

                {/* WhatsApp Direct Option */}
                <a
                  href={`https://wa.me/351925111222?text=${encodeURIComponent(`Olá! Vi o anúncio "${listing.title}" no Marketplace Portugal e gostaria de obter mais informações.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold py-2.5 px-4 rounded-xl border border-emerald-200 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Contactar via WhatsApp</span>
                </a>

                {/* Favorite & Share */}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={(e) => onToggleFavorite(listing.id, e)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isFavorite ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{isFavorite ? 'Guardado' : 'Favorito'}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      alert('Ligação copiada para a área de transferência!');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Partilhar</span>
                  </button>
                </div>
              </div>

              {/* Safety notice */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Dica de Segurança:</strong> Nunca envie dinheiro antecipado para contas particulares sem ver a viatura ou imóvel presencialmente.
                </span>
              </div>
            </div>
          </div>

          {/* Visit Booking / Lead Modal Overlay */}
          {showVisitForm && (
            <div className="mt-6 border-t border-slate-200 pt-6 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-3xl">
              <div className="max-w-xl mx-auto bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    {visitType === 'visita_viatura' ? 'Agendar Test Drive & Visita à Viatura' :
                     visitType === 'visita_imovel' ? 'Marcar Visita Presencial ao Imóvel' :
                     visitType === 'reserva_aluguer' ? 'Pedido de Reserva de Aluguer' : 'Pedido de Contacto'}
                  </h4>
                  <button onClick={() => setShowVisitForm(false)} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
                    Cancelar
                  </button>
                </div>

                {successMessage ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl font-medium text-center">
                    {successMessage}
                  </div>
                ) : (
                  <form onSubmit={handleVisitSubmit} className="space-y-3">
                    <p className="text-xs text-slate-600">
                      O seu pedido será encaminhado diretamente para o vendedor e registado no sistema de acompanhamento.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">O seu nome</label>
                        <input
                          type="text"
                          required
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Contacto Telefónico</label>
                        <input
                          type="text"
                          required
                          value={visitorPhone}
                          onChange={(e) => setVisitorPhone(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={visitorEmail}
                          onChange={(e) => setVisitorEmail(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Data / Horário de Preferência</label>
                        <input
                          type="datetime-local"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {visitType === 'reserva_aluguer' && (
                      <div className="bg-teal-50 p-3 rounded-xl border border-teal-200">
                        <label className="text-xs font-semibold text-teal-900 block mb-1">
                          Número de dias de aluguer: {rentalDays} dias
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          value={rentalDays}
                          onChange={(e) => setRentalDays(Number(e.target.value))}
                          className="w-full cursor-pointer accent-teal-600"
                        />
                        <div className="flex justify-between text-[11px] text-teal-800 font-bold mt-1">
                          <span>Total estimado: {formatPrice((listing.rental_price_daily || listing.price) * rentalDays)}</span>
                          <span>+ Caução ({listing.rental_deposit || 0} €)</span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Mensagem ou Observações (opcional)</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ex: Pretendo retoma de viatura, simulação de crédito, visita ao sábado..."
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Confirmar e Enviar Pedido
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
