import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: 'Hello! I am your MilkSafe Chemistry Advisor. Ask me anything about milk adulteration assays, colorimetric reactions, FSSAI compliance standards, or how to detect suspected contaminants at home or in the laboratory.',
    timestamp: 'Just now',
  },
];

const SUGGESTIONS = [
  'How do I confirm if my milk has starch?',
  'Why did my milk turn magenta with phenolphthalein?',
  'What is the chemistry behind the formalin ring test?',
  'How do synthetic milk emulsifiers harm human health?',
  'What are the permissible limits for urea in cow milk?',
];

export const AiMilkAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (userPrompt?: string) => {
    const query = userPrompt || inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userPrompt) setInputValue('');
    setIsLoading(true);

    try {
      // Check for Gemini API key
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      let replyText = '';

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: query,
          config: {
            systemInstruction:
              'You are the MilkSafe Senior Food Safety & Dairy Chemistry Advisor. Provide accurate, scientifically rigorous, and practical guidance on milk adulteration testing, colorimetric assays (iodine, phenolphthalein, DMAB, Seliwanoff, formalin ring test), health hazards, and FSSAI standards. Keep answers clear, professional, and well-structured.',
          },
        });
        replyText = response.text || 'I could not generate an answer at this moment.';
      } else {
        // Fallback intelligent scientific knowledge base
        replyText = generateFallbackResponse(query);
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: generateFallbackResponse(query),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (q: string): string => {
    const lower = q.toLowerCase();
    if (lower.includes('starch') || lower.includes('iodine')) {
      return 'Starch Adulteration Protocol:\n1. Principle: Starch amylose contains helical coils. Triiodide ions (I₃⁻) from 1% Iodine solution insert inside this helix, forming an intense blue-black polyiodide charge-transfer complex.\n2. Procedure: Add 3 mL milk, add 2-3 drops of Iodine solution, heat to 95°C and cool.\n3. Interpretation: Deep blue/purple indicates added flour/starch. Pure milk remains pale cream with a faint yellowish iodine tint.\n4. Regulatory: 0.00% tolerance under FSSAI.';
    }
    if (lower.includes('phenolphthalein') || lower.includes('detergent') || lower.includes('soap')) {
      return 'Detergent & Alkalis Assay:\n1. Principle: Fresh bovine milk has a natural pH of 6.6 - 6.8. Laundry detergents and synthetic emulsifiers raise pH above 9.5. Phenolphthalein indicator undergoes base-catalyzed ionization to produce a bright magenta-pink quinoid dianion.\n2. Observation: Immediate vibrant pink/magenta indicates detergent contamination.\n3. Health Risk: Destroys stomach mucosa, causes chemical gastritis, and overloads kidneys.';
    }
    if (lower.includes('urea') || lower.includes('dmab') || lower.includes('nitrogen')) {
      return 'Urea (Fertilizer) Assay:\n1. Motive: Added to watered milk to artificially inflate non-protein nitrogen (NPN), tricking Kjeldahl protein calculations.\n2. Test: DMAB (p-Dimethylaminobenzaldehyde) in HCl reacts with urea amides to yield a bright canary-yellow Schiff base chromophore.\n3. FSSAI Standard: Physiological limit is up to 70 mg/100 mL (700 ppm). Synthetic spiked milk exceeds this dramatically.';
    }
    if (lower.includes('formalin') || lower.includes('formaldehyde') || lower.includes('ring')) {
      return 'Formalin (Leach / Hehner Test):\n1. Motive: Formaldehyde is added to prevent milk from souring in warm transit without refrigeration.\n2. Test: Add 2 drops of 10% FeCl₃ to 5 mL milk, then gently layer concentrated H₂SO₄ down the tube wall without mixing.\n3. Positive Reaction: A sharp violet/purple ring forms at the liquid interface due to condensation between tryptophan in casein and formaldehyde catalyzed by Fe³⁺.\n4. Toxicity: Classified by IARC as a Group 1 human carcinogen.';
    }
    if (lower.includes('sucrose') || lower.includes('sugar') || lower.includes('resorcinol')) {
      return 'Sucrose / Cane Sugar Assay (Modified Seliwanoff Test):\n1. Motive: Added to watered milk to boost density readings on lactometers and restore sweetness.\n2. Reaction: Hot concentrated HCl hydrolyzes sucrose into fructose, which dehydrates to hydroxymethylfurfural (HMF). HMF condenses with resorcinol to create a deep cherry-red dye upon boiling in a 95°C water bath for 5 minutes.';
    }
    return `Based on dairy food safety protocols:\n- Physical tests: Pure milk flows slowly on a tilted glass plate leaving a white residue trail, whereas watered milk runs off immediately.\n- Chemical verification: Conduct the specific colorimetric test on the 3D Laboratory Bench to confirm chemical presence.\n- Regulatory standard: All synthetic additives (detergent, starch, formalin, neutralizers) carry a strict 0.00% zero-tolerance limit under FSSAI and Codex Alimentarius.`;
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider">
            AI Analytical Consultation
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-display">
            MilkSafe Chemistry & Diagnostics Assistant
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Get instant scientific explanations for observed test colors, laboratory reaction equations, and milk testing recommendations.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-sky-100 text-sky-800 border border-sky-200'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] font-mono mt-1 ${
                    msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="self-start flex gap-3 max-w-[80%]">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 border border-sky-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-ping" />
                Analyzing chemical parameters...
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 font-mono shrink-0 pl-1">Ask:</span>
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(sug)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] text-slate-700 whitespace-nowrap transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about a reaction color, chemical equation, or test method..."
            className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg transition-colors shrink-0 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
