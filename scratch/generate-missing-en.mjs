import { GoogleGenAI } from '@google/genai';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const AUDIO_DIR = join(ROOT, 'public', 'audio');

// Load API key from .env.local
const envFile = readFileSync(join(ROOT, '.env.local'), 'utf-8');
const API_KEY = envFile.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MISSING_SYMPTOMS = [
  { id: 'nausea', text: 'I feel nauseous' },
  { id: 'vomiting', text: 'I am vomiting' },
  { id: 'diarrhea', text: 'I have diarrhea' },
  { id: 'noappetite', text: 'I have no appetite' },
  { id: 'scared', text: 'I am scared' },
  { id: 'sad', text: 'I am sad' },
  { id: 'anxious', text: 'I feel anxious' },
  { id: 'happy', text: 'I am feeling better' },
  { id: 'water', text: 'I need water' },
  { id: 'food', text: 'I am hungry' },
  { id: 'bathroom', text: 'I need to go to the bathroom' },
  { id: 'help', text: 'I need help' },
  { id: 'sleep', text: 'I want to sleep' },
  { id: 'family', text: 'I want to see my family' }
];

function addWavHeader(pcmData, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcmData.copy(buffer, 44);
  return buffer;
}

async function main() {
  for (const symptom of MISSING_SYMPTOMS) {
    const outputPath = join(AUDIO_DIR, 'en', 'symptoms', `${symptom.id}.wav`);
    console.log(`🎙 Generating: "${symptom.text}" -> ${outputPath}`);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite-tts-preview',
        contents: symptom.text,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (!audioData) {
        console.error('  ❌ No audio returned');
        continue;
      }

      const pcm = Buffer.from(audioData.data, 'base64');
      const wav = addWavHeader(pcm);
      writeFileSync(outputPath, wav);
      console.log('  ✅ Done!');
      await new Promise(r => setTimeout(r, 5000)); // Rate limit safety
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
    }
  }
}

main().catch(console.error);
