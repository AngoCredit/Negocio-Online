import React, { useState } from 'react';
import {
  Shield,
  Users,
  Target,
  Kanban,
  FileText,
  DollarSign,
  Package,
  Settings,
  Database,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Lock,
  Search,
  Filter,
  Eye,
  Trash2,
  Copy,
  Check,
  Send,
  Building,
  UserCheck
} from 'lucide-react';
import {
  Profile,
  Listing,
  Lead,
  LeadStatus,
  CrmNote,
  Plan,
  PlatformSettings,
  UserRole
} from '../types/database.types';

interface AdminPanelProps {
  currentUser: Profile;
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onAddCrmNote: (leadId: string, content: string) => void;
  crmNotes: CrmNote[];
  listings: Listing[];
  onModerateListing: (listingId: string, action: 'approve' | 'reject' | 'highlight') => void;
  allUsers: Profile[];
  onUpdateUserRole: (userId: string, role: UserRole) => void;
  plans: Plan[];
  onUpdatePlan: (plan: Plan) => void;
  settings: PlatformSettings;
  onSaveSettings: (settings: PlatformSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  leads,
  onUpdateLeadStatus,
  onAddCrmNote,
  crmNotes,
  listings,
  onModerateListing,
  allUsers,
  onUpdateUserRole,
  plans,
  onUpdatePlan,
  settings,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'listings' | 'users' | 'plans' | 'settings' | 'sql'>('crm');
  const [crmSubTab, setCrmSubTab] = useState<'pipeline' | 'leads_list' | 'metrics'>('pipeline');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // Platform settings editing state
  const [editingSettings, setEditingSettings] = useState<PlatformSettings>({ ...settings });
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // CRM Pipeline columns
  const PIPELINE_STAGES: { id: LeadStatus; label: string; color: string; badge: string }[] = [
    { id: 'novo', label: '1. Novos Pedidos', color: 'border-blue-500 bg-blue-50/40', badge: 'bg-blue-100 text-blue-800' },
    { id: 'contactado', label: '2. Contactados', color: 'border-amber-500 bg-amber-50/40', badge: 'bg-amber-100 text-amber-800' },
    { id: 'em_negociacao', label: '3. Em Negociação', color: 'border-purple-500 bg-purple-50/40', badge: 'bg-purple-100 text-purple-800' },
    { id: 'convertido', label: '4. Convertidos / Fechados', color: 'border-emerald-500 bg-emerald-50/40', badge: 'bg-emerald-100 text-emerald-800' },
    { id: 'perdido', label: '5. Perdidos / Cancelados', color: 'border-slate-400 bg-slate-50', badge: 'bg-slate-200 text-slate-700' },
  ];

  const selectedLead = leads.find(l => l.id === selectedLeadId);
  const leadNotes = crmNotes.filter(n => n.lead_id === selectedLeadId);

  // Metrics
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'convertido').length;
  const inNegotiationLeads = leads.filter(l => l.status === 'em_negociacao').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';
  const totalDealValue = leads.reduce((acc, l) => acc + (l.deal_value || 0), 0);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !newNoteContent.trim()) return;
    onAddCrmNote(selectedLeadId, newNoteContent.trim());
    setNewNoteContent('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(editingSettings);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Painel Super Admin & CRM Central
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-red-600" />
            <strong className="text-red-700">Acesso Restrito:</strong> Este painel e o módulo de CRM são estritamente exclusivos de administradores. Vendedores e compradores não têm acesso.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-xl font-bold">
            {currentUser.full_name} ({currentUser.role})
          </span>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto py-4 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'crm', label: 'CRM Comercial Exclusivo', icon: Target },
          { id: 'listings', label: `Moderação de Anúncios (${listings.length})`, icon: Package },
          { id: 'users', label: `Gestão de Utilizadores (${allUsers.length})`, icon: Users },
          { id: 'plans', label: 'Configuração de Planos SaaS', icon: DollarSign },
          { id: 'settings', label: 'Definições da Plataforma', icon: Settings },
          { id: 'sql', label: 'Estrutura SQL & Supabase', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 1. CRM CENTRAL EXCLUSIVO DO SUPER ADMIN */}
      {/* ============================================================== */}
      {activeTab === 'crm' && (
        <div className="pt-6 space-y-6">
          {/* CRM KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Total de Leads</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{totalLeads}</span>
              <span className="text-[10px] text-slate-400">Viaturas, imóveis, alugueres</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Em Negociação</span>
              <span className="text-2xl font-black text-purple-700 mt-1 block">{inNegotiationLeads}</span>
              <span className="text-[10px] text-purple-600">Com acompanhamento ativo</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Convertidos / Fechados</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">{convertedLeads}</span>
              <span className="text-[10px] text-emerald-600">Vendas e subscrições</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Taxa de Conversão</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">{conversionRate}%</span>
              <span className="text-[10px] text-blue-600">Leads convertidas</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[11px] font-semibold text-slate-500 block">Volume Total em Pipeline</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {totalDealValue.toLocaleString('pt-PT')} €
              </span>
              <span className="text-[10px] text-slate-400">Valor potencial de negócios</span>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setCrmSubTab('pipeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  crmSubTab === 'pipeline' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Pipeline Visual (Kanban)
              </button>
              <button
                onClick={() => setCrmSubTab('leads_list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  crmSubTab === 'leads_list' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tabela de Leads
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Apenas administradores podem visualizar e adicionar notas confidenciais.
            </span>
          </div>

          {/* KANBAN PIPELINE VIEW */}
          {crmSubTab === 'pipeline' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 overflow-x-auto min-h-[460px]">
              {PIPELINE_STAGES.map((stage) => {
                const stageLeads = leads.filter(l => l.status === stage.id);
                return (
                  <div
                    key={stage.id}
                    className={`rounded-2xl border-t-4 border p-3 flex flex-col justify-between ${stage.color} bg-white shadow-xs`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-slate-800">{stage.label}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.badge}`}>
                          {stageLeads.length}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            onClick={() => setSelectedLeadId(lead.id)}
                            className={`p-3 rounded-xl border bg-white shadow-xs transition-all cursor-pointer hover:border-slate-400 ${
                              selectedLeadId === lead.id ? 'ring-2 ring-red-500 border-red-500' : 'border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                              <span className="font-mono font-bold text-slate-700">{lead.lead_code}</span>
                              <span className="capitalize">{lead.origin.replace(/_/g, ' ')}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {lead.buyer_name}
                            </h4>
                            <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                              {lead.listing_title || 'Interesse Comercial'}
                            </p>
                            {lead.deal_value && (
                              <p className="text-xs font-black text-emerald-700 mt-1">
                                {lead.deal_value.toLocaleString('pt-PT')} €
                              </p>
                            )}

                            {/* Move to next stage quick button */}
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">
                                {lead.assigned_admin_name || 'Admin'}
                              </span>
                              <select
                                value={lead.status}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  onUpdateLeadStatus(lead.id, e.target.value as LeadStatus);
                                }}
                                className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-bold cursor-pointer"
                              >
                                {PIPELINE_STAGES.map(s => (
                                  <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}

                        {stageLeads.length === 0 && (
                          <div className="text-center py-8 text-slate-400 text-xs">
                            Sem leads nesta etapa
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE VIEW */}
          {crmSubTab === 'leads_list' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Código</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Origem</th>
                    <th className="p-3">Anúncio / Vendedor</th>
                    <th className="p-3">Valor</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => setSelectedLeadId(l.id)}
                      className={`hover:bg-slate-50 cursor-pointer ${selectedLeadId === l.id ? 'bg-red-50/40' : ''}`}
                    >
                      <td className="p-3 font-mono font-bold text-slate-700">{l.lead_code}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{l.buyer_name}</span>
                        <span className="text-[11px] text-slate-500">{l.buyer_phone || l.buyer_email}</span>
                      </td>
                      <td className="p-3 capitalize">{l.origin.replace(/_/g, ' ')}</td>
                      <td className="p-3">
                        <span className="truncate block max-w-[200px]">{l.listing_title || '-'}</span>
                        <span className="text-[10px] text-slate-400">{l.seller_name}</span>
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {l.deal_value ? `${l.deal_value.toLocaleString('pt-PT')} €` : '-'}
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                          {l.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLeadId(l.id);
                          }}
                          className="text-red-600 font-bold hover:underline"
                        >
                          Ver Ficha
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* LEAD DETAIL & PRIVATE INTERNAL NOTES DRAWER */}
          {selectedLead && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                      {selectedLead.lead_code}
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      {selectedLead.buyer_name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Origem: <strong className="capitalize">{selectedLead.origin.replace(/_/g, ' ')}</strong> • Anúncio: {selectedLead.listing_title || 'Não associado'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Estado Atual:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => onUpdateLeadStatus(selectedLead.id, e.target.value as LeadStatus)}
                    className="text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 cursor-pointer"
                  >
                    {PIPELINE_STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* Contact details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                    Dados do Comprador / Lead
                  </h4>
                  <p><strong>Email:</strong> {selectedLead.buyer_email}</p>
                  <p><strong>Telefone:</strong> {selectedLead.buyer_phone || 'Não disponibilizado'}</p>
                  <p><strong>Vendedor Notificado:</strong> {selectedLead.seller_name || '-'}</p>
                  <p><strong>Data Preferencial de Visita/Reserva:</strong> {selectedLead.preferred_date ? new Date(selectedLead.preferred_date).toLocaleString('pt-PT') : 'Imediata'}</p>
                  {selectedLead.notes_summary && (
                    <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700">
                      <strong>Mensagem do Comprador:</strong> {selectedLead.notes_summary}
                    </div>
                  )}
                </div>

                {/* Confidential Internal Notes (Admin only) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-red-600" />
                      Notas Internas Confidenciais (CRM)
                    </h4>
                    <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded">
                      Invisível para Vendedor
                    </span>
                  </div>

                  {/* Add note form */}
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Registar nota interna (ex: cliente aprovou crédito, ligou às 15h...)"
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                    >
                      Registar
                    </button>
                  </form>

                  {/* Notes history */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {leadNotes.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-slate-700">{n.author_name}</span>
                          <span>{new Date(n.created_at).toLocaleString('pt-PT')}</span>
                        </div>
                        <p className="text-slate-800">{n.content}</p>
                      </div>
                    ))}
                    {leadNotes.length === 0 && (
                      <p className="text-[11px] text-slate-400 text-center py-4">
                        Ainda não existem notas internas registadas para esta lead.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MODERAÇÃO DE ANÚNCIOS */}
      {/* ============================================================== */}
      {activeTab === 'listings' && (
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Moderação e Controlo de Anúncios da Plataforma ({listings.length})
            </h3>
            <span className="text-xs text-slate-500">
              Aprovação, suspensão e destaque de anúncios
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Foto & Anúncio</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Vendedor</th>
                  <th className="p-3">Preço</th>
                  <th className="p-3">Cliques</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Ações de Moderação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-3">
                      <img src={l.images[0]} alt="" className="w-12 h-10 rounded-lg object-cover bg-slate-100" />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate max-w-[200px]">{l.title}</span>
                        <span className="text-[11px] text-slate-500">{l.concelho}, {l.district}</span>
                      </div>
                    </td>
                    <td className="p-3 capitalize">{l.category_slug}</td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800 block">{l.seller_name}</span>
                      <span className="text-[10px] text-slate-400">{l.seller_is_pro ? 'Profissional' : 'Particular'}</span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {l.price.toLocaleString('pt-PT')} €
                    </td>
                    <td className="p-3">{l.unique_clicks_count || 0}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        l.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <button
                        onClick={() => onModerateListing(l.id, 'highlight')}
                        className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${
                          l.is_featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {l.is_featured ? 'Remover Destaque' : 'Destacar'}
                      </button>
                      <button
                        onClick={() => onModerateListing(l.id, 'reject')}
                        className="text-[10px] font-bold bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded cursor-pointer"
                      >
                        Suspender
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. GESTÃO DE UTILIZADORES */}
      {/* ============================================================== */}
      {activeTab === 'users' && (
        <div className="pt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Controlo de Utilizadores e Papéis RBAC ({allUsers.length})
          </h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Utilizador</th>
                  <th className="p-3">Email & Contacto</th>
                  <th className="p-3">Distrito</th>
                  <th className="p-3">Verificação</th>
                  <th className="p-3">Papel Atual (RBAC)</th>
                  <th className="p-3">Alterar Papel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-2">
                      <img src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-bold text-slate-900">{u.full_name}</span>
                    </td>
                    <td className="p-3">
                      <span className="block text-slate-800">{u.email}</span>
                      <span className="text-[11px] text-slate-400">{u.phone || '-'}</span>
                    </td>
                    <td className="p-3">{u.address_district || 'Portugal'}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {u.verification_status}
                      </span>
                    </td>
                    <td className="p-3 font-bold capitalize">{u.role}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                        className="text-xs bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 cursor-pointer font-medium"
                      >
                        <option value="buyer">buyer (Comprador)</option>
                        <option value="private_seller">private_seller (Particular)</option>
                        <option value="pro_seller">pro_seller (Profissional)</option>
                        <option value="courier">courier (Estafeta)</option>
                        <option value="moderator">moderator (Moderador)</option>
                        <option value="admin">admin (Administrador)</option>
                        <option value="super_admin">super_admin (Super Admin)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. CONFIGURAÇÃO DE PLANOS SAAS */}
      {/* ============================================================== */}
      {activeTab === 'plans' && (
        <div className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Gestão e Configuração de Planos SaaS de Vendedores
              </h3>
              <p className="text-xs text-slate-500">
                Altere preços, limites de anúncios, fotos e contactos para o mercado nacional.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-900">{p.name}</h4>
                  <span className="font-mono text-xs text-slate-400 uppercase font-bold">{p.code}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Preço Mensal (€)</label>
                    <input
                      type="number"
                      step="0.10"
                      value={p.price_monthly}
                      onChange={(e) => onUpdatePlan({ ...p, price_monthly: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Máx. Anúncios Ativos</label>
                    <input
                      type="number"
                      value={p.max_active_listings}
                      onChange={(e) => onUpdatePlan({ ...p, max_active_listings: parseInt(e.target.value) || 1 })}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Máx. Fotos por Anúncio</label>
                    <input
                      type="number"
                      value={p.max_photos_per_listing}
                      onChange={(e) => onUpdatePlan({ ...p, max_photos_per_listing: parseInt(e.target.value) || 1 })}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Cliques Únicos Mensais</label>
                    <input
                      type="number"
                      value={p.max_unique_clicks_per_month}
                      onChange={(e) => onUpdatePlan({ ...p, max_unique_clicks_per_month: parseInt(e.target.value) || 10 })}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Contactos Mensais</label>
                    <input
                      type="number"
                      value={p.max_contacts_per_month}
                      onChange={(e) => onUpdatePlan({ ...p, max_contacts_per_month: parseInt(e.target.value) || 5 })}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Destaques Mensais Incluídos</label>
                    <input
                      type="number"
                      value={p.included_monthly_highlights}
                      onChange={(e) => onUpdatePlan({ ...p, included_monthly_highlights: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Configuração guardada no sistema
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. DEFINIÇÕES DA PLATAFORMA */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto pt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Configurações Gerais da Plataforma
              </h3>
              <p className="text-xs text-slate-500">
                Altere o nome da marca, contactos de suporte e comissões sem necessidade de alterar código.
              </p>
            </div>

            {saveSettingsSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Definições da plataforma atualizadas com sucesso!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Nome da Plataforma</label>
                <input
                  type="text"
                  value={editingSettings.platform_name}
                  onChange={(e) => setEditingSettings({ ...editingSettings, platform_name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Slogan / Tagline</label>
                <input
                  type="text"
                  value={editingSettings.tagline}
                  onChange={(e) => setEditingSettings({ ...editingSettings, tagline: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Email de Suporte</label>
                  <input
                    type="email"
                    value={editingSettings.support_email}
                    onChange={(e) => setEditingSettings({ ...editingSettings, support_email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Telefone em Portugal</label>
                  <input
                    type="text"
                    value={editingSettings.support_phone}
                    onChange={(e) => setEditingSettings({ ...editingSettings, support_phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Comissão sobre Compras Diretas (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingSettings.commission_percentage}
                  onChange={(e) => setEditingSettings({ ...editingSettings, commission_percentage: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl cursor-pointer transition-all shadow-md"
              >
                Guardar Configurações
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. ESTRUTURA SQL & SUPABASE MIGRATIONS */}
      {/* ============================================================== */}
      {activeTab === 'sql' && (
        <div className="pt-6 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  PostgreSQL & Supabase Architecture
                </span>
                <h3 className="text-lg font-black tracking-tight">
                  Migrações Relacionais Prontas para Produção (40+ Tabelas + RLS)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Arquitetura relacional completa em PostgreSQL com RLS para isolamento estrito de vendedores e CRM exclusivo.
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `-- Ficheiros criados no projeto:\n-- 1. /supabase/migrations/001_initial_schema.sql\n-- 2. /supabase/migrations/002_rls_policies.sql\n-- 3. /supabase/migrations/003_seed_data.sql`
                  );
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copiado!' : 'Copiar Caminhos das Migrações'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-emerald-400 font-mono font-bold block">001_initial_schema.sql</span>
                <p className="text-slate-300 text-[11px]">
                  42 tabelas relacionais com UUIDs, chaves estrangeiras, restrições e enums (profiles, listings, leads, orders, etc.).
                </p>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full inline-block font-mono">
                  Schema DDL
                </span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-amber-400 font-mono font-bold block">002_rls_policies.sql</span>
                <p className="text-slate-300 text-[11px]">
                  Políticas Row Level Security com funções de validação (current_user_profile_id, is_admin_or_super). Garante que vendedores NUNCA acedem ao CRM.
                </p>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full inline-block font-mono">
                  RLS Security
                </span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-teal-400 font-mono font-bold block">003_seed_data.sql</span>
                <p className="text-slate-300 text-[11px]">
                  Configurações de Portugal, 12 categorias principais, planos FREE, PREMIUM e BUSINESS, e transportadoras (CTT, DPD).
                </p>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full inline-block font-mono">
                  Seed Data
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
