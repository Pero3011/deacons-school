"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { CircleAlert } from "lucide-react";
import LanguageButton from "../../components/LanguageButton";
import { useLanguage } from "../../context/LanguageContext";
import { motion } from "framer-motion";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language } = useLanguage();

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      scale: 0.98,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as any, // modern easing
      },
    },
  };

  const leftPanel = {
    hidden: {
      opacity: 0,
      x: -40,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  };

  const rightPanel = {
    hidden: {
      opacity: 0,
      x: 40,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any,
      },
    },
  };

  const Title = {
    en: "Deacons School",
    ar: "مدرسة الشمامسة",
  };

  const Greeting = {
    title: {
      en: "Welcome Back",
      ar: "مرحبا بعودتك",
    },
    description: {
      en: "Please enter your credentials to access the portal.",
      ar: "ادخل بياناتك للدخول إلى المنصة.",
    },
  };

  const Access = {
    title: {
      en: "Administrative Access Only.",
      ar: "الوصول الإداري فقط.",
    },
    description: {
      en: "New administrative accounts are strictly provisioned by the Super Admin. Please contact the registrar for access issues.",
      ar: "يتم إنشاء الحسابات الإدارية الجديدة حصراً من قبل المدير العام. يرجى التواصل مع المسجل في حال وجود أي مشكلة في الوصول.",
    },
  };

  const FormContent = {
    email: {
      en: "Email",
      ar: "البريد الإلكتروني",
    },
    password: {
      en: "Password",
      ar: "كلمة المرور",
    },
    forgotPassword: {
      en: "Forgot Password?",
      ar: "هل نسيت كلمة المرور؟",
    },
    rememberMe: {
      en: "Remember me",
      ar: "تذكرني",
    },
    signIn: {
      en: "Sign In →",
      ar: "تسجيل الدخول →",
    },
    emailPlaceholder: {
      en: "admin@deaconschool.com",
      ar: "admin@deaconschool.com",
    },
    passwordPlaceholder: {
      en: "Enter your password",
      ar: "أدخل كلمة المرور",
    },
    description: {
      en: "Empowering the next generation of deacons through rigorous academic training and spiritual guidance.",
      ar: "تمكين جيل جديد من الشمامسة من خلال تدريب أكاديمي دقيق وإرشاد روحي.",
    },
  };

  const InputStyles =
    "w-full rounded-md border border-primary bg-white p-3 mt-2 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary";

  const isArabic = language === "ar";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Authentication failed.");
      }

      setMessage(
        language === "ar"
          ? "تم تسجيل الدخول بنجاح."
          : "Signed in successfully.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="grid w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl shadow-neutral-400 lg:grid-cols-2">
          {/* ================= Left Side ================= */}
          <motion.div
            variants={leftPanel}
            initial="hidden"
            animate="show"
            className="relative flex flex-col items-center justify-center overflow-hidden bg-primary px-6 py-10 text-center md:px-10 lg:min-h-175"
          >
            {/* Background Pattern */}
            <motion.div
              animate={{
                scale: [1, 1.03, 1],
                rotate: [0, 1, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0"
            >
              <Image
                src="/vecteezy_outline-cubic-seamless-pattern_7886154.svg"
                alt=""
                fill
                priority
                aria-hidden
                className="pointer-events-none absolute inset-0 object-cover opacity-20 select-none"
              />
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-primary/60" />

            <motion.div
              whileHover={{
                scale: 1.08,
                rotate: 5,
              }}
              className="absolute right-4 top-4 z-10 md:right-6 md:top-6"
            >
              <LanguageButton />
            </motion.div>

            {/* Logo */}
            <motion.div
              variants={itemVariants}
              className="relative h-36 w-full sm:h-44 md:h-52"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain drop-shadow-[0_0_8px_rgba(254,243,199,1)]"
                priority
              />
            </motion.div>

            {/* Titles */}
            <motion.div
              variants={itemVariants}
              className="relative my-6 text-white"
            >
              <h1 className="text-2xl font-bold font-serif md:text-3xl">
                {Title[language]}
              </h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{
                  delay: 0.6,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="my-8 mx-auto h-0.5 rounded-full bg-secondary"
              />
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="relative max-w-md px-2 text-sm leading-7 text-[#D3E3FF] md:text-base"
            >
              {FormContent.description[language]}
            </motion.p>
          </motion.div>

          {/* ================= Right Side ================= */}
          <motion.div
            variants={rightPanel}
            initial="hidden"
            animate="show"
            className="flex flex-col justify-center p-6 sm:p-10 lg:p-20"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className={isArabic ? "text-right" : "text-left"}
            >
              <h1 className="pb-2 text-2xl font-semibold font-serif md:text-3xl">
                {Greeting.title[language]}
              </h1>

              <h4 className="text-gray-600">
                {Greeting.description[language]}
              </h4>
            </motion.div>

            {/* Form */}
            <form className="my-8 space-y-5" onSubmit={handleSubmit}>
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  {FormContent.email[language]}
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder={FormContent.emailPlaceholder[language]}
                  className={InputStyles}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <div
                  className={`flex items-center ${isArabic ? "justify-between" : "justify-between"}`}
                >
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    {FormContent.password[language]}
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-secondary hover:underline"
                  >
                    {FormContent.forgotPassword[language]}
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  placeholder={FormContent.passwordPlaceholder[language]}
                  className={InputStyles}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  className={`flex cursor-pointer items-center gap-2 text-sm ${isArabic ? "justify-end" : "justify-start"}`}
                >
                  <input type="checkbox" className="accent-secondary" />
                  <span>{FormContent.rememberMe[language]}</span>
                </label>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                variants={itemVariants}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-primary py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {isSubmitting
                    ? language === "ar"
                      ? "جاري تسجيل الدخول..."
                      : "Signing in..."
                    : FormContent.signIn[language]}
                </button>
              </motion.div>

              {message ? (
                <p
                  className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
                >
                  {message}
                </p>
              ) : null}
            </form>

            {/* Alert */}
            <motion.div
              variants={itemVariants}
              className="mt-2 flex items-start gap-4 rounded-md border-l-4 border-secondary bg-[#D3E3FF] p-4 text-sm"
            >
              <CircleAlert size={34} className="mt-1 shrink-0 text-secondary" />

              <div>
                <h3 className="font-semibold">{Access.title[language]}</h3>

                <p className="mt-1 leading-6 text-gray-700">
                  {Access.description[language]}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
