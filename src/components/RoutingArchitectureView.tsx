import React from 'react';
import { 
  GitFork, 
  ArrowDown, 
  ArrowRight, 
  Cpu, 
  Database, 
  BarChart3, 
  DollarSign, 
  Receipt, 
  LifeBuoy, 
  AlertOctagon, 
  Megaphone, 
  Users, 
  ShieldCheck, 
  Zap, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getChannelIcon, getChannelName } from '../utils/channelHelpers';
import { ChannelType } from '../types';

export const RoutingArchitectureView: React.FC = () => {
  const channels: ChannelType[] = ['instagram', 'tiktok', 'whatsapp', 'gmail', 'outlook', 'messenger'];

  const taxonomyCategories = [
    {
      name: 'Sales',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      team: 'Sales Team',
      sla: '30 Minutes',
      subcategories: [
        'New lead',
        'Product enquiry',
        'Quotation request',
        'Pricing request',
        'Partnership enquiry',
      ],
      description: 'Prospective buyers, bulk catalog quotes, merchandise requests, and commercial partnerships.',
    },
    {
      name: 'Accounts',
      icon: <Receipt className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      team: 'Accounts',
      sla: '2 Hours',
      subcategories: [
        'Invoice request',
        'Payment confirmation',
        'Refund request',
        'Credit note request',
      ],
      description: 'Billing inquiries, invoice copy dispatch, remittance advice, and refund processing.',
    },
    {
      name: 'Customer Support',
      icon: <LifeBuoy className="w-4 h-4 text-blue-400" />,
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-300',
      team: 'Customer Support',
      sla: '45 Minutes',
      subcategories: [
        'General support',
        'Technical issue',
        'Product issue',
        'Delivery issue',
      ],
      description: 'Order tracking, troubleshooting errors, sizing assistance, and setup guides.',
    },
    {
      name: 'Complaints',
      icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
      team: 'Complaints & Escalations',
      sla: '15 Minutes (Priority 1)',
      subcategories: [
        'Service complaint',
        'Product complaint',
        'Staff complaint',
      ],
      description: 'Damaged packages, incorrect items delivered, executive escalation risks.',
    },
    {
      name: 'Marketing',
      icon: <Megaphone className="w-4 h-4 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
      team: 'Marketing',
      sla: '4 Hours',
      subcategories: [
        'Collaboration request',
        'Influencer enquiry',
        'Campaign enquiry',
      ],
      description: 'PR packages, creator outreach, TikTok brand deals, and marketing partnerships.',
    },
    {
      name: 'Human Resources',
      icon: <Users className="w-4 h-4 text-teal-400" />,
      color: 'border-teal-500/40 bg-teal-950/20 text-teal-300',
      team: 'Human Resources',
      sla: '24 Hours',
      subcategories: [
        'Job application',
        'Leave enquiry',
        'Employee issue',
      ],
      description: 'Job resumes, candidate queries, staff administration, and internal talent inquiries.',
    },
  ];

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto space-y-8">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            High-Level Architecture & Routing Engine
          </h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            PIPELINE TOPOLOGY
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Visual representation of message ingestion, AI classification layer, team queues, database persistence, and analytics.
        </p>
      </div>

      {/* Interactive Architecture Flow Diagram */}
      <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Real-time Ingestion Pipeline Flow
        </h2>

        {/* Step 1: Ingestion Channels */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400">1. Connected Inbound Channels:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {channels.map((ch) => (
              <div
                key={ch}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-2 text-xs font-medium text-slate-200"
              >
                {getChannelIcon(ch, 'w-4 h-4')}
                <span className="truncate">{getChannelName(ch)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center text-indigo-400">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Step 2: API Integration Layer */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                API Integration & Normalization Layer
              </h3>
              <p className="text-[11px] text-slate-400">
                Webhook listeners, cryptographic signature checks, payload extraction, and standardized schema mapping.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            Express / Node.js
          </span>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center text-indigo-400">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Step 3: AI Classification Engine */}
        <div className="p-4 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 rounded-xl border border-indigo-500/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/30 text-indigo-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>AI Classification & Semantic Analysis Engine</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Intent recognition, entity extraction (invoices, order numbers, quantities), sentiment scoring & urgency analysis.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400">@google/genai SDK</span>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center text-indigo-400">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Step 4: 6 Categorized Team Desks */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400">
            4. Automatic Team Routing & Ticket Queues:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {taxonomyCategories.map((cat) => (
              <div
                key={cat.name}
                className={`p-3.5 rounded-xl border ${cat.color} space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {cat.icon}
                    <span className="text-xs font-bold text-white">{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">SLA: {cat.sla}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">
                  Assigned: <strong className="text-white">{cat.team}</strong>
                </div>
                <div className="text-[10px] text-slate-400">
                  Subcategories: {cat.subcategories.slice(0, 3).join(', ')}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center text-indigo-400">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Step 5: Database & Dashboard Layer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Database & Persistence</h3>
              <p className="text-[11px] text-slate-400">
                Normalized conversation store, CRM contact linking & full audit log.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Power BI & Executive Dashboard</h3>
              <p className="text-[11px] text-slate-400">
                Live team queues, SLA tracking, volume forecasting & CSV exports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Taxonomy & SLA Reference Table */}
      <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Complete Enterprise Taxonomy Reference
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Primary Category</th>
                <th className="p-3">Subcategories</th>
                <th className="p-3">Assigned Team</th>
                <th className="p-3">Target SLA</th>
                <th className="p-3">Routing Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {taxonomyCategories.map((cat) => (
                <tr key={cat.name} className="hover:bg-slate-850">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    {cat.icon}
                    <span>{cat.name}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {cat.subcategories.map((sub, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-indigo-300">{cat.team}</td>
                  <td className="p-3">
                    <span className="flex items-center space-x-1 font-mono text-slate-400">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{cat.sla}</span>
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">{cat.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
