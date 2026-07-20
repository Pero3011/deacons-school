"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown, Folder, Lock} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useLanguage } from "@/context/LanguageContext";

type Student = {
  id: number;
  nameEn: string;
  nameAr: string;
  t1: string;
  t2: string;
  t3: string;
  current: boolean[];
};

type ClassFolder = {
  id: string;
  nameEn: string;
  nameAr: string;
  teacherEn: string;
  teacherAr: string;
  studentCount: number;
  locked?: boolean;
  loading?: boolean;
  students: Student[];
};

const classFolders: ClassFolder[] = [
  {
    id: "grade-1",
    nameEn: "Elementary: Grade 1 (St. Mark)",
    nameAr: "المرحلة الابتدائية: الصف الأول (مارمرقس)",
    teacherEn: "Teacher: Michael Ghabbour • 42 Students",
    teacherAr: "المعلم: مايكل غبور • ٤٢ طالب",
    studentCount: 42,
    students: [
      {
        id: 1,
        nameEn: "Andrew Samuel",
        nameAr: "اندرو صموئيل",
        t1: "95%",
        t2: "92%",
        t3: "98%",
        current: [true, true, false, true],
      },
      {
        id: 2,
        nameEn: "Marina Wagih",
        nameAr: "مارينا وجيه",
        t1: "100%",
        t2: "98%",
        t3: "100%",
        current: [true, true, true, true],
      },
      {
        id: 3,
        nameEn: "Peter Isaac",
        nameAr: "بيتر اسحق",
        t1: "80%",
        t2: "85%",
        t3: "82%",
        current: [true, false, true, false],
      },
      {
        id: 4,
        nameEn: "Justina Rafik",
        nameAr: "يوستينا رفيق",
        t1: "92%",
        t2: "90%",
        t3: "94%",
        current: [true, true, true, false],
      },
      {
        id: 5,
        nameEn: "Kyrollos Mina",
        nameAr: "كيرلس مينا",
        t1: "88%",
        t2: "82%",
        t3: "90%",
        current: [false, true, true, true],
      },
    ],
  },
  {
    id: "grade-7",
    nameEn: "Preparatory: Grade 7 (St. Anthony)",
    nameAr: "المرحلة الإعدادية: الصف السابع (الأنبا أنطونيوس)",
    teacherEn: "Teacher: David Shenouda • 38 Students",
    teacherAr: "المعلم: ديفيد شنودة • ٣٨ طالب",
    studentCount: 38,
    loading: true,
    students: [],
  },
  {
    id: "grade-10",
    nameEn: "High School: Grade 10 (St. Paul)",
    nameAr: "المرحلة الثانوية: الصف العاشر (ماربولس)",
    teacherEn: "Restricted Access",
    teacherAr: "وصول مقيد",
    studentCount: 0,
    locked: true,
    students: [],
  },
];

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
};

// Framer Motion Variants for staggered orchestration
const containerVariants:Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delays sequential elements by 100ms
    },
  },
};

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function AttendancePage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "grade-1": true,
  });
  const [attendance, setAttendance] = useState<Record<string, boolean[]>>(
    Object.fromEntries(
      classFolders
        .find((f) => f.id === "grade-1")!
        .students.map((s) => [s.id, s.current]),
    ),
  );

  const toggleFolder = (id: string) => {
    setOpenFolders((current) => ({ ...current, [id]: !current[id] }));
  };

  const toggleAttendance = (studentId: number, weekIndex: number) => {
    setAttendance((current) => {
      const week = current[studentId] ?? [];
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

        {/* Turned the <main> wrapper into a motion container */}
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
              <span className="font-serif text-3xl font-bold">1,248</span>
            </div>

            <div className="flex h-28 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t.avgAttendance[language]}
              </span>
              <div className="flex items-end gap-2">
                <span className="font-serif text-3xl font-bold text-secondary">
                  94%
                </span>
                <span className="mb-1 text-sm font-semibold text-green-600">
                  ↑ 2%
                </span>
              </div>
            </div>

            <div className="flex h-28 flex-col justify-between rounded-xl bg-[#EEF0FB] p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t.activeClasses[language]}
              </span>
              <span className="font-serif text-3xl font-bold text-primary">
                24
              </span>
            </div>
          </motion.div>

          {/* Folders */}
          <motion.div variants={itemVariants} className="space-y-4">
            {classFolders.map((cls) => {
              const isOpen = !!openFolders[cls.id];
              return (
                <div
                  key={cls.id}
                  className={`overflow-hidden rounded-xl border border-slate-200 bg-white transition-all ${
                    cls.locked ? "opacity-60" : ""
                  }`}
                >
                  <button
                    disabled={cls.locked}
                    onClick={() => toggleFolder(cls.id)}
                    className={`flex w-full items-center justify-between p-5 text-left transition-colors ${
                      isArabic ? "text-right" : "text-left"
                    } ${cls.locked ? "cursor-not-allowed" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center gap-4">
                      {cls.locked ? (
                        <Lock className="h-8 w-8 text-slate-300" />
                      ) : (
                        <Folder
                          className="h-8 w-8 text-amber-500"
                          strokeWidth={1.5}
                          fill="currentColor"
                          fillOpacity={0.15}
                        />
                      )}
                      <div>
                        <h3
                          className={`font-serif text-lg font-semibold ${cls.locked ? "text-slate-400" : "text-primary"}`}
                        >
                          {isArabic ? cls.nameAr : cls.nameEn}
                        </h3>
                        <p
                          className={`text-sm ${cls.locked ? "text-slate-400" : "text-slate-500"}`}
                        >
                          {isArabic ? cls.teacherAr : cls.teacherEn}
                        </p>
                      </div>
                    </div>
                    {!cls.locked && (
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      </motion.span>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && !cls.locked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t-2 border-primary"
                      >
                        {cls.loading ? (
                          <div className="p-12 text-center italic text-slate-400">
                            {t.loading[language]}
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
                                    colSpan={4}
                                    className="whitespace-nowrap border-x border-slate-200 bg-slate-100 p-2 text-center"
                                  >
                                    {t.currentTerm[language]}
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {cls.students.map((student, index) => {
                                  const week =
                                    attendance[student.id] ?? student.current;
                                  return (
                                    <tr
                                      key={student.id}
                                      className={`transition-colors hover:bg-amber-50/40 ${
                                        index % 2 === 1 ? "bg-slate-50/50" : ""
                                      }`}
                                    >
                                      <td className="p-4 font-semibold text-primary">
                                        {isArabic
                                          ? student.nameAr
                                          : student.nameEn}
                                      </td>
                                      <td className="p-4 text-center text-slate-500">
                                        {student.t1}
                                      </td>
                                      <td className="p-4 text-center text-slate-500">
                                        {student.t2}
                                      </td>
                                      <td className="border-r border-slate-100 p-4 text-center text-slate-500">
                                        {student.t3}
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
            })}
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
