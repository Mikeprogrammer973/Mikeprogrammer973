"use client";

import { useEffect, useRef, useState } from "react";

/** Idiomas suportados */
const LANGUAGES = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English",  flag: "🇺🇸" },
  { code: "es", label: "Español",  flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch",  flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
] as const;

const GOOGLE_SCRIPT_ID = "google-translate-script";
const GOOGLE_SCRIPT_SRC = "https://translate.google.com/translate_a/element.js";

/** Carrega o script do Google uma única vez (sem callback global) */
function loadGoogleTranslateScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(GOOGLE_SCRIPT_ID)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.id = GOOGLE_SCRIPT_ID;
    s.src = GOOGLE_SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Falha ao carregar o Google Translate"));
    document.head.appendChild(s);
  });
}

/** Aguarda o constructor estar realmente disponível */
async function waitForTranslateElement(maxMs = 7000, intervalMs = 150): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const ctor = window.google?.translate?.TranslateElement;
      if (typeof ctor === "function") {
        resolve();
      } else if (Date.now() - start >= maxMs) {
        reject(new Error("TranslateElement indisponível (timeout)."));
      } else {
        setTimeout(tick, intervalMs);
      }
    };
    tick();
  });
}

/** Define cookie usado pelo Google Translate (fallback para troca de idioma) */
function setGoogTransCookie(from: string, to: string) {
  const v = `/${from}/${to}`;
  const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000).toUTCString();
  // cookie para o seu domínio
  document.cookie = `googtrans=${v};expires=${expires};path=/`;
  document.cookie = `googtrans=${v};expires=${expires};path=/;domain=.${location.hostname}`;
}

/** Tenta mudar idioma via combo; se não houver, usa cookie e recarrega */
function changeLanguage(lang: string, from = "pt") {
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  } else {
    setGoogTransCookie(from, lang);
    location.reload();
  }
}

export default function TranslateWidget() {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>("pt");
  const [ready, setReady] = useState(false);
  const hasInit = useRef(false);

  // Inicializa o widget com retries e tipos
  useEffect(() => {
    let canceled = false;

    (async () => {
      try {
        await loadGoogleTranslateScript();
        await waitForTranslateElement();

        if (canceled || hasInit.current) return;

        const ctor = window.google!.translate!.TranslateElement!;
        // Cria o widget (container pode ficar oculto)
        new ctor(
          {
            pageLanguage: "pt",
            includedLanguages: LANGUAGES.map((l) => l.code).join(","),
            autoDisplay: false,
          },
          "google_translate_element"
        );

        hasInit.current = true;
        setReady(true);

        // aplica preferência salva (localStorage) ou idioma do navegador
        const saved = localStorage.getItem("preferred_lang");
        const browser = navigator.language.split("-")[0];
        const preferred =
          saved && LANGUAGES.some((l) => l.code === saved) ? saved :
          LANGUAGES.some((l) => l.code === browser) ? browser : "pt";

        setCurrentLang(preferred);
        // Pequeno atraso para o select existir
        setTimeout(() => changeLanguage(preferred), 400);
      } catch (e) {
        console.warn(e);
        // Mesmo sem o widget, mantém o seletor custom para tentar via cookie
        setReady(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, []);

  const onPick = (code: string) => {
    setCurrentLang(code);
    localStorage.setItem("preferred_lang", code);
    changeLanguage(code);
    setOpen(false);
  };

  return (
    <>
      {/* Container requerido pelo Google (pode ficar invisível) */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition"
          aria-haspopup="listbox"
          aria-expanded={open}
          title={ready ? "Selecionar idioma" : "Tradução pode demorar a iniciar"}
        >
          <span>🌎</span>
          <span>
            {LANGUAGES.find((l) => l.code === currentLang)?.flag}{" "}
            {LANGUAGES.find((l) => l.code === currentLang)?.label}
          </span>
        </button>

        {/* Dropdown custom */}
        {open && (
          <div
            className="absolute bottom-14 right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-dropdown"
            role="listbox"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onPick(lang.code)}
                className={`flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 transition ${
                  lang.code === currentLang ? "bg-gray-200 font-semibold" : ""
                }`}
                role="option"
                aria-selected={lang.code === currentLang}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
