/* File: js/i18n.js */
// lang config
const CONFIG = {
    defaultLang: 'en',
    supportedLangs: ['en','vi','fr','de','ja','zh-cn','pt','es','ru','ko','zh-tw','it','id','hi'] 
};

// DOMContentLoaded i18n
document.addEventListener('DOMContentLoaded', () => {
    detectAndLoadLanguage();
    setupLanguageSwitcher();
});

function detectAndLoadLanguage() {
    // 1. LocalStorage
    const savedLang = localStorage.getItem('clubtify_lang');
    if (savedLang && CONFIG.supportedLangs.includes(savedLang)) {
        loadLanguage(savedLang);
        return;
    }

    // 2. Browser Language
    // navigator.language
    const browserLang = navigator.language || navigator.userLanguage; 
    const shortLang = browserLang.substring(0, 2);

    if (CONFIG.supportedLangs.includes(shortLang)) {
        loadLanguage(shortLang);
    } else {
        // 3. default English
        loadLanguage(CONFIG.defaultLang);
    }
}

async function loadLanguage(lang) {
    try {
        const response = await fetch(`i18n/${lang}.json`);
        if (!response.ok) throw new Error(`Could not load ${lang}.json`);
        
        const translations = await response.json();
        applyTranslations(translations);
        
        // save
        localStorage.setItem('clubtify_lang', lang);
        
        // update
        document.documentElement.lang = lang;

        console.log(`Language loaded: ${lang}`);

    } catch (error) {
        console.error('Error loading language:', error);
        // if erro
        if (lang !== CONFIG.defaultLang) loadLanguage(CONFIG.defaultLang);
    }
}

function applyTranslations(data) {
    // find all element attribute data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        //nnested object (eg: hero.headline)
        const text = key.split('.').reduce((obj, i) => (obj ? obj[i] : null), data);
        
        if (text !== undefined && text !== null) {
            //  HTML text 
            const hasHTML = /<[a-z][\s\S]*>/i.test(text);
                        
            // 1. if INPUT (submit/button) -> value
            if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
                el.value = text;
            } 
            // 2. if OPTGROUP -> attribute label
            else if (el.tagName === 'OPTGROUP') {
                el.label = text;
            }
            // 3. if OPTION -> textContent
            else if (el.tagName === 'OPTION') {
                el.textContent = text;
            }
            // 4. if HTML text
            else if (hasHTML) {
                el.innerHTML = text;
            }
            // 5. else
            else {
                el.textContent = text;
            }            
            
        } else {
            console.warn(`Translation missing for key: ${key}`);
        }
    });

    // placeholder input/textarea
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const text = key.split('.').reduce((obj, i) => (obj ? obj[i] : null), data);
        if (text) el.placeholder = text;
    });
    
    // data-i18n-ph
    const placeholdersPh = document.querySelectorAll('[data-i18n-ph]');
    placeholdersPh.forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        const text = key.split('.').reduce((obj, i) => (obj ? obj[i] : null), data);
        if (text) el.placeholder = text;
    });
}

// switch language
function switchLanguage(lang) {
    if (CONFIG.supportedLangs.includes(lang)) {
        loadLanguage(lang);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { switchLanguage };
}

// SETUP LANGUAGE SWITCHER
function setupLanguageSwitcher() {
    const langToggle = document.getElementById('langToggle');
    const currentLangSpan = document.getElementById('currentLang');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langToggle) return;
    
    // update active state
    function updateLanguageUI(lang) {
        if (currentLangSpan) {
            const langCode = lang === 'zh-cn' ? '简中' : 
                           lang === 'zh-tw' ? '繁中' : 
                           lang.toUpperCase();
            currentLangSpan.textContent = langCode;
        }
        
        // update active state for option
        langOptions.forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            if (optionLang === lang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    // listener click lang
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            switchLanguage(lang);
            updateLanguageUI(lang);
            
            // close dropdown
            const dropdown = document.getElementById('langDropdown');
            if (dropdown) {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            }
        });
    });
    
    // Click close dropdown
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-switcher')) {
            const dropdown = document.getElementById('langDropdown');
            if (dropdown) {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            }
        }
    });
    
    // Toggle dropdown click 
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('langDropdown');
        if (dropdown) {
            const isVisible = dropdown.style.opacity === '1';
            dropdown.style.opacity = isVisible ? '0' : '1';
            dropdown.style.visibility = isVisible ? 'hidden' : 'visible';
            dropdown.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
        }
    });
    
    // save lang and update UI
    const savedLang = localStorage.getItem('clubtify_lang') || 'en';
    updateLanguageUI(savedLang);
    
    // update UI loadLanguage
    const originalLoadLanguage = loadLanguage;
    window.loadLanguage = async function(lang) {
        await originalLoadLanguage(lang);
        updateLanguageUI(lang);
    };
}