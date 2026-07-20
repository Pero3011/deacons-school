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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetAdminForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const closeAdminRegisterModal = () => {
    setShowAdminRegisterModal(false);
    resetAdminForm();
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

              <div className="space-y-4 px-6 py-6">
                <label className="space-y-2 text-sm text-slate-700">
                  Full Name
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                    placeholder="John Doe"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                    placeholder="admin@example.com"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  Password (Hashed)
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  Confirm Password (Hashed)
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
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
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end sm:items-center">
                <button
                  onClick={closeAdminRegisterModal}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={closeAdminRegisterModal}
                  className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  Register Admin
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
