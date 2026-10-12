import React from 'react';
import { 
  MessageSquare, 
  Instagram, 
  Video, 
  Mail, 
  Send, 
  Flame, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  HelpCircle,
  DollarSign,
  Receipt,
  LifeBuoy,
  Megaphone,
  Users,
  Smile,
  Meh,
  Frown,
  AlertOctagon,
  Zap
} from 'lucide-react';
import { ChannelType, PrimaryCategory, Priority, Sentiment, MessageStatus } from '../types';

export function getChannelColor(channel: ChannelType): string {
  switch (channel) {
    case 'whatsapp': return '#25D366';
    case 'instagram': return '#E1306C';
    case 'tiktok': return '#00F2FE';
    case 'gmail': return '#EA4335';
    case 'outlook': return '#0078D4';
    case 'messenger': return '#0084FF';
    default: return '#6366F1';
  }
}

export function getChannelBadgeClass(channel: ChannelType): string {
  switch (channel) {
    case 'whatsapp': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'instagram': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    case 'tiktok': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'gmail': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'outlook': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'messenger': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  }
}

export function getChannelIcon(channel: ChannelType, className = 'w-4 h-4'): React.ReactElement {
  switch (channel) {
    case 'whatsapp':
      return <MessageSquare className={`${className} text-emerald-400`} />;
    case 'instagram':
      return <Instagram className={`${className} text-pink-400`} />;
    case 'tiktok':
      return <Video className={`${className} text-cyan-400`} />;
    case 'gmail':
      return <Mail className={`${className} text-red-400`} />;
    case 'outlook':
      return <Mail className={`${className} text-blue-400`} />;
    case 'messenger':
      return <Send className={`${className} text-sky-400`} />;
    default:
      return <MessageSquare className={className} />;
  }
}

export function getChannelName(channel: ChannelType): string {
  switch (channel) {
    case 'whatsapp': return 'WhatsApp';
    case 'instagram': return 'Instagram DM';
    case 'tiktok': return 'TikTok DM';
    case 'gmail': return 'Gmail';
    case 'outlook': return 'Outlook';
    case 'messenger': return 'Messenger';
    default: return channel;
  }
}

export function getCategoryBadge(category: PrimaryCategory) {
  switch (category) {
    case 'Sales':
      return {
        bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
        icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
        team: 'Sales Team',
      };
    case 'Accounts':
      return {
        bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        icon: <Receipt className="w-3.5 h-3.5 text-amber-400" />,
        team: 'Accounts',
      };
    case 'Customer Support':
      return {
        bg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
        icon: <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />,
        team: 'Customer Support',
      };
    case 'Complaints':
      return {
        bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
        icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />,
        team: 'Complaints & Escalations',
      };
    case 'Marketing':
      return {
        bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
        icon: <Megaphone className="w-3.5 h-3.5 text-purple-400" />,
        team: 'Marketing',
      };
    case 'Human Resources':
      return {
        bg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
        icon: <Users className="w-3.5 h-3.5 text-teal-400" />,
        team: 'Human Resources',
      };
    default:
      return {
        bg: 'bg-slate-700/50 border-slate-600 text-slate-300',
        icon: <HelpCircle className="w-3.5 h-3.5" />,
        team: 'Triage Queue',
      };
  }
}

export function getPriorityBadge(priority: Priority) {
  switch (priority) {
    case 'Urgent':
      return {
        label: 'Urgent',
        badge: 'bg-red-500/20 text-red-400 border-red-500/30 ring-1 ring-red-500/20',
        icon: <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />,
      };
    case 'High':
      return {
        label: 'High',
        badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
      };
    case 'Medium':
      return {
        label: 'Medium',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
        icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      };
    case 'Low':
      return {
        label: 'Low',
        badge: 'bg-slate-800 text-slate-400 border-slate-700',
        icon: <CheckCircle className="w-3.5 h-3.5 text-slate-400" />,
      };
    default:
      return {
        label: priority,
        badge: 'bg-slate-800 text-slate-400 border-slate-700',
        icon: null,
      };
  }
}

export function getSentimentBadge(sentiment: Sentiment) {
  switch (sentiment) {
    case 'Positive':
      return {
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        icon: <Smile className="w-3.5 h-3.5 text-emerald-400" />,
      };
    case 'Neutral':
      return {
        color: 'text-slate-400',
        bg: 'bg-slate-800 border-slate-700',
        icon: <Meh className="w-3.5 h-3.5 text-slate-400" />,
      };
    case 'Frustrated':
      return {
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20',
        icon: <Frown className="w-3.5 h-3.5 text-amber-400" />,
      };
    case 'Urgent':
      return {
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/20',
        icon: <Zap className="w-3.5 h-3.5 text-rose-400" />,
      };
    case 'Angry':
      return {
        color: 'text-red-400',
        bg: 'bg-red-500/15 border-red-500/30',
        icon: <AlertOctagon className="w-3.5 h-3.5 text-red-400" />,
      };
    default:
      return {
        color: 'text-slate-400',
        bg: 'bg-slate-800 border-slate-700',
        icon: <Meh className="w-3.5 h-3.5" />,
      };
  }
}

export function getStatusBadge(status: MessageStatus) {
  switch (status) {
    case 'Open':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'In Progress':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Resolved':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Escalated':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return 'recently';
  }
}
