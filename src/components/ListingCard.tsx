import React from 'react';
import {
  Heart,
  MapPin,
  Truck,
  CheckCircle2,
  Sparkles,
  Calendar,
  Gauge,
  Fuel,
  Maximize2
} from 'lucide-react';
import { Listing } from '../types/database.types';

interface ListingCardProps {
  listing: Listing;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const renderCategorySpecs = () => {
    const attr = listing.attributes || {};
    if (listing.category_slug === 'viaturas') {
      return (
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5 flex-wrap">
          {attr.year && <span className="bg-slate-100 px-1.5 py-0.5 rounded font-medium">{String(attr.year)}</span>}
          {attr.km && (
            <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
              <Gauge className="w-3 h-3 text-slate-400" />
              {Number(attr.km).toLocaleString('pt-PT')} km
            </span>
          )}
          {attr.fuel && (
            <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
              <Fuel className="w-3 h-3 text-slate-400" />
              {String(attr.fuel)}
            </span>
          )}
        </div>
      );
    }

    if (listing.category_slug === 'imoveis') {
      return (
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5 flex-wrap">
          {attr.typology && <span className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">{String(attr.typology)}</span>}
          {attr.area_m2 && (
            <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
              <Maximize2 className="w-3 h-3 text-slate-400" />
              {String(attr.area_m2)} m²
            </span>
          )}
          {attr.energy_certificate && (
            <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
              Cert. {String(attr.energy_certificate)}
            </span>
          )}
        </div>
      );
    }

    if (listing.category_slug === 'alugueres') {
      return (
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 bg-teal-50 text-teal-800 font-bold px-1.5 py-0.5 rounded">
            <Calendar className="w-3 h-3" />
            Aluguer diário / semanal
          </span>
          {listing.rental_deposit && (
            <span className="text-slate-400 text-[10px]">
              Caução: {listing.rental_deposit} €
            </span>
          )}
        </div>
      );
    }

    if (listing.category_slug === 'cosmeticos' && attr.brand) {
      return (
        <div className="text-[11px] text-slate-500 mt-1.5 truncate">
          Marca: <span className="font-semibold text-slate-700">{String(attr.brand)}</span>
          {attr.volume_ml && <span> • {String(attr.volume_ml)}</span>}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      onClick={() => onClick(listing)}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer relative"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center z-10">
          {listing.is_featured && (
            <span className="inline-flex items-center gap-1 bg-linear-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" />
              Destaque
            </span>
          )}
          {listing.listing_type === 'rental' && (
            <span className="inline-flex items-center gap-1 bg-teal-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
              Aluguer
            </span>
          )}
          {listing.delivery_available && (
            <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm">
              <Truck className="w-3 h-3 text-emerald-400" />
              Entrega
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(listing.id, e)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:text-red-600 hover:bg-white shadow-sm transition-all z-10 cursor-pointer"
          title={isFavorite ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
        </button>

        {/* Location tag bottom on image */}
        <div className="absolute bottom-2.5 left-2.5 text-white flex items-center gap-1 text-[11px] font-medium drop-shadow-xs z-10">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate max-w-[200px]">
            {listing.concelho}, {listing.district}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price display */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              {formatPrice(listing.price)}
              {listing.listing_type === 'rental' && (
                <span className="text-xs font-normal text-slate-500"> / dia</span>
              )}
            </span>
            {listing.condition && (
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {listing.condition}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {listing.title}
          </h3>

          {/* Dynamic Specs */}
          {renderCategorySpecs()}
        </div>

        {/* Footer info: Seller & Date */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1 truncate max-w-[150px]">
            <span className="truncate font-medium text-slate-700">
              {listing.seller_name || 'Vendedor Particular'}
            </span>
            {listing.seller_verified && (
              <span title="Vendedor Verificado">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
          <span className="shrink-0 text-slate-400">
            {listing.seller_is_pro ? 'Profissional' : 'Particular'}
          </span>
        </div>
      </div>
    </div>
  );
};
