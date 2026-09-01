"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);

    // Connect your Supabase authentication here.
    // Example:
    //
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });

    console.log("Login attempt:", {
      email,
      password,
    });

    // Temporary loading state
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#F6FBF8] font-sans text-gray-900 selection:bg-emerald-200">

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }

          50% {
            opacity: 0.55;
            transform: scale(1.08);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.7s ease-out both;
        }

        .animate-fade-right {
          animation: fadeRight 0.8s ease-out both;
        }

        .animate-fade-left {
          animation: fadeLeft 0.8s ease-out both;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulseSoft 4s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-6 lg:px-8">

          {/* LOGO */}
          <a
            href="/"
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00A859] text-white shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>

            <div className="leading-none">
              <span className="text-lg font-bold tracking-tight text-gray-950">
                eConcern
              </span>

              <span className="ml-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#00A859]">
                Barangay
              </span>
            </div>
          </a>

          {/* RIGHT NAVIGATION */}
          <div className="ml-auto flex items-center gap-5 lg:gap-8">

            <nav className="hidden items-center gap-6 lg:flex">

              <a
                href="/"
                className="group relative py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-950"
              >
                Home

                <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-[#00A859] transition-all duration-300 group-hover:w-full" />
              </a>

              <a
                href="/#how-it-works"
                className="group relative py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-950"
              >
                How It Works

                <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-[#00A859] transition-all duration-300 group-hover:w-full" />
              </a>

              <a
                href="/#awareness"
                className="group relative py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-950"
              >
                Awareness

                <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-[#00A859] transition-all duration-300 group-hover:w-full" />
              </a>

            </nav>

            {/* DIVIDER */}
            <div className="hidden h-7 w-px bg-gray-200 lg:block" />

            {/* REPORT */}
            <a
              href="/resident"
              className="hidden text-sm font-semibold text-gray-600 transition-colors hover:text-gray-950 sm:block"
            >
              Submit Report
            </a>

            {/* CURRENT PAGE */}
            <div className="hidden rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-[#008F4B] sm:block">
              Admin Login
            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="relative">

        {/* BACKGROUND DECORATION */}
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl animate-pulse-soft" />

        <div
          className="pointer-events-none absolute -right-40 top-32 h-96 w-96 rounded-full bg-green-100/40 blur-3xl animate-pulse-soft"
          style={{ animationDelay: "1.5s" }}
        />

        <section className="relative mx-auto flex min-h-[calc(100vh-145px)] w-full max-w-6xl items-center px-6 py-12 sm:py-16 lg:px-8">

          {/* =================================================
              LOGIN CARD
          ================================================== */}
          <div className="grid w-full overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_25px_80px_-35px_rgba(0,100,60,0.35)] lg:grid-cols-2">

            {/* =================================================
                LEFT - LOGIN FORM
            ================================================== */}
            <div className="animate-fade-left flex items-center justify-center p-7 sm:p-10 lg:p-14">

              <div className="w-full max-w-sm">

                {/* ICON */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#00A859] shadow-sm transition-all duration-300 hover:scale-105 hover:rotate-3">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                {/* TITLE */}
                <div className="animate-fade-up">

                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#00A859]">
                    eConcern Admin
                  </p>

                  <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-950 sm:text-4xl">
                    Welcome back.
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Sign in to manage community reports and help keep
                    Barangay Barangca clean.
                  </p>

                </div>

                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="animate-fade-up delay-100 mt-8 space-y-5"
                >

                  {/* EMAIL */}
                  <div>

                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-semibold text-gray-700"
                    >
                      Email Address
                    </label>

                    <div className="relative">

                      <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}
                  <div>

                    <div className="mb-1.5 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="text-xs font-semibold text-gray-700"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        className="text-xs font-semibold text-[#00A859] transition-colors hover:text-[#008F4B]"
                      >
                        Forgot password?
                      </button>

                    </div>

                    <div className="relative">

                      <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 pr-11 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* REMEMBER */}
                  <label className="flex cursor-pointer items-center gap-2">

                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 accent-[#00A859]"
                    />

                    <span className="text-xs text-gray-500">
                      Keep me signed in
                    </span>

                  </label>

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A859] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#008F4B] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}

                  </button>

                </form>

                {/* SECURITY NOTICE */}
                <div className="animate-fade-up delay-200 mt-7 flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">

                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#00A859]" />

                  <div>
                    <p className="text-xs font-semibold text-emerald-900">
                      Authorized access only
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-emerald-800/70">
                      This dashboard is restricted to authorized
                      barangay personnel.
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* =================================================
                RIGHT - BRANDING
            ================================================== */}
            <div className="animate-fade-right relative hidden min-h-[620px] overflow-hidden bg-[#073B25] lg:block">

              {/* GLOW */}
              <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

              <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-green-300/10 blur-3xl" />

              {/* GRID */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* DECORATIVE CIRCLES */}
              <div className="absolute right-12 top-12 h-20 w-20 rounded-full border border-emerald-300/10" />

              <div className="absolute right-20 top-20 h-8 w-8 rounded-full bg-emerald-300/10" />

              <div className="absolute bottom-24 right-16 h-32 w-32 rounded-full border border-emerald-300/10" />

              {/* CONTENT */}
              <div className="relative z-10 flex h-full min-h-[620px] flex-col justify-between p-10 sm:p-12">

                {/* TOP */}
                <div className="animate-fade-up">

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-100 backdrop-blur-sm">

                    <Sparkles className="h-3.5 w-3.5" />

                    eConcern Admin

                  </div>

                </div>

                {/* CENTER */}
                <div className="flex items-center justify-center">

                  <div className="relative animate-float">

                    {/* OUTER RING */}
                    <div className="absolute inset-[-45px] rounded-full border border-emerald-300/10" />

                    {/* SECOND RING */}
                    <div className="absolute inset-[-85px] rounded-full border border-emerald-300/5" />

                    {/* ICON */}
                    <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 text-emerald-200 shadow-2xl backdrop-blur-xl">

                      <Sparkles className="h-14 w-14" />

                    </div>

                  </div>

                </div>

                {/* BOTTOM */}
                <div className="animate-fade-up delay-300 max-w-md">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                    Cleaner Communities
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.03em] text-white">
                    Building a cleaner
                    <br />
                    Barangay together.
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-emerald-100/60">
                    Monitor environmental concerns, review community
                    reports, and help turn local problems into lasting
                    solutions.
                  </p>

                  {/* MINI FEATURES */}
                  <div className="mt-7 flex flex-wrap gap-2">

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-emerald-100/70">
                      Community Reports
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-emerald-100/70">
                      Environmental Action
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-gray-100 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          {/* BRAND */}
          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00A859] text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>

            <div>
              <span className="font-bold text-gray-900">
                eConcern
              </span>

              <p className="text-[11px] text-gray-400">
                Cleaner communities, together.
              </p>
            </div>

          </div>

          {/* COPYRIGHT */}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} eConcern · Barangay Barangca,
            Candaba, Pampanga
          </p>

        </div>
      </footer>

    </div>
  );
}
