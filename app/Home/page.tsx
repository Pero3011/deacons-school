"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import {
  Folder,
  FolderPlus,
  Users,
  X,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
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

interface TargetClass {
  id: string;
  nameEn: string;
  nameAr: string;
}

interface DbClass {
  id: string | number;
  nameEn: string;
  nameAr: string;
}

interface DbStudent {
  id: string | number;
  nameEn: string;
  nameAr: string;
}

export default function AdminHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classList, setClassList] = useState(classes);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Split Class Creation Modals State
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [targetClass, setTargetClass] = useState<TargetClass | null>(null);

  // Modal 1: Class details & API state
  const [newClassName, setNewClassName] = useState("");
  const [newClassNameAr, setNewClassNameAr] = useState("");
  const [classFormError, setClassFormError] = useState("");
  const [classFormSuccess, setClassFormSuccess] = useState("");
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // Modal 2: Students details & API state
  const [studentsPreview, setStudentsPreview] = useState<StudentPreview[]>([]);
  const [newStudentNameEn, setNewStudentNameEn] = useState("");
  const [newStudentNameAr, setNewStudentNameAr] = useState("");
  const [studentFormError, setStudentFormError] = useState("");
  const [studentFormSuccess, setStudentFormSuccess] = useState("");
  const [isSavingStudents, setIsSavingStudents] = useState(false);

  const selectedClass = classList.find((c) => c.id === selectedClassId) ?? null;

  // On page mount: fetch classes from API if available
  useEffect(() => {
    let isMounted = true;
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            const formatted = data.map((c: DbClass) => ({
              id: String(c.id),
              name: c.nameEn,
              nameAr: c.nameAr,
              students: 0,
              badge: "ACTIVE",
              badgeColor: "bg-emerald-100 text-emerald-700",
              muted: false,
              roster: [],
            }));
            setClassList((prev) => {
              const existingIds = new Set(prev.map((item) => item.id));
              const newItems = formatted.filter((item) => !existingIds.has(item.id));
              return [...newItems, ...prev];
            });
          }
        }
      } catch {
        // Fallback to local default classes
      }
    }
    fetchClasses();
    return () => {
      isMounted = false;
    };
  }, []);

  // When a class is selected: load students from API if needed
  useEffect(() => {
    if (!selectedClassId) return;
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students/${selectedClassId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setClassList((prev) =>
              prev.map((cls) => {
                if (cls.id === selectedClassId) {
                  const roster = data.map((st: DbStudent, idx: number) => ({
                    id: String(st.id),
                    initials:
                      st.nameEn
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "ST",
                    name: st.nameEn,
                    nameAr: st.nameAr,
                    avatarColor:
                      idx % 3 === 0
                        ? "bg-blue-100 text-blue-700"
                        : idx % 3 === 1
                        ? "bg-purple-100 text-purple-700"
                        : "bg-amber-100 text-amber-700",
                    attendance: 100,
                    term1: "-",
                    term2: "-",
                    term3: "-",
                    status: "ACTIVE",
                    statusColor: "bg-emerald-100 text-emerald-700",
                  }));
                  return { ...cls, students: data.length, roster };
                }
                return cls;
              })
            );
          }
        }
      } catch {}
    }
    fetchStudents();
  }, [selectedClassId]);

  const handleFolderClick = (id: string) => {
    setSelectedClassId((current) => (current === id ? null : id));
  };

  const openAddClassModal = () => {
    setNewClassName("");
    setNewClassNameAr("");
    setClassFormError("");
    setClassFormSuccess("");
    setTargetClass(null);
    setStudentsPreview([]);
    setNewStudentNameEn("");
    setNewStudentNameAr("");
    setStudentFormError("");
    setStudentFormSuccess("");
    setShowAddClassModal(true);
    setShowAddStudentModal(false);
  };

  const closeAllModals = () => {
    setShowAddClassModal(false);
    setShowAddStudentModal(false);
    setNewClassName("");
    setNewClassNameAr("");
    setClassFormError("");
    setClassFormSuccess("");
    setTargetClass(null);
    setStudentsPreview([]);
    setNewStudentNameEn("");
    setNewStudentNameAr("");
    setStudentFormError("");
    setStudentFormSuccess("");
    setIsCreatingClass(false);
    setIsSavingStudents(false);
  };

  // Open modal 2 to add students to an existing class
  const openAddStudentsForExistingClass = (cls: { id: string; name: string; nameAr: string }) => {
    setTargetClass({ id: cls.id, nameEn: cls.name, nameAr: cls.nameAr });
    setStudentsPreview([]);
    setNewStudentNameEn("");
    setNewStudentNameAr("");
    setStudentFormError("");
    setStudentFormSuccess("");
    setShowAddStudentModal(true);
  };

  // Step 1: POST /api/classes -> Create class in DB and optionally proceed to Step 2
  const handleCreateClass = async (addStudentsNext: boolean) => {
    setClassFormError("");
    setClassFormSuccess("");

    if (!newClassName.trim() || !newClassNameAr.trim()) {
      setClassFormError("Please enter both English and Arabic class names.");
      return;
    }

    setIsCreatingClass(true);

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: newClassName.trim(),
          nameAr: newClassNameAr.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setClassFormError(data?.error || `Failed to create class (${response.status})`);
        setIsCreatingClass(false);
        return;
      }

      const created = data?.class;
      const classId = String(created?.id || `class-${Date.now()}`);
      const newClassObj = {
        id: classId,
        name: created?.nameEn || newClassName.trim(),
        nameAr: created?.nameAr || newClassNameAr.trim(),
        students: 0,
        badge: "ACTIVE",
        badgeColor: "bg-emerald-100 text-emerald-700",
        muted: false,
        roster: [],
      };

      // Add to local state
      setClassList((prev) => [newClassObj, ...prev]);
      setSelectedClassId(classId);

      if (addStudentsNext) {
        setTargetClass({
          id: classId,
          nameEn: newClassObj.name,
          nameAr: newClassObj.nameAr,
        });
        setShowAddClassModal(false);
        setShowAddStudentModal(true);
      } else {
        setClassFormSuccess("Class created successfully!");
        setTimeout(() => {
          closeAllModals();
        }, 1200);
      }
    } catch (err: unknown) {
      setClassFormError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
    } finally {
      setIsCreatingClass(false);
    }
  };

  // Step 2 -> Step 1 (Back)
  const handleBackToClassDetails = () => {
    setShowAddStudentModal(false);
    setShowAddClassModal(true);
  };

  // Add student to preview list in Step 2
  const handleAddStudentToPreview = () => {
    if (!newStudentNameEn.trim() || !newStudentNameAr.trim()) {
      setStudentFormError("Please enter both student names (EN & AR).");
      return;
    }

    setStudentFormError("");
    setStudentsPreview((current) => [
      ...current,
      {
        id: `S-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nameEn: newStudentNameEn.trim(),
        nameAr: newStudentNameAr.trim(),
      },
    ]);
    setNewStudentNameEn("");
    setNewStudentNameAr("");
  };

  const handleRemoveStudentFromPreview = (id: string) => {
    setStudentsPreview((current) => current.filter((s) => s.id !== id));
  };

  // Step 2: POST /api/students/[classId] -> Save students to the class
  const handleSaveStudentsToApi = async () => {
    if (!targetClass) return;
    setStudentFormError("");
    setStudentFormSuccess("");

    if (studentsPreview.length === 0) {
      // No students added, just close modal
      closeAllModals();
      return;
    }

    setIsSavingStudents(true);

    try {
      const response = await fetch(`/api/students/${targetClass.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          students: studentsPreview.map((s) => ({
            nameEn: s.nameEn,
            nameAr: s.nameAr,
          })),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setStudentFormError(data?.error || `Failed to add students (${response.status})`);
        setIsSavingStudents(false);
        return;
      }

      const dbStudents = Array.isArray(data?.students) ? data.students : [];
      const newRoster = dbStudents.map((st: DbStudent, idx: number) => ({
        id: String(st.id || `DS-${Math.floor(1000 + Math.random() * 9000)}`),
        initials:
          st.nameEn
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "ST",
        name: st.nameEn,
        nameAr: st.nameAr,
        avatarColor:
          idx % 3 === 0
            ? "bg-blue-100 text-blue-700"
            : idx % 3 === 1
            ? "bg-purple-100 text-purple-700"
            : "bg-amber-100 text-amber-700",
        attendance: 100,
        term1: "-",
        term2: "-",
        term3: "-",
        status: "ACTIVE",
        statusColor: "bg-emerald-100 text-emerald-700",
      }));

      // Update classList with added students
      setClassList((prev) =>
        prev.map((c) => {
          if (c.id === targetClass.id) {
            return {
              ...c,
              students: (c.students || 0) + newRoster.length,
              roster: [...c.roster, ...newRoster],
            };
          }
          return c;
        })
      );

      setSelectedClassId(targetClass.id);
      setStudentFormSuccess(`Successfully added ${newRoster.length} student(s)!`);

      setTimeout(() => {
        closeAllModals();
      }, 1200);
    } catch (err: unknown) {
      setStudentFormError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
    } finally {
      setIsSavingStudents(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Container Layer */}
      <div className="min-h-screen min-w-0 md:pl-72 flex flex-col">
        {/* Topbar Component */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Modal 1: Add New Class Details (nameEn & nameAr) */}
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
                className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        Step 1 of 2
                      </span>
                      <h2 className="text-xl font-semibold text-slate-900">
                        Add New Class
                      </h2>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter the English and Arabic names for the new class.
                    </p>
                  </div>
                  <button
                    onClick={closeAllModals}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Close add class"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="space-y-4 px-6 py-6">
                  {classFormError && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{classFormError}</span>
                    </div>
                  )}

                  {classFormSuccess && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{classFormSuccess}</span>
                    </div>
                  )}

                  <label className="block space-y-2 text-sm font-medium text-slate-700">
                    Class Name (EN)
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(event) => {
                        setNewClassName(event.target.value);
                        if (classFormError) setClassFormError("");
                      }}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      placeholder="e.g. Grade 1 (St. Mark)"
                    />
                  </label>

                  <label className="block space-y-2 text-sm font-medium text-slate-700">
                    Class Name (AR)
                    <input
                      type="text"
                      dir="rtl"
                      value={newClassNameAr}
                      onChange={(event) => {
                        setNewClassNameAr(event.target.value);
                        if (classFormError) setClassFormError("");
                      }}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white text-right"
                      placeholder="مثال: المرحلة الأولى (مارمرقس)"
                    />
                  </label>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    disabled={isCreatingClass}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <div className="flex flex-wrap items-center justify-end gap-2.5">
                    <button
                      type="button"
                      disabled={isCreatingClass}
                      onClick={() => handleCreateClass(false)}
                      className="rounded-2xl border border-amber-300 bg-amber-50/60 px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"
                    >
                      Save Without Students
                    </button>

                    <button
                      type="button"
                      disabled={isCreatingClass}
                      onClick={() => handleCreateClass(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-75 shadow-sm"
                    >
                      {isCreatingClass ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating Class...</span>
                        </>
                      ) : (
                        <>
                          <span>Next: Add Students</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal 2: Add Students to Class */}
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
                className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        Step 2 of 2
                      </span>
                      <h2 className="text-xl font-semibold text-slate-900">
                        Add Students
                      </h2>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Adding to:{" "}
                      <span className="font-semibold text-slate-800">
                        {targetClass?.nameEn || newClassName}
                      </span>{" "}
                      ({targetClass?.nameAr || newClassNameAr})
                    </p>
                  </div>
                  <button
                    onClick={closeAllModals}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Close add students modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="space-y-5 px-6 py-6">
                  {studentFormError && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{studentFormError}</span>
                    </div>
                  )}

                  {studentFormSuccess && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{studentFormSuccess}</span>
                    </div>
                  )}

                  {/* Student Input Form */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Add New Student
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                        Student Name (EN)
                        <input
                          type="text"
                          value={newStudentNameEn}
                          onChange={(e) => {
                            setNewStudentNameEn(e.target.value);
                            if (studentFormError) setStudentFormError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddStudentToPreview();
                          }}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400"
                          placeholder="e.g. Mina Kamal"
                        />
                      </label>
                      <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                        Student Name (AR)
                        <input
                          type="text"
                          dir="rtl"
                          value={newStudentNameAr}
                          onChange={(e) => {
                            setNewStudentNameAr(e.target.value);
                            if (studentFormError) setStudentFormError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddStudentToPreview();
                          }}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 text-right"
                          placeholder="مثال: مينا كمال"
                        />
                      </label>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddStudentToPreview}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-600 shadow-2xs"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add to List</span>
                      </button>
                    </div>
                  </div>

                  {/* Added Students List */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Enrolled Students ({studentsPreview.length})
                      </h3>
                      {studentsPreview.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setStudentsPreview([])}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {studentsPreview.length > 0 ? (
                      <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                        {studentsPreview.map((student, idx) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-2xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                {idx + 1}
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-800 leading-tight">
                                  {student.nameEn}
                                </p>
                                <p dir="rtl" className="text-xs text-slate-400 leading-tight">
                                  {student.nameAr}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveStudentFromPreview(student.id)}
                              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                              title="Remove Student"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center text-xs text-slate-400">
                        No students added yet. You can add students using the inputs above, or click Save to finish.
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleBackToClassDetails}
                    disabled={isSavingStudents}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Class Details</span>
                  </button>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeAllModals}
                      disabled={isSavingStudents}
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveStudentsToApi}
                      disabled={isSavingStudents}
                      className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-75 shadow-sm"
                    >
                      {isSavingStudents ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving Students...</span>
                        </>
                      ) : (
                        <span>Save Students to Class</span>
                      )}
                    </button>
                  </div>
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

            {classList.map((cls) => {
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
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-slate-800 pt-3 sm:pt-0 sm:border-none">
                      <button
                        onClick={() => openAddStudentsForExistingClass(selectedClass)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-600 shadow-sm transition-colors"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Add Students</span>
                      </button>
                      <button className="rounded-lg bg-[#8A5A1C] px-4 py-2 text-xs font-bold text-white hover:bg-[#764B14] shadow-sm">
                        Download PDF
                      </button>
                      <button
                        onClick={() => setSelectedClassId(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

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
        </motion.div>
      </div>
    </div>
  );
}
