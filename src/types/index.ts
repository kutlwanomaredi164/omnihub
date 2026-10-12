export type ChannelType = 
  | 'whatsapp' 
  | 'instagram' 
  | 'tiktok' 
  | 'messenger' 
  | 'gmail' 
  | 'outlook';

export type PrimaryCategory = 
  | 'Sales' 
  | 'Accounts' 
  | 'Customer Support' 
  | 'Complaints' 
  | 'Marketing' 
  | 'Human Resources';

export type Subcategory = 
  // Sales
  | 'New lead'
  | 'Product enquiry'
  | 'Quotation request'
  | 'Pricing request'
  | 'Partnership enquiry'
  // Accounts
  | 'Invoice request'
  | 'Payment confirmation'
  | 'Refund request'
  | 'Credit note request'
  // Customer Support
  | 'General support'
  | 'Technical issue'
  | 'Product issue'
  | 'Delivery issue'
  // Complaints
  | 'Service complaint'
  | 'Product complaint'
  | 'Staff complaint'
  // Marketing
  | 'Collaboration request'
  | 'Influencer enquiry'
  | 'Campaign enquiry'
  // Human Resources
  | 'Job application'
  | 'Leave enquiry'
  | 'Employee issue';

export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type MessageStatus = 'Open' | 'In Progress' | 'Resolved' | 'Escalated';

export type Sentiment = 'Positive' | 'Neutral' | 'Frustrated' | 'Urgent' | 'Angry';

export type CustomerType = 'New' | 'Returning' | 'VIP';

export interface MessageReply {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
  isAiDraft?: boolean;
}

export interface InternalNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Message {
  id: string;
  source: ChannelType;
  sender: string;
  senderName: string;
  senderAvatar?: string;
  senderEmail?: string;
  senderPhone?: string;
  subject?: string;
  message: string;
  category: PrimaryCategory;
  subcategory: string;
  priority: Priority;
  status: MessageStatus;
  assigned_to: string;
  sentiment: Sentiment;
  sentiment_score: number;
  customer_type: CustomerType;
  key_entities: string[];
  summary: string;
  routing_reason: string;
  confidence_score: number;
  suggested_reply: string;
  recommended_actions: string[];
  replies: MessageReply[];
  internal_notes: InternalNote[];
  ticket_id?: string;
  created_at: string;
  sla_deadline: string;
  is_read: boolean;
  metadata?: Record<string, any>;
}

export interface ChannelInfo {
  id: ChannelType;
  name: string;
  brandColor: string;
  badgeBg: string;
  badgeText: string;
  status: 'connected' | 'reconnecting' | 'paused';
  webhookUrl: string;
  latencyMs: number;
  messageCount: number;
  description: string;
}

export interface CRMContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  handles: Partial<Record<ChannelType, string>>;
  type: CustomerType;
  company?: string;
  totalMessages: number;
  lastContact: string;
  assignedTeam: string;
  notes: string;
}
