
'use client'

import { useEffect } from 'react'

// Primeiro, declare os tipos globalmente antes de qualquer código
declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: {
          new (options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: number;
            autoDisplay?: boolean;
          }, element: string): unknown;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
    googleTranslateLoaderInitialized?: boolean;
  }
}

export default function GoogleTranslateLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeGoogleTranslate = () => {
      if (!window.googleTranslateLoaderInitialized) {
        window.googleTranslateLoaderInitialized = true;
        
        window.googleTranslateElementInit = () => {
          try {
            if (window.google?.translate?.TranslateElement) {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'pt,en,es,fr,de,it,ja,ko,zh-CN,ru',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          } catch (error) {
            console.error('Error initializing Google Translate:', error);
          }
        };

        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      }
    };

    initializeGoogleTranslate();

    return () => {
      window.googleTranslateLoaderInitialized = false;
    };
  }, []);

  return null;
}
