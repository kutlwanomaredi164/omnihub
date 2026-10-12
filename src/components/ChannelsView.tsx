import React, { useState } from 'react';
import { 
  Radio, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink, 
  Key, 
  Activity,
  Zap,
  Globe
} from 'lucide-react';
import { ChannelInfo } from '../types';
import { getChannelIcon } from '../utils/channelHelpers';

interface ChannelsViewProps {
  channels: ChannelInfo[];
  onOpenSimulator: () => void;
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({ channels, onOpenSimulator }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePingTest = (id: string) => {
    setPingingId(id);
    setTimeout(() => {
      setPingingId(null);
    }, 600);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Connected Channels & Webhook Gateway
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              6/6 ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure real-time webhooks, API tokens, and monitor ingestion latency for all 6 connected messaging channels.
          </p>
        </div>

        <button
          onClick={onOpenSimulator}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/25 transition"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Inbound Event</span>
        </button>
      </div>

      {/* Grid of Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {channels.map((ch) => {
          const isCopied = copiedId === ch.id;
          const isPinging = pingingId === ch.id;

          return (
            <div
              key={ch.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm hover:border-slate-700 transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                    {getChannelIcon(ch.id, 'w-5 h-5')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{ch.name}</h3>
                    <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="font-medium">Active & Listening</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePingTest(ch.id)}
                  title="Ping webhook endpoint"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {ch.description}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/60">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Latency</span>
                  <div className="font-mono text-slate-200 font-bold">{ch.latencyMs} ms</div>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/60">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Processed</span>
                  <div className="font-mono text-slate-200 font-bold">{ch.messageCount} msgs</div>
                </div>
              </div>

              {/* Webhook endpoint URL */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Live Webhook Endpoint:</span>
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
                  <span className="truncate pr-2">{ch.webhookUrl}</span>
                  <button
                    onClick={() => handleCopy(ch.id, ch.webhookUrl)}
                    className="text-slate-400 hover:text-indigo-400 transition"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HMAC-SHA256 Verified</span>
                </span>
                <span className="text-slate-400 font-mono">TLS 1.3</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
