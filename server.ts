import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt describing the complete taxonomy & routing guidelines
const CLASSIFICATION_SYSTEM_INSTRUCTION = `
You are an enterprise AI message classification and routing engine for an omnichannel inbox.
Your task is to analyze incoming messages across WhatsApp, Instagram DM, TikTok, Facebook Messenger, Gmail, and Outlook.

You must categorize each message into EXACTLY ONE of the following Primary Categories and Subcategories:
1. "Sales"
   Subcategories: "New lead", "Product enquiry", "Quotation request", "Pricing request", "Partnership enquiry"
   Assigned Team: "Sales Team"
2. "Accounts"
   Subcategories: "Invoice request", "Payment confirmation", "Refund request", "Credit note request"
   Assigned Team: "Accounts"
3. "Customer Support"
   Subcategories: "General support", "Technical issue", "Product issue", "Delivery issue"
   Assigned Team: "Customer Support"
4. "Complaints"
   Subcategories: "Service complaint", "Product complaint", "Staff complaint"
   Assigned Team: "Complaints & Escalations"
5. "Marketing"
   Subcategories: "Collaboration request", "Influencer enquiry", "Campaign enquiry"
   Assigned Team: "Marketing"
6. "Human Resources"
   Subcategories: "Job application", "Leave enquiry", "Employee issue"
   Assigned Team: "Human Resources"

Priority Guidelines:
- "Urgent": Severe complaints, escalation threats, critical bugs/outages, legal/finance blockers.
- "High": Delivery delays, damaged/wrong products received, high-value enterprise sales leads, refund escalations.
- "Medium": Standard quotes, product inquiries, general invoice requests, payment receipts.
- "Low": General job applications, non-urgent influencer pitches, informational FAQs.

Customer Status: "New", "Returning", or "VIP".
Sentiment: "Positive", "Neutral", "Frustrated", "Urgent", or "Angry".

Provide output in JSON format with fields:
- category (string)
- subcategory (string)
- priority ("Urgent" | "High" | "Medium" | "Low")
- assigned_to (string)
- sentiment ("Positive" | "Neutral" | "Frustrated" | "Urgent" | "Angry")
- sentiment_score (number between -1.0 and 1.0)
- customer_type ("New" | "Returning" | "VIP")
- key_entities (array of strings, e.g. ["INV-2026-445", "100 branded t-shirts"])
- summary (short 1-sentence synopsis)
- routing_reason (brief explanation why this category/team was assigned)
- confidence_score (number between 0.85 and 0.99)
- suggested_reply (ready-to-send empathetic, professional draft reply tailored to the channel and inquiry)
- recommended_actions (array of strings, e.g. ["Generate Quotation Template", "Assign to Senior Rep", "Attach Invoice PDF"])
`;

// Fallback rule-based classifier when Gemini is offline or rate-limited
function fallbackClassifier(message: string, source: string, sender: string) {
  const lower = message.toLowerCase();

  let category = 'Customer Support';
  let subcategory = 'General support';
  let priority = 'Medium';
  let assigned_to = 'Customer Support';
  let sentiment = 'Neutral';
  let sentiment_score = 0.0;
  let customer_type = 'New';
  const key_entities: string[] = [];

  // Extract invoice / order patterns
  const invMatch = message.match(/INV-[\w-]+|order\s*#?[\w-]+/i);
  if (invMatch) key_entities.push(invMatch[0]);
  const qtyMatch = message.match(/\b\d+\s*(units|pieces|t-shirts|items|boxes|shirts)\b/i);
  if (qtyMatch) key_entities.push(qtyMatch[0]);

  // Accounts
  if (lower.includes('invoice') || lower.includes('inv-') || lower.includes('payment') || lower.includes('receipt') || lower.includes('refund') || lower.includes('credit note') || lower.includes('paid')) {
    category = 'Accounts';
    assigned_to = 'Accounts';
    if (lower.includes('refund')) {
      subcategory = 'Refund request';
      priority = 'High';
      sentiment = 'Frustrated';
      sentiment_score = -0.5;
    } else if (lower.includes('credit note')) {
      subcategory = 'Credit note request';
    } else if (lower.includes('payment') || lower.includes('proof of payment') || lower.includes('paid')) {
      subcategory = 'Payment confirmation';
      sentiment = 'Positive';
      sentiment_score = 0.4;
    } else {
      subcategory = 'Invoice request';
      priority = 'Medium';
    }
  }
  // Complaints
  else if (lower.includes('complaint') || lower.includes('wrong') || lower.includes('broken') || lower.includes('unacceptable') || lower.includes('terrible') || lower.includes('disappointed') || lower.includes('rude') || lower.includes('scam') || lower.includes('faulty')) {
    category = 'Complaints';
    assigned_to = 'Complaints & Escalations';
    priority = 'High';
    sentiment = lower.includes('unacceptable') || lower.includes('scam') ? 'Angry' : 'Frustrated';
    sentiment_score = -0.8;
    if (lower.includes('staff') || lower.includes('employee') || lower.includes('manager') || lower.includes('rude')) {
      subcategory = 'Staff complaint';
    } else if (lower.includes('product') || lower.includes('size') || lower.includes('broken') || lower.includes('defect')) {
      subcategory = 'Product complaint';
    } else {
      subcategory = 'Service complaint';
    }
  }
  // Sales
  else if (lower.includes('price') || lower.includes('quotation') || lower.includes('quote') || lower.includes('pricing') || lower.includes('buy') || lower.includes('order 100') || lower.includes('branded') || lower.includes('partnership') || lower.includes('bulk') || lower.includes('catalog')) {
    category = 'Sales';
    assigned_to = 'Sales Team';
    priority = lower.includes('100') || lower.includes('bulk') || lower.includes('enterprise') ? 'High' : 'Medium';
    sentiment = 'Positive';
    sentiment_score = 0.6;
    if (lower.includes('quotation') || lower.includes('quote')) subcategory = 'Quotation request';
    else if (lower.includes('pricing') || lower.includes('price')) subcategory = 'Pricing request';
    else if (lower.includes('partnership')) subcategory = 'Partnership enquiry';
    else subcategory = 'New lead';
  }
  // Marketing
  else if (lower.includes('collaborat') || lower.includes('influencer') || lower.includes('sponsor') || lower.includes('pr package') || lower.includes('promo') || lower.includes('media kit') || lower.includes('campaign')) {
    category = 'Marketing';
    assigned_to = 'Marketing';
    subcategory = lower.includes('influencer') ? 'Influencer enquiry' : lower.includes('campaign') ? 'Campaign enquiry' : 'Collaboration request';
    priority = 'Low';
    sentiment = 'Positive';
    sentiment_score = 0.5;
  }
  // HR
  else if (lower.includes('job') || lower.includes('resume') || lower.includes('cv') || lower.includes('hiring') || lower.includes('interview') || lower.includes('leave enquiry') || lower.includes('applicant') || lower.includes('career')) {
    category = 'Human Resources';
    assigned_to = 'Human Resources';
    subcategory = lower.includes('leave') ? 'Leave enquiry' : lower.includes('issue') ? 'Employee issue' : 'Job application';
    priority = 'Low';
    sentiment = 'Neutral';
    sentiment_score = 0.1;
  }
  // Support
  else if (lower.includes('delivery') || lower.includes('tracking') || lower.includes('where is my') || lower.includes('shipped') || lower.includes('courier')) {
    category = 'Customer Support';
    assigned_to = 'Customer Support';
    subcategory = 'Delivery issue';
    priority = 'High';
    sentiment = 'Frustrated';
    sentiment_score = -0.3;
  } else if (lower.includes('error') || lower.includes('bug') || lower.includes('login') || lower.includes('password') || lower.includes('crash') || lower.includes('500') || lower.includes('technical')) {
    category = 'Customer Support';
    assigned_to = 'Customer Support';
    subcategory = 'Technical issue';
    priority = 'High';
    sentiment = 'Frustrated';
    sentiment_score = -0.4;
  }

  const suggestedReplies: Record<string, string> = {
    Sales: `Hello! Thank you for reaching out to us. We would be delighted to assist you with your enquiry. One of our sales specialists is preparing your custom quote and will send through detailed pricing shortly.`,
    Accounts: `Hello. Thank you for your inquiry regarding your account. We have retrieved your request and are processing the documents. You will receive an update from our accounts department within 2 hours.`,
    Complaints: `We sincerely apologize for the inconvenience this has caused. We take your feedback very seriously and a senior escalation specialist has been assigned to resolve this for you immediately.`,
    'Customer Support': `Hi there, thank you for contacting support. We understand how important this is and our support engineering team is looking into this right now. We'll update you as soon as possible.`,
    Marketing: `Thanks for getting in touch! We love exploring partnerships. Our marketing and brand collaborations team will review your proposal and get back to you if there's a strong fit.`,
    'Human Resources': `Thank you for your application and interest in joining our team. Our People & Talent acquisition team is reviewing your profile and will be in touch if your qualifications align with open roles.`,
  };

  return {
    category,
    subcategory,
    priority,
    assigned_to,
    sentiment,
    sentiment_score,
    customer_type,
    key_entities,
    summary: `Inbound ${subcategory.toLowerCase()} via ${source}`,
    routing_reason: `Rule-matched keywords detected for ${category} (${subcategory}) routed to ${assigned_to}.`,
    confidence_score: 0.94,
    suggested_reply: suggestedReplies[category] || `Hello, thank you for reaching out. We have routed your request to our team.`,
    recommended_actions: [
      `Notify ${assigned_to}`,
      `Track sender SLA within 1 hour`,
      `Sync with CRM timeline`,
    ],
  };
}

// REST Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiModel: 'gemini-3.8-flash',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

app.post('/api/classify', async (req, res) => {
  try {
    const { message, source, sender, metadata } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    if (aiClient) {
      try {
        const prompt = `
Analyze the following incoming message:
Channel/Source: ${source || 'Unknown'}
Sender: ${sender || 'Customer'}
Message Content:
"${message}"
Metadata: ${JSON.stringify(metadata || {})}

Classify this message precisely adhering to the system instructions. Respond ONLY with a valid JSON object matching the requested schema.
`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: CLASSIFICATION_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        try {
          const parsed = JSON.parse(rawText);
          return res.json({
            ...parsed,
            provider: 'gemini-3.8-flash',
          });
        } catch (parseError) {
          console.warn('Failed to parse Gemini JSON output, falling back:', rawText);
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using intelligent rule fallback:', geminiError?.message);
      }
    }

    // Fallback if no AI client or error
    const fallback = fallbackClassifier(message, source || 'Channel', sender || 'User');
    return res.json({
      ...fallback,
      provider: 'rule-engine-fallback',
    });
  } catch (err: any) {
    console.error('Classification error:', err);
    res.status(500).json({ error: err.message || 'Classification failed' });
  }
});

app.post('/api/generate-reply', async (req, res) => {
  try {
    const { message, category, subcategory, tone, source, sender } = req.body;

    if (aiClient) {
      try {
        const prompt = `
You are an expert customer communication specialist.
Generate a draft reply for:
Channel: ${source}
Customer: ${sender}
Category: ${category} (${subcategory})
Customer Message: "${message}"
Requested Tone: ${tone || 'Professional & Empathetic'}

Requirements:
- Keep the format natural for ${source} (e.g. WhatsApp / IG DM should be friendly and concise; Email should have polite salutation and closing).
- Address the customer's exact issue directly.
- Include placeholders like [Your Name] or [Reference #] if specific info is needed.
- Return a JSON object with:
  "reply": string (the draft reply text),
  "tone": string,
  "action_items": array of strings
`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json(parsed);
      } catch (err) {
        console.warn('Gemini reply generation error, using template:', err);
      }
    }

    // Default template reply
    res.json({
      reply: `Hi ${sender},\n\nThank you for reaching out regarding ${subcategory || 'your inquiry'}. We are actively looking into this and our ${category} team is taking care of it.\n\nBest regards,\nCustomer Operations`,
      tone: tone || 'Professional',
      action_items: ['Verify customer account', 'Send status update within 2h'],
      provider: 'template',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Simulated Webhook Endpoint
app.post('/api/webhook/:channel', async (req, res) => {
  const { channel } = req.params;
  const body = req.body;

  // Extract common fields from various simulated formats
  const sender = body.from || body.sender || body.user || 'Unknown Sender';
  const text = body.text || body.message || body.body || (typeof body === 'string' ? body : JSON.stringify(body));

  res.json({
    received: true,
    channel,
    sender,
    text,
    timestamp: new Date().toISOString(),
    event_id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  });
});

// Dev server or Production static serving
async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OmniRoute] Server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
