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

export default function TranslateWidget() {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>("pt");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Função global obrigatória para o Google Translate
  useEffect(() => {
    if (scriptLoaded && typeof window !== "undefined" && window.google) {
      // Inicializa o Google Translate
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    }
  }, [scriptLoaded]);

  // Detecta o idioma do navegador automaticamente
  useEffect(() => {
    const browserLang = navigator.language.split("-")[0];
    if (LANGUAGES.some((l) => l.code === browserLang)) {
      setCurrentLang(browserLang);
      setTimeout(() => changeLanguage(browserLang), 1200);
    }
  }, [scriptLoaded]);

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
      {/* Script do Google Translate */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
        onLoad={() => {
          // Define a função global de callback
          window.googleTranslateElementInit = () => {
            setScriptLoaded(true);
          };
        }}
      />

      {/* Contêiner do widget */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        {/* Botão principal */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition"
        >
          🌎 {LANGUAGES.find((l) => l.code === currentLang)?.flag}{" "}
          {LANGUAGES.find((l) => l.code === currentLang)?.label}
        </button>

        {/* Dropdown */}
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
    </>
  );
}
