import React from 'react';
import { 
  Inbox, 
  BarChart3, 
  GitFork, 
  Radio, 
  Users, 
  Play, 
  Sparkles, 
  RotateCcw,
  Zap,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { ChannelInfo } from '../types';
import { getChannelIcon } from '../utils/channelHelpers';

interface HeaderProps {
  activeTab: 'inbox' | 'analytics' | 'routing' | 'channels' | 'crm';
  setActiveTab: (tab: 'inbox' | 'analytics' | 'routing' | 'channels' | 'crm') => void;
  channels: ChannelInfo[];
  unreadCount: number;
  onOpenSimulator: () => void;
  isAutoStreaming: boolean;
  setIsAutoStreaming: (val: boolean) => void;
  onResetData: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  channels,
  unreadCount,
  onOpenSimulator,
  isAutoStreaming,
  setIsAutoStreaming,
  onResetData,
  hasApiKey,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    OmniRoute
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI HUB
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Gemini 3.8 Flash Active</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-mono text-[10px]">6 Channels Connected</span>
                </div>
              </div>
            </div>

            {/* Channels mini-ticker */}
            <div className="hidden xl:flex items-center space-x-1.5 pl-6 border-l border-slate-800/80">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  title={`${ch.name}: ${ch.status} (${ch.latencyMs}ms)`}
                  className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 hover:border-slate-700 transition"
                >
                  {getChannelIcon(ch.id, 'w-3 h-3')}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'inbox'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Unified Inbox</span>
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-400/30 text-indigo-100 font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Power BI & Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('routing')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'routing'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Routing Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('channels')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'channels'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Channels API</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'crm'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer CRM</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Auto Ingest Simulator Toggle */}
            <button
              onClick={() => setIsAutoStreaming(!isAutoStreaming)}
              title="Toggle automatic periodic message simulation"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs border font-medium transition ${
                isAutoStreaming
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAutoStreaming ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
              <span className="hidden sm:inline">{isAutoStreaming ? 'Live Stream: ON' : 'Live Stream: OFF'}</span>
            </button>

            {/* Simulate Inbound Button */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md shadow-indigo-500/25 transition transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Inbound</span>
            </button>

            {/* Reset helper */}
            <button
              onClick={onResetData}
              title="Reset to default seed data"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
