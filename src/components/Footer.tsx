import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { PlatformSettings } from '../types/database.types';

interface FooterProps {
  settings: PlatformSettings;
  onSelectCategory: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onSelectCategory }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                M
              </div>
              <span className="text-white text-base font-black tracking-tight">
                {settings.platform_name}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {settings.tagline}. A plataforma nacional de comércio, viaturas, imóveis e alugueres adaptada às normas de Portugal e da União Europeia.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Lisboa • Porto • Todo o Portugal
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> {settings.support_phone}
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-500" /> {settings.support_email}
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Categorias Populares
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('viaturas')} className="hover:text-white transition-colors cursor-pointer">
                  Viaturas & Automóveis
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('imoveis')} className="hover:text-white transition-colors cursor-pointer">
                  Casas & Imóveis (Venda e Arrendamento)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('alugueres')} className="hover:text-white transition-colors cursor-pointer">
                  Aluguer de Veículos e Equipamentos
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('cosmeticos')} className="hover:text-white transition-colors cursor-pointer">
                  Cosméticos & Beleza
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('eletronica')} className="hover:text-white transition-colors cursor-pointer">
                  Eletrónica & Informática
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('servicos')} className="hover:text-white transition-colors cursor-pointer">
                  Serviços Profissionais
                </button>
              </li>
            </ul>
          </div>

          {/* RGPD & Legal */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Conformidade & Jurídico (Portugal)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#termos" onClick={(e) => { e.preventDefault(); alert('Termos e Condições gerais de utilização de acordo com o direito português.'); }} className="hover:text-white transition-colors">
                  Termos e Condições
                </a>
              </li>
              <li>
                <a href="#rgpd" onClick={(e) => { e.preventDefault(); alert('Política de Privacidade e Proteção de Dados (Regulamento Geral de Proteção de Dados - RGPD).'); }} className="hover:text-white transition-colors">
                  Política de Privacidade & RGPD
                </a>
              </li>
              <li>
                <a href="#cookies" onClick={(e) => { e.preventDefault(); alert('Política de Cookies e gestão de consentimento.'); }} className="hover:text-white transition-colors">
                  Política de Cookies
                </a>
              </li>
              <li>
                <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Livro de Reclamações Eletrónico
                </a>
              </li>
              <li>
                <a href="#rll" onClick={(e) => { e.preventDefault(); alert('Resolução de Litígios em Linha (Direção-Geral do Consumidor).'); }} className="hover:text-white transition-colors">
                  Resolução Alternativa de Litígios
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Security badges */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Pagamentos Seguros
            </h4>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Transações protegidas através de referências Multibanco, MB WAY e Cartões com autenticação forte 3D Secure.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-300">
              <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">MB WAY</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">Multibanco</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">Visa / Mastercard</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">CTT Expresso</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} {settings.platform_name}. Todos os direitos reservados. Fuso horário Europe/Lisbon.</p>
          <p className="flex items-center gap-1">
            Desenvolvido para o mercado português com PostgreSQL & Supabase Ready
          </p>
        </div>
      </div>
    </footer>
  );
};
