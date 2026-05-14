import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { type, text, topic } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // ── Translate a phrase into 4 Filipino languages ──
    if (type === 'translate_phrase') {
      if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 });

      const prompt = `Translate this English phrase into 4 Philippine languages. Return ONLY valid JSON, no markdown.
Phrase: "${text}"

Return format:
{"tl":"Tagalog translation","ceb":"Cebuano translation","ilo":"Ilocano translation","war":"Waray translation"}`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      const raw = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const translations = JSON.parse(raw);

      return NextResponse.json({ translations });
    }

    // ── Generate health education content ──
    if (type === 'generate_education') {
      if (!topic) return NextResponse.json({ error: 'Missing topic' }, { status: 400 });

      const prompt = `You are a health education expert for Filipino communities. Generate a health education card about "${topic}".

Return ONLY valid JSON, no markdown. Use this exact format:
{
  "title": {"en":"English Title","tl":"Tagalog","ceb":"Cebuano","ilo":"Ilocano","war":"Waray"},
  "content": {
    "en":["point 1","point 2","point 3","point 4","point 5","point 6"],
    "tl":["point 1 in Tagalog","point 2","point 3","point 4","point 5","point 6"],
    "ceb":["point 1 in Cebuano","point 2","point 3","point 4","point 5","point 6"]
  }
}

Requirements:
- Each language should have exactly 6 bullet points
- Content should be simple, practical health advice for patients
- Use language appropriate for rural Filipino communities
- Include Tagalog (tl), Cebuano (ceb), Ilocano (ilo), and Waray (war) translations in both title and content`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      const raw = result.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const education = JSON.parse(raw);

      return NextResponse.json({ education });
    }

    return NextResponse.json({ error: 'Invalid type. Use translate_phrase or generate_education.' }, { status: 400 });
  } catch (err) {
    console.error('[Generate API] Error:', err.message);
    if (err.message?.includes('429') || err.status === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
