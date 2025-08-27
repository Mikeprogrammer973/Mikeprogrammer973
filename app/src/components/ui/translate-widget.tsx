
'use client'

import { useState, useRef, useEffect } from 'react'
import { Languages, ChevronDown, Check } from 'lucide-react'
import { Button } from './button'

const languages = [
  { code: 'pt', name: 'Português', nativeName: 'Português' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' }
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    if (typeof window !== 'undefined' && window.google && window.google.translate) {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      }
    }
    setCurrentLanguage(langCode);
    setIsOpen(false);
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.nativeName : 'Português';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Languages className="w-4 h-4" />
        <span className="hidden sm:block">{getCurrentLanguageName()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in-80">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-accent transition-colors ${
                  currentLanguage === language.code ? 'bg-accent font-medium' : ''
                }`}
                onClick={() => changeLanguage(language.code)}
              >
                <span>
                  <span className="mr-2">{language.nativeName}</span>
                  <span className="text-muted-foreground text-xs">({language.name})</span>
                </span>
                {currentLanguage === language.code && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Elemento invisível do Google Translate */}
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
}
