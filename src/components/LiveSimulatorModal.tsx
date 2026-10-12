import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  MessageSquare, 
  Send, 
  Instagram, 
  Video, 
  Mail,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { ChannelType, Message } from '../types';
import { classifyMessageWithAI } from '../services/api';
import { getChannelIcon, getChannelName } from '../utils/channelHelpers';

interface LiveSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageIngested: (newMessage: Message) => void;
}

interface PresetScenario {
  id: string;
  channel: ChannelType;
  sender: string;
  senderName: string;
  subject?: string;
  text: string;
  expectedCategory: string;
  expectedTeam: string;
  label: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'p1',
    channel: 'whatsapp',
    sender: '+27821234567',
    senderName: 'David Sithole',
    text: 'Hi, I would like a price for 100 branded t-shirts.',
    expectedCategory: 'Sales (Quotation request)',
    expectedTeam: 'Sales Team',
    label: 'WhatsApp: 100 Branded T-Shirts Quote',
  },
  {
    id: 'p2',
    channel: 'instagram',
    sender: '@emily_clarke',
    senderName: 'Emily Clarke',
    text: 'I received my order but the wrong size was delivered. I ordered Medium and got XL.',
    expectedCategory: 'Complaints (Product complaint)',
    expectedTeam: 'Customer Support',
    label: 'Instagram DM: Wrong Size Delivered Complaint',
  },
  {
    id: 'p3',
    channel: 'outlook',
    sender: 'finance@apexlogistics.com',
    senderName: 'Apex Accounts',
    subject: 'Invoice Request INV-2026-445',
    text: 'Please send invoice INV-2026-445. Our auditing team needs the signed tax breakdown by EOD.',
    expectedCategory: 'Accounts (Invoice request)',
    expectedTeam: 'Accounts',
    label: 'Outlook: Send Invoice INV-2026-445',
  },
  {
    id: 'p4',
    channel: 'tiktok',
    sender: '@techinfluencer_mike',
    senderName: 'Mike Tech Reviews',
    text: 'Hey! Loved your recent video launch. Can we collaborate on a paid sponsorship or media kit campaign for our 850k tech audience?',
    expectedCategory: 'Marketing (Influencer enquiry)',
    expectedTeam: 'Marketing',
    label: 'TikTok: Brand Sponsorship Collaboration',
  },
  {
    id: 'p5',
    channel: 'gmail',
    sender: 'security@enterprisegov.org',
    senderName: 'David H. (SysAdmin)',
    subject: 'CRITICAL: Production SSO Outage',
    text: 'URGENT: Single Sign-On (SSO) gateway is failing for all 4,000 employees with error 502 Bad Gateway. Escalating immediately.',
    expectedCategory: 'Customer Support (Technical issue)',
    expectedTeam: 'Customer Support',
    label: 'Gmail: Urgent Production SSO Outage',
  },
  {
    id: 'p6',
    channel: 'messenger',
    sender: 'marcus.chen',
    senderName: 'Marcus Chen',
    text: 'Hi, I saw your job opening for Senior Frontend Engineer and would love to submit my CV and portfolio for consideration.',
    expectedCategory: 'Human Resources (Job application)',
    expectedTeam: 'Human Resources',
    label: 'Messenger: Job Application for Senior Frontend',
  },
];

export const LiveSimulatorModal: React.FC<LiveSimulatorModalProps> = ({
  isOpen,
  onClose,
  onMessageIngested,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('whatsapp');
  const [senderName, setSenderName] = useState('David Sithole');
  const [senderHandle, setSenderHandle] = useState('+27821234567');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('Hi, I would like a price for 100 branded t-shirts.');
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedChannel(preset.channel);
    setSenderName(preset.senderName);
    setSenderHandle(preset.sender);
    setSubject(preset.subject || '');
    setMessageText(preset.text);
  };

  const handleSimulateInbound = async () => {
    if (!messageText.trim()) return;

    setIsLoading(true);
    setPipelineStage('1/4 Parsing inbound webhook payload...');

    try {
      // Simulate real ingestion pipeline stages
      await new Promise((r) => setTimeout(r, 400));
      setPipelineStage('2/4 Querying Gemini 3.8 Flash AI Engine...');

      const aiResult = await classifyMessageWithAI({
        message: messageText,
        source: getChannelName(selectedChannel),
        sender: senderHandle,
        metadata: {
          senderName,
          subject,
          simulated: true,
        },
      });

      setPipelineStage('3/4 Matching routing rules & team SLAs...');
      await new Promise((r) => setTimeout(r, 350));

      setPipelineStage('4/4 Persisting to database & notifying triage queue...');
      await new Promise((r) => setTimeout(r, 250));

      // Construct complete Message
      const ticketId = `TCK-${Math.floor(10000 + Math.random() * 90000)}`;
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        source: selectedChannel,
        sender: senderHandle,
        senderName: senderName || 'Anonymous Customer',
        subject: (selectedChannel === 'gmail' || selectedChannel === 'outlook') && subject ? subject : undefined,
        message: messageText,
        category: (aiResult.category as any) || 'Customer Support',
        subcategory: aiResult.subcategory || 'General support',
        priority: aiResult.priority || 'Medium',
        status: 'Open',
        assigned_to: aiResult.assigned_to || 'Customer Support',
        sentiment: aiResult.sentiment || 'Neutral',
        sentiment_score: aiResult.sentiment_score ?? 0,
        customer_type: aiResult.customer_type || 'New',
        key_entities: aiResult.key_entities || [],
        summary: aiResult.summary || messageText.slice(0, 60),
        routing_reason: aiResult.routing_reason || 'Classified by Gemini 3.8 Flash pipeline',
        confidence_score: aiResult.confidence_score || 0.95,
        suggested_reply: aiResult.suggested_reply || 'Thank you for your message. We are reviewing your inquiry.',
        recommended_actions: aiResult.recommended_actions || ['Notify assigned team', 'Verify account details'],
        replies: [],
        internal_notes: [
          {
            id: `note_${Date.now()}`,
            author: 'AI Webhook Gateway',
            text: `Inbound webhook received from ${getChannelName(selectedChannel)}. Auto-classified with ${( (aiResult.confidence_score || 0.95) * 100 ).toFixed(1)}% confidence.`,
            timestamp: new Date().toISOString(),
          },
        ],
        ticket_id: ticketId,
        created_at: new Date().toISOString(),
        sla_deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        is_read: false,
      };

      onMessageIngested(newMessage);
      onClose();
    } catch (err: any) {
      console.error('Simulation error:', err);
      alert('Error during AI classification: ' + err.message);
    } finally {
      setIsLoading(false);
      setPipelineStage('');
    }
  };

  const channels: ChannelType[] = ['whatsapp', 'instagram', 'tiktok', 'gmail', 'outlook', 'messenger'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Inbound Webhook Simulator</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono">
                  LIVE AI PIPELINE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Test omnichannel ingestion across WhatsApp, Instagram, TikTok, Gmail, Outlook & Messenger
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

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300">Quick Test Scenarios (from Prompt):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SCENARIOS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2.5 text-left rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition group space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-1.5 font-semibold text-slate-200 group-hover:text-white">
                      {getChannelIcon(preset.channel, 'w-3.5 h-3.5')}
                      <span>{preset.label}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                    "{preset.text}"
                  </p>
                  <div className="text-[10px] text-indigo-400 font-medium">
                    Expected: {preset.expectedCategory} → {preset.expectedTeam}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            {/* Channel Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Target Ingestion Channel
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {channels.map((ch) => {
                  const isSelected = selectedChannel === ch;
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setSelectedChannel(ch)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-medium transition ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {getChannelIcon(ch, 'w-4 h-4 mb-1')}
                      <span className="text-[10px]">{getChannelName(ch)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sender details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Customer / Sender Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. David Sithole"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Sender Identifier (Handle / Phone / Email)
                </label>
                <input
                  type="text"
                  value={senderHandle}
                  onChange={(e) => setSenderHandle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. +27821234567 or @emily"
                />
              </div>
            </div>

            {/* Subject if email */}
            {(selectedChannel === 'gmail' || selectedChannel === 'outlook') && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Request for Invoice INV-2026-445"
                />
              </div>
            )}

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Raw Inbound Message Content
              </label>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type any incoming customer message to test real-time classification..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Pipeline execution progress banner */}
          {isLoading && (
            <div className="p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-xl flex items-center space-x-3 text-xs text-indigo-200 animate-pulse">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="font-mono">{pipelineStage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            POST /api/webhook/{selectedChannel}
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isLoading || !messageText.trim()}
              onClick={handleSimulateInbound}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Run AI Pipeline & Ingest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
