"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Folder, FolderPlus, Users, X } from "lucide-react";
import PerformanceCards from "./sections/PerformanceCards";
import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

const classes = [
  {
    id: "grade-1",
    name: "Grade 1",
    nameAr: "المرحلة الأولى",
    students: 24,
    badge: "ACTIVE",
    badgeColor: "bg-emerald-100 text-emerald-700",
    muted: false,
    roster: [
      {
        id: "DS-9021",
        initials: "ME",
        name: "Mark Ebrahim",
        nameAr: "مارك ابراهيم",
        avatarColor: "bg-blue-100 text-blue-700",
        attendance: 92,
        term1: "A+",
        term2: "A",
        term3: "A+",
        status: "EXCELLENT",
        statusColor: "bg-emerald-100 text-emerald-700",
      },
      {
        id: "DS-9044",
        initials: "SK",
        name: "Sarah Kamel",
        nameAr: "سارة كامل",
        avatarColor: "bg-purple-100 text-purple-700",
        attendance: 85,
        term1: "A",
        term2: "A",
        term3: "A-",
        status: "HONORS",
        statusColor: "bg-sky-100 text-sky-700",
      },
      {
        id: "DS-8812",
        initials: "YA",
        name: "Youssef Aziz",
        nameAr: "يوسف عزيز",
        avatarColor: "bg-amber-100 text-amber-700",
        attendance: 76,
        term1: "B+",
        term2: "B",
        term3: "B+",
        status: "STEADY",
        statusColor: "bg-indigo-100 text-indigo-600",
      },
    ],
  },
  {
    id: "advanced-liturgy",
    name: "Advanced Liturgy",
    nameAr: "الطقس المتقدم",
    students: 12,
    badge: "ACTIVE",
    badgeColor: "bg-emerald-100 text-emerald-700",
    muted: false,
    roster: [
      {
        id: "DS-9102",
        initials: "MK",
        name: "Mina Kamal",
        nameAr: "مينا كمال",
        avatarColor: "bg-rose-100 text-rose-700",
        attendance: 88,
        term1: "A",
        term2: "A-",
        term3: "A",
        status: "HONORS",
        statusColor: "bg-sky-100 text-sky-700",
      },
    ],
  },
  {
    id: "graduates-23",
    name: "Graduates '23",
    nameAr: "خريجي ٢٠٢٣",
    students: null,
    badge: "ARCHIVED",
    badgeColor: "bg-slate-100 text-slate-500",
    muted: true,
    roster: [],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

interface StudentPreview {
  id: string;
  nameEn: string;
  nameAr: string;
}

export default function AdminHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassNameAr, setNewClassNameAr] = useState("");
  const [newClassStudentCount, setNewClassStudentCount] = useState("");
  const [studentsPreview, setStudentsPreview] = useState<StudentPreview[]>([]);
  const [newStudentNameEn, setNewStudentNameEn] = useState("");
  const [newStudentNameAr, setNewStudentNameAr] = useState("");

  const selectedClass = classes.find((c) => c.id === selectedClassId) ?? null;

  const handleFolderClick = (id: string) => {
    setSelectedClassId((current) => (current === id ? null : id));
  };

  const openAddClassModal = () => {
    setShowAddClassModal(true);
  };

  const closeAddClassModal = () => {
    setShowAddClassModal(false);
    setShowAddStudentModal(false);
    setNewClassName("");
    setNewClassNameAr("");
    setNewClassStudentCount("");
    setStudentsPreview([]);
    setNewStudentNameEn("");
    setNewStudentNameAr("");
  };

  const openAddStudentModal = () => {
    setShowAddStudentModal(true);
  };

  const closeAddStudentModal = () => {
    setShowAddStudentModal(false);
    setNewStudentNameEn("");
    setNewStudentNameAr("");
  };

  const saveStudentPreview = () => {
    if (!newStudentNameEn.trim() || !newStudentNameAr.trim()) {
      return;
    }

    setStudentsPreview((current) => [
      ...current,
      {
        id: `S-${Date.now()}`,
        nameEn: newStudentNameEn.trim(),
        nameAr: newStudentNameAr.trim(),
      },
    ]);
    closeAddStudentModal();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Container Layer */}
      <div className="min-h-screen min-w-0 md:pl-72 flex flex-col">
        {/* Topbar Component */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Add New Class Modal */}
        <AnimatePresence>
          {showAddClassModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              >
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Add New Class
                    </h2>
                    <p className="text-sm text-slate-500">
                      Enter the class details and add students.
                    </p>
                  </div>
                  <button
                    onClick={closeAddClassModal}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Close add class"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6 px-6 py-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700">
                      Class Name (EN)
                      <input
                        type="text"
                        value={newClassName}
                        onChange={(event) =>
                          setNewClassName(event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                        placeholder="Grade 1"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                      Class Name (AR)
                      <input
                        type="text"
                        dir="rtl"
                        value={newClassNameAr}
                        onChange={(event) =>
                          setNewClassNameAr(event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                        placeholder="المرحلة الأولى"
                      />
                    </label>
                  </div>

                  <label className="space-y-2 text-sm text-slate-700 mb-2">
                    Number of Students
                    <input
                      type="number"
                      min="0"
                      value={newClassStudentCount}
                      onChange={(event) =>
                        setNewClassStudentCount(event.target.value)
                      }
                      className="w-full max-w-55 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      placeholder="0"
                    />
                  </label>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          Add Student
                        </h3>
                        <p className="text-sm text-slate-500">
                          Add one or more students for this class.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={openAddStudentModal}
                        className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                      >
                        Add Student
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {studentsPreview.length > 0 ? (
                        <div className="space-y-3">
                          {studentsPreview.map((student) => (
                            <div
                              key={student.id}
                              className="rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                            >
                              <div className="flex flex-col gap-1 text-sm text-slate-900 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="font-semibold">
                                    {student.nameEn}
                                  </p>
                                  <p dir="rtl" className="text-slate-500">
                                    {student.nameAr}
                                  </p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                  Preview
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 px-4 py-8 text-center text-sm text-slate-500">
                          No students added yet. Click "Add Student" to begin.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end sm:items-center">
                  <button
                    onClick={closeAddClassModal}
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={closeAddClassModal}
                    className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Save Class
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Student Modal */}
        <AnimatePresence>
          {showAddStudentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
              >
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Add Student
                    </h3>
                    <p className="text-sm text-slate-500">
                      Enter the student information below.
                    </p>
                  </div>
                  <button
                    onClick={closeAddStudentModal}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Close add student"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4 px-6 py-6">
                  <label className="space-y-2 text-sm text-slate-700">
                    Name (EN)
                    <input
                      type="text"
                      value={newStudentNameEn}
                      onChange={(event) =>
                        setNewStudentNameEn(event.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      placeholder="Mina Kamal"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    Name (AR)
                    <input
                      type="text"
                      dir="rtl"
                      value={newStudentNameAr}
                      onChange={(event) =>
                        setNewStudentNameAr(event.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      placeholder="مينا كمال"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end sm:items-center">
                  <button
                    type="button"
                    onClick={closeAddStudentModal}
                    className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveStudentPreview}
                    className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Save Student
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Inner Layout Wrapper */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 px-4 py-6 sm:px-8 md:px-12 lg:px-16"
        >
          {/* Header Panel */}
          <motion.div
            variants={itemVariants}
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex flex-wrap gap-x-2 items-center">
                <span className="font-serif text-2xl font-bold text-primary md:text-3xl">
                  Class Management /
                </span>
                <span
                  dir="rtl"
                  className="text-lg md:text-xl font-medium text-slate-600"
                >
                  إدارة الفصول
                </span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 max-w-xl">
                Manage schedules, attendance, and academic records for all
                liturgical grades.
              </p>
            </div>

            {/* Current Semester */}
            <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 border-amber-500 pl-3 sm:pl-0 sm:pr-3 py-0.5 self-start sm:self-auto">
              <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Current Semester
              </h4>
              <span className="text-sm font-semibold text-slate-600 flex gap-1.5 sm:justify-end items-center">
                <span>Fall 2024 /</span>
                <span dir="rtl" className="text-xs font-medium">
                  خريف ٢٠٢٤
                </span>
              </span>
            </div>
          </motion.div>

          {/* Classes Grid System */}
          <motion.div
            variants={itemVariants}
            className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <button
              onClick={openAddClassModal}
              className="flex flex-row sm:flex-col items-center sm:justify-center gap-3 rounded-xl bg-amber-500 p-5 text-white shadow-sm transition-colors hover:bg-amber-600 min-h-25 sm:h-auto"
            >
              <FolderPlus className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
              <h4 className="text-sm font-bold">Add New Class</h4>
            </button>

            {classes.map((cls) => {
              const isSelected = selectedClassId === cls.id;
              return (
                <motion.button
                  key={cls.id}
                  onClick={() => handleFolderClick(cls.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`relative mt-3 rounded-2xl border-2 p-6 text-left transition-all ${
                    cls.muted ? "bg-slate-50 opacity-60" : "bg-white"
                  } ${
                    isSelected
                      ? "border-[#1c2434] bg-white ring-4 ring-slate-100"
                      : "border-[#1c2434] hover:bg-slate-50/50"
                  }`}
                >
                  {/* Custom Folder Tab Element */}
                  <div
                    className={`absolute -top-2.25 left-6 h-2.5 w-32 bg-[#1c2434] transition-opacity ${
                      cls.muted ? "opacity-60" : "opacity-100"
                    }`}
                    style={{
                      clipPath: "polygon(0% 100%, 15% 0%, 85% 0%, 100% 100%)",
                    }}
                  />

                  {/* Top Section: Folder Icon and Badge */}
                  <div className="mb-6 flex items-start justify-between">
                    <Folder
                      className={`h-9 w-9 stroke-[2.5] ${
                        cls.muted ? "text-slate-400" : "text-[#1c2434]"
                      }`}
                    />
                    <span
                      className={`rounded bg-[#e2eafc] px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1c2434] shrink-0 uppercase`}
                    >
                      {cls.badge || "ACTIVE"}
                    </span>
                  </div>

                  {/* Middle Section: Typography */}
                  <div className="mb-6">
                    <h4 className="font-serif text-2xl font-normal text-[#1c2434] truncate">
                      {cls.name}
                    </h4>
                    <p
                      className="mt-1 text-base text-slate-600 truncate"
                      dir="rtl"
                    >
                      {cls.nameAr}
                    </p>
                  </div>

                  {/* Bottom Section: Student Count */}
                  {cls.students !== null && (
                    <div className="flex items-center gap-2.5 text-base font-medium text-[#1c2434]">
                      <Users className="h-5 w-5 text-amber-500 fill-amber-500/10 stroke-[2.5]" />
                      <span>{cls.students} Students</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Class Info Roster Preview Dynamic Layer */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              {selectedClass && (
                <motion.div
                  key={selectedClass.id}
                  initial={{ opacity: 0, y: -12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -12, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden rounded-xl border border-slate-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0B1730] px-4 py-4 sm:px-6 sm:py-5 gap-4">
                    <div>
                      <h1 className="text-base font-bold text-white flex flex-wrap gap-x-2 items-center">
                        <span>{selectedClass.name} /</span>
                        <span
                          dir="rtl"
                          className="text-sm text-slate-300 font-normal"
                        >
                          {selectedClass.nameAr}
                        </span>
                      </h1>
                      <h4 className="text-xs text-slate-400 flex flex-wrap gap-x-1.5 items-center mt-0.5">
                        <span>Roster & Performance Summary /</span>
                        <span dir="rtl" className="text-[11px]">
                          كشف الاسماء والدرجات
                        </span>
                      </h4>
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-slate-800 pt-3 sm:pt-0 sm:border-none">
                      <button
                        type="button"
                        onClick={openAddStudentModal}
                        className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-600 shadow-sm"
                      >
                        Add Student
                      </button>
                      <button className="rounded-lg bg-[#8A5A1C] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#764B14] shadow-sm">
                        Download PDF
                      </button>
                      <button
                        onClick={() => setSelectedClassId(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Close roster view"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Roster Table Content */}
                  <div className="overflow-x-auto w-full">
                    {selectedClass.roster.length > 0 ? (
                      <table className="w-full border-collapse text-sm table-auto">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-4 py-3 text-left font-semibold text-slate-700 min-w-50">
                              Student Name / الاسم
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                              ID
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700 min-w-40">
                              Attendance / الحضور
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-700">
                              Term 1
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-700">
                              Term 2
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-700">
                              Term 3
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {selectedClass.roster.map((student) => (
                            <tr
                              key={student.id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${student.avatarColor}`}
                                  >
                                    {student.initials}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">
                                      {student.name}
                                    </p>
                                    <p
                                      className="text-xs text-slate-400 truncate"
                                      dir="rtl"
                                    >
                                      {student.nameAr}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                                #{student.id}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex flex-col gap-1">
                                  <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                      className="h-full rounded-full bg-amber-500"
                                      style={{
                                        width: `${student.attendance}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs text-slate-500">
                                    {student.attendance}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                                {student.term1}
                              </td>
                              <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                                {student.term2}
                              </td>
                              <td className="px-4 py-3.5 text-center font-medium text-slate-700">
                                {student.term3}
                              </td>
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${student.statusColor}`}
                                >
                                  {student.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="px-6 py-10 text-center text-sm text-slate-400 bg-white">
                        No roster data available for this class.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Performance Trends Section */}
          <motion.div variants={itemVariants} className="mt-6">
            <PerformanceCards />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
