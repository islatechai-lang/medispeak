/**
 * Audio Pre-Generation Script
 * Generates TTS audio files for all phrases, symptoms, and emergency phrases
 * using the Gemini TTS API. Saves to public/audio/ for instant playback.
 * 
 * Usage: node scripts/generate-audio.mjs
 */

import { GoogleGenAI } from '@google/genai';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const AUDIO_DIR = join(ROOT, 'public', 'audio');

// Load API key from .env.local
import { readFileSync } from 'fs';
const envFile = readFileSync(join(ROOT, '.env.local'), 'utf-8');
const API_KEY = envFile.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ─── Data ───────────────────────────────────────────────────
const LANGUAGES = ['tl', 'ceb', 'ilo', 'war'];

const EMERGENCY_PHRASES = [
  { id: 'emg_1', tl: 'Maging kalmado po kayo.', ceb: 'Pagkalma lang po.', ilo: 'Agkalma ka.', war: 'Pagkalma la.' },
  { id: 'emg_2', tl: 'Kailangan pumunta sa emergency room.', ceb: 'Kinahanglan moadto sa emergency room.', ilo: 'Masapul nga mapanka iti emergency room.', war: 'Kinahanglan kumadto ha emergency room.' },
  { id: 'emg_3', tl: 'Huminga ng malalim.', ceb: 'Pagginhawa og lawom.', ilo: 'Angangesem a nauneg.', war: 'Humangos hin halarom.' },
  { id: 'emg_4', tl: 'Saan ang masakit?', ceb: 'Asa ang sakit?', ilo: 'Sadino ti sakit?', war: 'Diin an masakit?' },
  { id: 'emg_5', tl: 'Naririnig mo ba ako?', ceb: 'Nadungog mo ba ko?', ilo: 'Mangngegnak kadi?', war: 'Nabababati mo ba ako?' },
  { id: 'emg_6', tl: 'Huwag gumalaw.', ceb: 'Ayaw paglihok.', ilo: 'Dikay aggunay.', war: 'Ayaw paglihok.' },
  { id: 'emg_7', tl: 'May darating na tulong.', ceb: 'Naa nay moabot nga tabang.', ilo: 'Umay ti tulong.', war: 'May maabot na bulig.' },
  { id: 'emg_8', tl: 'May allergy ka ba sa gamot?', ceb: 'Naa bay allergy sa tambal?', ilo: 'Adda kadi alerhiyam iti agas?', war: 'May allergy ka ba ha tambal?' },
];

// Import phrases and symptoms data
const PHRASES_DATA = (await import('../lib/phrasesData.js'));
const SYMPTOMS_DATA = (await import('../lib/symptomsData.js'));

// ─── WAV Header Helper ──────────────────────────────────────
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

// ─── TTS Generator ──────────────────────────────────────────
async function generateAudio(text, outputPath) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro-preview-tts',
      contents: text,
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
      console.log(`  ⚠  No audio returned for: "${text.substring(0, 40)}..."`);
      return false;
    }

    const pcm = Buffer.from(audioData.data, 'base64');
    const wav = addWavHeader(pcm);
    writeFileSync(outputPath, wav);
    console.log(`  ✅ ${outputPath.split('audio')[1]}`);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed: "${text.substring(0, 40)}..." — ${err.message}`);
    return false;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Main ───────────────────────────────────────────────────
async function main() {
  console.log('\n🎙  MediSpeak Audio Pre-Generation\n');

  // Create directories
  for (const lang of LANGUAGES) {
    for (const sub of ['phrases', 'symptoms', 'emergency']) {
      const dir = join(AUDIO_DIR, lang, sub);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    }
  }

  let total = 0, success = 0;
  let apiCallsThisMinute = 0;

  async function safeGenerate(text, path) {
    if (existsSync(path)) {
      console.log(`  ⏭  Already exists: ${path.split('audio')[1]}`);
      return true;
    }

    const res = await generateAudio(text, path);
    console.log('  ⏳ Steady rate-limit: Sleeping 10s...');
    await sleep(10000); // Steady 6 RPM (well under the 15 RPM limit)
    return res;
  }

  // ── Symptoms ──
  console.log('\n🩺 Symptoms (PRIORITY)\n');
  for (const [category, symptoms] of Object.entries(SYMPTOMS_DATA.SYMPTOMS)) {
    for (const symptom of symptoms) {
      for (const lang of LANGUAGES) {
        if (!symptom[lang]) continue;
        total++;
        const path = join(AUDIO_DIR, lang, 'symptoms', `${symptom.id}.wav`);
        if (await safeGenerate(symptom[lang], path)) success++;
      }
    }
  }

  // ── Emergency Phrases ──
  console.log('\n🚨 Emergency Phrases\n');
  for (const phrase of EMERGENCY_PHRASES) {
    for (const lang of LANGUAGES) {
      if (!phrase[lang]) continue;
      total++;
      const path = join(AUDIO_DIR, lang, 'emergency', `${phrase.id}.wav`);
      if (await safeGenerate(phrase[lang], path)) success++;
    }
  }

  // ── Nurse Phrases ──
  console.log('\n💬 Nurse Phrases\n');
  for (const phrase of PHRASES_DATA.PHRASES) {
    for (const lang of LANGUAGES) {
      if (!phrase[lang]) continue;
      total++;
      const path = join(AUDIO_DIR, lang, 'phrases', `${phrase.id}.wav`);
      if (await safeGenerate(phrase[lang], path)) success++;
    }
  }

  console.log(`\n✨ Done! ${success}/${total} audio files generated.`);
  console.log(`📁 Files saved to: public/audio/\n`);
}

main().catch(console.error);
