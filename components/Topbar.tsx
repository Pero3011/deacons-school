"use client";

import { Bell, Globe, LogOut, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { language, toggleLanguage } = useLanguage();

  const user = {
    name: "Admin User",
    email: "admin@deaconsschool.com",
  };

  return (
    <div className="flex h-16 w-full items-center justify-between border-b border-indigo-100 bg-[#F8F9FE] px-4 sm:px-6">
      {/* Left side — Mobile Hamburger trigger */}
      <div className="flex items-center">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="mr-2 inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleLanguage}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden xs:inline">
            Language: {language === "ar" ? "AR/EN" : "EN/AR"}
          </span>
          <span className="xs:hidden">{language === "ar" ? "AR" : "EN"}</span>
        </motion.button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="text-slate-700 hover:text-slate-900 p-1"
        >
          <Bell className="h-5 w-5" />
        </motion.button>

        {/* Login info */}
        <div className="flex items-center gap-3 rounded-lg bg-[#0B1730] px-3 py-1.5 sm:py-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold leading-tight text-white">
              {user.name}
            </p>
            <p className="text-[10px] leading-tight text-slate-300">
              {user.email}
            </p>
          </div>
          <button
            className="text-slate-300 hover:text-white"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
