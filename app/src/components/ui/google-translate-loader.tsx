
'use client'

import { useEffect } from 'react'

export default function GoogleTranslateLoader() {
  useEffect(() => {
    // Função para inicializar o Google Translate
    const initializeGoogleTranslate = () => {
      if (typeof window !== 'undefined' && !window.googleTranslateLoaderInitialized) {
        const addScript = document.createElement('script');
        addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
        document.head.appendChild(addScript);
        
        window.googleTranslateLoaderInitialized = true;
        
        window.googleTranslateElementInit = () => {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'pt',
              includedLanguages: 'pt,en,es,fr,de,it,ja,ko,zh-CN,ru',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            }, 'google_translate_element');
          }
        };
      }
    };

    initializeGoogleTranslate();
  }, []);

  return null;
}

// Extend the Window interface to include Google Translate properties
declare global {
  interface Window {
    googleTranslateLoaderInitialized?: boolean;
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: unknown, element: string) => unknown;
        TranslateElement: {
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
  }
}
