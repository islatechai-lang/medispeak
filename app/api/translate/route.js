import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, sourceLang, targetLang, context } = await request.json();

    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const langNames = {
      en: 'English', tl: 'Tagalog', ceb: 'Cebuano',
      ilo: 'Ilocano', war: 'Waray',
    };

    const src = langNames[sourceLang] || sourceLang;
    const tgt = langNames[targetLang] || targetLang;

    const prompt = `You are a professional medical translator for healthcare settings in the Philippines. Translate the following ${src} text into ${tgt}. 

Rules:
- Provide an accurate, natural-sounding translation appropriate for nurse-patient communication
- Keep medical terms clear and understandable for patients
- Be culturally sensitive and respectful
- If the text contains medical instructions, ensure clarity and safety
${context ? `- Context: ${context}` : ''}

Text to translate:
"${text}"

Respond with ONLY a JSON object in this exact format (no markdown, no code blocks):
{"translation": "the translated text here", "pronunciation": "simple pronunciation guide here"}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    let result;
    const rawText = response.text.trim();
    
    try {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      result = { translation: rawText, pronunciation: '' };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation error:', error.message || error);
    return NextResponse.json(
      { error: `Translation failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
