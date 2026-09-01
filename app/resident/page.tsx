"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  FileText,
  ImagePlus,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

export default function ReportPage() {
  const [reportType, setReportType] = useState("Clogged Drainage");
  const [activeTab, setActiveTab] = useState("new");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setPhoto({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const removePhoto = () => {
    if (photo?.preview) {
      URL.revokeObjectURL(photo.preview);
    }

    setPhoto(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Connect your Supabase/API submission here.
    console.log({
      reportType,
      description,
      photo: photo?.file,
    });
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
            transform: translateX(25px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.7s ease-out both;
        }

        .animate-fade-right {
          animation: fadeRight 0.7s ease-out both;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
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

          {/* RIGHT SIDE NAVIGATION */}
          <div className="ml-auto flex items-center gap-5 lg:gap-8">

            {/* NAV LINKS */}
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

            {/* ADMIN LOGIN */}
            <a
              href="/login"
              className="hidden text-sm font-semibold text-gray-600 transition-colors hover:text-gray-950 sm:block"
            >
              Admin Login
            </a>

            {/* CURRENT PAGE BUTTON */}
            <div className="hidden rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-[#008F4B] sm:block">
              Submit Report
            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="relative">

        {/* BACKGROUND DECORATION */}
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-green-100/40 blur-3xl" />

        <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-14 sm:py-20">

          {/* =================================================
              HEADER
          ================================================== */}
          <div className="animate-fade-up text-center">

            {/* LOCATION */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">

              <MapPin className="h-3.5 w-3.5" />

              Barangay Barangca

              <span className="h-1 w-1 rounded-full bg-emerald-500" />

              Candaba, Pampanga

            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-6xl">
              See something?
              <br />

              <span className="text-[#00A859]">
                Say something.
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
              Help keep our community clean by reporting clogged drainage,
              illegal dumping, or uncollected trash directly to barangay
              officials.
            </p>

            {/* NO ACCOUNT NOTICE */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
              <ShieldCheck className="h-4 w-4 text-[#00A859]" />
              No account required to submit a report
            </div>

          </div>

          {/* =================================================
              TABS
          ================================================== */}
          <div className="animate-fade-up delay-100 mt-10 w-full">

            <div className="flex items-center justify-center border-b border-gray-200">

              {/* NEW REPORT */}
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`relative px-6 pb-4 text-sm font-semibold transition-colors ${
                  activeTab === "new"
                    ? "text-gray-950"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  File New Report
                </span>

                {activeTab === "new" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
                )}
              </button>

              {/* TRACK REPORT */}
              <button
                type="button"
                onClick={() => setActiveTab("track")}
                className={`relative px-6 pb-4 text-sm font-semibold transition-colors ${
                  activeTab === "track"
                    ? "text-gray-950"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Track My Reports
                </span>

                {activeTab === "track" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
                )}
              </button>

            </div>
          </div>

          {/* =================================================
              NEW REPORT TAB
          ================================================== */}
          {activeTab === "new" && (
            <form
              onSubmit={handleSubmit}
              className="animate-fade-up delay-200 mt-8 w-full rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(0,100,60,0.3)] sm:p-10"
            >

              {/* ===========================================
                  YOUR INFORMATION
              ============================================ */}
              <div>

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-gray-950">
                      Your Information
                    </h2>

                    <p className="text-xs text-gray-400">
                      Help us identify and verify your report.
                    </p>
                  </div>

                </div>

                {/* FULL NAME */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                {/* AGE + PUROK */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Age
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      placeholder="Your age"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Purok / Street
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="e.g. Purok 2"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                </div>

                {/* EMAIL + PHONE */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      placeholder="09XX XXX XXXX"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                </div>

                {/* INFO NOTICE */}
                <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800">
                  Your identity will remain unverified until a barangay
                  official confirms your details.
                </div>

              </div>

              {/* DIVIDER */}
              <div className="my-9 h-px bg-gray-100" />

              {/* ===========================================
                  REPORT DETAILS
              ============================================ */}
              <div>

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                    <Leaf className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-gray-950">
                      Report Details
                    </h2>

                    <p className="text-xs text-gray-400">
                      Tell us what environmental issue you observed.
                    </p>
                  </div>

                </div>

                {/* REPORT TYPE */}
                <div>

                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Report Category
                  </label>

                  <div className="relative">

                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    >
                      <option value="Clogged Drainage">
                        Clogged Drainage
                      </option>

                      <option value="Illegal Dumping">
                        Illegal Dumping
                      </option>

                      <option value="Uncollected Trash">
                        Uncollected Trash
                      </option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-4">

                  <div className="mb-1.5 flex items-center justify-between">

                    <label className="text-xs font-semibold text-gray-700">
                      Description
                    </label>

                    <span className="text-[11px] text-gray-400">
                      {description.length}/500
                    </span>

                  </div>

                  <textarea
                    rows={5}
                    maxLength={500}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue and include a nearby landmark..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />

                </div>

                {/* PHOTO UPLOAD */}
                <div className="mt-4">

                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Photo Evidence
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  {!photo ? (
                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 transition-all hover:border-emerald-300 hover:bg-emerald-50/50">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm transition-all group-hover:scale-105 group-hover:text-[#00A859]">
                        <ImagePlus className="h-5 w-5" />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-gray-700">
                        Upload a photo
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        JPG, PNG or WEBP · Maximum 5MB
                      </p>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />

                    </label>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gray-50">

                      <img
                        src={photo.preview}
                        alt="Report preview"
                        className="h-56 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900/80 text-white backdrop-blur transition hover:bg-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10">
                        <p className="text-xs font-medium text-white">
                          {photo.file.name}
                        </p>
                      </div>

                    </div>
                  )}

                </div>

              </div>

              {/* DIVIDER */}
              <div className="my-9 h-px bg-gray-100" />

              {/* SUBMIT */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A859] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#008F4B] hover:shadow-xl"
              >
                Submit Report

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* PRIVACY */}
              <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">
                By submitting this report, you confirm that the information
                provided is accurate to the best of your knowledge.
              </p>

            </form>
          )}

          {/* =================================================
              TRACK REPORTS TAB
          ================================================== */}
          {activeTab === "track" && (
            <div className="animate-fade-right mt-8 w-full">

              {/* TRACK CARD */}
              <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(0,100,60,0.3)] sm:p-10">

                <div className="text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#00A859]">
                    <BarChart3 className="h-6 w-6" />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-950">
                    Track Your Reports
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Enter your report reference number to check its current
                    status.
                  </p>

                </div>

                {/* REFERENCE INPUT */}
                <div className="mx-auto mt-8 max-w-md">

                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                    Report Reference Number
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <input
                      type="text"
                      placeholder="e.g. ECO-2026-0001"
                      className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <button
                      type="button"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A859] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#008F4B]"
                    >
                      Track

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>

                  </div>

                </div>

                {/* SAMPLE STATUS */}
                <div className="mt-10 rounded-2xl border border-gray-100 bg-[#F8FCFA] p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Example Report
                      </p>

                      <h3 className="mt-1 text-sm font-bold text-gray-900">
                        ECO-2026-0001
                      </h3>
                    </div>

                    <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700">
                      Under Review
                    </span>

                  </div>

                  {/* PROGRESS */}
                  <div className="mt-6">

                    <div className="flex items-center">

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00A859] text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                      <div className="h-1 flex-1 bg-[#00A859]" />

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00A859] text-white">
                        <ShieldCheck className="h-4 w-4" />
                      </div>

                      <div className="h-1 flex-1 bg-gray-200" />

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                    </div>

                    <div className="mt-2 flex justify-between text-[10px] text-gray-400">
                      <span>Submitted</span>
                      <span>Under Review</span>
                      <span>Resolved</span>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          )}

        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-gray-100 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">

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

          {/* FOOTER TEXT */}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} eConcern · Barangay Barangca,
            Candaba, Pampanga
          </p>

        </div>
      </footer>
    </div>
  );
}
