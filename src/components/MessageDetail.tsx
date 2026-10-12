import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Tag, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  ExternalLink,
  MessageSquare,
  Bot,
  RefreshCw,
  Share2,
  FileText,
  ShieldCheck,
  ChevronRight,
  Flame,
  AlertTriangle,
  Lock,
  Plus
} from 'lucide-react';
import { Message, MessageStatus, Priority, PrimaryCategory, CRMContact } from '../types';
import { 
  getChannelIcon, 
  getChannelBadgeClass, 
  getChannelName, 
  getCategoryBadge, 
  getPriorityBadge, 
  getSentimentBadge, 
  getStatusBadge,
  formatTimeAgo 
} from '../utils/channelHelpers';
import { generateSmartReply } from '../services/api';

interface MessageDetailProps {
  message: Message;
  onUpdateStatus: (id: string, status: MessageStatus) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  onUpdateTeam: (id: string, team: string) => void;
  onUpdateCategory: (id: string, category: PrimaryCategory, subcategory: string) => void;
  onAddReply: (id: string, text: string, isAiDraft?: boolean) => void;
  onAddInternalNote: (id: string, text: string) => void;
  onOpenTeamsAlert: (message: Message) => void;
  crmContact?: CRMContact;
}

export const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateTeam,
  onUpdateCategory,
  onAddReply,
  onAddInternalNote,
  onOpenTeamsAlert,
  crmContact,
}) => {
  const [activeTab, setActiveTab] = useState<'reply' | 'notes' | 'crm'>('reply');
  const [draftReplyText, setDraftReplyText] = useState(message.suggested_reply || '');
  const [selectedTone, setSelectedTone] = useState('Professional & Empathetic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  // Handle re-generation with Gemini
  const handleRegenerateReply = async (tone: string) => {
    setSelectedTone(tone);
    setIsGenerating(true);
    try {
      const res = await generateSmartReply({
        message: message.message,
        category: message.category,
        subcategory: message.subcategory,
        tone,
        source: getChannelName(message.source),
        sender: message.senderName || message.sender,
      });
      if (res.reply) {
        setDraftReplyText(res.reply);
      }
    } catch (err) {
      console.error('Failed to regenerate reply:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = () => {
    if (!draftReplyText.trim()) return;
    onAddReply(message.id, draftReplyText.trim(), true);
    setDraftReplyText('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddInternalNote(message.id, noteInput.trim());
    setNoteInput('');
  };

  const categoryBadge = getCategoryBadge(message.category);
  const priorityBadge = getPriorityBadge(message.priority);
  const sentimentBadge = getSentimentBadge(message.sentiment);

  const teamOptions = [
    'Sales Team',
    'Accounts',
    'Customer Support',
    'Complaints & Escalations',
    'Marketing',
    'Human Resources',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      {/* Top Banner / Channel & Ticket bar */}
      <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-sm">
            {getChannelIcon(message.source, 'w-5 h-5')}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">{message.senderName}</h2>
              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${getChannelBadgeClass(message.source)}`}>
                <span>{getChannelName(message.source)}</span>
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-xs font-mono text-slate-400">{message.sender}</span>
            </div>
            <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-400">
              <span className="font-mono text-indigo-400 font-semibold">{message.ticket_id || 'TCK-AUTO'}</span>
              <span>•</span>
              <span>Received {formatTimeAgo(message.created_at)}</span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-slate-300">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>SLA Target: 2h</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Teams Notification Preview */}
          <button
            onClick={() => onOpenTeamsAlert(message)}
            title="Preview Microsoft Teams or Slack routing card"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Teams Alert</span>
          </button>

          {/* Status selector */}
          <select
            value={message.status}
            onChange={(e) => onUpdateStatus(message.id, e.target.value as MessageStatus)}
            className={`text-xs font-semibold rounded-lg px-3 py-1.5 border focus:outline-none cursor-pointer transition ${getStatusBadge(
              message.status
            )}`}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>
      </div>

      <div className="p-5 space-y-6 flex-1">
        {/* Email subject if present */}
        {message.subject && (
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center space-x-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Subject:</span>
            <span className="text-sm font-semibold text-white">{message.subject}</span>
          </div>
        )}

        {/* Inbound Customer Message Bubble */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-200">{message.senderName}</span>
              <span className="text-slate-500 font-mono text-[11px]">({message.sender})</span>
            </div>
            <span className="text-slate-400">{new Date(message.created_at).toLocaleString()}</span>
          </div>

          <p className="text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
            {message.message}
          </p>

          {/* Key Entities Detected */}
          {message.key_entities.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60 flex items-center flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Extracted Entities:</span>
              {message.key_entities.map((ent, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  <Tag className="w-3 h-3 text-indigo-400" />
                  <span>{ent}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* AI Classification & Routing Engine Card */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-900/80 p-5 space-y-4 shadow-lg shadow-indigo-950/20">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <span>AI Classification & Routing Pipeline</span>
                  <span className="text-[10px] normal-case bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                    Gemini 3.8 Flash
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Confidence: <span className="text-emerald-400 font-semibold font-mono">{(message.confidence_score * 100).toFixed(1)}%</span> • Latency: 138ms
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${priorityBadge.badge}`}>
                {priorityBadge.icon}
                <span>{message.priority} Priority</span>
              </span>
            </div>
          </div>

          {/* Grid of Classification Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Primary Category */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Primary Category</span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold border ${categoryBadge.bg}`}>
                  {categoryBadge.icon}
                  <span>{message.category}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-1">Subcategory: <strong className="text-slate-200">{message.subcategory}</strong></p>
            </div>

            {/* Assigned Team */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assigned Team</span>
              <div className="pt-0.5">
                <select
                  value={message.assigned_to}
                  onChange={(e) => onUpdateTeam(message.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-300 focus:outline-none focus:border-indigo-500"
                >
                  {teamOptions.map((tm) => (
                    <option key={tm} value={tm}>
                      {tm}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Auto-routed via rules</span>
              </p>
            </div>

            {/* Sentiment Analysis */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sentiment Analysis</span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold border ${sentimentBadge.bg} ${sentimentBadge.color}`}>
                  {sentimentBadge.icon}
                  <span>{message.sentiment}</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ({message.sentiment_score > 0 ? `+${message.sentiment_score.toFixed(2)}` : message.sentiment_score.toFixed(2)})
                </span>
              </div>
              {/* Mini Sentiment Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full ${
                    message.sentiment_score >= 0.2
                      ? 'bg-emerald-500'
                      : message.sentiment_score <= -0.2
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, ((message.sentiment_score + 1) / 2) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* Customer Type / Tier */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Customer Profile</span>
              <div className="pt-0.5 flex items-center space-x-1.5">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  message.customer_type === 'VIP'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : message.customer_type === 'Returning'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {message.customer_type} Customer
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">SLA tier: Priority 1</p>
            </div>
          </div>

          {/* AI Reasoning explanation */}
          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 text-xs space-y-1">
            <span className="font-semibold text-slate-300">Routing Justification:</span>
            <p className="text-slate-400 leading-relaxed font-mono text-[11px]">
              {message.routing_reason}
            </p>
          </div>

          {/* Recommended Next Actions */}
          {message.recommended_actions.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300">Recommended Smart Actions:</span>
              <div className="flex flex-wrap gap-2">
                {message.recommended_actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onAddInternalNote(message.id, `Action Executed: ${act}`);
                    }}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 transition cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-indigo-400" />
                    <span>{act}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Workspace: Tabbed (Reply / Internal Notes / CRM Profile) */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/70 overflow-hidden shadow-sm">
          {/* Workspace Tabs */}
          <div className="flex items-center border-b border-slate-800 px-4 bg-slate-900">
            <button
              onClick={() => setActiveTab('reply')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 transition ${
                activeTab === 'reply'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Omnichannel Response Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 transition ${
                activeTab === 'notes'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Internal Notes ({message.internal_notes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center space-x-2 py-3 px-3 text-xs font-semibold border-b-2 transition ${
                activeTab === 'crm'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>CRM History & Identity</span>
            </button>
          </div>

          {/* TAB 1: Omnichannel Response Studio */}
          {activeTab === 'reply' && (
            <div className="p-4 space-y-4">
              {/* Conversation history if any replies sent */}
              {message.replies.length > 0 && (
                <div className="space-y-3 pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400">Response History:</span>
                  {message.replies.map((rep) => (
                    <div key={rep.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-indigo-300">{rep.author} ({rep.role})</span>
                        <span className="text-slate-500 font-mono">{formatTimeAgo(rep.timestamp)}</span>
                      </div>
                      <p className="text-xs text-slate-200 whitespace-pre-wrap">{rep.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tone selection pills */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className="text-slate-400">AI Tone:</span>
                  {[
                    'Professional & Empathetic',
                    'Friendly & Concise',
                    'Executive Formal',
                    'Urgent Apology & Fix',
                  ].map((tone) => (
                    <button
                      key={tone}
                      disabled={isGenerating}
                      onClick={() => handleRegenerateReply(tone)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                        selectedTone === tone
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>

                <button
                  disabled={isGenerating}
                  onClick={() => handleRegenerateReply(selectedTone)}
                  className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Re-draft with Gemini</span>
                </button>
              </div>

              {/* Draft Text Area */}
              <div className="relative">
                <textarea
                  rows={5}
                  value={draftReplyText}
                  onChange={(e) => setDraftReplyText(e.target.value)}
                  placeholder="Type or customize your response to customer..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition leading-relaxed font-sans"
                />
                <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Channel: {getChannelName(message.source)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Auto-synced with {getChannelName(message.source)} API</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(draftReplyText);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition"
                  >
                    Copy Text
                  </button>

                  <button
                    onClick={handleSendReply}
                    className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition transform active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch via {getChannelName(message.source)}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Internal Notes */}
          {activeTab === 'notes' && (
            <div className="p-4 space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add internal note for team members (never visible to customer)..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    Add Internal Note
                  </button>
                </div>
              </form>

              <div className="space-y-2 pt-2">
                {message.internal_notes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-4">No internal notes yet.</p>
                ) : (
                  message.internal_notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">{note.author}</span>
                        <span className="text-slate-500 font-mono">{formatTimeAgo(note.timestamp)}</span>
                      </div>
                      <p className="text-xs text-slate-300">{note.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CRM Profile */}
          {activeTab === 'crm' && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300">Identity Details</span>
                  <div className="text-xs space-y-1.5 text-slate-400">
                    <p><strong className="text-slate-200">Name:</strong> {crmContact?.name || message.senderName}</p>
                    <p><strong className="text-slate-200">Primary Channel:</strong> {getChannelName(message.source)}</p>
                    <p><strong className="text-slate-200">Identifier:</strong> <span className="font-mono text-slate-300">{message.sender}</span></p>
                    <p><strong className="text-slate-200">Company:</strong> {crmContact?.company || 'N/A'}</p>
                    <p><strong className="text-slate-200">Customer Tier:</strong> <span className="text-indigo-400 font-bold">{crmContact?.type || message.customer_type}</span></p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300">Omnichannel Engagement</span>
                  <div className="text-xs space-y-1.5 text-slate-400">
                    <p><strong className="text-slate-200">Total Inquiries:</strong> {crmContact?.totalMessages || 1} tickets</p>
                    <p><strong className="text-slate-200">Assigned Team:</strong> {message.assigned_to}</p>
                    <p><strong className="text-slate-200">CRM Notes:</strong> {crmContact?.notes || 'Prospective client'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
