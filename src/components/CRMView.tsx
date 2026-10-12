import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Building2, 
  Phone, 
  Mail, 
  MessageSquare, 
  Tag, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { CRMContact, ChannelType } from '../types';
import { getChannelIcon, getChannelName, formatTimeAgo } from '../utils/channelHelpers';

interface CRMViewProps {
  contacts: CRMContact[];
  onSelectCustomerMessages: (senderQuery: string) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({ contacts, onSelectCustomerMessages }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Customer CRM & Identity Directory
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              CROSS-CHANNEL LINKED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consolidated customer profiles resolving senders across WhatsApp, Instagram, TikTok, Gmail, Outlook, and Messenger.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm hover:border-slate-700 transition"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{contact.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>{contact.company || 'Individual Account'}</span>
                  </p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  contact.type === 'VIP'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : contact.type === 'Returning'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {contact.type}
              </span>
            </div>

            {/* Linked Channels Handles */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400">Linked Channel Identities:</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(contact.handles).map(([ch, val]) => (
                  <span
                    key={ch}
                    className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-mono bg-slate-950 text-slate-300 border border-slate-800"
                  >
                    {getChannelIcon(ch as ChannelType, 'w-3 h-3')}
                    <span>{val}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/60 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">Account Summary:</span>
              <p className="text-[11px] leading-relaxed italic">{contact.notes}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
              <span className="font-mono text-[11px]">
                {contact.totalMessages} recorded message{contact.totalMessages === 1 ? '' : 's'}
              </span>

              <button
                onClick={() => onSelectCustomerMessages(contact.name)}
                className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold transition"
              >
                <span>View In Inbox</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
