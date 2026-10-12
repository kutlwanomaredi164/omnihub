import React from 'react';
import { 
  X, 
  Share2, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ShieldAlert, 
  Flame, 
  Sparkles,
  MessageSquare,
  Bot
} from 'lucide-react';
import { Message } from '../types';
import { getChannelName, getCategoryBadge, getPriorityBadge } from '../utils/channelHelpers';

interface TeamsAlertModalProps {
  message: Message | null;
  onClose: () => void;
}

export const TeamsAlertModal: React.FC<TeamsAlertModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  const categoryBadge = getCategoryBadge(message.category);
  const priorityBadge = getPriorityBadge(message.priority);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#464EB8] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              T
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>Microsoft Teams / Slack Webhook Card</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-mono">
                  AdaptiveCard v1.5
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Pushed automatically to channel #{message.assigned_to.toLowerCase().replace(/\s+/g, '-')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Adaptive Card Preview */}
        <div className="p-6 bg-slate-950/50 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border-l-4 border-indigo-500 border border-slate-800 space-y-3 shadow-md">
            {/* Card Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-xs text-white">OmniRoute AI Bot</span>
                <span className="text-[10px] text-slate-500">• Inbound Alert</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Just now</span>
            </div>

            {/* Alert Headline */}
            <div>
              <h4 className="text-sm font-bold text-white">
                New {message.category} inquiry from {message.senderName} ({getChannelName(message.source)})
              </h4>
              <p className="text-xs text-slate-300 mt-1 italic">
                "{message.message}"
              </p>
            </div>

            {/* Fact Set Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/70 rounded-lg text-xs border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Priority</span>
                <div className="font-bold text-amber-400 flex items-center space-x-1">
                  <span>{message.priority}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Assigned Team</span>
                <div className="font-bold text-indigo-300">{message.assigned_to}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Classification</span>
                <div className="font-bold text-slate-200">{message.subcategory}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Ticket ID</span>
                <div className="font-mono text-indigo-400 font-bold">{message.ticket_id || 'TCK-AUTO'}</div>
              </div>
            </div>

            {/* Recommended Action snippet */}
            <div className="text-[11px] text-slate-400">
              <strong className="text-slate-300">AI Recommendation:</strong> {message.recommended_actions[0] || 'Review customer request and assign specialist'}
            </div>

            {/* Interactive Action Buttons inside Teams Card */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
              >
                Claim in OmniRoute Desk
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Send AI Draft Reply
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
