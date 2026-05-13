export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', speechCode: 'en-US', ttsCode: 'en-US' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭', speechCode: 'fil-PH', ttsCode: 'fil-PH' },
  { code: 'ceb', name: 'Cebuano', flag: '🇵🇭', speechCode: 'fil-PH', ttsCode: 'fil-PH' },
  { code: 'ilo', name: 'Ilocano', flag: '🇵🇭', speechCode: 'fil-PH', ttsCode: 'fil-PH' },
  { code: 'war', name: 'Waray', flag: '🇵🇭', speechCode: 'fil-PH', ttsCode: 'fil-PH' },
];

export function getLangName(code) {
  return LANGUAGES.find(l => l.code === code)?.name || code;
}

export function getLangFlag(code) {
  return LANGUAGES.find(l => l.code === code)?.flag || '🌐';
}

export function getSpeechCode(code) {
  return LANGUAGES.find(l => l.code === code)?.speechCode || 'en-US';
}

export function getTTSCode(code) {
  return LANGUAGES.find(l => l.code === code)?.ttsCode || 'en-US';
}
