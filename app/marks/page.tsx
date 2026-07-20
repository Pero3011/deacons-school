"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Book,
  BookOpen,
  Download,
  FileDown,
  X,
  ChevronDown,
  FolderOpen,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useLanguage } from "@/context/LanguageContext";

type MarksRow = {
  id: string;
  nameEn: string;
  nameAr: string;
  term1?: [number, number, number, number];
  term2?: [number, number, number, number];
  term3?: [number, number, number, number];
  finalGrade?: string;
  finalPercent?: number;
};

const subjects = [
  { key: "melodies", en: "Melodies", ar: "الحان" },
  { key: "taks", en: "Taks", ar: "طقس" },
  { key: "aghaby", en: "Aghaby", ar: "اجبية" },
  { key: "coptic", en: "Coptic", ar: "قبطي" },
];

const primaryStudents: MarksRow[] = [
  {
    id: "1",
    nameEn: "Samuel Mikhail",
    nameAr: "صموئيل ميخائيل",
    term1: [95, 90, 92, 91],
    term2: [88, 85, 90, 89],
  },
  {
    id: "2",
    nameEn: "Maria Shenouda",
    nameAr: "ماريا شنودة",
    term1: [98, 95, 94, 93],
    term2: [99, 97, 98, 98],
    term3: [96, 96, 97, 95],
    finalGrade: "A+",
    finalPercent: 96.3,
  },
  {
    id: "3",
    nameEn: "John David",
    nameAr: "يوحنا داود",
    term1: [78, 72, 75, 75],
    term2: [82, 78, 80, 80],
    term3: [79, 77, 78, 78],
    finalGrade: "B",
    finalPercent: 77.6,
  },
];

const t = {
  heading: { en: "Marks Management", ar: "إدارة الدرجات" },
  subheading: {
    en: "Grade tracking and academic records for the current academic year.",
    ar: "متابعة الدرجات والسجلات الأكاديمية للعام الدراسي الحالي.",
  },
  primaryTab: {
    en: "Primary Level (Level 1-3)",
    ar: "المرحلة الابتدائية (١-٣)",
  },
  secondaryTab: {
    en: "Intermediate Level (Level 4-6)",
    ar: "المرحلة المتوسطة (٤-٦)",
  },
  className: {
    en: "Class: St. Mary (Level 1)",
    ar: "الفصل: مارجرجس (المستوى ١)",
  },
  exportClass: { en: "Export Class Report", ar: "تصدير تقرير الفصل" },
  studentName: { en: "Student Name", ar: "اسم الطالب" },
  term: { en: "Term", ar: "الترم" },
  finalGrade: { en: "Final Grade", ar: "الدرجة النهائية" },
  actions: { en: "Actions", ar: "إجراءات" },
  pending: { en: "Pending", ar: "قيد الانتظار" },
  emptyIntermediate: {
    en: "Select a specific class from the sidebar to view detailed marks.",
    ar: "اختر فصلاً محدداً من القائمة الجانبية لعرض الدرجات بالتفصيل.",
  },
  modalTitle: { en: "Export Academic Record", ar: "تصدير السجل الأكاديمي" },
  modalSubtitle: {
    en: "Choose the reporting period for:",
    ar: "اختر الفترة الزمنية لـ:",
  },
  fullYear: { en: "Export Full Year", ar: "تصدير العام كاملاً" },
  fullYearDesc: {
    en: "Includes Terms 1, 2, and 3 with final GPA calculation.",
    ar: "يشمل الترم ١، ٢، ٣ مع حساب المعدل النهائي.",
  },
  specificTerm: { en: "Select Specific Term", ar: "اختيار ترم محدد" },
  specificTermDesc: {
    en: "Choose a single term to generate a mid-year report.",
    ar: "اختر ترماً واحداً لإصدار تقرير منتصف العام.",
  },
  footer: {
    en: "Official Deacon School Document Service",
    ar: "خدمة مستندات مدرسة الشمامسة الرسمية",
  },
};

// Orchestrates the entrance fade and slide up
const containerVariants:Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function MarksPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"primary" | "secondary">(
    "primary",
  );
  const [exportTarget, setExportTarget] = useState<string | null>(null);
  const [showTermSelect, setShowTermSelect] = useState(false);

  const closeModal = () => {
    setExportTarget(null);
    setShowTermSelect(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="min-h-screen min-w-0 md:pl-72 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 px-4 py-6 sm:px-8 md:px-12 lg:px-16"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className={`mb-8 ${isArabic ? "text-right" : "text-left"}`}
          >
            <h1 className="font-serif text-2xl font-bold text-primary md:text-3xl">
              {t.heading[language]}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t.subheading[language]}
            </p>
          </motion.div>

          {/* Card Container */}
          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 bg-[#F8F9FE] px-2">
              <button
                onClick={() => setActiveTab("primary")}
                className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "primary"
                    ? "border-t-4 border-primary bg-white text-primary"
                    : "text-slate-500 hover:text-primary"
                }`}
              >
                <Book className="h-4 w-4" />
                {t.primaryTab[language]}
              </button>
              <button
                onClick={() => setActiveTab("secondary")}
                className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "secondary"
                    ? "border-t-4 border-primary bg-white text-primary"
                    : "text-slate-500 hover:text-primary"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {t.secondaryTab[language]}
              </button>
            </div>

            {/* Tab Panels Content Window */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === "primary" && (
                  <motion.div
                    key="primary-tab"
                    initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isArabic ? -10 : 10 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6"
                  >
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h2 className="font-serif text-xl font-semibold text-primary">
                        {t.className[language]}
                      </h2>
                      <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50">
                        <Download className="h-4 w-4" />
                        {t.exportClass[language]}
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table
                        className="w-full min-w-225 border-collapse text-left"
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <thead>
                          <tr className="bg-primary text-white">
                            <th
                              rowSpan={2}
                              className="border-r border-white/10 p-4 text-sm font-semibold"
                            >
                              {t.studentName[language]}
                            </th>
                            <th
                              colSpan={4}
                              className="border-r border-white/10 border-b p-2 text-center text-sm font-semibold"
                            >
                              {t.term[language]} 1
                            </th>
                            <th
                              colSpan={4}
                              className="border-r border-white/10 border-b p-2 text-center text-sm font-semibold"
                            >
                              {t.term[language]} 2
                            </th>
                            <th
                              colSpan={4}
                              className="border-r border-white/10 border-b p-2 text-center text-sm font-semibold"
                            >
                              {t.term[language]} 3
                            </th>
                            <th
                              rowSpan={2}
                              className="border-r border-white/10 p-4 text-center text-sm font-semibold"
                            >
                              {t.finalGrade[language]}
                            </th>
                            <th
                              rowSpan={2}
                              className="p-4 text-right text-sm font-semibold"
                            >
                              {t.actions[language]}
                            </th>
                          </tr>
                          <tr className="bg-[#27374d] text-[10px] uppercase tracking-wider text-white/80">
                            {[1, 2, 3].map((term) =>
                              subjects.map((s, i) => (
                                <th
                                  key={`${term}-${s.key}`}
                                  className={`p-2 text-center ${i === subjects.length - 1 ? "border-r border-white/20" : "border-r border-white/10"}`}
                                >
                                  {isArabic ? s.ar : s.en}
                                </th>
                              )),
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {primaryStudents.map((student, index) => (
                            <tr
                              key={student.id}
                              className={`transition-colors hover:bg-slate-50 ${index % 2 === 1 ? "bg-slate-50/50" : ""}`}
                            >
                              <td className="border-r border-slate-100 p-4">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-primary">
                                    {isArabic ? student.nameAr : student.nameEn}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {isArabic ? student.nameEn : student.nameAr}
                                  </span>
                                </div>
                              </td>

                              {[
                                student.term1,
                                student.term2,
                                student.term3,
                              ].map((term, termIndex) =>
                                term ? (
                                  term.map((score, scoreIndex) => (
                                    <td
                                      key={`${termIndex}-${scoreIndex}`}
                                      className={`p-2 text-center text-xs ${
                                        scoreIndex === subjects.length - 1
                                          ? "border-r border-slate-200"
                                          : "border-r border-slate-100"
                                      }`}
                                    >
                                      {score}
                                    </td>
                                  ))
                                ) : (
                                  <td
                                    key={`empty-${termIndex}`}
                                    colSpan={4}
                                    className="border-r border-slate-200 p-2 text-center"
                                  >
                                    <span className="text-xs font-semibold italic text-secondary">
                                      {t.pending[language]}
                                    </span>
                                  </td>
                                ),
                              )}

                              <td className="border-r border-slate-100 p-4 text-center">
                                {student.finalGrade ? (
                                  <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white">
                                    {student.finalGrade} ({student.finalPercent}
                                    %)
                                  </span>
                                ) : (
                                  <span className="font-serif text-lg text-primary">
                                    -
                                  </span>
                                )}
                              </td>

                              <td className="p-4 text-right">
                                <button
                                  onClick={() =>
                                    setExportTarget(
                                      isArabic
                                        ? student.nameAr
                                        : student.nameEn,
                                    )
                                  }
                                  className="rounded-lg p-2 text-primary transition hover:bg-slate-100 hover:text-secondary"
                                  title="Export PDF"
                                >
                                  <FileDown className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === "secondary" && (
                  <motion.div
                    key="secondary-tab"
                    initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isArabic ? -10 : 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-3 p-12 text-center"
                  >
                    <FolderOpen className="h-14 w-14 text-slate-300" />
                    <h3 className="font-serif text-lg font-semibold text-primary">
                      {isArabic
                        ? "بيانات المرحلة المتوسطة"
                        : "Intermediate Data"}
                    </h3>
                    <p className="max-w-md text-sm text-slate-500">
                      {t.emptyIntermediate[language]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.main>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {exportTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-primary bg-white shadow-2xl"
            >
              <div className="border-b border-slate-200 bg-[#F8F9FE] p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-primary">
                    {t.modalTitle[language]}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-slate-500 transition hover:text-red-600"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-slate-600">
                  {t.modalSubtitle[language]}{" "}
                  <span className="font-bold text-primary">{exportTarget}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 p-6">
                <button
                  onClick={closeModal}
                  className="group flex items-center gap-4 rounded-lg border-2 border-slate-200 bg-[#F8F9FE] p-4 text-left transition hover:border-primary active:scale-[0.98]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#27374d] text-white">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {t.fullYear[language]}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.fullYearDesc[language]}
                    </p>
                  </div>
                  <ChevronDown className="ml-auto h-5 w-5 -rotate-90 text-slate-300 transition group-hover:text-primary" />
                </button>

                <div>
                  <button
                    onClick={() => setShowTermSelect((v) => !v)}
                    className="group flex w-full items-center gap-4 rounded-lg border-2 border-slate-200 p-4 text-left transition hover:border-secondary active:scale-[0.98]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-secondary/10 text-secondary">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        {t.specificTerm[language]}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t.specificTermDesc[language]}
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: showTermSelect ? 180 : 0 }}
                      className="ml-auto text-slate-300 transition group-hover:text-secondary"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {showTermSelect && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((term) => (
                            <button
                              key={term}
                              onClick={closeModal}
                              className="rounded border border-slate-200 px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                            >
                              {t.term[language]} {term}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="bg-[#F8F9FE] p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t.footer[language]}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}