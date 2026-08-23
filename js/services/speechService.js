/**
 * @file speechService.js
 * Browser Speech Synthesis Service (TTS) for Multilingual Audio Read-Aloud
 * Supported Languages: English (en-IN), Hindi (hi-IN), Marathi (mr-IN), Punjabi (pa-IN)
 */

export class SpeechService {
  static voices = [];
  static initialized = false;

  static init() {
    if (!this.isSupported() || this.initialized) return;

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          this.voices = available;
          this.initialized = true;
        }
      } catch (e) {
        console.warn('Could not load speech synthesis voices:', e);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  static isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  /**
   * Reads text aloud in the specified regional language with best matching regional voice.
   * 
   * @param {Object} options
   * @param {string} options.text - Raw text or markdown
   * @param {string} options.languageCode - 'en' | 'hi' | 'mr' | 'pa'
   * @param {Function} options.onStart - () => void
   * @param {Function} options.onEnd - () => void
   * @param {Function} options.onPause - () => void
   * @param {Function} options.onResume - () => void
   * @param {Function} options.onError - (err) => void
   */
  static speak({ text, languageCode = 'en', onStart, onEnd, onPause, onResume, onError }) {
    if (!this.isSupported()) {
      if (onError) onError('Speech synthesis audio is not supported in this browser.');
      return;
    }

    this.init();

    // Stop any ongoing speech first
    this.stop();

    const cleanText = this.stripMarkdown(text);
    if (!cleanText.trim()) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const langMap = {
        en: 'en-IN',
        hi: 'hi-IN',
        mr: 'mr-IN',
        pa: 'pa-IN'
      };

      const targetLocale = langMap[languageCode] || 'en-IN';
      utterance.lang = targetLocale;
      utterance.rate = 0.90; // Natural measured rate for rural agrarian comprehension
      utterance.pitch = 1.0;

      // Select Best Available Voice
      const selectedVoice = this.getBestVoice(languageCode, targetLocale);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onpause = () => {
        if (onPause) onPause();
      };

      utterance.onresume = () => {
        if (onResume) onResume();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error event:', e);
        if (onEnd) onEnd();
        if (onError) onError(e?.error || 'Audio playback ended.');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis initiation failed:', err);
      if (onError) onError('Audio playback failed.');
    }
  }

  /**
   * Finds the best matching voice for a given language code with graceful Indic fallback.
   * 
   * @param {string} langCode - 'en' | 'hi' | 'mr' | 'pa'
   * @param {string} targetLocale - 'en-IN' | 'hi-IN' | 'mr-IN' | 'pa-IN'
   * @returns {SpeechSynthesisVoice|null}
   */
  static getBestVoice(langCode, targetLocale) {
    if (!this.voices || this.voices.length === 0) {
      try {
        this.voices = window.speechSynthesis.getVoices();
      } catch (e) {}
    }

    if (!this.voices || this.voices.length === 0) return null;

    const voices = this.voices;
    const lowerLang = (langCode || 'en').toLowerCase();

    // 1. Exact locale match (e.g. 'mr-IN', 'hi-IN', 'pa-IN', 'en-IN')
    let match = voices.find(v => v.lang === targetLocale || v.lang.replace('_', '-') === targetLocale);
    if (match) return match;

    // 2. Language prefix match (e.g. 'mr', 'hi', 'pa', 'en')
    match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lowerLang));
    if (match) return match;

    // 3. Name-based match for Indic voice tags
    const nameKeywords = {
      mr: ['marathi', 'मराठी'],
      hi: ['hindi', 'हिन्दी', 'हिंदी'],
      pa: ['punjabi', 'ਪੰਜਾਬੀ'],
      en: ['india', 'indian', 'en-in', 'en_in']
    };

    const targetKeywords = nameKeywords[lowerLang] || [];
    for (const kw of targetKeywords) {
      match = voices.find(v => (v.name && v.name.toLowerCase().includes(kw)) || (v.lang && v.lang.toLowerCase().includes(kw)));
      if (match) return match;
    }

    // 4. Indic Regional Fallback:
    // If exact Marathi or Punjabi voice is absent on the user's OS, use Hindi (hi-IN)
    if (lowerLang === 'mr' || lowerLang === 'pa') {
      const hindiVoice = voices.find(v => 
        v.lang === 'hi-IN' || 
        v.lang === 'hi_IN' || 
        (v.lang && v.lang.startsWith('hi')) || 
        (v.name && v.name.toLowerCase().includes('hindi'))
      );
      if (hindiVoice) return hindiVoice;
    }

    // 5. Indian English Fallback
    const indianEnglishVoice = voices.find(v => 
      v.lang === 'en-IN' || 
      v.lang === 'en_IN' || 
      (v.name && v.name.toLowerCase().includes('india'))
    );
    if (indianEnglishVoice) return indianEnglishVoice;

    // 6. Generic English voice
    const genericEnglishVoice = voices.find(v => v.lang && v.lang.startsWith('en'));
    if (genericEnglishVoice) return genericEnglishVoice;

    // 7. System default
    return voices.find(v => v.default) || voices[0] || null;
  }

  static pause() {
    if (this.isSupported() && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.pause();
      } catch (e) {
        console.warn('Speech pause error:', e);
      }
    }
  }

  static resume() {
    if (this.isSupported() && window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {
        console.warn('Speech resume error:', e);
      }
    }
  }

  static stop() {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Speech cancel error:', e);
      }
    }
  }

  static isSpeaking() {
    return this.isSupported() && window.speechSynthesis.speaking && !window.speechSynthesis.paused;
  }

  static isPaused() {
    return this.isSupported() && window.speechSynthesis.paused;
  }

  /**
   * Cleans markdown tags, emojis, and non-spoken formatting symbols for natural speech synthesis
   */
  static stripMarkdown(md) {
    if (!md) return '';
    return md
      .replace(/#{1,6}\s+/g, '') // Headings
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italics
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
      .replace(/`{1,3}.*?`{1,3}/g, '') // Code blocks
      .replace(/[-*+›]\s+/g, ' ') // Bullets
      .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
      .replace(/[|—_~]/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Emojis
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// Initialize on script load if in browser
SpeechService.init();

