// Language state + UI strings + toggle. Default Catalan.
// UI strings live in strings.json (Catalan) / strings.en.json (English, generated
// by `npm run translate`). Project .txt texts load a per-language file too.

const SUPPORTED = ['ca', 'en'];
let lang = 'ca';
let strings = {};

try {
  const saved = localStorage.getItem('lang');
  if (SUPPORTED.includes(saved)) lang = saved;
} catch (e) {
  // ignore
}

function getLang() {
  return lang;
}

async function loadStrings() {
  const files = lang === 'en' ? ['strings.en.json', 'strings.json'] : ['strings.json'];
  for (const f of files) {
    try {
      const res = await fetch(f);
      if (res.ok) {
        strings = await res.json();
        return;
      }
    } catch (e) {
      // try next candidate
    }
  }
  strings = {};
}

function applyStrings() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (strings[key] != null) {
      el.textContent = strings[key];
    }
  });
}

function applyLangButton() {
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang === 'ca' ? 'CAT' : 'EN';
}

async function setLang(next) {
  if (!SUPPORTED.includes(next)) return;
  lang = next;
  try {
    localStorage.setItem('lang', next);
  } catch (e) {
    // ignore
  }
  document.documentElement.setAttribute('lang', lang);
  applyLangButton();
  await loadStrings();
  applyStrings();
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
}

function toggleLang() {
  setLang(lang === 'ca' ? 'en' : 'ca');
}

function initLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.addEventListener('click', toggleLang);
    applyLangButton();
  }
}

// Load initial strings and apply them once ready.
loadStrings().then(() => {
  applyLangButton();
  applyStrings();
});

export { getLang, setLang, toggleLang, initLangToggle };
