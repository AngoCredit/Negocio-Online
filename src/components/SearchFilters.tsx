import React from 'react';
import {
  Filter,
  RotateCcw,
  MapPin,
  Tag,
  Truck,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { Category, PORTUGAL_DISTRICTS } from '../types/database.types';

interface SearchFiltersProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  selectedDistrict: string;
  onSelectDistrict: (dist: string) => void;
  minPrice: string;
  onMinPriceChange: (v: string) => void;
  maxPrice: string;
  onMaxPriceChange: (v: string) => void;
  condition: string;
  onConditionChange: (v: string) => void;
  sellerType: string;
  onSellerTypeChange: (v: string) => void;
  deliveryOnly: boolean;
  onDeliveryOnlyChange: (v: boolean) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (v: boolean) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
  onReset: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  selectedDistrict,
  onSelectDistrict,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  condition,
  onConditionChange,
  sellerType,
  onSellerTypeChange,
  deliveryOnly,
  onDeliveryOnlyChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  sortBy,
  onSortByChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          Filtros de Pesquisa
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Limpar
        </button>
      </div>

      {/* Category selector */}
      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1.5">
          Categoria
        </label>
        <select
          value={selectedCategorySlug}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="">Todas as Categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* District in Portugal */}
      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> Distrito (Portugal)
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => onSelectDistrict(e.target.value)}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="">Todo o Portugal</option>
          {PORTUGAL_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1.5">
          Gama de Preço (€)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min €"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="number"
            placeholder="Max €"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1.5">
          Estado do Artigo
        </label>
        <select
          value={condition}
          onChange={(e) => onConditionChange(e.target.value)}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="">Todos os Estados</option>
          <option value="Novo">Novo</option>
          <option value="Como novo">Como novo</option>
          <option value="Bom estado">Bom estado</option>
          <option value="Usado">Usado</option>
        </select>
      </div>

      {/* Seller Type */}
      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1.5">
          Tipo de Vendedor
        </label>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-center text-xs">
          <button
            type="button"
            onClick={() => onSellerTypeChange('all')}
            className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              sellerType === 'all' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => onSellerTypeChange('particular')}
            className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              sellerType === 'particular' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Particular
          </button>
          <button
            type="button"
            onClick={() => onSellerTypeChange('pro')}
            className={`py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              sellerType === 'pro' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profissional
          </button>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
          <input
            type="checkbox"
            checked={deliveryOnly}
            onChange={(e) => onDeliveryOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-slate-400" /> Entrega em casa disponível
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Apenas vendedores verificados
          </span>
        </label>
      </div>

      {/* Sorting */}
      <div className="pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" /> Ordenar Por
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="recent">Mais Recentes</option>
          <option value="price_asc">Menor Preço (€ - €€€)</option>
          <option value="price_desc">Maior Preço (€€€ - €)</option>
          <option value="popular">Mais Visualizados</option>
        </select>
      </div>
    </div>
  );
};
