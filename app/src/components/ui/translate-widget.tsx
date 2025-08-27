"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function TranslateWidget() {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("pt");

  const initGoogleTranslate = () => {
    // Só inicializa se o objeto realmente existir
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          autoDisplay: false,
        },
        "google_translate_element"
      );
    } else {
      // Se o script ainda não carregou, tenta de novo depois
      setTimeout(initGoogleTranslate, 200);
    }
  };

  useEffect(() => {
    // Define a função global ANTES de carregar o script
    window.googleTranslateElementInit = initGoogleTranslate;

    // Detecta idioma do navegador e aplica automaticamente
    const browserLang = navigator.language.split("-")[0];
    if (LANGUAGES.some((l) => l.code === browserLang)) {
      setCurrentLang(browserLang);
      setTimeout(() => changeLanguage(browserLang), 1500);
    }
  }, []);

  const changeLanguage = (lang: string) => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
      setCurrentLang(lang);
    }
  };

  return (
    <>
      {/* Carrega o script do Google Translate */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      {/* Botão principal */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition"
        >
          🌎 {LANGUAGES.find((l) => l.code === currentLang)?.flag}{" "}
          {LANGUAGES.find((l) => l.code === currentLang)?.label}
        </button>

        {/* Dropdown de idiomas */}
        {open && (
          <div className="absolute bottom-14 right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-dropdown">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 transition ${
                  lang.code === currentLang ? "bg-gray-200 font-bold" : ""
                }`}
              >
                <span className="text-lg">{lang.flag}</span> {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Elemento oculto necessário para o Google Translate funcionar */}
      <div id="google_translate_element" className="hidden"></div>
    </>
  );
}
