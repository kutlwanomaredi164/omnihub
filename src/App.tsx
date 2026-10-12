/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { MessageDetail } from './components/MessageDetail';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { RoutingArchitectureView } from './components/RoutingArchitectureView';
import { ChannelsView } from './components/ChannelsView';
import { CRMView } from './components/CRMView';
import { LiveSimulatorModal } from './components/LiveSimulatorModal';
import { TeamsAlertModal } from './components/TeamsAlertModal';
import { 
  Message, 
  ChannelInfo, 
  CRMContact, 
  ChannelType, 
  PrimaryCategory, 
  Priority, 
  MessageStatus 
} from './types';
import { INITIAL_CHANNELS, INITIAL_MESSAGES, INITIAL_CRM_CONTACTS } from './data/seedData';
import { checkServerHealth, classifyMessageWithAI } from './services/api';

const STORAGE_KEY = 'omniroute_messages_v1';

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved messages:', e);
    }
    return INITIAL_MESSAGES;
  });

  const [channels, setChannels] = useState<ChannelInfo[]>(INITIAL_CHANNELS);
  const [crmContacts, setCrmContacts] = useState<CRMContact[]>(INITIAL_CRM_CONTACTS);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(messages[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'analytics' | 'routing' | 'channels' | 'crm'>('inbox');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<PrimaryCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MessageStatus | 'all'>('all');

  // Modals & simulation
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [teamsAlertMessage, setTeamsAlertMessage] = useState<Message | null>(null);
  const [isAutoStreaming, setIsAutoStreaming] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [messages]);

  // Check health on mount
  useEffect(() => {
    checkServerHealth().then((health) => {
      setHasApiKey(health.hasApiKey);
    });
  }, []);

  // Periodic Auto-Streaming simulation (when enabled)
  useEffect(() => {
    if (!isAutoStreaming) return;

    const streamPool = [
      {
        channel: 'whatsapp' as ChannelType,
        sender: '+27839988771',
        senderName: 'Lerato Molefe',
        text: 'Do you offer bulk discounts if we order 250 units for our corporate summit?',
      },
      {
        channel: 'instagram' as ChannelType,
        sender: '@urban_trends',
        senderName: 'Urban Trends Studio',
        text: 'Our team would love to feature your latest release in our weekly fashion reel. Can you send product samples?',
      },
      {
        channel: 'outlook' as ChannelType,
        sender: 'billing@solarsolutions.co.za',
        senderName: 'Solar Solutions Billing',
        subject: 'Remittance Advice INV-2026-902',
        text: 'Please confirm remittance allocation for invoice INV-2026-902 paid this morning.',
      },
      {
        channel: 'gmail' as ChannelType,
        sender: 'hr-applicant@gmail.com',
        senderName: 'Tariq Al-Mansoor',
        subject: 'Application: DevOps Engineer - Tariq Al-Mansoor',
        text: 'Attached please find my resume for the Senior Cloud DevOps vacancy.',
      },
      {
        channel: 'tiktok' as ChannelType,
        sender: '@lifestyle_vibe',
        senderName: 'Chloe Bennett',
        text: 'Hey! Loved the video, how much is shipping to California?',
      },
    ];

    const interval = setInterval(async () => {
      const sample = streamPool[Math.floor(Math.random() * streamPool.length)];
      try {
        const aiResult = await classifyMessageWithAI({
          message: sample.text,
          source: sample.channel,
          sender: sample.sender,
        });

        const newMsg: Message = {
          id: `msg_auto_${Date.now()}`,
          source: sample.channel,
          sender: sample.sender,
          senderName: sample.senderName,
          subject: (sample as any).subject,
          message: sample.text,
          category: (aiResult.category as any) || 'Sales',
          subcategory: aiResult.subcategory || 'New lead',
          priority: aiResult.priority || 'Medium',
          status: 'Open',
          assigned_to: aiResult.assigned_to || 'Sales Team',
          sentiment: aiResult.sentiment || 'Positive',
          sentiment_score: aiResult.sentiment_score ?? 0.5,
          customer_type: aiResult.customer_type || 'New',
          key_entities: aiResult.key_entities || [],
          summary: aiResult.summary || sample.text.slice(0, 50),
          routing_reason: aiResult.routing_reason || 'Auto-classified via stream',
          confidence_score: aiResult.confidence_score || 0.96,
          suggested_reply: aiResult.suggested_reply || 'Thank you for your message.',
          recommended_actions: aiResult.recommended_actions || ['Notify assigned team'],
          replies: [],
          internal_notes: [],
          ticket_id: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
          created_at: new Date().toISOString(),
          sla_deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          is_read: false,
        };

        setMessages((prev) => [newMsg, ...prev]);
        setChannels((prev) =>
          prev.map((c) => (c.id === sample.channel ? { ...c, messageCount: c.messageCount + 1 } : c))
        );
      } catch (err) {
        console.warn('Auto stream classification error:', err);
      }
    }, 24000);

    return () => clearInterval(interval);
  }, [isAutoStreaming]);

  // Handlers
  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );
  };

  const handleUpdateStatus = (id: string, status: MessageStatus) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const handleUpdatePriority = (id: string, priority: Priority) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, priority } : m))
    );
  };

  const handleUpdateTeam = (id: string, team: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, assigned_to: team } : m))
    );
  };

  const handleUpdateCategory = (id: string, category: PrimaryCategory, subcategory: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, category, subcategory } : m))
    );
  };

  const handleAddReply = (id: string, text: string, isAiDraft?: boolean) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newReply = {
          id: `rep_${Date.now()}`,
          author: 'Customer Operations Specialist',
          role: m.assigned_to,
          text,
          timestamp: new Date().toISOString(),
          isAiDraft,
        };
        return {
          ...m,
          status: m.status === 'Open' ? 'In Progress' : m.status,
          replies: [...m.replies, newReply],
        };
      })
    );
  };

  const handleAddInternalNote = (id: string, text: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const newNote = {
          id: `note_${Date.now()}`,
          author: 'Operations Staff',
          text,
          timestamp: new Date().toISOString(),
        };
        return {
          ...m,
          internal_notes: [...m.internal_notes, newNote],
        };
      })
    );
  };

  const handleMessageIngested = (newMessage: Message) => {
    setMessages((prev) => [newMessage, ...prev]);
    setSelectedMessageId(newMessage.id);
    setActiveTab('inbox');
    setChannels((prev) =>
      prev.map((c) => (c.id === newMessage.source ? { ...c, messageCount: c.messageCount + 1 } : c))
    );
  };

  const handleMarkAllAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
  };

  const handleResetData = () => {
    if (window.confirm('Reset all messages to initial demo state?')) {
      setMessages(INITIAL_MESSAGES);
      setSelectedMessageId(INITIAL_MESSAGES[0].id);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSelectCustomerMessages = (query: string) => {
    setActiveTab('inbox');
    setSearchQuery(query);
  };

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || messages[0] || null;
  const unreadCount = messages.filter((m) => !m.is_read).length;

  const activeCrmContact = selectedMessage
    ? crmContacts.find(
        (c) =>
          c.name === selectedMessage.senderName ||
          Object.values(c.handles).includes(selectedMessage.sender)
      )
    : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header & Channel Status */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        channels={channels}
        unreadCount={unreadCount}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        isAutoStreaming={isAutoStreaming}
        setIsAutoStreaming={setIsAutoStreaming}
        onResetData={handleResetData}
        hasApiKey={hasApiKey}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'inbox' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-64px)]">
            {/* Left 5 cols: Message Feed & Filters */}
            <div className="lg:col-span-5 xl:col-span-4 h-full overflow-hidden border-r border-slate-800">
              <MessageList
                messages={messages}
                selectedId={selectedMessageId}
                onSelectMessage={handleSelectMessage}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedChannel={selectedChannel}
                setSelectedChannel={setSelectedChannel}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPriority={selectedPriority}
                setSelectedPriority={setSelectedPriority}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                onMarkAllAsRead={handleMarkAllAsRead}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
              />
            </div>

            {/* Right 7 cols: Detailed Inspector & Omnichannel Desk */}
            <div className="hidden lg:block lg:col-span-7 xl:col-span-8 h-full overflow-hidden">
              {selectedMessage ? (
                <MessageDetail
                  message={selectedMessage}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdatePriority={handleUpdatePriority}
                  onUpdateTeam={handleUpdateTeam}
                  onUpdateCategory={handleUpdateCategory}
                  onAddReply={handleAddReply}
                  onAddInternalNote={handleAddInternalNote}
                  onOpenTeamsAlert={(msg) => setTeamsAlertMessage(msg)}
                  crmContact={activeCrmContact}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                  Select a message to view AI classification and action desk
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard messages={messages} />}

        {activeTab === 'routing' && <RoutingArchitectureView />}

        {activeTab === 'channels' && (
          <ChannelsView
            channels={channels}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
          />
        )}

        {activeTab === 'crm' && (
          <CRMView
            contacts={crmContacts}
            onSelectCustomerMessages={handleSelectCustomerMessages}
          />
        )}
      </main>

      {/* Live Webhook Ingestion Simulator Modal */}
      <LiveSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onMessageIngested={handleMessageIngested}
      />

      {/* Teams / Slack Alert Preview Modal */}
      <TeamsAlertModal
        message={teamsAlertMessage}
        onClose={() => setTeamsAlertMessage(null)}
      />
    </div>
  );
}
