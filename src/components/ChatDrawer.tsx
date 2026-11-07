import React, { useState } from 'react';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCheck,
  ChevronLeft
} from 'lucide-react';
import { Conversation, Message, Profile } from '../types/database.types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conv: Conversation) => void;
  messages: Message[];
  onSendMessage: (conversationId: string, text: string) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  conversations,
  activeConversation,
  onSelectConversation,
  messages,
  onSendMessage,
}) => {
  if (!isOpen) return null;

  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !inputText.trim()) return;
    onSendMessage(activeConversation.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            {activeConversation && (
              <button
                onClick={() => onSelectConversation(null as any)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 md:hidden cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {activeConversation ? 'Conversa sobre o Anúncio' : 'Mensagens & Chat'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If no active conversation, show conversation list */}
        {!activeConversation ? (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="text-center py-16 px-4">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-semibold">Sem conversas ativas.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Abra qualquer anúncio e clique em "Chat em Direto" para iniciar conversa com o vendedor.
                </p>
              </div>
            ) : (
              conversations.map((c) => {
                const otherPartyName = c.buyer_id === currentUser.id ? c.seller_name : c.buyer_name;
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectConversation(c)}
                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={c.listing_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="font-bold text-slate-900 truncate">{otherPartyName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.last_message_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium truncate">{c.listing_title}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.last_message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Active conversation view */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Listing snippet header */}
            <div className="p-3 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeConversation.listing_image}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {activeConversation.listing_title}
                  </h4>
                  <span className="text-xs font-black text-emerald-800">
                    {activeConversation.listing_price.toLocaleString('pt-PT')} €
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelectConversation(null as any)}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold shrink-0 cursor-pointer"
              >
                Trocar
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const isMe = m.sender_id === currentUser.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                      {isMe ? 'Eu' : m.sender_name}
                    </span>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <p>{m.content}</p>
                      <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {new Date(m.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Escreva a sua mensagem..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
