
'use client'

import { useEffect } from 'react'

// Tipos mínimos necessários
type TranslateElementConstructor = {
  new (options: TranslateOptions, element: string): unknown;
  InlineLayout: {
    SIMPLE: number;
  };
};

interface TranslateOptions {
  pageLanguage: string;
  includedLanguages: string;
  layout: number;
  autoDisplay: boolean;
}

interface GoogleTranslate {
  TranslateElement: TranslateElementConstructor;
}

interface GoogleAPI {
  translate?: GoogleTranslate;
}

declare global {
  interface Window {
    google?: GoogleAPI;
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslateLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Evitar múltiplas inicializações
    if (window.googleTranslateElementInit) return;

    window.googleTranslateElementInit = () => {
      try {
        const google = window.google;
        if (!google?.translate?.TranslateElement) {
          console.warn('Google Translate API not available');
          return;
        }

        const layout = google.translate.TranslateElement.InlineLayout?.SIMPLE || 0;
        
        new google.translate.TranslateElement({
          pageLanguage: 'pt',
          includedLanguages: 'pt,en,es,fr,de,it,ja,ko,zh-CN,ru',
          layout: layout,
          autoDisplay: false
        }, 'google_translate_element');
      } catch (error) {
        console.error('Failed to initialize Google Translate:', error);
      }
    };

    // Carregar o script do Google Translate
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      window.googleTranslateElementInit = undefined;
    };
  }, []);

  return null;
}
