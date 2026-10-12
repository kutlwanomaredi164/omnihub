import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Download, 
  Layers, 
  PieChart, 
  Users, 
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Filter
} from 'lucide-react';
import { Message, PrimaryCategory, ChannelType } from '../types';
import { 
  getChannelName, 
  getChannelColor, 
  getCategoryBadge 
} from '../utils/channelHelpers';

interface AnalyticsDashboardProps {
  messages: Message[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ messages }) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('week');

  // Compute metrics from current state
  const total = messages.length;
  const resolved = messages.filter((m) => m.status === 'Resolved').length;
  const inProgress = messages.filter((m) => m.status === 'In Progress').length;
  const openCount = messages.filter((m) => m.status === 'Open').length;
  const escalated = messages.filter((m) => m.status === 'Escalated' || m.priority === 'Urgent').length;

  // Category breakdown
  const categoryCounts: Record<PrimaryCategory, number> = {
    Sales: 0,
    Accounts: 0,
    'Customer Support': 0,
    Complaints: 0,
    Marketing: 0,
    'Human Resources': 0,
  };
  messages.forEach((m) => {
    if (categoryCounts[m.category] !== undefined) {
      categoryCounts[m.category]++;
    }
  });

  // Channel breakdown
  const channelCounts: Record<ChannelType, number> = {
    whatsapp: 0,
    instagram: 0,
    tiktok: 0,
    gmail: 0,
    outlook: 0,
    messenger: 0,
  };
  messages.forEach((m) => {
    if (channelCounts[m.source] !== undefined) {
      channelCounts[m.source]++;
    }
  });

  // Priority breakdown
  const priorityCounts = {
    Urgent: messages.filter((m) => m.priority === 'Urgent').length,
    High: messages.filter((m) => m.priority === 'High').length,
    Medium: messages.filter((m) => m.priority === 'Medium').length,
    Low: messages.filter((m) => m.priority === 'Low').length,
  };

  // Sentiment breakdown
  const sentimentCounts = {
    Positive: messages.filter((m) => m.sentiment === 'Positive').length,
    Neutral: messages.filter((m) => m.sentiment === 'Neutral').length,
    Frustrated: messages.filter((m) => m.sentiment === 'Frustrated').length,
    Urgent: messages.filter((m) => m.sentiment === 'Urgent').length,
    Angry: messages.filter((m) => m.sentiment === 'Angry').length,
  };

  // Team workload
  const teamWorkload: Record<string, number> = {};
  messages.forEach((m) => {
    teamWorkload[m.assigned_to] = (teamWorkload[m.assigned_to] || 0) + 1;
  });

  // Export report to CSV
  const handleExportCSV = () => {
    const headers = [
      'Ticket ID',
      'Channel',
      'Sender Name',
      'Sender Contact',
      'Category',
      'Subcategory',
      'Priority',
      'Status',
      'Assigned Team',
      'Sentiment',
      'Sentiment Score',
      'Created At',
      'Message Text',
    ];
    const rows = messages.map((m) => [
      `"${m.ticket_id || 'TCK-AUTO'}"`,
      `"${getChannelName(m.source)}"`,
      `"${m.senderName.replace(/"/g, '""')}"`,
      `"${m.sender}"`,
      `"${m.category}"`,
      `"${m.subcategory}"`,
      `"${m.priority}"`,
      `"${m.status}"`,
      `"${m.assigned_to}"`,
      `"${m.sentiment}"`,
      m.sentiment_score,
      `"${m.created_at}"`,
      `"${m.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omniroute_executive_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto space-y-6">
      {/* Executive Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Executive Analytics & Power BI Reporting
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              REAL-TIME SYNC
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Omnichannel message performance, classification accuracy, and team SLA workload across all 6 channels.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Time range selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            {(['today', 'week', 'month', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                  timeRange === r
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'All Time' : r}
              </button>
            ))}
          </div>

          {/* Export Report */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Headline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Ingested</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{total}</div>
          <div className="flex items-center text-[11px] text-emerald-400 space-x-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18.4% from last period</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">AI Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">98.2%</div>
          <div className="text-[11px] text-slate-400">Gemini 3.8 Flash confidence</div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">SLA Adherence</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">96.7%</div>
          <div className="text-[11px] text-slate-400">Target response &lt; 2h</div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Avg Latency</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">142ms</div>
          <div className="text-[11px] text-slate-400">Classification speed</div>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Urgent Escalations</span>
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{escalated}</div>
          <div className="text-[11px] text-slate-400">Requires executive attention</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Volume by Category</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">6 Taxonomies</span>
          </div>

          <div className="space-y-3 pt-2">
            {(Object.keys(categoryCounts) as PrimaryCategory[]).map((cat) => {
              const count = categoryCounts[cat];
              const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
              const badge = getCategoryBadge(cat);

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-1.5 text-slate-200 font-medium">
                      {badge.icon}
                      <span>{cat}</span>
                    </span>
                    <span className="font-mono text-slate-400">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel Ingestion Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>Ingestion by Messaging Channel</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">6 Platforms</span>
          </div>

          <div className="space-y-3 pt-2">
            {(Object.keys(channelCounts) as ChannelType[]).map((ch) => {
              const count = channelCounts[ch];
              const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
              const color = getChannelColor(ch);

              return (
                <div key={ch} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-2 text-slate-200 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                      <span>{getChannelName(ch)}</span>
                    </span>
                    <span className="font-mono text-slate-400">
                      {count} messages ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Team Workload Allocation & Sentiment Spectrum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Workload */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Team Workload Allocation</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Auto-Assigned</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {Object.entries(teamWorkload).map(([team, count]) => (
              <div key={team} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{team}</span>
                  <span className="font-mono text-indigo-400 font-bold">{count} active</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Avg response: 18 min • SLA compliance: 98%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Spectrum */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Sentiment Analysis</h3>
            <span className="text-xs text-slate-400 font-mono">AI Gauge</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(sentimentCounts).map(([sentiment, count]) => {
              const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
              let barColor = 'bg-slate-500';
              if (sentiment === 'Positive') barColor = 'bg-emerald-500';
              if (sentiment === 'Frustrated') barColor = 'bg-amber-500';
              if (sentiment === 'Angry') barColor = 'bg-rose-500';
              if (sentiment === 'Urgent') barColor = 'bg-purple-500';

              return (
                <div key={sentiment} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{sentiment}</span>
                    <span className="font-mono text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
