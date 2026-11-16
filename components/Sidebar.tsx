"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleUserIcon,
  GraduationCap,
  UserCheck,
  Star,
  Settings2,
  HelpCircle,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const [showAdminRegisterModal, setShowAdminRegisterModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"Admin" | "SuperAdmin">("Admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const resetAdminForm = () => {
    setNameEn("");
    setNameAr("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("Admin");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(false);
  };

  const closeAdminRegisterModal = () => {
    setShowAdminRegisterModal(false);
    resetAdminForm();
  };

  const handleSubmitAdmin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!nameEn.trim() || !nameAr.trim() || !email.trim() || !password) {
      setSubmitError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setSubmitError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: nameEn.trim(),
          nameAr: nameAr.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setSubmitError(data?.error || `Registration failed (${response.status})`);
        return;
      }

      setSubmitSuccess("Admin registered successfully!");
      setTimeout(() => {
        closeAdminRegisterModal();
      }, 1500);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const Links = [
    { icon: GraduationCap, title: "Home (Classes)", route: "/" },
    { icon: UserCheck, title: "Attendance", route: "/attendance" },
    { icon: Star, title: "Marks", route: "/marks" },
  ];

  return (
    <>
      {/* Darkened Backdrop Overlay for Mobile Screens */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-indigo-100 bg-[#EEF0FB] px-4 py-6 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Wrap content in a scrollable container internally *only* if the screen height shrinks too small for the options */}
        <div className="flex flex-col flex-1 justify-between overflow-y-auto no-scrollbar">
          <div>
            {/* Header & Mobile Close Button */}
            <div className="mb-6 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-slate-800">
                  Deacons School
                </h1>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-200 md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Role Card */}
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-white px-3 py-3 shadow-sm">
              <CircleUserIcon
                className="h-8 w-8 text-slate-700"
                strokeWidth={1.5}
              />
              <div>
                <h4 className="text-sm font-semibold text-slate-800">
                  Admin User
                </h4>
                <span className="text-xs font-medium text-amber-700">
                  Super-Admin Access
                </span>
              </div>
            </div>

            {/* Navigation Links List */}
            <ul className="space-y-2">
              {Links.map((link, index) => {
                const isActive = pathname === link.route;
                const Icon = link.icon;
                return (
                  <motion.li key={index} whileTap={{ scale: 0.98 }}>
                    <Link
                      href={link.route}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? "border-l-4 border-amber-500 bg-[#0B1730] text-white"
                          : "border-l-4 border-transparent text-slate-600 hover:bg-white/60"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`}
                      />
                      <span>{link.title}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Bottom Utility Action Items */}
          <div className="mt-6">
            <div className="mb-4 border-t border-indigo-100" />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAdminRegisterModal(true)}
              className="mb-4 w-full rounded-lg bg-[#8A5A1C] py-3 text-sm font-bold text-white shadow-sm hover:bg-[#764B14]"
            >
              New Registration
            </motion.button>

            <div className="space-y-1">
              <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/60">
                <Settings2 className="h-4 w-4 text-slate-500" />
                <h4>Settings</h4>
              </div>
              <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/60">
                <HelpCircle className="h-4 w-4 text-slate-500" />
                <h4>Help</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAdminRegisterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4"
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
                    Register New Admin
                  </h3>
                  <p className="text-sm text-slate-500">
                    Super-admin only: add a new administrative user.
                  </p>
                </div>
                <button
                  onClick={closeAdminRegisterModal}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Close registration modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitAdmin}>
                <div className="space-y-4 px-6 py-6 max-h-[75vh] overflow-y-auto">
                  {submitError && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1.5 text-xs font-semibold text-slate-700">
                      Full Name (EN)
                      <input
                        type="text"
                        value={nameEn}
                        onChange={(event) => {
                          setNameEn(event.target.value);
                          if (submitError) setSubmitError("");
                        }}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                        placeholder="e.g. John Doe"
                      />
                    </label>

                    <label className="space-y-1.5 text-xs font-semibold text-slate-700">
                      Full Name (AR)
                      <input
                        type="text"
                        dir="rtl"
                        value={nameAr}
                        onChange={(event) => {
                          setNameAr(event.target.value);
                          if (submitError) setSubmitError("");
                        }}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white text-right"
                        placeholder="مثال: يوحنا داود"
                      />
                    </label>
                  </div>

                  <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                    Email Address
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (submitError) setSubmitError("");
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      placeholder="admin@example.com"
                    />
                  </label>

                  <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                    Role
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as "Admin" | "SuperAdmin")}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                    >
                      <option value="Admin">Admin</option>
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                  </label>

                  <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                    Password (Min 8 characters)
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (submitError) setSubmitError("");
                        }}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </label>

                  <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                    Confirm Password
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          if (submitError) setSubmitError("");
                        }}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((current) => !current)
                        }
                        className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </label>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end sm:items-center">
                  <button
                    type="button"
                    onClick={closeAdminRegisterModal}
                    disabled={isSubmitting}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-75 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <span>Register Admin</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
