"use client";

/* eslint-disable react/no-unescaped-entities */

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Filter,
  LogOut,
  Mail,
  Phone,
  Plus,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

type AccountView = "Residents" | "Admins";

type Resident = {
  id: string;
  name: string;
  email: string;
  phone: string;
  purok: string;
  age: number;
  status: "Verified" | "Unverified";
  joined: string;
};

type Admin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "superadmin";
  joined: string;
};

type SuperAdminProfile = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
};

const DEFAULT_SUPER_ADMIN_PROFILE: SuperAdminProfile = {
  fullName: "Super Admin",
  email: "superadmin@barangca.gov.ph",
  phone: "Not provided",
  role: "System Administrator",
};

export default function SuperAdminPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<AccountView>("Residents");

  const [residents, setResidents] = useState<Resident[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loadingResidents, setLoadingResidents] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  const [residentSearch, setResidentSearch] = useState("");
  const [residentStatusFilter, setResidentStatusFilter] = useState("All");
  const [residentSortBy, setResidentSortBy] = useState("Newest");

  const [adminSearch, setAdminSearch] = useState("");
  const [adminRoleFilter, setAdminRoleFilter] = useState("All");
  const [adminSortBy, setAdminSortBy] = useState("Newest");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [superAdminProfile, setSuperAdminProfile] =
    useState<SuperAdminProfile>(DEFAULT_SUPER_ADMIN_PROFILE);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Create admin modal state
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [createAdminError, setCreateAdminError] = useState<string | null>(null);

  /* =========================================================
     DATA FETCHING
  ========================================================= */

  const fetchResidents = useCallback(async () => {
    setLoadingResidents(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, phone, purok, age, verification_status, created_at"
      )
      .eq("role", "resident")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setResidents(
        data.map((r) => ({
          id: r.id,
          name: r.full_name ?? "—",
          email: r.email ?? "—",
          phone: r.phone ?? "—",
          purok: r.purok ?? "—",
          age: r.age ?? 0,
          status:
            r.verification_status === "verified" ? "Verified" : "Unverified",
          joined: r.created_at
            ? new Date(r.created_at).toLocaleDateString()
            : "—",
        }))
      );
    } else if (error) {
      console.error("Failed to fetch residents:", error.message);
    }
    setLoadingResidents(false);
  }, []);

  const fetchAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, role, created_at")
      .in("role", ["admin", "superadmin"])
      .order("created_at", { ascending: false });

    if (!error && data) {
      setAdmins(
        data.map((a) => ({
          id: a.id,
          name: a.full_name ?? "—",
          email: a.email ?? "—",
          phone: a.phone ?? "—",
          role: a.role as "admin" | "superadmin",
          joined: a.created_at
            ? new Date(a.created_at).toLocaleDateString()
            : "—",
        }))
      );
    } else if (error) {
      console.error("Failed to fetch admins:", error.message);
    }
    setLoadingAdmins(false);
  }, []);

  useEffect(() => {
    const loadAccounts = async () => {
      await Promise.all([fetchResidents(), fetchAdmins()]);
    };

    loadAccounts();
  }, [fetchResidents, fetchAdmins]);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, role")
        .eq("id", user.id)
        .maybeSingle();

      setSuperAdminProfile({
        fullName: data?.full_name ?? user.email ?? "Super Admin",
        email: data?.email ?? user.email ?? "Not provided",
        phone: data?.phone ?? "Not provided",
        role:
          data?.role === "superadmin"
            ? "Super Administrator"
            : "System Administrator",
      });
    };

    loadProfile();
  }, []);

  /* =========================================================
     ACTIONS
  ========================================================= */

  const handleVerifyResident = async (
    residentId: string,
    newStatus: "verified" | "rejected"
  ) => {
    const supabase = createClient();
    const { error } = await supabase.rpc("set_resident_verification", {
      resident_id: residentId,
      new_status: newStatus,
    });

    if (error) {
      alert(`Failed to update: ${error.message}`);
      return;
    }

    fetchResidents();
  };

  const handleCreateAdmin = async () => {
    setCreatingAdmin(true);
    setCreateAdminError(null);

    try {
      const res = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdminForm),
      });

      const result = await res.json();

      if (!res.ok) {
        setCreateAdminError(result.error ?? "Something went wrong");
        setCreatingAdmin(false);
        return;
      }

      setShowCreateAdmin(false);
      setNewAdminForm({ full_name: "", email: "", password: "" });
      fetchAdmins();
    } catch {
      setCreateAdminError("Network error — please try again.");
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (authData.user) {
      await supabase
        .from("profiles")
        .update({
          full_name: superAdminProfile.fullName,
          phone: superAdminProfile.phone,
        })
        .eq("id", authData.user.id);
    }

    setProfileModalOpen(false);
  };

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    });

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPasswordError(null);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setPasswordModalOpen(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfileMenuOpen(false);
    router.push("/login");
  };

  /* =========================================================
     DERIVED STATE
  ========================================================= */

  const verifiedCount = residents.filter(
    (resident) => resident.status === "Verified"
  ).length;

  const unverifiedCount = residents.filter(
    (resident) => resident.status === "Unverified"
  ).length;

  const superAdminCount = admins.filter(
    (admin) => admin.role === "superadmin"
  ).length;

  const filteredResidents = useMemo(() => {
    let data = residents.filter((resident) => {
      const searchValue = residentSearch.toLowerCase();

      const matchesSearch =
        resident.name.toLowerCase().includes(searchValue) ||
        resident.email.toLowerCase().includes(searchValue) ||
        resident.purok.toLowerCase().includes(searchValue);

      const matchesStatus =
        residentStatusFilter === "All" ||
        resident.status === residentStatusFilter;

      return matchesSearch && matchesStatus;
    });

    if (residentSortBy === "Name") {
      data = [...data].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (residentSortBy === "Oldest") {
      data = [...data].reverse();
    }

    return data;
  }, [residents, residentSearch, residentStatusFilter, residentSortBy]);

  const filteredAdmins = useMemo(() => {
    let data = admins.filter((admin) => {
      const searchValue = adminSearch.toLowerCase();

      const matchesSearch =
        admin.name.toLowerCase().includes(searchValue) ||
        admin.email.toLowerCase().includes(searchValue);

      const matchesRole =
        adminRoleFilter === "All" || admin.role === adminRoleFilter;

      return matchesSearch && matchesRole;
    });

    if (adminSortBy === "Name") {
      data = [...data].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (adminSortBy === "Oldest") {
      data = [...data].reverse();
    }

    return data;
  }, [admins, adminSearch, adminRoleFilter, adminSortBy]);

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");

  return (
    <div className="min-h-screen bg-[#F6FBF8] font-sans text-gray-900 selection:bg-emerald-200">
      {/* =====================================================
          ANIMATIONS
      ====================================================== */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-fade-up { animation: fadeUp 0.6s ease-out both; }
        .animate-fade-right { animation: fadeRight 0.6s ease-out both; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="sticky top-0 z-50 border-b border-emerald-100/70 bg-white/90 shadow-sm shadow-emerald-950/5 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-7xl flex-col gap-3 px-5 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <Link href="/" className="group flex items-center gap-3 self-start lg:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A859] text-white shadow-sm shadow-emerald-900/20 transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="text-left leading-none">
              <span className="block text-lg font-bold tracking-tight text-gray-950">
                eConcern
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#00A859]">
                Super Admin
              </span>
            </div>
          </Link>

          <div className="flex w-full items-center gap-4 lg:ml-auto lg:w-auto lg:gap-8">
            <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl border border-emerald-100 bg-white/70 p-1 shadow-inner lg:flex-none">
              <button
                type="button"
                onClick={() => setActiveView("Residents")}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-bold transition sm:px-4 ${
                  activeView === "Residents"
                    ? "bg-[#00A859] text-white shadow-sm"
                    : "text-slate-500 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                <Users className="h-4 w-4" />
                Resident Accounts
              </button>

              <button
                type="button"
                onClick={() => setActiveView("Admins")}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-bold transition sm:px-4 ${
                  activeView === "Admins"
                    ? "bg-[#00A859] text-white shadow-sm"
                    : "text-slate-500 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Accounts
              </button>
            </nav>

            <div className="hidden h-7 w-px bg-gray-200 lg:block" />

            <div className="relative block shrink-0">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
                className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-white/80 sm:gap-3 sm:px-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-[#00A859] ring-1 ring-emerald-100 sm:h-9 sm:w-9">
                  <UserRound className="h-4 w-4" />
                </div>

                <div className="hidden text-left lg:block">
                  <p className="text-xs font-bold text-gray-900">
                    {superAdminProfile.fullName}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {superAdminProfile.role}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-12 z-[80] w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                  <div className="border-b border-slate-100 bg-emerald-50/60 px-4 py-4">
                    <p className="text-sm font-bold text-slate-950">
                      {superAdminProfile.fullName}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {superAdminProfile.email}
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-slate-600 transition hover:bg-emerald-50 hover:text-[#008F4B]"
                    >
                      <UserRound className="h-4 w-4" />
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setPasswordModalOpen(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-slate-600 transition hover:bg-emerald-50 hover:text-[#008F4B]"
                    >
                      <Settings className="h-4 w-4" />
                      Change Password
                    </button>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-green-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
          {/* =================================================
              RESIDENT ACCOUNTS
          ================================================== */}
          {activeView === "Residents" && (
            <div key="residents">
              <div className="animate-fade-up flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A859]">
                    <ShieldCheck className="h-4 w-4" />
                    System Administration
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-950 sm:text-4xl">
                    Resident Accounts
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                    Manage resident accounts, review verification status, and
                    maintain accurate community records.
                  </p>
                </div>

                <div className="animate-float flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Total Residents
                    </p>
                    <p className="text-lg font-extrabold text-gray-950">
                      {residents.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="animate-fade-up delay-100 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-700">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      All Accounts
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-extrabold text-gray-950">
                    {residents.length}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Registered residents
                  </p>
                </div>

                <div className="animate-fade-up delay-200 rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      VERIFIED
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-extrabold text-gray-950">
                    {verifiedCount}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Verified residents
                  </p>
                </div>

                <div className="animate-fade-up delay-300 rounded-2xl border border-amber-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                      NEEDS REVIEW
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-extrabold text-gray-950">
                    {unverifiedCount}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Awaiting verification
                  </p>
                </div>
              </div>

              <section className="animate-fade-up delay-400 mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_20px_60px_-35px_rgba(0,100,60,0.3)]">
                <div className="border-b border-gray-100 p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-base font-bold text-gray-950">
                        Resident Directory
                      </h2>
                      <p className="mt-1 text-xs text-gray-400">
                        Review and manage registered residents.
                      </p>
                    </div>

                    <div className="relative w-full lg:max-w-xs">
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={residentSearch}
                        onChange={(e) => setResidentSearch(e.target.value)}
                        placeholder="Search residents..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Filter className="h-3.5 w-3.5" />
                      Filter:
                    </div>

                    <div className="relative">
                      <select
                        value={residentStatusFilter}
                        onChange={(e) =>
                          setResidentStatusFilter(e.target.value)
                        }
                        className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-xs font-semibold text-gray-600 outline-none focus:border-[#00A859]"
                      >
                        <option value="All">All Status</option>
                        <option value="Verified">Verified</option>
                        <option value="Unverified">Unverified</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="relative">
                      <select
                        value={residentSortBy}
                        onChange={(e) => setResidentSortBy(e.target.value)}
                        className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-xs font-semibold text-gray-600 outline-none focus:border-[#00A859]"
                      >
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                        <option value="Name">Name A-Z</option>
                      </select>
                      <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    </div>

                    <span className="ml-auto text-xs text-gray-400">
                      Showing{" "}
                      <span className="font-bold text-gray-700">
                        {filteredResidents.length}
                      </span>{" "}
                      residents
                    </span>
                  </div>
                </div>

                {loadingResidents ? (
                  <div className="px-6 py-16 text-center text-sm text-gray-400">
                    Loading residents…
                  </div>
                ) : (
                  <>
                    {/* DESKTOP TABLE */}
                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full text-left">
                        <thead className="border-b border-gray-100 bg-[#F8FCFA]">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Resident
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Contact
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Location
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Status
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Joined
                            </th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredResidents.map((resident) => (
                            <tr
                              key={resident.id}
                              className="group transition-colors hover:bg-emerald-50/40"
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#00A859]">
                                    {initials(resident.name)}
                                  </div>
                                  <p className="text-sm font-bold text-gray-900">
                                    {resident.name}
                                  </p>
                                </div>
                              </td>

                              <td className="px-6 py-5">
                                <p className="text-xs font-medium text-gray-700">
                                  {resident.email}
                                </p>
                                <p className="mt-1 text-[11px] text-gray-400">
                                  {resident.phone}
                                </p>
                              </td>

                              <td className="px-6 py-5">
                                <p className="text-xs font-semibold text-gray-700">
                                  {resident.purok}
                                </p>
                                <p className="mt-1 text-[11px] text-gray-400">
                                  Age {resident.age}
                                </p>
                              </td>

                              <td className="px-6 py-5">
                                {resident.status === "Verified" ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-700">
                                    <XCircle className="h-3.5 w-3.5" />
                                    Unverified
                                  </span>
                                )}
                              </td>

                              <td className="px-6 py-5">
                                <span className="text-xs text-gray-500">
                                  {resident.joined}
                                </span>
                              </td>

                              <td className="px-6 py-5">
                                {resident.status === "Unverified" ? (
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleVerifyResident(
                                          resident.id,
                                          "verified"
                                        )
                                      }
                                      className="rounded-lg bg-[#00A859] px-3 py-2 text-[11px] font-bold text-white transition hover:bg-[#008F4B]"
                                    >
                                      Verify
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleVerifyResident(
                                          resident.id,
                                          "rejected"
                                        )
                                      }
                                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-[11px] font-bold text-red-600 transition hover:bg-red-50"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleVerifyResident(
                                          resident.id,
                                          "rejected"
                                        )
                                      }
                                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-600 opacity-0 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                                    >
                                      Revoke
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE CARDS */}
                    <div className="divide-y divide-gray-100 md:hidden">
                      {filteredResidents.map((resident) => (
                        <div
                          key={resident.id}
                          className="p-5 transition-colors hover:bg-emerald-50/40"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#00A859]">
                                {initials(resident.name)}
                              </div>
                              <p className="text-sm font-bold text-gray-900">
                                {resident.name}
                              </p>
                            </div>

                            {resident.status === "Verified" ? (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                                <CheckCircle2 className="h-3 w-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">
                                <XCircle className="h-3 w-3" />
                                Unverified
                              </span>
                            )}
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3">
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                Email
                              </p>
                              <p className="mt-1 truncate text-[11px] font-medium text-gray-700">
                                {resident.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                Location
                              </p>
                              <p className="mt-1 text-[11px] font-medium text-gray-700">
                                {resident.purok}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                Phone
                              </p>
                              <p className="mt-1 text-[11px] font-medium text-gray-700">
                                {resident.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                Joined
                              </p>
                              <p className="mt-1 text-[11px] font-medium text-gray-700">
                                {resident.joined}
                              </p>
                            </div>
                          </div>

                          {resident.status === "Unverified" && (
                            <div className="mt-4 flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleVerifyResident(resident.id, "verified")
                                }
                                className="flex-1 rounded-xl bg-[#00A859] py-2.5 text-xs font-bold text-white transition hover:bg-[#008F4B]"
                              >
                                Verify
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleVerifyResident(resident.id, "rejected")
                                }
                                className="flex-1 rounded-xl border border-red-200 bg-white py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {filteredResidents.length === 0 && (
                      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                          <Search className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-sm font-bold text-gray-900">
                          No residents found
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          Try changing your search or filter.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </section>

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00A859]" />
                Resident information is restricted to authorized barangay
                personnel.
              </div>
            </div>
          )}

          {/* =================================================
              ADMIN ACCOUNTS
          ================================================== */}
          {activeView === "Admins" && (
            <div key="admins">
              <div className="animate-fade-up flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A859]">
                    <ShieldCheck className="h-4 w-4" />
                    System Administration
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-950 sm:text-4xl">
                    Admin Accounts
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                    Manage authorized system administrators and barangay
                    personnel with access to eConcern.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="animate-float flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Total Admins
                      </p>
                      <p className="text-lg font-extrabold text-gray-950">
                        {admins.length}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCreateAdmin(true)}
                    className="flex items-center gap-2 rounded-2xl bg-[#00A859] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#008F4B]"
                  >
                    <Plus className="h-4 w-4" />
                    New Admin
                  </button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="animate-fade-up delay-100 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-700">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      All Accounts
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-extrabold text-gray-950">
                    {admins.length}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Registered administrators
                  </p>
                </div>

                <div className="animate-fade-up delay-200 rounded-2xl border border-amber-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                      PRIVILEGED
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-extrabold text-gray-950">
                    {superAdminCount}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Super administrators
                  </p>
                </div>
              </div>

              <section className="animate-fade-up delay-400 mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_20px_60px_-35px_rgba(0,100,60,0.3)]">
                <div className="border-b border-gray-100 p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-base font-bold text-gray-950">
                        Administrator Directory
                      </h2>
                      <p className="mt-1 text-xs text-gray-400">
                        Review and manage authorized administrator accounts.
                      </p>
                    </div>

                    <div className="relative w-full lg:max-w-xs">
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        placeholder="Search administrators..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Filter className="h-3.5 w-3.5" />
                      Filter:
                    </div>

                    <div className="relative">
                      <select
                        value={adminRoleFilter}
                        onChange={(e) => setAdminRoleFilter(e.target.value)}
                        className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-xs font-semibold text-gray-600 outline-none focus:border-[#00A859]"
                      >
                        <option value="All">All Roles</option>
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    </div>

                    <div className="relative">
                      <select
                        value={adminSortBy}
                        onChange={(e) => setAdminSortBy(e.target.value)}
                        className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-xs font-semibold text-gray-600 outline-none focus:border-[#00A859]"
                      >
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                        <option value="Name">Name A-Z</option>
                      </select>
                      <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    </div>

                    <span className="ml-auto text-xs text-gray-400">
                      Showing{" "}
                      <span className="font-bold text-gray-700">
                        {filteredAdmins.length}
                      </span>{" "}
                      administrators
                    </span>
                  </div>
                </div>

                {loadingAdmins ? (
                  <div className="px-6 py-16 text-center text-sm text-gray-400">
                    Loading administrators…
                  </div>
                ) : (
                  <>
                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full text-left">
                        <thead className="border-b border-gray-100 bg-[#F8FCFA]">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Administrator
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Contact
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Role
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Joined
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredAdmins.map((admin) => (
                            <tr
                              key={admin.id}
                              className="transition-colors hover:bg-emerald-50/40"
                            >
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#00A859]">
                                    {initials(admin.name)}
                                  </div>
                                  <p className="text-sm font-bold text-gray-900">
                                    {admin.name}
                                  </p>
                                </div>
                              </td>

                              <td className="px-6 py-5">
                                <p className="text-xs font-medium text-gray-700">
                                  {admin.email}
                                </p>
                                <p className="mt-1 text-[11px] text-gray-400">
                                  {admin.phone}
                                </p>
                              </td>

                              <td className="px-6 py-5">
                                {admin.role === "superadmin" ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1.5 text-[10px] font-bold text-violet-700">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Super Admin
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
                                    <UserCheck className="h-3.5 w-3.5" />
                                    Admin
                                  </span>
                                )}
                              </td>

                              <td className="px-6 py-5">
                                <span className="text-xs text-gray-500">
                                  {admin.joined}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="divide-y divide-gray-100 md:hidden">
                      {filteredAdmins.map((admin) => (
                        <div key={admin.id} className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#00A859]">
                              {initials(admin.name)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {admin.name}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {admin.role === "superadmin"
                                  ? "Super Admin"
                                  : "Admin"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3">
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                Email
                              </p>
                              <p className="mt-1 truncate text-[11px] font-medium text-gray-700">
                                {admin.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                Joined
                              </p>
                              <p className="mt-1 text-[11px] font-medium text-gray-700">
                                {admin.joined}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredAdmins.length === 0 && (
                      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                          <Search className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-sm font-bold text-gray-900">
                          No administrators found
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          Try changing your search or filter.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </section>

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-[#00A859]" />
                Administrator access is restricted to authorized system
                personnel.
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          PROFILE MODAL
      ====================================================== */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-emerald-100 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                  Profile
                </p>
                <h3 className="mt-1 text-lg font-bold text-gray-950">
                  Super Admin Profile
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="px-6 py-6">
              <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                  <Mail className="h-4 w-4 text-[#00A859]" />
                  <span className="truncate text-xs font-semibold text-gray-600">
                    {superAdminProfile.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                  <ShieldCheck className="h-4 w-4 text-[#00A859]" />
                  <span className="truncate text-xs font-semibold text-gray-600">
                    {superAdminProfile.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={superAdminProfile.fullName}
                    onChange={(event) =>
                      setSuperAdminProfile((profile) => ({
                        ...profile,
                        fullName: event.target.value,
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                    Phone Number
                  </span>
                  <div className="relative mt-2">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={superAdminProfile.phone}
                      onChange={(event) =>
                        setSuperAdminProfile((profile) => ({
                          ...profile,
                          phone: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 pl-9 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </label>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 transition hover:border-emerald-200 hover:text-[#008F4B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A859] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#008F4B]"
                >
                  <Save className="h-4 w-4" />
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CHANGE PASSWORD MODAL
      ====================================================== */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                  Settings
                </p>
                <h3 className="mt-1 text-lg font-bold text-gray-950">
                  Change Password
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 px-6 py-6">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                  New Password
                </span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((form) => ({
                      ...form,
                      newPassword: event.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">
                  Confirm New Password
                </span>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((form) => ({
                      ...form,
                      confirmPassword: event.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              {passwordError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                  {passwordError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 transition hover:border-emerald-200 hover:text-[#008F4B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A859] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#008F4B]"
                >
                  <Save className="h-4 w-4" />
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE ADMIN MODAL
      ====================================================== */}
      {showCreateAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-950">
                Create Admin Account
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowCreateAdmin(false);
                  setCreateAdminError(null);
                }}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              You're setting a temporary password directly — share it with the
              new admin securely and have them change it after first login.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newAdminForm.full_name}
                  onChange={(e) =>
                    setNewAdminForm({
                      ...newAdminForm,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={newAdminForm.email}
                  onChange={(e) =>
                    setNewAdminForm({ ...newAdminForm, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Temporary Password
                </label>
                <input
                  type="text"
                  value={newAdminForm.password}
                  onChange={(e) =>
                    setNewAdminForm({
                      ...newAdminForm,
                      password: e.target.value,
                    })
                  }
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#00A859] focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {createAdminError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                  {createAdminError}
                </div>
              )}

              <button
                type="button"
                onClick={handleCreateAdmin}
                disabled={creatingAdmin}
                className="w-full rounded-xl bg-[#00A859] py-3 text-sm font-bold text-white transition hover:bg-[#008F4B] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {creatingAdmin ? "Creating…" : "Create Admin Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00A859] text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="font-bold text-gray-900">eConcern</span>
              <p className="text-[10px] text-gray-400">
                Barangay Administration System
              </p>
            </div>
          </div>
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} eConcern · Barangay Barangca,
            Candaba, Pampanga
          </p>
        </div>
      </footer>
    </div>
  );
}
