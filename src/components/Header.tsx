import React, { useState } from 'react';
import {
  ShoppingBag,
  PlusCircle,
  Shield,
  Store,
  MessageSquare,
  Search,
  MapPin,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { Profile, PlatformSettings, UserRole, PORTUGAL_DISTRICTS } from '../types/database.types';

interface HeaderProps {
  currentUser: Profile;
  allUsers: Profile[];
  settings: PlatformSettings;
  activeView: 'marketplace' | 'seller_portal' | 'admin_panel' | 'search';
  onViewChange: (view: 'marketplace' | 'seller_portal' | 'admin_panel' | 'search') => void;
  onUserChange: (user: Profile) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  unreadChatCount: number;
  onPublishClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDistrict: string;
  onDistrictChange: (d: string) => void;
  onSearchSubmit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  settings,
  activeView,
  onViewChange,
  onUserChange,
  cartCount,
  onOpenCart,
  onOpenChat,
  unreadChatCount,
  onPublishClick,
  searchQuery,
  onSearchChange,
  selectedDistrict,
  onDistrictChange,
  onSearchSubmit,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const isSuperOrAdmin = currentUser.role === 'super_admin' || currentUser.role === 'admin';
  const isSeller = currentUser.role === 'pro_seller' || currentUser.role === 'private_seller' || isSuperOrAdmin;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">Super Admin</span>;
      case 'admin':
        return <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">Admin</span>;
      case 'pro_seller':
        return <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold">Vendedor Pro</span>;
      case 'private_seller':
        return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">Particular</span>;
      case 'courier':
        return <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">Estafeta</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">Comprador</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice for Portugal Marketplace & Quick Role Switcher */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Mercado Portugal • EUR (€)
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Suporte em Lisboa: <strong className="text-white">{settings.support_phone}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Simular Papel (RBAC):</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = allUsers.find(u => u.id === e.target.value);
                if (found) {
                  onUserChange(found);
                  if (activeView === 'admin_panel' && found.role !== 'super_admin' && found.role !== 'admin') {
                    onViewChange('marketplace');
                  }
                }
              }}
              className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-0.5 border border-slate-700 hover:border-slate-500 focus:outline-hidden"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div
            onClick={() => onViewChange('marketplace')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
              M
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                {settings.platform_name}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">
                Portugal Oficial
              </span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl bg-slate-100 rounded-full border border-slate-200 p-1 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
            <div className="flex items-center pl-3 pr-2 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar viaturas, apartamentos, ferramentas, cosméticos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchSubmit();
                }
              }}
              className="bg-transparent flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden px-1"
            >
            </input>

            {/* District selector in search */}
            <div className="flex items-center border-l border-slate-300 pl-2 pr-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
              <select
                value={selectedDistrict}
                onChange={(e) => onDistrictChange(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden py-1 max-w-[130px] truncate cursor-pointer"
              >
                <option value="">Todo o Portugal</option>
                {PORTUGAL_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onSearchSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors ml-1"
            >
              Pesquisar
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Post Ad CTA */}
            <button
              onClick={onPublishClick}
              className="flex items-center gap-1.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Anúncio</span>
            </button>

            {/* Chat Drawer Trigger */}
            <button
              onClick={onOpenChat}
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Mensagens & Chat"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadChatCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Shopping Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Carrinho de Compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all cursor-pointer"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.full_name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <span className="text-xs font-semibold text-slate-800 hidden md:inline truncate max-w-[120px]">
                  {currentUser.full_name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-1.5">{getRoleBadge(currentUser.role)}</div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onViewChange('marketplace');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                        activeView === 'marketplace' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span>Marketplace Público</span>
                    </button>

                    {isSeller && (
                      <button
                        onClick={() => {
                          onViewChange('seller_portal');
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                          activeView === 'seller_portal' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <PackageCheck className="w-4 h-4 text-purple-600" />
                        <span>Área do Vendedor (Anúncios & Vendas)</span>
                      </button>
                    )}

                    {isSuperOrAdmin && (
                      <button
                        onClick={() => {
                          onViewChange('admin_panel');
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                          activeView === 'admin_panel' ? 'bg-red-50 text-red-700' : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Shield className="w-4 h-4 text-red-600" />
                        <span>Painel Super Admin & CRM</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Trocar Perfil (RBAC Test)
                    </div>
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onUserChange(u);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                          u.id === currentUser.id ? 'text-emerald-700 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        <span className="truncate">{u.full_name}</span>
                        {getRoleBadge(u.role)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 lg:hidden flex items-center gap-2">
          <div className="flex-1 flex items-center bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar anúncios..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearchSubmit();
              }}
              className="bg-transparent text-xs text-slate-800 placeholder-slate-400 w-full focus:outline-hidden"
            />
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-xs text-slate-700 rounded-xl px-2.5 py-2 font-medium"
          >
            <option value="">Todo o país</option>
            {PORTUGAL_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
