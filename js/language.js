/* ==========================================================================
   SHIKSHA SETU - DYNAMIC 3-LANGUAGE TRANSLATION ENGINE (EN, HI, MR)
   ========================================================================== */

const LanguageManager = {
  currentLang: 'en',

  init() {
    const saved = localStorage.getItem('shiksha_lang');
    if (saved && ['en', 'hi', 'mr'].includes(saved)) {
      this.currentLang = saved;
    } else {
      this.currentLang = 'en';
    }
    this.applyLanguage(this.currentLang);
  },

  setLanguage(langCode) {
    if (!['en', 'hi', 'mr'].includes(langCode)) return;
    this.currentLang = langCode;
    localStorage.setItem('shiksha_lang', langCode);
    this.applyLanguage(langCode);
    
    // Dispatch custom event so active views can re-render if needed
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: langCode } }));
  },

  get(key) {
    const dict = SHIKSHA_DATA.translations[this.currentLang] || SHIKSHA_DATA.translations['en'];
    return dict[key] || SHIKSHA_DATA.translations['en'][key] || key;
  },

  applyLanguage(langCode) {
    document.documentElement.lang = langCode;

    // Update text content for elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.get(key);
      if (text) {
        el.textContent = text;
      }
    });

    // Update placeholders for input elements with data-i18n-placeholder attribute
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = this.get(key);
      if (text) {
        el.setAttribute('placeholder', text);
      }
    });

    // Update language select dropdowns if present
    const selectors = document.querySelectorAll('.lang-selector');
    selectors.forEach(select => {
      select.value = langCode;
    });
  }
};

// Global shorthand helper
function t(key) {
  return LanguageManager.get(key);
}
