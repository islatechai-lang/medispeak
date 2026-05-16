import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json({ error: 'Deepgram API key not configured' }, { status: 500 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio');
    const language = formData.get('language') || 'en';

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    // Map our language codes to Deepgram supported languages
    const langMap = {
      en: 'en',
      tl: 'tl',
      ceb: 'tl', // Closest supported: Tagalog
      ilo: 'tl',
      war: 'tl',
    };

    const dgLang = langMap[language] || 'en';
    const dgModel = dgLang === 'tl' ? 'nova-3' : 'nova-2';

    const response = await fetch(`https://api.deepgram.com/v1/listen?model=${dgModel}&smart_format=true&language=${dgLang}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': audioFile.type || 'audio/webm',
      },
      body: audioBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepgram error:', errorText);
      return NextResponse.json({ error: 'Speech recognition failed' }, { status: 500 });
    }

    const data = await response.json();
    const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    return NextResponse.json({ transcript, confidence: data.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0 });
  } catch (error) {
    console.error('STT error:', error.message || error);
    return NextResponse.json(
      { error: `Speech recognition failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
