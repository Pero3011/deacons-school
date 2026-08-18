"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Book, Download, FileDown, X, ChevronDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useLanguage } from "@/context/LanguageContext";

type ClassData = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type MarksheetStudent = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type MarksheetExam = {
  id: string;
  term: "Term1" | "Term2" | "Term3";
  maxMark: number;
  subject: { id: string; nameEn: string; nameAr: string };
};

type Marksheet = {
  students: MarksheetStudent[];
  exams: MarksheetExam[];
  marks: Record<string, Record<string, number>>; // studentId -> examId -> mark
};

const TERMS: Array<"Term1" | "Term2" | "Term3"> = ["Term1", "Term2", "Term3"];

const t = {
  heading: { en: "Marks Management", ar: "إدارة الدرجات" },
  subheading: {
    en: "Grade tracking and academic records for the current academic year.",
    ar: "متابعة الدرجات والسجلات الأكاديمية للعام الدراسي الحالي.",
  },
  selectClass: { en: "Select a class", ar: "اختر فصلاً" },
  exportClass: { en: "Export Class Report", ar: "تصدير تقرير الفصل" },
  studentName: { en: "Student Name", ar: "اسم الطالب" },
  term: { en: "Term", ar: "الترم" },
  actions: { en: "Actions", ar: "إجراءات" },
  noExam: { en: "No exam set", ar: "لم يتم تحديد امتحان" },
  loadingClasses: { en: "Loading classes...", ar: "جاري تحميل الفصول..." },
  loadingMarksheet: { en: "Loading marksheet...", ar: "جاري تحميل الدرجات..." },
  noClasses: { en: "No classes yet.", ar: "لا توجد فصول بعد." },
  noStudents: {
    en: "No students in this class yet.",
    ar: "لا يوجد طلاب في هذا الفصل بعد.",
  },
  saveError: { en: "Couldn't save mark.", ar: "تعذر حفظ الدرجة." },
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

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
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
  const [exportTarget, setExportTarget] = useState<string | null>(null);
  const [showTermSelect, setShowTermSelect] = useState(false);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const [marksheet, setMarksheet] = useState<Marksheet | null>(null);
  const [isLoadingMarksheet, setIsLoadingMarksheet] = useState(false);
  const [savingCell, setSavingCell] = useState<string | null>(null);

  // Fetch classes once
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoadingClasses(true);
    setClassesError(null);

    fetch("/api/classes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data.error)
          throw new Error(data.error || `HTTP ${res.status}`);
        return data;
      })
      .then((data: ClassData[]) => {
        const list = Array.isArray(data) ? data : [];
        setClasses(list);
        if (list.length > 0) setSelectedClassId(list[0].id);
      })
      .catch((err) => {
        console.error("Couldn't fetch classes:", err);
        setClassesError("Couldn't load classes.");
        setClasses([]);
      })
      .finally(() => setIsLoadingClasses(false));
  }, []);

  // Fetch marksheet whenever the selected class changes
  useEffect(() => {
    if (!selectedClassId) return;
    const token = localStorage.getItem("token");
    setIsLoadingMarksheet(true);

    fetch(`/api/classes/${selectedClassId}/marksheet`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data.error)
          throw new Error(data.error || `HTTP ${res.status}`);
        return data;
      })
      .then((data: Marksheet) => setMarksheet(data))
      .catch((err) => {
        console.error("Couldn't fetch marksheet:", err);
        setMarksheet(null);
      })
      .finally(() => setIsLoadingMarksheet(false));
  }, [selectedClassId]);

  const closeModal = () => {
    setExportTarget(null);
    setShowTermSelect(false);
  };

  const examFor = (subjectId: string, term: string) =>
    marksheet?.exams.find((e) => e.subject.id === subjectId && e.term === term);

  // Distinct subjects that actually have at least one exam in this class
  const subjectsInClass = marksheet
    ? Array.from(
        new Map(marksheet.exams.map((e) => [e.subject.id, e.subject])).values(),
      )
    : [];

  const handleMarkChange = async (
    studentId: string,
    examId: string,
    value: number,
  ) => {
    const key = `${studentId}-${examId}`;
    setSavingCell(key);

    // optimistic update
    setMarksheet((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        marks: {
          ...prev.marks,
          [studentId]: { ...prev.marks[studentId], [examId]: value },
        },
      };
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId, examId, obtainedMark: value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t.saveError[language]);
    } catch (err) {
      console.error("Error saving mark:", err);
      alert(t.saveError[language]);
    } finally {
      setSavingCell(null);
    }
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

          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-[#F8F9FE] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Book className="h-4 w-4" />
                <select
                  value={selectedClassId ?? ""}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  disabled={isLoadingClasses || classes.length === 0}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-primary outline-none focus:border-primary disabled:opacity-50"
                >
                  {classes.length === 0 && (
                    <option value="">{t.selectClass[language]}</option>
                  )}
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {isArabic ? cls.nameAr : cls.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50">
                <Download className="h-4 w-4" />
                {t.exportClass[language]}
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {isLoadingClasses ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  {t.loadingClasses[language]}
                </div>
              ) : classesError ? (
                <div className="py-10 text-center text-sm text-red-500">
                  {classesError}
                </div>
              ) : classes.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  {t.noClasses[language]}
                </div>
              ) : isLoadingMarksheet || !marksheet ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  {t.loadingMarksheet[language]}
                </div>
              ) : marksheet.students.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  {t.noStudents[language]}
                </div>
              ) : (
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
                        {TERMS.map((term) => (
                          <th
                            key={term}
                            colSpan={Math.max(subjectsInClass.length, 1)}
                            className="border-r border-white/10 border-b p-2 text-center text-sm font-semibold"
                          >
                            {t.term[language]} {term.replace("Term", "")}
                          </th>
                        ))}
                      </tr>
                      <tr className="bg-[#27374d] text-[10px] uppercase tracking-wider text-white/80">
                        {TERMS.map((term) =>
                          subjectsInClass.length > 0 ? (
                            subjectsInClass.map((s, i) => (
                              <th
                                key={`${term}-${s.id}`}
                                className={`p-2 text-center ${
                                  i === subjectsInClass.length - 1
                                    ? "border-r border-white/20"
                                    : "border-r border-white/10"
                                }`}
                              >
                                {isArabic ? s.nameAr : s.nameEn}
                              </th>
                            ))
                          ) : (
                            <th
                              key={term}
                              className="border-r border-white/20 p-2"
                            />
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {marksheet.students.map((student, index) => (
                        <tr
                          key={student.id}
                          className={`transition-colors hover:bg-slate-50 ${
                            index % 2 === 1 ? "bg-slate-50/50" : ""
                          }`}
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

                          {TERMS.map((term) =>
                            subjectsInClass.map((subject, i) => {
                              const exam = examFor(subject.id, term);
                              if (!exam) {
                                return (
                                  <td
                                    key={`${term}-${subject.id}`}
                                    className={`p-2 text-center text-xs italic text-slate-300 ${
                                      i === subjectsInClass.length - 1
                                        ? "border-r border-slate-200"
                                        : "border-r border-slate-100"
                                    }`}
                                  >
                                    {t.noExam[language]}
                                  </td>
                                );
                              }
                              const key = `${student.id}-${exam.id}`;
                              const currentValue =
                                marksheet.marks[student.id]?.[exam.id];
                              return (
                                <td
                                  key={key}
                                  className={`p-1 text-center ${
                                    i === subjectsInClass.length - 1
                                      ? "border-r border-slate-200"
                                      : "border-r border-slate-100"
                                  }`}
                                >
                                  <input
                                    type="number"
                                    min={0}
                                    max={exam.maxMark}
                                    defaultValue={currentValue ?? ""}
                                    disabled={savingCell === key}
                                    onBlur={(e) => {
                                      const raw = e.target.value;
                                      if (raw === "") return;
                                      const value = Number(raw);
                                      if (
                                        Number.isNaN(value) ||
                                        value === currentValue
                                      )
                                        return;
                                      handleMarkChange(
                                        student.id,
                                        exam.id,
                                        value,
                                      );
                                    }}
                                    className="w-16 rounded border border-slate-200 px-1 py-1 text-center text-xs outline-none focus:border-primary disabled:opacity-50"
                                    title={`/ ${exam.maxMark}`}
                                  />
                                </td>
                              );
                            }),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
