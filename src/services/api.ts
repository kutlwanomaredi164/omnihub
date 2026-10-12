export interface ClassifyPayload {
  message: string;
  source: string;
  sender: string;
  metadata?: Record<string, any>;
}

export interface ClassificationResult {
  category: string;
  subcategory: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  assigned_to: string;
  sentiment: 'Positive' | 'Neutral' | 'Frustrated' | 'Urgent' | 'Angry';
  sentiment_score: number;
  customer_type: 'New' | 'Returning' | 'VIP';
  key_entities: string[];
  summary: string;
  routing_reason: string;
  confidence_score: number;
  suggested_reply: string;
  recommended_actions: string[];
  provider?: string;
}

export async function classifyMessageWithAI(payload: ClassifyPayload): Promise<ClassificationResult> {
  const res = await fetch('/api/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Classification failed with status ${res.status}`);
  }

  return await res.json();
}

export async function generateSmartReply(params: {
  message: string;
  category: string;
  subcategory: string;
  tone: string;
  source: string;
  sender: string;
}): Promise<{ reply: string; tone: string; action_items?: string[] }> {
  const res = await fetch('/api/generate-reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Failed to generate reply (${res.status})`);
  }

  return await res.json();
}

export async function checkServerHealth(): Promise<{
  status: string;
  hasApiKey: boolean;
  aiModel: string;
}> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      hasApiKey: false,
      aiModel: 'offline',
    };
  }
}
