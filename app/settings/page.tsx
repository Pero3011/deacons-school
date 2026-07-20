"use client";

import React, { useState } from "react";
import {
  Calendar,
  Languages,
  Bell,
  AlertTriangle,
  Save,
  Download,
  RefreshCw,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function SystemSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // State for Academic Year Configurations
  const [term1, setTerm1] = useState(12);
  const [term2, setTerm2] = useState(14);
  const [term3, setTerm3] = useState(8);

  // State for Localization
  const [language, setLanguage] = useState("English (UK)");
  const [displayMode, setDisplayMode] = useState<"Bilingual" | "Monolingual">(
    "Bilingual",
  );

  // State for Admin Notifications
  const [notifications, setNotifications] = useState({
    absenceAlerts: true,
    lowMarkWarnings: true,
    newRegistrations: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="min-h-screen min-w-0 md:pl-72 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="min-h-screen bg-[#f4f7fc] p-8 text-[#1e293b] font-sans">
          {/* Top Header Row */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0f2d59] tracking-tight">
                System Settings
              </h1>
              <p className="text-xl font-bold text-[#e28743] mt-1 rtl text-right">
                إعدادات النظام
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-initial px-5 py-2.5 bg-white border border-[#cbd5e1] text-[#334155] rounded font-medium shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export Logs
              </button>
              <button className="flex-1 md:flex-initial px-5 py-2.5 bg-[#12233c] text-white rounded font-semibold shadow-sm hover:bg-[#1e3559] transition-colors flex items-center justify-center gap-2 text-sm">
                <Save className="w-4 h-4" />
                Save All Changes
              </button>
            </div>
          </div>

          {/* Main Grid Content */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column: Academic Year Configuration */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 pb-4 border-b-2 border-[#12233c] mb-6">
                  <div className="p-2 bg-[#f1f5f9] rounded text-[#12233c] mt-1">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0f2d59]">
                      Academic Year Configuration
                    </h2>
                    <p className="text-base font-bold text-[#e28743] tracking-wide mt-0.5">
                      إعدادات السنة الدراسية
                    </p>
                  </div>
                </div>

                <p className="text-[#64748b] text-sm leading-relaxed mb-8">
                  Configure the duration of each academic term for the current
                  cycle. These settings will determine the number of attendance
                  columns and mark entries in student records.
                </p>

                {/* Term Sliders */}
                <div className="space-y-8">
                  {/* Term 1 */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="w-full md:w-1/3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-[#1e293b]">
                          Term 1 (Fall)
                        </span>
                        <span className="text-xs font-bold text-[#e28743]">
                          الفصل الأول
                        </span>
                      </div>
                      <p className="text-xs text-[#64748b] mt-1">
                        Standard duration is 12-14 weeks.
                      </p>
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                      <input
                        type="range"
                        min="6"
                        max="18"
                        value={term1}
                        onChange={(e) => setTerm1(Number(e.target.value))}
                        className="w-full accent-[#12233c] h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex items-center gap-2 min-w-22.5 justify-end">
                        <span className="bg-[#12233c] text-white font-bold text-xl px-3 py-1.5 rounded min-w-11 text-center">
                          {term1}
                        </span>
                        <span className="text-xs font-semibold text-[#64748b]">
                          Weeks
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Term 2 */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="w-full md:w-1/3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-[#1e293b]">
                          Term 2 (Spring)
                        </span>
                        <span className="text-xs font-bold text-[#e28743]">
                          الفصل الثاني
                        </span>
                      </div>
                      <p className="text-xs text-[#64748b] mt-1">
                        Standard duration is 12-14 weeks.
                      </p>
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                      <input
                        type="range"
                        min="6"
                        max="18"
                        value={term2}
                        onChange={(e) => setTerm2(Number(e.target.value))}
                        className="w-full accent-[#12233c] h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex items-center gap-2 min-w-22.5 justify-end">
                        <span className="bg-[#12233c] text-white font-bold text-xl px-3 py-1.5 rounded min-w-11 text-center">
                          {term2}
                        </span>
                        <span className="text-xs font-semibold text-[#64748b]">
                          Weeks
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Term 3 */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="w-full md:w-1/3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-[#1e293b]">
                          Term 3 (Summer)
                        </span>
                        <span className="text-xs font-bold text-[#e28743]">
                          الفصل الثالث
                        </span>
                      </div>
                      <p className="text-xs text-[#64748b] mt-1">
                        Intensive sessions usually 6-8 weeks.
                      </p>
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                      <input
                        type="range"
                        min="4"
                        max="12"
                        value={term3}
                        onChange={(e) => setTerm3(Number(e.target.value))}
                        className="w-full accent-[#12233c] h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex items-center gap-2 min-w-22.5 justify-end">
                        <span className="bg-[#12233c] text-white font-bold text-xl px-3 py-1.5 rounded min-w-11 text-center">
                          {term3}
                        </span>
                        <span className="text-xs font-semibold text-[#64748b]">
                          Weeks
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Blocks */}
            <div className="space-y-6">
              {/* Localization Settings */}
              <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#334155]">
                  <Languages className="w-4 h-4" />
                  <h3 className="font-bold text-sm">Localization Settings</h3>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                    Primary Interface Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-[#cbd5e1] rounded p-2 text-sm bg-white focus:outline-none focus:border-[#12233c]"
                  >
                    <option>English (UK)</option>
                    <option>English (US)</option>
                    <option>Arabic (العربية)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                    Display Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDisplayMode("Bilingual")}
                      className={`py-2 text-xs font-bold rounded border transition-colors ${
                        displayMode === "Bilingual"
                          ? "bg-[#12233c] text-white border-[#12233c]"
                          : "bg-white text-[#334155] border-[#cbd5e1] hover:bg-gray-50"
                      }`}
                    >
                      Bilingual
                    </button>
                    <button
                      onClick={() => setDisplayMode("Monolingual")}
                      className={`py-2 text-xs font-bold rounded border transition-colors ${
                        displayMode === "Monolingual"
                          ? "bg-[#12233c] text-white border-[#12233c]"
                          : "bg-white text-[#334155] border-[#cbd5e1] hover:bg-gray-50"
                      }`}
                    >
                      Monolingual
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin Notifications */}
              <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#334155]">
                  <Bell className="w-4 h-4" />
                  <h3 className="font-bold text-sm">Admin Notifications</h3>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-sm font-medium text-[#334155]">
                      Absence Alerts
                    </span>
                    <input
                      type="checkbox"
                      checked={notifications.absenceAlerts}
                      onChange={() => toggleNotification("absenceAlerts")}
                      className="w-4 h-4 text-[#12233c] border-[#cbd5e1] rounded focus:ring-0 accent-[#12233c]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-sm font-medium text-[#334155]">
                      Low Mark Warnings
                    </span>
                    <input
                      type="checkbox"
                      checked={notifications.lowMarkWarnings}
                      onChange={() => toggleNotification("lowMarkWarnings")}
                      className="w-4 h-4 text-[#12233c] border-[#cbd5e1] rounded focus:ring-0 accent-[#12233c]"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-sm font-medium text-[#334155]">
                      New Registrations
                    </span>
                    <input
                      type="checkbox"
                      checked={notifications.newRegistrations}
                      onChange={() => toggleNotification("newRegistrations")}
                      className="w-4 h-4 text-[#12233c] border-[#cbd5e1] rounded focus:ring-0 accent-[#12233c]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Year-End Reset Block */}
          <div className="max-w-6xl mx-auto bg-white rounded-lg border border-[#dc2626] p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 text-[#b91c1c] mb-2">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Year-End Reset
                  </h2>
                  <p className="text-base font-bold text-[#b91c1c] tracking-wide mt-0.5">
                    إعادة تعيين نهاية العام
                  </p>
                </div>
              </div>

              <h3 className="text-xs font-black text-[#1e293b] tracking-wider mb-2">
                THIS ACTION IS IRREVERSIBLE AND PERMANENT.
              </h3>
              <p className="text-[#64748b] text-sm leading-relaxed mb-3">
                Performing a year-end reset will archive the current academic
                year's data and completely clear all active attendance logs and
                student marks. This process prepares the database for the new
                educational cycle.
              </p>
              <p className="text-[#b91c1c] text-sm font-bold italic">
                Only proceed once the Third Term is finalized and all
                certificates have been issued.
              </p>
            </div>

            <div className="w-full md:w-auto text-center md:text-right shrink-0">
              <button className="w-full md:w-auto px-6 py-3 bg-[#a81a1a] text-white font-bold rounded shadow hover:bg-[#881414] transition-colors flex items-center justify-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4" />
                Perform Final Reset
              </button>
              <p className="text-[11px] text-[#64748b] italic mt-2">
                Requires Super-Admin Confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
