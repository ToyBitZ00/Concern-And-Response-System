"use client";

import React, { useState, useEffect } from "react";
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
  User,
  Loader2,
  Edit3,
  AlertCircle,
  Copy,
  Search,
  Clock,
  SearchX // <-- Added this new icon for the "Not Found" state
} from "lucide-react";

type PhotoData = {
  file: File;
  preview: string;
};

// Types for Tracking
type TrackedReport = {
  id: string;
  status: "Submitted" | "Pending" | "Viewed" | "Resolved";
  category: string;
  date: string;
};

export default function ReportPage() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("info");

  // Report Details State
  const [reportType, setReportType] = useState("Clogged Drainage");
  const [reportPurok, setReportPurok] = useState("");
  const [reportStreet, setReportStreet] = useState("");
  const [reportLandmark, setReportLandmark] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<PhotoData | null>(null);

  // Personal Information State
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [purok, setPurok] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Validation Error States
  const [errors, setErrors] = useState({
    fullName: "",
    age: "",
    email: "",
    phone: "",
    purok: "",
  });

  const [reportErrors, setReportErrors] = useState({
    reportPurok: "",
    reportStreet: "",
    description: "",
  });

  // Identity Verification & UI State
  const [isIdentityLocked, setIsIdentityLocked] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Submission & Tracking State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  
  // Tracking Search State
  const [trackInput, setTrackInput] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackedResult, setTrackedResult] = useState<TrackedReport | null>(null);
  const [trackError, setTrackError] = useState(false); // <-- New state for handling "Not Found"

  // =======================================================================
  // DEBOUNCE DELAY IMPLEMENTATION (Database check simulation)
  // =======================================================================
  useEffect(() => {
    if (email.length > 5 && !isIdentityLocked && !errors.email) {
      const delayDebounceFn = setTimeout(() => {
        console.log("Checking database for existing user:", email);
      }, 800);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [email, isIdentityLocked, errors.email]);

  // =======================================================================
  // REAL-TIME VALIDATION RULES
  // =======================================================================
  const validateName = (val: string) => {
    if (!val) return "";
    if (val.length > 0 && val.length < 4) return "Name must be at least 4 characters.";
    if (/(.)\1{3,}/.test(val)) return "Invalid name. Gibberish detected.";
    if (!/[aeiouAEIOU]/.test(val) && val.length >= 4) return "Invalid name. Vowels required.";
    return "";
  };

  const validateAge = (val: string) => {
    if (!val) return "";
    const num = parseInt(val);
    if (num < 1 || num > 120) return "Enter a valid age (1-120).";
    return "";
  };

  const validateLocationField = (val: string, fieldName: string) => {
    if (!val) return "";
    if (val.trim().length < 2) return `${fieldName} is required.`;
    return "";
  };

  const validateEmail = (val: string) => {
    if (!val) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return "Valid format required (e.g., user@domain.com).";
    return "";
  };

  const validatePhone = (val: string) => {
    if (!val) return "";
    if (val.length < 10) return "Must be 10 or 11 digits.";
    return "";
  };

  // =======================================================================
  // STRICT INPUT HANDLERS (Checks while typing)
  // =======================================================================
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^a-zA-Z\sñÑ\-\.]/g, "");
    setFullName(val);
    setErrors((prev) => ({ ...prev, fullName: validateName(val) }));
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setAge(val);
    setErrors((prev) => ({ ...prev, age: validateAge(val) }));
  };

  const handlePurokChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPurok(val);
    setErrors((prev) => ({ ...prev, purok: validateLocationField(val, "Purok/Street") }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setPhone(val);
    setErrors((prev) => ({ ...prev, phone: validatePhone(val) }));
  };

  const handleReportPurokChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setReportPurok(val);
    setReportErrors((prev) => ({ ...prev, reportPurok: validateLocationField(val, "Purok/Sitio") }));
  };

  const handleReportStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setReportStreet(val);
    setReportErrors((prev) => ({ ...prev, reportStreet: validateLocationField(val, "Street") }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setDescription(val);
    setReportErrors((prev) => ({ ...prev, description: val.trim() ? "" : "Description is required." }));
  };

  // =======================================================================
  // FINAL VERIFICATION LOGIC
  // =======================================================================
  const handleVerifyIdentity = () => {
    const nameErr = validateName(fullName) || (!fullName ? "Required field" : "");
    const ageErr = validateAge(age) || (!age ? "Required field" : "");
    const purokErr = validateLocationField(purok, "Purok/Street") || (!purok ? "Required field" : "");
    const emailErr = validateEmail(email) || (!email ? "Required field" : "");
    const phoneErr = validatePhone(phone) || (!phone ? "Required field" : "");

    if (nameErr || ageErr || purokErr || emailErr || phoneErr) {
      setErrors({ fullName: nameErr, age: ageErr, purok: purokErr, email: emailErr, phone: phoneErr });
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setIsIdentityLocked(true);
    }, 1200);
  };

  // =======================================================================
  // PHOTO & FORM SUBMISSION
  // =======================================================================
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto({ file, preview: URL.createObjectURL(file) });
  };

  const removePhoto = () => {
    if (photo?.preview) URL.revokeObjectURL(photo.preview);
    setPhoto(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rpErr = validateLocationField(reportPurok, "Purok/Sitio") || (!reportPurok ? "Required field" : "");
    const rsErr = validateLocationField(reportStreet, "Street") || (!reportStreet ? "Required field" : "");
    const dErr = !description.trim() ? "Required field" : "";

    if (rpErr || rsErr || dErr) {
      setReportErrors({ reportPurok: rpErr, reportStreet: rsErr, description: dErr });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const currentYear = new Date().getFullYear();
      const generatedId = Math.floor(Math.random() * 1000) + 1; 
      const referenceNumber = `ECO-${currentYear}-${generatedId}`;

      setSubmittedReference(referenceNumber);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleResetForm = () => {
    setReportType("Clogged Drainage");
    setReportPurok("");
    setReportStreet("");
    setReportLandmark("");
    setDescription("");
    removePhoto();
    setSubmittedReference(null);
  };

  const handleTrackNavigation = () => {
    if (submittedReference) {
      setTrackInput(submittedReference);
      handleTrackSubmit(submittedReference);
    }
    setActiveTab("track");
  };

  // =======================================================================
  // TRACKING LOGIC (WITH NOT FOUND STATE)
  // =======================================================================
  const handleTrackSubmit = (overrideId?: string) => {
    const searchId = overrideId || trackInput;
    if (!searchId) return;

    setIsTracking(true);
    setTrackError(false);
    setTrackedResult(null);
    
    // Simulate database lookup delay
    setTimeout(() => {
      // MOCK DATABASE CHECK: If the input doesn't start with "ECO-", trigger the "Not Found" error
      if (!searchId.toUpperCase().startsWith("ECO-")) {
        setTrackError(true);
        setIsTracking(false);
        return;
      }

      // If it passes, show the mocked result
      setTrackedResult({
        id: searchId.toUpperCase(),
        status: "Viewed", 
        category: reportType || "Environmental Concern",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      });
      setIsTracking(false);
    }, 1000);
  };

  const trackingSteps = ["Submitted", "Pending", "Viewed", "Resolved"];

  return (
    <div className="min-h-screen overflow-hidden bg-[#F6FBF8] font-sans text-gray-900 selection:bg-emerald-200">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(25px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-up { animation: fadeUp 0.7s ease-out both; }
        .animate-fade-right { animation: fadeRight 0.7s ease-out both; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-6 lg:px-8">
          <a href="/" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00A859] text-white shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="leading-none">
              <span className="text-lg font-bold tracking-tight text-gray-950">eConcern</span>
              <span className="ml-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#00A859]">Barangay</span>
            </div>
          </a>
          <div className="ml-auto flex items-center gap-5 lg:gap-8">
            <nav className="hidden items-center gap-6 lg:flex">
              <a href="/" className="group relative py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-950">
                Home
                <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-[#00A859] transition-all duration-300 group-hover:w-full" />
              </a>
            </nav>
            <div className="hidden h-7 w-px bg-gray-200 lg:block" />
            <a href="/login" className="hidden text-sm font-semibold text-gray-600 transition-colors hover:text-gray-950 sm:block">
              Admin Login
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative">
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-green-100/40 blur-3xl" />

        <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-14 sm:py-20">
          
          <div className="animate-fade-up text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <MapPin className="h-3.5 w-3.5" />
              Barangay Barangca
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              Candaba, Pampanga
            </div>
            <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-6xl">
              See something?
              <br />
              <span className="text-[#00A859]">Say something.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
              Help keep our community clean by reporting clogged drainage,
              illegal dumping, or uncollected trash directly to barangay officials.
            </p>
          </div>

          {/* TABS */}
          <div className="animate-fade-up delay-100 mt-10 w-full">
            <div className="flex flex-wrap items-center justify-center border-b border-gray-200">
              <button type="button" onClick={() => setActiveTab("info")} className={`relative px-4 sm:px-6 pb-4 text-sm font-semibold transition-colors ${activeTab === "info" ? "text-gray-950" : "text-gray-400 hover:text-gray-700"}`}>
                <span className="flex items-center gap-2"><User className="h-4 w-4" /> Your Information</span>
                {activeTab === "info" && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />}
              </button>

              <button type="button" onClick={() => setActiveTab("new")} className={`relative px-4 sm:px-6 pb-4 text-sm font-semibold transition-colors ${activeTab === "new" ? "text-gray-950" : "text-gray-400 hover:text-gray-700"}`}>
                <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> File New Report</span>
                {activeTab === "new" && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />}
              </button>

              <button type="button" onClick={() => setActiveTab("track")} className={`relative px-4 sm:px-6 pb-4 text-sm font-semibold transition-colors ${activeTab === "track" ? "text-gray-950" : "text-gray-400 hover:text-gray-700"}`}>
                <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Track My Reports</span>
                {activeTab === "track" && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />}
              </button>
            </div>
          </div>

          {/* FORM WRAPPER */}
          {(activeTab === "info" || activeTab === "new") && (
            <form onSubmit={handleSubmit} className="animate-fade-up delay-200 mt-8 w-full rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(0,100,60,0.3)] sm:p-10">
              
              {/* TAB 1: YOUR INFORMATION */}
              {activeTab === "info" && (
                <div className="animate-fade-right">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-950">Your Information</h2>
                      <p className="text-xs text-gray-400">
                        {isIdentityLocked ? "Review your verified details below." : "Help us identify and verify your report."}
                      </p>
                    </div>
                  </div>

                  {!isIdentityLocked ? (
                    <>
                      {/* FULL NAME */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-700">Full Name</label>
                        <input type="text" required value={fullName} onChange={handleNameChange} placeholder="Enter your full name" className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-4 ${errors.fullName ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-[#00A859] focus:ring-emerald-500/10"}`} />
                        {errors.fullName && <p className="mt-1.5 text-[11px] font-medium text-red-500">{errors.fullName}</p>}
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* AGE */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-gray-700">Age</label>
                          <input type="text" maxLength={3} required value={age} onChange={handleAgeChange} placeholder="Your age" className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-4 ${errors.age ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-[#00A859] focus:ring-emerald-500/10"}`} />
                          {errors.age && <p className="mt-1.5 text-[11px] font-medium text-red-500">{errors.age}</p>}
                        </div>
                        {/* PUROK */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-gray-700">Purok / Street</label>
                          <input type="text" required value={purok} onChange={handlePurokChange} placeholder="e.g. Purok 2" className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-4 ${errors.purok ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-[#00A859] focus:ring-emerald-500/10"}`} />
                          {errors.purok && <p className="mt-1.5 text-[11px] font-medium text-red-500">{errors.purok}</p>}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* EMAIL */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-gray-700">Email</label>
                          <input type="email" required value={email} onChange={handleEmailChange} placeholder="you@example.com" className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-4 ${errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-[#00A859] focus:ring-emerald-500/10"}`} />
                          {errors.email && <p className="mt-1.5 text-[11px] font-medium text-red-500">{errors.email}</p>}
                        </div>
                        {/* PHONE */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-gray-700">Phone Number</label>
                          <input type="tel" maxLength={11} required value={phone} onChange={handlePhoneChange} placeholder="09XX XXX XXXX" className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-4 ${errors.phone ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-[#00A859] focus:ring-emerald-500/10"}`} />
                          {errors.phone && <p className="mt-1.5 text-[11px] font-medium text-red-500">{errors.phone}</p>}
                        </div>
                      </div>

                      <div className="mt-8">
                        <button type="button" onClick={handleVerifyIdentity} disabled={isChecking} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A859] py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#008F4B] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0">
                          {isChecking ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : <>Verify your Identity <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></>}
                        </button>
                      </div>
                    </>
                  ) : (
                    /* SUMMARY CARD */
                    <div className="animate-fade-up">
                      <div className="rounded-2xl border border-emerald-100 bg-[#F6FBF8] p-5 sm:p-6">
                        <div className="mb-6 flex items-start justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
                              <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                <AlertCircle className="h-3.5 w-3.5" /> Unverified
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Awaiting admin verification for official resident status.</p>
                          </div>
                          <button type="button" onClick={() => setIsIdentityLocked(false)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 border-t border-emerald-100/50 pt-5 sm:grid-cols-2 sm:gap-6">
                          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Email Address</p><p className="mt-1 text-sm font-medium text-gray-900">{email}</p></div>
                          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Phone Number</p><p className="mt-1 text-sm font-medium text-gray-900">{phone}</p></div>
                          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Age</p><p className="mt-1 text-sm font-medium text-gray-900">{age} years old</p></div>
                          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Location</p><p className="mt-1 text-sm font-medium text-gray-900">{purok}</p></div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <button type="button" onClick={() => setActiveTab("new")} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800">
                          Next: Report Details
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: REPORT DETAILS */}
              {activeTab === "new" && (
                <div className="animate-fade-right">
                  {!submittedReference ? (
                    // --- STANDARD SUBMISSION FORM ---
                    <>
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                          <Leaf className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-gray-950">Report Details</h2>
                          <p className="text-xs text-gray-400">Tell us what environmental issue you observed.</p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-700">Report Category</label>
                        <div className="relative">
                          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10">
                            <option value="Clogged Drainage">Clogged Drainage</option>
                            <option value="Illegal Dumping">Illegal Dumping</option>
                            <option value="Uncollected Trash">Uncollected Trash</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      {/* --- NEW LOCATION FIELDS --- */}
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* PUROK / SITIO */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-gray-700">Purok / Sitio</label>
                          <input 
                            type="text" 
                            required 
                            value={reportPurok} 
                            onChange={handleReportPurokChange} 
                            placeholder="e.g. Purok 1" 
                            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-4 ${reportErrors.reportPurok ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-[#00A859] focus:ring-emerald-500/10"}`} 
                          />
                          {reportErrors.reportPurok && <p className="mt-1.5 text-[11px] font-medium text-red-500">{reportErrors.reportPurok}</p>}
                        </div>
                        
                        {/* STREET */}
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-gray-700">Street</label>
                          <input 
                            type="text" 
                            required 
                            value={reportStreet} 
                            onChange={handleReportStreetChange} 
                            placeholder="e.g. Main Street" 
                            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-4 ${reportErrors.reportStreet ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-[#00A859] focus:ring-emerald-500/10"}`} 
                          />
                          {reportErrors.reportStreet && <p className="mt-1.5 text-[11px] font-medium text-red-500">{reportErrors.reportStreet}</p>}
                        </div>
                      </div>

                      {/* LANDMARK (Optional) */}
                      <div className="mt-4">
                        <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                          Landmark <span className="ml-1 font-normal text-gray-400">(Optional)</span>
                        </label>
                        <input 
                          type="text" 
                          value={reportLandmark} 
                          onChange={(e) => setReportLandmark(e.target.value)} 
                          placeholder="e.g. Near the barangay hall, beside the waiting shed..." 
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10" 
                        />
                      </div>

                      {/* DESCRIPTION */}
                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between">
                          <label className="text-xs font-semibold text-gray-700">Description</label>
                          <span className="text-[11px] text-gray-400">{description.length}/500</span>
                        </div>
                        <textarea 
                          rows={5} 
                          maxLength={500} 
                          required 
                          value={description} 
                          onChange={handleDescriptionChange} 
                          placeholder="Provide additional details about the environmental concern..." 
                          className={`w-full resize-none rounded-xl border bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:bg-white focus:ring-4 ${reportErrors.description ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200 focus:border-[#00A859] focus:ring-emerald-500/10"}`} 
                        />
                        {reportErrors.description && <p className="mt-1.5 text-[11px] font-medium text-red-500">{reportErrors.description}</p>}
                      </div>

                      <div className="mt-4">
                        <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                          Photo Evidence <span className="ml-1 font-normal text-gray-400">(Optional)</span>
                        </label>
                        {!photo ? (
                          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 transition-all hover:border-emerald-300 hover:bg-emerald-50/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm transition-all group-hover:scale-105 group-hover:text-[#00A859]">
                              <ImagePlus className="h-5 w-5" />
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-700">Upload a photo</p>
                            <p className="mt-1 text-xs text-gray-400">JPG, PNG or WEBP · Maximum 5MB</p>
                            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
                          </label>
                        ) : (
                          <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gray-50">
                            <img src={photo.preview} alt="Report preview" className="h-56 w-full object-cover" />
                            <button type="button" onClick={removePhoto} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900/80 text-white backdrop-blur transition hover:bg-red-500">
                              <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10">
                              <p className="text-xs font-medium text-white">{photo.file.name}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-8">
                        <button type="submit" disabled={isSubmitting || !isIdentityLocked} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A859] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#008F4B] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0">
                          {isSubmitting ? (
                             <><Loader2 className="h-4 w-4 animate-spin" /> Submitting Report...</>
                          ) : (
                             <>Submit Report <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></>
                          )}
                        </button>
                        {!isIdentityLocked && (
                           <p className="mt-3 text-center text-[11px] font-medium text-red-500">
                             Please verify your identity in the "Your Information" tab before submitting.
                           </p>
                        )}
                        <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">
                          By submitting this report, you confirm that the information provided is accurate to the best of your knowledge.
                        </p>
                      </div>
                    </>
                  ) : (
                    // --- SUCCESS CONFIRMATION VIEW ---
                    <div className="animate-fade-up py-6 text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[#00A859]">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      
                      <h2 className="mt-6 text-2xl font-bold text-gray-950">Report Submitted!</h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Thank you! Your environmental concern has been securely sent to the barangay officials.
                      </p>

                      <div className="mx-auto mt-8 inline-flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50/50 px-8 py-5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                          Your Reference Number
                        </span>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-2xl font-black text-gray-900">{submittedReference}</span>
                          <button 
                            type="button" 
                            onClick={() => navigator.clipboard.writeText(submittedReference)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm transition-colors hover:text-[#00A859]"
                            title="Copy to clipboard"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="mt-3 max-w-xs text-center text-[11px] text-gray-500">
                          Please take note of this tracking number to track the status of your report.
                        </span>
                      </div>

                      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                          type="button"
                          onClick={handleTrackNavigation}
                          className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800"
                        >
                          <BarChart3 className="h-4 w-4" /> Track this Report
                        </button>
                        <button
                          type="button"
                          onClick={handleResetForm}
                          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 transition-all duration-300 hover:bg-gray-50"
                        >
                          File Another Report
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}

          {/* TAB 3: TRACK REPORTS */}
          {activeTab === "track" && (
            <div className="animate-fade-right mt-8 w-full">
              <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(0,100,60,0.3)] sm:p-10">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#00A859]">
                    <Search className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-950">Track Your Reports</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Enter your report reference number to check its current status.
                  </p>
                </div>
                
                {/* SEARCH INPUT */}
                <div className="mx-auto mt-8 max-w-md">
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Report Reference Number</label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input 
                      type="text" 
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTrackSubmit()}
                      placeholder="e.g. ECO-2026-0001" 
                      className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10" 
                    />
                    <button 
                      type="button" 
                      onClick={() => handleTrackSubmit()}
                      disabled={isTracking || !trackInput.trim()}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A859] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#008F4B] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isTracking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
                    </button>
                  </div>
                </div>

                {/* ERROR CARD (NOT FOUND) */}
                {trackError && !isTracking && (
                  <div className="animate-fade-up mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <SearchX className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-gray-900">Report Not Found</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      We couldn't find a record for that tracking number. Please check if you typed it correctly or file a new report.
                    </p>
                  </div>
                )}

                {/* TRACKING RESULT CARD */}
                {trackedResult && !trackError && (
                  <div className="animate-fade-up mt-10 rounded-2xl border border-emerald-100 bg-[#F8FCFA] p-6 sm:p-8">
                    
                    {/* Header Info */}
                    <div className="flex flex-col gap-4 border-b border-emerald-100/50 pb-6 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                          {trackedResult.category}
                        </p>
                        <h3 className="mt-1 text-xl font-black text-gray-900">
                          {trackedResult.id}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Clock className="h-3.5 w-3.5" /> Date Submitted: {trackedResult.date}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                        trackedResult.status === "Resolved" ? "bg-emerald-100 text-emerald-700" :
                        trackedResult.status === "Viewed" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                        "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {trackedResult.status}
                      </span>
                    </div>

                    {/* Stepper Progress */}
                    <div className="mt-8">
                      <div className="relative flex items-center justify-between">
                        {/* Connecting Line Background */}
                        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-gray-200"></div>
                        
                        {/* Active Connecting Line */}
                        <div 
                          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-[#00A859] transition-all duration-500"
                          style={{ width: `${(trackingSteps.indexOf(trackedResult.status) / (trackingSteps.length - 1)) * 100}%` }}
                        ></div>

                        {/* Steps */}
                        {trackingSteps.map((step, index) => {
                          const currentIndex = trackingSteps.indexOf(trackedResult.status);
                          const isCompleted = index <= currentIndex;
                          const isActive = index === currentIndex;

                          return (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#F8FCFA] transition-colors duration-300 ${
                                isCompleted ? "bg-[#00A859] text-white" : "bg-gray-200 text-gray-400"
                              }`}>
                                {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-white" />}
                              </div>
                              <span className={`absolute -bottom-6 text-[10px] sm:text-xs font-semibold ${
                                isActive ? "text-[#00A859]" : isCompleted ? "text-gray-700" : "text-gray-400"
                              }`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Dynamic Message based on status */}
                    <div className="mt-12 rounded-xl bg-white p-4 text-center shadow-sm">
                      <p className="text-sm text-gray-600">
                        {trackedResult.status === "Submitted" && "Your report has been received and is waiting in the queue."}
                        {trackedResult.status === "Pending" && "A barangay official is currently reviewing your submission."}
                        {trackedResult.status === "Viewed" && "Your report has been viewed by authorities and action is being planned."}
                        {trackedResult.status === "Resolved" && "This issue has been successfully resolved. Thank you for keeping our community clean!"}
                      </p>
                    </div>

                  </div>
                )}
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}