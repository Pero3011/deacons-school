"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Calendar,
  CalendarCheck,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  Lock,
  Save,
  SquarePlus,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useLanguage } from "@/context/LanguageContext";

type AttendanceState = "attended" | "absent" | "excused";

interface AttendanceRecord {
  id: number;
  nameEn: string;
  nameAr: string;
  initials: string;
  avatarBg: string;
  studentId: string;
  termPercent: number;
  termSundaysText: string;
  status: AttendanceState;
  notes: string;
}

interface ClassFolder {
  id: string;
  nameEn: string;
  nameAr: string;
  teacherEn: string;
  teacherAr: string;
  studentCount: number;
  roomEn?: string;
  roomAr?: string;
  activeSession?: boolean;
  locked?: boolean;
  loading?: boolean;
}

const SUNDAY_SESSIONS = [
  {
    id: "2023-10-01",
    dateEn: "Sunday, Oct 1, 2023",
    dateAr: "الأحد، ١ أكتوبر ٢٠٢٣",
    shortDate: "Oct 1, 2023",
    termInfoEn: "Term 1 - Week 1",
    termInfoAr: "الترم ١ - الأسبوع ١",
  },
  {
    id: "2023-10-08",
    dateEn: "Sunday, Oct 8, 2023",
    dateAr: "الأحد، ٨ أكتوبر ٢٠٢٣",
    shortDate: "Oct 8, 2023",
    termInfoEn: "Term 1 - Week 2",
    termInfoAr: "الترم ١ - الأسبوع ٢",
  },
  {
    id: "2023-10-15",
    dateEn: "Sunday, Oct 15, 2023",
    dateAr: "الأحد، ١٥ أكتوبر ٢٠٢٣",
    shortDate: "Oct 15, 2023",
    termInfoEn: "Term 1 - Week 3",
    termInfoAr: "الترم ١ - الأسبوع ٣",
  },
  {
    id: "2023-10-22",
    dateEn: "Sunday, Oct 22, 2023",
    dateAr: "الأحد، ٢٢ أكتوبر ٢٠٢٣",
    shortDate: "Oct 22, 2023",
    termInfoEn: "Term 1 - Week 4",
    termInfoAr: "الترم ١ - الأسبوع ٤",
  },
  {
    id: "2023-10-29",
    dateEn: "Sunday, Oct 29, 2023",
    dateAr: "الأحد، ٢٩ أكتوبر ٢٠٢٣",
    shortDate: "Oct 29, 2023",
    termInfoEn: "Term 1 - Week 5",
    termInfoAr: "الترم ١ - الأسبوع ٥",
  },
  {
    id: "2023-11-05",
    dateEn: "Sunday, Nov 5, 2023",
    dateAr: "الأحد، ٥ نوفمبر ٢٠٢٣",
    shortDate: "Nov 5, 2023",
    termInfoEn: "Term 1 - Week 6",
    termInfoAr: "الترم ١ - الأسبوع ٦",
  },
  {
    id: "2023-11-12",
    dateEn: "Sunday, Nov 12, 2023",
    dateAr: "الأحد، ١٢ نوفمبر ٢٠٢٣",
    shortDate: "Nov 12, 2023",
    termInfoEn: "Term 1 - Week 7",
    termInfoAr: "الترم ١ - الأسبوع ٧",
  },
];

const INITIAL_STUDENTS_GRADE1: AttendanceRecord[] = [
  {
    id: 1,
    nameEn: "Samuel Mikhail",
    nameAr: "صموئيل ميخائيل",
    initials: "SM",
    avatarBg: "bg-[#112237]",
    studentId: "#DC-2301",
    termPercent: 92,
    termSundaysText: "11 / 12 Sundays",
    status: "attended",
    notes: "Attended Vespers",
  },
  {
    id: 2,
    nameEn: "Maria Shenouda",
    nameAr: "ماريا شنودة",
    initials: "MS",
    avatarBg: "bg-[#d97706]",
    studentId: "#DC-2302",
    termPercent: 100,
    termSundaysText: "12 / 12 Sundays",
    status: "attended",
    notes: "Recited Coptic Hymn",
  },
  {
    id: 3,
    nameEn: "John David",
    nameAr: "يوحنا داود",
    initials: "JD",
    avatarBg: "bg-[#112237]",
    studentId: "#DC-2303",
    termPercent: 83,
    termSundaysText: "10 / 12 Sundays",
    status: "absent",
    notes: "Contacted guardian",
  },
  {
    id: 4,
    nameEn: "Mark Anton",
    nameAr: "مرقس أنطون",
    initials: "MA",
    avatarBg: "bg-[#112237]",
    studentId: "#DC-2304",
    termPercent: 75,
    termSundaysText: "9 / 12 Sundays",
    status: "excused",
    notes: "Family travel permission",
  },
  {
    id: 5,
    nameEn: "Kirollos Beshay",
    nameAr: "كيرلس بشاي",
    initials: "KB",
    avatarBg: "bg-[#b45309]",
    studentId: "#DC-2305",
    termPercent: 92,
    termSundaysText: "11 / 12 Sundays",
    status: "attended",
    notes: "Altar service on duty",
  },
  {
    id: 6,
    nameEn: "Peter Mina",
    nameAr: "بطرس مينا",
    initials: "PM",
    avatarBg: "bg-[#112237]",
    studentId: "#DC-2306",
    termPercent: 96,
    termSundaysText: "11.5 / 12 Sundays",
    status: "attended",
    notes: "Excellent discipline",
  },
];

const classFolders: ClassFolder[] = [
  {
    id: "grade-1",
    nameEn: "Elementary: Grade 1 (St. Mark)",
    nameAr: "المرحلة الابتدائية: الصف الأول (مارمرقس)",
    teacherEn: "Teacher: Michael Ghabbour • 42 Registered Students • St. Mark Hall",
    teacherAr: "المعلم: مايكل غبور • ٤٢ طالب مسجل • قاعة مارمرقس",
    studentCount: 42,
    activeSession: true,
  },
  {
    id: "grade-7",
    nameEn: "Preparatory: Grade 7 (St. Anthony)",
    nameAr: "المرحلة الإعدادية: الصف السابع (الأنبا أنطونيوس)",
    teacherEn: "Teacher: David Shenouda • 38 Students",
    teacherAr: "المعلم: ديفيد شنودة • ٣٨ طالب",
    studentCount: 38,
  },
  {
    id: "grade-10",
    nameEn: "High School: Grade 10 (St. Paul)",
    nameAr: "المرحلة الثانوية: الصف العاشر (ماربولس)",
    teacherEn: "Restricted Access (Requires Archdeacon Permission)",
    teacherAr: "وصول مقيد (يتطلب إذن رئيس الشمامسة)",
    studentCount: 0,
    locked: true,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
};

export default function AttendancePage() {
  const { language, setLanguage } = useLanguage();
  const isArabic = language === "ar";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sunday session index (default to Oct 29, 2023 - index 4)
  const [selectedSundayIndex, setSelectedSundayIndex] = useState(4);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Folder state
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "grade-1": true,
    "grade-7": false,
  });

  // Grade 1 Attendance state
  const [students, setStudents] = useState<AttendanceRecord[]>(INITIAL_STUDENTS_GRADE1);

  // Track open dropdown menu for status per student
  const [activeStatusDropdown, setActiveStatusDropdown] = useState<number | null>(null);

  // Toast / Save notification state
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const currentSession = SUNDAY_SESSIONS[selectedSundayIndex] ?? SUNDAY_SESSIONS[4];

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrevSunday = () => {
    setSelectedSundayIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSunday = () => {
    setSelectedSundayIndex((prev) => Math.min(SUNDAY_SESSIONS.length - 1, prev + 1));
  };

  const setStudentStatus = (studentId: number, newStatus: AttendanceState) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
    );
    setActiveStatusDropdown(null);
  };

  const handleNotesChange = (studentId: number, newNotes: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, notes: newNotes } : s))
    );
  };

  // Mark all as attended
  const handleMarkAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "attended" })));
  };

  // Save attendance
  const handleSaveAttendance = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    }, 600);
  };

  // Dynamic counts for bottom of the table
  const attendedCount = students.filter((s) => s.status === "attended").length;
  const absentCount = students.filter((s) => s.status === "absent").length;
  const excusedCount = students.filter((s) => s.status === "excused").length;

  return (
    <div className="min-h-screen bg-[#F8F9FE]" dir={isArabic ? "rtl" : "ltr"}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`min-h-screen min-w-0 flex flex-col ${isArabic ? "md:pr-72" : "md:pl-72"}`}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 px-4 py-6 sm:px-8 md:px-10 lg:px-12 max-w-7xl w-full mx-auto"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#112237]">
                {isArabic ? "سجل الحضور" : "Attendance Registry"}
              </h1>
              <p className="mt-1 text-sm text-slate-500 font-medium">
                {isArabic ? "العام الدراسي ٢٠٢٣ - ٢٠٢٤" : "Academic Year 2023 - 2024"}
              </p>
            </div>

            {/* Language Pill Switcher */}
            <div className="flex items-center self-start sm:self-auto rounded-lg bg-[#E7EBF7] p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-md px-4 py-1.5 text-xs md:text-sm font-semibold transition-all ${
                  language === "en"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("ar")}
                className={`rounded-md px-4 py-1.5 text-xs md:text-sm font-semibold transition-all ${
                  language === "ar"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                العربية
              </button>
            </div>
          </motion.div>

          {/* Attendance Date Identifier Bar */}
          <motion.div
            variants={itemVariants}
            className="mb-8 rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Left Side: Calendar icon and Titles */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm md:text-[15px] font-bold text-slate-800">
                    {isArabic
                      ? "تاريخ الحضور (أيام الأحد) / Attendance Date (Sundays)"
                      : "Attendance Date (Sundays) / تاريخ الحضور (أيام الأحد)"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isArabic
                      ? "اختر جلسة الأحد من التقويم الطقسي ٢٠٢٣-٢٠٢٤"
                      : "Select Sunday session from the 2023-2024 liturgical calendar"}
                  </p>
                </div>
              </div>

              {/* Right Side: Sunday Selector & Date Badge */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Sunday Navigator */}
                <div className="relative inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={handlePrevSunday}
                    disabled={selectedSundayIndex === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-s-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                    title={isArabic ? "الأحد السابق" : "Previous Sunday"}
                  >
                    <ChevronLeft className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                      className="flex h-9 items-center gap-2 border-x border-slate-200 px-3 text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <span>
                        {isArabic
                          ? `${currentSession.dateAr} / ${currentSession.dateEn}`
                          : `${currentSession.dateEn} / ${currentSession.dateAr}`}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    {/* Dropdown Menu for Sundays */}
                    <AnimatePresence>
                      {dateDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className={`absolute z-30 mt-1 max-h-60 w-72 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg ${
                            isArabic ? "left-0" : "right-0"
                          }`}
                        >
                          {SUNDAY_SESSIONS.map((session, idx) => (
                            <button
                              key={session.id}
                              type="button"
                              onClick={() => {
                                setSelectedSundayIndex(idx);
                                setDateDropdownOpen(false);
                              }}
                              className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors ${
                                idx === selectedSundayIndex
                                  ? "bg-blue-50 font-semibold text-blue-700"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span>{isArabic ? session.dateAr : session.dateEn}</span>
                              <span className="text-[11px] text-slate-400">
                                {isArabic ? session.termInfoAr : session.termInfoEn}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextSunday}
                    disabled={selectedSundayIndex === SUNDAY_SESSIONS.length - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-e-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
                    title={isArabic ? "الأحد التالي" : "Next Sunday"}
                  >
                    <ChevronRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {/* Orange Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-[#FFF5EB] px-3 py-1.5 text-xs font-semibold text-amber-800">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>{currentSession.shortDate}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3 Summary Cards */}
          <motion.div
            variants={itemVariants}
            className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {/* Total Students */}
            <div className="flex h-28 flex-col justify-between rounded-xl bg-[#112237] p-5 text-white shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {isArabic ? "إجمالي الطلاب" : "TOTAL STUDENTS"}
              </span>
              <span className="font-serif text-3xl md:text-4xl font-bold">1,248</span>
            </div>

            {/* Average Attendance */}
            <div className="flex h-28 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isArabic ? "متوسط الحضور" : "AVERAGE ATTENDANCE"}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl md:text-4xl font-bold text-slate-800">
                  94%
                </span>
                <span className="text-sm font-semibold text-emerald-600">↑ 2%</span>
              </div>
            </div>

            {/* Active Classes */}
            <div className="flex h-28 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isArabic ? "الفصول النشطة" : "ACTIVE CLASSES"}
              </span>
              <span className="font-serif text-3xl md:text-4xl font-bold text-[#112237]">
                24
              </span>
            </div>
          </motion.div>

          {/* Save Status Notification / Banner */}
          <AnimatePresence>
            {saveStatus === "saved" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 flex items-center justify-between rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>
                    {isArabic
                      ? "تم حفظ كشف الحضور بنجاح لجميع الطلاب!"
                      : "Attendance records saved successfully for this session!"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveStatus("idle")}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Class Folders Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            {classFolders.map((cls) => {
              const isOpen = !!openFolders[cls.id];
              return (
                <div
                  key={cls.id}
                  className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all ${
                    cls.locked ? "opacity-70 bg-slate-50/50" : ""
                  }`}
                >
                  {/* Folder Header Accordion Bar */}
                  <button
                    type="button"
                    disabled={cls.locked}
                    onClick={() => toggleFolder(cls.id)}
                    className={`flex w-full items-center justify-between p-4 sm:p-5 transition-colors ${
                      cls.locked ? "cursor-not-allowed" : "hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {cls.locked ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <Lock className="h-6 w-6" />
                        </div>
                      ) : (
                        <Folder
                          className="h-8 w-8 text-amber-500 shrink-0"
                          strokeWidth={1.6}
                          fill="currentColor"
                          fillOpacity={0.18}
                        />
                      )}

                      <div className={isArabic ? "text-right" : "text-left"}>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`font-serif text-base sm:text-lg font-bold ${
                              cls.locked ? "text-slate-400" : "text-[#112237]"
                            }`}
                          >
                            {isArabic ? cls.nameAr : cls.nameEn}
                          </h3>

                          {cls.activeSession && (
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                              {isArabic ? "جلسة نشطة" : "Active Session"}
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-0.5 text-xs sm:text-sm ${
                            cls.locked ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {isArabic ? cls.teacherAr : cls.teacherEn}
                        </p>
                      </div>
                    </div>

                    {!cls.locked && (
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      </motion.div>
                    )}
                  </button>

                  {/* Expanded Content (For Grade 1) */}
                  <AnimatePresence initial={false}>
                    {isOpen && !cls.locked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-slate-200"
                      >
                        {/* Subheader: Session details and Buttons */}
                        <div className="flex flex-col gap-3 bg-[#FAFBFD] px-4 py-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200">
                          {/* Left: Session identifier */}
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                            <CalendarCheck className="h-4 w-4 text-slate-500" />
                            <span>
                              {isArabic
                                ? `الجلسة: ${currentSession.dateAr} (${currentSession.termInfoAr})`
                                : `Session: ${currentSession.dateEn} (${currentSession.termInfoEn})`}
                            </span>
                          </div>

                          {/* Right: Action Buttons (Mark All & Save Attendance) */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            {/* Mark All Present Button */}
                            <button
                              type="button"
                              onClick={handleMarkAllPresent}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-[#E8F8F0] px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100/90 active:scale-98 shadow-2xs"
                            >
                              <CheckCheck className="h-4 w-4 text-emerald-700" />
                              <span>
                                {isArabic
                                  ? "تحديد الكل حاضر / Mark All Present"
                                  : "Mark All Present / تحديد الكل حاضر"}
                              </span>
                            </button>

                            {/* Save Attendance Button */}
                            <button
                              type="button"
                              onClick={handleSaveAttendance}
                              disabled={saveStatus === "saving"}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#112237] px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#1c334f] active:scale-98 disabled:opacity-75 shadow-xs"
                            >
                              <Save className="h-4 w-4 text-white" />
                              <span>
                                {saveStatus === "saving"
                                  ? isArabic
                                    ? "جاري الحفظ..."
                                    : "Saving..."
                                  : isArabic
                                  ? "حفظ كشف الحضور / Save Attendance"
                                  : "Save Attendance / حفظ كشف الحضور"}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Attendance Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-left" dir={isArabic ? "rtl" : "ltr"}>
                            <thead>
                              <tr className="border-b border-slate-200 bg-[#EFF3F8] text-xs font-bold text-slate-600">
                                <th className="p-3.5 text-center w-12">#</th>
                                <th className="p-3.5 min-w-[210px]">
                                  {isArabic ? "تفاصيل الطالب / الشماس" : "Student / Deacon Details"}
                                </th>
                                <th className="p-3.5 min-w-[110px]">
                                  {isArabic ? "كود الطالب" : "Student ID"}
                                </th>
                                <th className="p-3.5 min-w-[170px]">
                                  {isArabic ? "إحصائيات حضور الترم" : "Term Attendance Stats"}
                                </th>
                                <th className="p-3.5 min-w-[180px]">
                                  {isArabic ? "حالة حضور اليوم" : "Today's Attendance Status"}
                                </th>
                                <th className="p-3.5 min-w-[220px]">
                                  {isArabic ? "ملاحظات الإجراء" : "Action Notes"}
                                </th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 bg-white text-xs sm:text-sm">
                              {students.map((student, idx) => {
                                const isDropdownOpen = activeStatusDropdown === student.id;

                                return (
                                  <tr
                                    key={student.id}
                                    className="transition-colors hover:bg-slate-50/70"
                                  >
                                    {/* Column 1: # */}
                                    <td className="p-3.5 text-center font-medium text-slate-500">
                                      {idx + 1}
                                    </td>

                                    {/* Column 2: Student Details (Avatar + EN/AR Names) */}
                                    <td className="p-3.5">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-2xs ${student.avatarBg}`}
                                        >
                                          {student.initials}
                                        </div>
                                        <div>
                                          <div className="font-semibold text-slate-900 leading-tight">
                                            {isArabic ? student.nameAr : student.nameEn}
                                          </div>
                                          <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                                            {isArabic ? student.nameEn : student.nameAr}
                                          </div>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Column 3: Student ID */}
                                    <td className="p-3.5 font-mono text-xs text-slate-500 font-medium">
                                      {student.studentId}
                                    </td>

                                    {/* Column 4: Term Attendance Stats */}
                                    <td className="p-3.5">
                                      <div className="space-y-1.5 max-w-[150px]">
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-bold text-slate-800">
                                            {student.termPercent}%
                                          </span>
                                          <span className="text-[11px] text-slate-400 font-medium">
                                            {student.termSundaysText}
                                          </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                          <div
                                            className={`h-full rounded-full ${
                                              student.termPercent >= 90
                                                ? "bg-emerald-500"
                                                : student.termPercent >= 80
                                                ? "bg-amber-500"
                                                : "bg-orange-500"
                                            }`}
                                            style={{ width: `${student.termPercent}%` }}
                                          />
                                        </div>
                                      </div>
                                    </td>

                                    {/* Column 5: Today's Attendance Status Dropdown */}
                                    <td className="p-3.5">
                                      <div className="relative inline-block w-full max-w-[170px]">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setActiveStatusDropdown(
                                              isDropdownOpen ? null : student.id
                                            )
                                          }
                                          className={`flex w-full items-center justify-between rounded-lg border px-3 py-1.5 text-xs font-semibold transition shadow-2xs ${
                                            student.status === "attended"
                                              ? "border-emerald-300 bg-[#E8F8F0] text-emerald-700 hover:bg-emerald-100/80"
                                              : student.status === "absent"
                                              ? "border-rose-300 bg-[#FEECEC] text-rose-700 hover:bg-rose-100/80"
                                              : "border-amber-300 bg-[#FEF6E4] text-amber-800 hover:bg-amber-100/80"
                                          }`}
                                        >
                                          <span className="flex items-center gap-1.5">
                                            {student.status === "attended" && (
                                              <>
                                                <Check className="h-3.5 w-3.5" />
                                                <span>{isArabic ? "حاضر / Attended" : "Attended / حاضر"}</span>
                                              </>
                                            )}
                                            {student.status === "absent" && (
                                              <>
                                                <X className="h-3.5 w-3.5" />
                                                <span>{isArabic ? "غائب / Absent" : "Absent / غائب"}</span>
                                              </>
                                            )}
                                            {student.status === "excused" && (
                                              <>
                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                <span>{isArabic ? "معذور / Excused" : "Excused / معذور"}</span>
                                              </>
                                            )}
                                          </span>
                                          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                        </button>

                                        {/* Status Dropdown Menu */}
                                        <AnimatePresence>
                                          {isDropdownOpen && (
                                            <motion.div
                                              initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                              animate={{ opacity: 1, y: 0, scale: 1 }}
                                              exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                              className={`absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg ${
                                                isArabic ? "right-0" : "left-0"
                                              }`}
                                            >
                                              <button
                                                type="button"
                                                onClick={() => setStudentStatus(student.id, "attended")}
                                                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                                              >
                                                <Check className="h-3.5 w-3.5" />
                                                <span>{isArabic ? "حاضر / Attended" : "Attended / حاضر"}</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => setStudentStatus(student.id, "absent")}
                                                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                                              >
                                                <X className="h-3.5 w-3.5" />
                                                <span>{isArabic ? "غائب / Absent" : "Absent / غائب"}</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => setStudentStatus(student.id, "excused")}
                                                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50"
                                              >
                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                <span>{isArabic ? "معذور / Excused" : "Excused / معذور"}</span>
                                              </button>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    </td>

                                    {/* Column 6: Action Notes */}
                                    <td className="p-3.5">
                                      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 transition focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-300 max-w-xs shadow-2xs">
                                        <input
                                          type="text"
                                          value={student.notes}
                                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                                          placeholder={isArabic ? "أضف ملاحظة..." : "Add a note..."}
                                          className="w-full bg-transparent outline-none placeholder:text-slate-400 text-xs text-slate-700"
                                        />
                                        <button
                                          type="button"
                                          title={isArabic ? "إجراء ملاحظة" : "Note Action"}
                                          className="text-slate-400 hover:text-slate-600 ml-1 shrink-0"
                                        >
                                          <SquarePlus className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Table Footer Summary Counts */}
                        <div className="flex flex-wrap items-center gap-6 border-t border-slate-200 bg-[#FAFBFD] px-5 py-3 text-xs font-semibold text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span>
                              {isArabic ? `حاضر: ${attendedCount}` : `Attended: ${attendedCount}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                            <span>
                              {isArabic ? `غائب: ${absentCount}` : `Absent: ${absentCount}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span>
                              {isArabic ? `معذور: ${excusedCount}` : `Excused: ${excusedCount}`}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
