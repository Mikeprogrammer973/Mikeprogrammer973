"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

interface GoogleWindow extends Window {
  google?: any;
  googleTranslateElementInit?: () => void;
}
declare const window: GoogleWindow;

const LANGUAGES = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
];

export default function TranslateWidget() {
  const [isReady, setIsReady] = useState(false);
  const [currentLang, setCurrentLang] = useState("pt");
  const [open, setOpen] = useState(false);

  // Inicializa o Google Translate
  const initGoogleTranslate = () => {
    if (
      window.google &&
      window.google.translate &&
      typeof window.google.translate.TranslateElement === "function"
    ) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          autoDisplay: false,
        },
        "google_translate_element"
      );

      // Espera o Google criar o <select> e então esconde
      setTimeout(() => {
        const select = document.querySelector<HTMLSelectElement>(
          ".goog-te-combo"
        );
        if (select) {
          select.style.display = "none"; // 🔹 Esconde o dropdown feio
          setIsReady(true);
        }
      }, 800);
    } else {
      // Se a API ainda não carregou, tenta novamente
      setTimeout(initGoogleTranslate, 400);
    }
  };

  useEffect(() => {
    window.googleTranslateElementInit = initGoogleTranslate;
  }, []);

  // Troca de idioma no Google Translate manualmente
  const changeLanguage = (lang: string) => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change")); // 🔹 Força o Google Translate a mudar o idioma
      setCurrentLang(lang);
    }
  };

  return (
    <>
      {/* Carrega o script do Google */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setOpen((prev) => !prev)}
          disabled={!isReady}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🌎 {LANGUAGES.find((l) => l.code === currentLang)?.flag}{" "}
          {LANGUAGES.find((l) => l.code === currentLang)?.label}
        </button>

        {/* Dropdown customizado */}
        {open && (
          <div className="absolute bottom-14 right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 transition ${
                  lang.code === currentLang ? "bg-gray-200 font-bold" : ""
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Elemento que o Google Translate usa — mas escondemos o conteúdo */}
      <div id="google_translate_element" style={{ display: "none" }}></div>
    </>
  );
}
