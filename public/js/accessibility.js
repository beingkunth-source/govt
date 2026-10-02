/* ==========================================================================
   SHIKSHA SETU - ACCESSIBILITY, LOW-DATA & WEB SPEECH MANAGER
   ========================================================================== */

const AccessibilityManager = {
  fontSize: 'md',      // sm, md, lg, xl
  isHighContrast: false,
  isLowData: false,
  synth: window.speechSynthesis || null,
  currentUtterance: null,

  init() {
    // Load stored settings
    const savedFontSize = localStorage.getItem('shiksha_font_size');
    if (savedFontSize) this.setFontSize(savedFontSize);

    const savedContrast = localStorage.getItem('shiksha_high_contrast');
    if (savedContrast === 'true') this.setHighContrast(true);

    const savedLowData = localStorage.getItem('shiksha_low_data');
    if (savedLowData === 'true') this.setLowData(true);
  },

  setFontSize(size) {
    const validSizes = ['sm', 'md', 'lg', 'xl'];
    if (!validSizes.includes(size)) return;
    
    this.fontSize = size;
    localStorage.setItem('shiksha_font_size', size);
    
    const root = document.documentElement;
    validSizes.forEach(s => root.classList.remove(`font-${s}`));
    root.classList.add(`font-${size}`);
  },

  setHighContrast(enabled) {
    this.isHighContrast = enabled;
    localStorage.setItem('shiksha_high_contrast', enabled);
    
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  },

  toggleHighContrast() {
    this.setHighContrast(!this.isHighContrast);
  },

  setLowData(enabled) {
    this.isLowData = enabled;
    localStorage.setItem('shiksha_low_data', enabled);
    
    if (enabled) {
      document.body.classList.add('low-data-mode');
    } else {
      document.body.classList.remove('low-data-mode');
    }

    window.dispatchEvent(new CustomEvent('lowDataChanged', { detail: { lowData: enabled } }));
  },

  toggleLowData() {
    this.setLowData(!this.isLowData);
  },

  // --- Text to Speech API ---
  speakText(text, langCode = 'en') {
    if (!this.synth) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    this.stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language codes
    const langMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'mr': 'mr-IN'
    };
    
    utterance.lang = langMap[langCode] || 'en-IN';
    utterance.rate = 0.9; // Slightly slower for clear educational listening
    
    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  },

  stopSpeech() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }
};

if (typeof window !== 'undefined') {
  window.AccessibilityManager = AccessibilityManager;
}

