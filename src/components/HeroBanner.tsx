import React from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Sparkles,
  Car,
  Home,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PlatformSettings } from '../types/database.types';

interface HeroBannerProps {
  settings: PlatformSettings;
  onExploreCategory: (slug: string) => void;
  onPublishClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  onExploreCategory,
  onPublishClick,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-white py-12 sm:py-16">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>O Ecossistema Comercial Multicategoria de Portugal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            {settings.banner_headline}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl">
            {settings.banner_subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onPublishClick}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Publicar Anúncio Gratuito</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onExploreCategory('viaturas')}
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-2xl transition-all cursor-pointer"
            >
              Ver Viaturas
            </button>

            <button
              onClick={() => onExploreCategory('imoveis')}
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-2xl transition-all cursor-pointer"
            >
              Ver Imóveis
            </button>
          </div>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-8 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Vendedores Verificados</h4>
              <p className="text-[11px] text-slate-400">Verificação com NIF português</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Envio Nacional</h4>
              <p className="text-[11px] text-slate-400">Integração CTT & DPD</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">MB WAY & Multibanco</h4>
              <p className="text-[11px] text-slate-400">Pagamentos 100% seguros</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Compra, Venda e Aluguer</h4>
              <p className="text-[11px] text-slate-400">Diário, semanal ou mensal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
