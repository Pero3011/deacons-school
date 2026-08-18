"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown, Folder, Lock } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useLanguage } from "@/context/LanguageContext";

type RosterStudent = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type ClassData = {
  id: string;
  nameEn: string;
  nameAr: string;
  _count?: { students: number };
  students?: RosterStudent[];
};

const t = {
  heading: { en: "Attendance Registry", ar: "سجل الحضور" },
  subheading: {
    en: "Academic Year 2023 - 2024",
    ar: "العام الدراسي ٢٠٢٣ - ٢٠٢٤",
  },
  totalStudents: { en: "Total Students", ar: "إجمالي الطلاب" },
  avgAttendance: { en: "Average Attendance", ar: "متوسط الحضور" },
  activeClasses: { en: "Active Classes", ar: "الفصول النشطة" },
  studentName: { en: "Student Name", ar: "اسم الطالب" },
  term1: { en: "Term 1", ar: "الترم ١" },
  term2: { en: "Term 2", ar: "الترم ٢" },
  term3: { en: "Term 3", ar: "الترم ٣" },
  currentTerm: {
    en: "Current Term (April Weeks)",
    ar: "الترم الحالي (أسابيع أبريل)",
  },
  loading: {
    en: "Loading student records...",
    ar: "جاري تحميل سجلات الطلاب...",
  },
  noStudents: {
    en: "No students in this class yet.",
    ar: "لا يوجد طلاب في هذا الفصل بعد.",
  },
  loadingClasses: {
    en: "Loading classes...",
    ar: "جاري تحميل الفصول...",
  },
  noClasses: {
    en: "No classes yet.",
    ar: "لا توجد فصول بعد.",
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// Four toggleable weeks for the "current term" mini-grid.
// This is UI-only until a real attendances API exists — see note below.
const CURRENT_TERM_WEEKS = 4;

export default function AttendancePage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  // NOTE: There is no attendances table/API wired up yet, so this stays
  // client-only state — toggling a box here does NOT persist to the database.
  // Once an /api/attendances endpoint exists, this should be replaced with
  // fetched data + a PATCH/POST call inside toggleAttendance.
  const [attendance, setAttendance] = useState<Record<string, boolean[]>>({});

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [classesError, setClassesError] = useState<string | null>(null);

  const [studentCount, setStudentCount] = useState<number | null>(null);

  const fetchClasses = () => {
    setIsLoadingClasses(true);
    setClassesError(null);
    const token = localStorage.getItem("token");

    fetch("/api/classes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || `HTTP ${res.status}`);
        }
        return data;
      })
      .then((data: ClassData[]) => {
        const list = Array.isArray(data) ? data : [];
        setClasses(list);

        // Open the first class by default once data arrives, if nothing
        // is open yet.
        setOpenFolders((current) => {
          if (Object.keys(current).length > 0 || list.length === 0) {
            return current;
          }
          return { [list[0].id]: true };
        });
      })
      .catch((err) => {
        console.error("Couldn't fetch classes:", err);
        setClassesError("Couldn't load classes.");
        setClasses([]);
      })
      .finally(() => setIsLoadingClasses(false));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Total students: derived from /api/students/count rather than summed
  // client-side, since a student could theoretically exist without a class.
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/students/count", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStudentCount(data.count))
      .catch((err) => console.error("Couldn't fetch student count:", err));
  }, []);

  // Active classes count comes straight from the classes we already fetched —
  // no need for a separate /api/classes/count round trip.
  const classCount = classes.length;

  const toggleFolder = (id: string) => {
    setOpenFolders((current) => ({ ...current, [id]: !current[id] }));
  };

  const toggleAttendance = (studentId: string, weekIndex: number) => {
    setAttendance((current) => {
      const week = current[studentId] ?? Array(CURRENT_TERM_WEEKS).fill(false);
      const next = [...week];
      next[weekIndex] = !next[weekIndex];
      return { ...current, [studentId]: next };
    });
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
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className={isArabic ? "text-right" : "text-left"}>
              <h1 className="font-serif text-2xl font-bold text-primary md:text-3xl">
                {t.heading[language]}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {t.subheading[language]}
              </p>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            variants={itemVariants}
            className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div className="flex h-28 flex-col justify-between rounded-xl bg-primary p-5 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                {t.totalStudents[language]}
              </span>
              <span className="font-serif text-3xl font-bold">
                {studentCount ?? "…"}
              </span>
            </div>

            <div className="flex h-28 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t.avgAttendance[language]}
              </span>
              <div className="flex items-end gap-2">
                {/* No attendances table yet — placeholder until real data exists */}
                <span className="font-serif text-3xl font-bold text-secondary">
                  —
                </span>
              </div>
            </div>

            <div className="flex h-28 flex-col justify-between rounded-xl bg-[#EEF0FB] p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t.activeClasses[language]}
              </span>
              <span className="font-serif text-3xl font-bold text-primary">
                {classCount}
              </span>
            </div>
          </motion.div>

          {/* Folders */}
          <motion.div variants={itemVariants} className="space-y-4">
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
            ) : (
              classes.map((cls) => {
                const isOpen = !!openFolders[cls.id];
                const students = cls.students ?? [];
                const studentCountForClass =
                  cls._count?.students ?? students.length;

                return (
                  <div
                    key={cls.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all"
                  >
                    <button
                      onClick={() => toggleFolder(cls.id)}
                      className={`flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50 ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Folder
                          className="h-8 w-8 text-amber-500"
                          strokeWidth={1.5}
                          fill="currentColor"
                          fillOpacity={0.15}
                        />
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-primary">
                            {isArabic ? cls.nameAr : cls.nameEn}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {studentCountForClass}{" "}
                            {isArabic ? "طالب" : "Students"}
                          </p>
                        </div>
                      </div>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden border-t-2 border-primary"
                        >
                          {students.length === 0 ? (
                            <div className="p-12 text-center italic text-slate-400">
                              {t.noStudents[language]}
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table
                                className="w-full border-collapse text-left"
                                dir={isArabic ? "rtl" : "ltr"}
                              >
                                <thead>
                                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                                    <th className="p-4">
                                      {t.studentName[language]}
                                    </th>
                                    <th className="p-4 text-center">
                                      {t.term1[language]}
                                    </th>
                                    <th className="p-4 text-center">
                                      {t.term2[language]}
                                    </th>
                                    <th className="p-4 border-r border-slate-200 text-center">
                                      {t.term3[language]}
                                    </th>
                                    <th
                                      colSpan={CURRENT_TERM_WEEKS}
                                      className="whitespace-nowrap border-x border-slate-200 bg-slate-100 p-2 text-center"
                                    >
                                      {t.currentTerm[language]}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {students.map((student, index) => {
                                    const week =
                                      attendance[student.id] ??
                                      Array(CURRENT_TERM_WEEKS).fill(false);
                                    return (
                                      <tr
                                        key={student.id}
                                        className={`transition-colors hover:bg-amber-50/40 ${
                                          index % 2 === 1
                                            ? "bg-slate-50/50"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-4 font-semibold text-primary">
                                          {isArabic
                                            ? student.nameAr
                                            : student.nameEn}
                                        </td>
                                        {/* No marks API yet — placeholders like the roster table */}
                                        <td className="p-4 text-center text-slate-400">
                                          —
                                        </td>
                                        <td className="p-4 text-center text-slate-400">
                                          —
                                        </td>
                                        <td className="border-r border-slate-100 p-4 text-center text-slate-400">
                                          —
                                        </td>
                                        {week.map((attended, weekIndex) => (
                                          <td
                                            key={weekIndex}
                                            className="border-x border-slate-100 p-4 text-center"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={attended}
                                              onChange={() =>
                                                toggleAttendance(
                                                  student.id,
                                                  weekIndex,
                                                )
                                              }
                                              className="h-5 w-5 cursor-pointer rounded text-primary accent-secondary"
                                            />
                                          </td>
                                        ))}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
