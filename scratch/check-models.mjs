import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const envFile = readFileSync(join(ROOT, '.env.local'), 'utf-8');
const API_KEY = envFile.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function main() {
  // The SDK doesn't have a direct listModels, but we can try to guess or use the discovery API
  // Actually, I'll just try 'gemini-2.0-flash-exp' which often has higher limits
  console.log("Checking gemini-2.0-flash-exp...");
  try {
     const res = await ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
     console.log("Model exists");
  } catch(e) {
     console.log("Error", e.message);
  }
}
main();
