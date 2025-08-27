
'use client'

import { useState, useRef, useEffect } from 'react'
import { Languages, ChevronDown, Check, Loader2 } from 'lucide-react'
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
  const [isChanging, setIsChanging] = useState(false);
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

  // Função para detectar mudanças no select do Google Translate
  useEffect(() => {
    const checkGoogleTranslate = () => {
      const googleSelect = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (googleSelect) {
        // Sincronizar com o select do Google
        setCurrentLanguage(googleSelect.value);
        
        // Observar mudanças no select do Google
        googleSelect.addEventListener('change', (e) => {
          const target = e.target as HTMLSelectElement;
          setCurrentLanguage(target.value);
        });
      }
    };

    // Verificar periodicamente se o select do Google foi carregado
    const interval = setInterval(checkGoogleTranslate, 1000);
    
    // Verificar imediatamente
    checkGoogleTranslate();

    return () => clearInterval(interval);
  }, []);

  const changeLanguage = async (langCode: string) => {
    setIsChanging(true);
    setIsOpen(false);
    
    try {
      // Método 1: Tentar encontrar e modificar o select do Google Translate
      const googleSelect = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      
      if (googleSelect && googleSelect.value !== langCode) {
        googleSelect.value = langCode;
        googleSelect.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Forçar o evento de change
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', { value: googleSelect, enumerable: true });
        googleSelect.dispatchEvent(event);
      } else {
        // Método 2: Usar a API do Google Translate diretamente
        const googleTranslate = window.google?.translate;
        if (googleTranslate && googleTranslate.translate) {
          googleTranslate.translate(langCode);
        }
        
        // Método 3: Recarregar a página com o novo idioma (fallback)
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
      
      setCurrentLanguage(langCode);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
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
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors min-w-[120px] justify-center"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
      >
        {isChanging ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Languages className="w-4 h-4" />
            <span className="hidden sm:block">{getCurrentLanguageName()}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in-80">
          <div className="py-1 max-h-60 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-accent transition-colors ${
                  currentLanguage === language.code ? 'bg-accent font-medium' : ''
                }`}
                onClick={() => changeLanguage(language.code)}
                disabled={isChanging}
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

      {/* Elemento do Google Translate (deve estar invisível) */}
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
}


