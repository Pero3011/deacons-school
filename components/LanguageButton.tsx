"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageButton() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
      aria-label="Toggle language"
    >
      <Languages size={18} />
      <span>{language === "en" ? "🌐 العربية" : "🌐 English"}</span>
    </button>
  );
}
