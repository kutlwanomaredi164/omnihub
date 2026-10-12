import React from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Flame, 
  Tag, 
  Inbox,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Message, ChannelType, PrimaryCategory, Priority, MessageStatus } from '../types';
import { 
  getChannelIcon, 
  getChannelBadgeClass, 
  getChannelName, 
  getCategoryBadge, 
  getPriorityBadge, 
  getSentimentBadge, 
  formatTimeAgo 
} from '../utils/channelHelpers';

interface MessageListProps {
  messages: Message[];
  selectedId: string | null;
  onSelectMessage: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedChannel: ChannelType | 'all';
  setSelectedChannel: (channel: ChannelType | 'all') => void;
  selectedCategory: PrimaryCategory | 'all';
  setSelectedCategory: (category: PrimaryCategory | 'all') => void;
  selectedPriority: Priority | 'all';
  setSelectedPriority: (priority: Priority | 'all') => void;
  selectedStatus: MessageStatus | 'all';
  setSelectedStatus: (status: MessageStatus | 'all') => void;
  onMarkAllAsRead: () => void;
  onOpenSimulator: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedId,
  onSelectMessage,
  searchQuery,
  setSearchQuery,
  selectedChannel,
  setSelectedChannel,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  selectedStatus,
  setSelectedStatus,
  onMarkAllAsRead,
  onOpenSimulator,
}) => {
  const channels: Array<{ id: ChannelType | 'all'; label: string }> = [
    { id: 'all', label: 'All Channels' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'gmail', label: 'Gmail' },
    { id: 'outlook', label: 'Outlook' },
    { id: 'messenger', label: 'Messenger' },
  ];

  const categories: Array<{ id: PrimaryCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'Sales', label: 'Sales' },
    { id: 'Accounts', label: 'Accounts' },
    { id: 'Customer Support', label: 'Support' },
    { id: 'Complaints', label: 'Complaints' },
    { id: 'Marketing', label: 'Marketing' },
    { id: 'Human Resources', label: 'HR' },
  ];

  const priorities: Array<{ id: Priority | 'all'; label: string }> = [
    { id: 'all', label: 'All Priorities' },
    { id: 'Urgent', label: 'Urgent' },
    { id: 'High', label: 'High' },
    { id: 'Medium', label: 'Medium' },
    { id: 'Low', label: 'Low' },
  ];

  const statuses: Array<{ id: MessageStatus | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'Open', label: 'Open' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Resolved', label: 'Resolved' },
    { id: 'Escalated', label: 'Escalated' },
  ];

  // Filtering logic
  const filteredMessages = messages.filter((msg) => {
    if (selectedChannel !== 'all' && msg.source !== selectedChannel) return false;
    if (selectedCategory !== 'all' && msg.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && msg.priority !== selectedPriority) return false;
    if (selectedStatus !== 'all' && msg.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = msg.message.toLowerCase().includes(q);
      const matchSender = msg.sender.toLowerCase().includes(q) || msg.senderName.toLowerCase().includes(q);
      const matchSubject = msg.subject?.toLowerCase().includes(q);
      const matchTicket = msg.ticket_id?.toLowerCase().includes(q);
      const matchSubcat = msg.subcategory.toLowerCase().includes(q);
      const matchEntity = msg.key_entities.some((e) => e.toLowerCase().includes(q));
      if (!matchText && !matchSender && !matchSubject && !matchTicket && !matchSubcat && !matchEntity) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800">
      {/* Search & Top Action Bar */}
      <div className="p-3 border-b border-slate-800 space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search messages, entities, invoices, tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Channel Horizontal Scroll Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {channels.map((ch) => {
            const isActive = selectedChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition border ${
                  isActive
                    ? 'bg-slate-800 text-white border-indigo-500/50 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {ch.id !== 'all' && getChannelIcon(ch.id as ChannelType, 'w-3 h-3')}
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row (Category & Priority) */}
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none flex-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={onMarkAllAsRead}
            title="Mark all as read"
            className="text-[10px] text-slate-400 hover:text-indigo-400 flex items-center space-x-0.5 px-1 py-0.5"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span className="hidden sm:inline">Read all</span>
          </button>
        </div>

        {/* Status / Priority pills */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
          <div className="flex items-center space-x-1">
            <span className="text-slate-500 text-[10px]">Status:</span>
            {statuses.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  selectedStatus === st.id
                    ? 'bg-slate-800 text-slate-200 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-500 text-[10px]">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="bg-slate-900 text-slate-300 text-[10px] rounded px-1.5 py-0.5 border border-slate-800 focus:outline-none"
            >
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Message Count Bar */}
      <div className="px-3 py-1.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Showing {filteredMessages.length} message{filteredMessages.length === 1 ? '' : 's'}</span>
        <span className="text-slate-500 font-mono text-[10px]">Auto-Classified by Gemini</span>
      </div>

      {/* Message Cards Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">No messages found</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting your filters or simulate an incoming message.</p>
            </div>
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-medium transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Test Inbound</span>
            </button>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isSelected = msg.id === selectedId;
            const categoryBadge = getCategoryBadge(msg.category);
            const priorityBadge = getPriorityBadge(msg.priority);
            const sentimentBadge = getSentimentBadge(msg.sentiment);

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage(msg.id)}
                className={`p-3.5 cursor-pointer transition relative group ${
                  isSelected
                    ? 'bg-slate-900/90 border-l-4 border-l-indigo-500 shadow-inner'
                    : 'hover:bg-slate-900/40 border-l-4 border-l-transparent'
                } ${!msg.is_read ? 'bg-indigo-950/20' : ''}`}
              >
                {/* Unread dot */}
                {!msg.is_read && (
                  <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20"></span>
                )}

                {/* Header: Channel badge + Sender + Time */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getChannelBadgeClass(msg.source)}`}>
                      {getChannelIcon(msg.source, 'w-3 h-3')}
                      <span>{getChannelName(msg.source)}</span>
                    </span>
                    <span className="font-semibold text-xs text-slate-200 group-hover:text-white truncate max-w-[140px]">
                      {msg.senderName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formatTimeAgo(msg.created_at)}
                  </span>
                </div>

                {/* Subject or Snippet */}
                {msg.subject && (
                  <p className="text-xs font-semibold text-slate-300 truncate mb-1">
                    {msg.subject}
                  </p>
                )}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                  {msg.message}
                </p>

                {/* Key Entities highlight pills */}
                {msg.key_entities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {msg.key_entities.slice(0, 2).map((entity, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-500" />
                        <span className="truncate max-w-[120px]">{entity}</span>
                      </span>
                    ))}
                    {msg.key_entities.length > 2 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{msg.key_entities.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Badges: Category, Priority, Assigned Team, Sentiment */}
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-900/80">
                  <div className="flex items-center space-x-1.5">
                    {/* Category */}
                    <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded font-medium border ${categoryBadge.bg}`}>
                      {categoryBadge.icon}
                      <span>{msg.category}</span>
                    </span>

                    {/* Subcategory */}
                    <span className="text-slate-400 hidden sm:inline truncate max-w-[100px]">
                      • {msg.subcategory}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Sentiment Icon */}
                    <span title={`Sentiment: ${msg.sentiment}`} className="flex items-center">
                      {sentimentBadge.icon}
                    </span>

                    {/* Priority badge */}
                    <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded font-bold border ${priorityBadge.badge}`}>
                      {priorityBadge.icon}
                      <span>{msg.priority}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
