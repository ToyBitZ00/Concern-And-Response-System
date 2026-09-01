"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Filter,
  Plus,
  Search,
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

export default function SuperAdminPage() {
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
    fetchResidents();
    fetchAdmins();
  }, [fetchResidents, fetchAdmins]);

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
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-6 lg:px-8">
          <a href="/" className="group flex items-center gap-2.5">
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

          <div className="ml-auto flex items-center gap-5 lg:gap-8">
            <nav className="hidden items-center gap-6 lg:flex">
              <button
                type="button"
                onClick={() => setActiveView("Residents")}
                className={`relative py-2 text-sm transition ${
                  activeView === "Residents"
                    ? "font-semibold text-gray-950"
                    : "font-medium text-gray-500 hover:text-gray-950"
                }`}
              >
                Resident Accounts
                {activeView === "Residents" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveView("Admins")}
                className={`relative py-2 text-sm transition ${
                  activeView === "Admins"
                    ? "font-semibold text-gray-950"
                    : "font-medium text-gray-500 hover:text-gray-950"
                }`}
              >
                Admin Accounts
                {activeView === "Admins" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
                )}
              </button>
            </nav>

            <div className="hidden h-7 w-px bg-gray-200 lg:block" />

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-[#00A859]">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-bold text-gray-900">
                  Super Admin
                </p>
                <p className="text-[10px] text-gray-400">
                  System Administrator
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className="border-t border-gray-100 bg-white px-6 py-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveView("Residents")}
              className={`relative whitespace-nowrap pb-2 text-xs transition ${
                activeView === "Residents"
                  ? "font-bold text-gray-950"
                  : "font-medium text-gray-500"
              }`}
            >
              Resident Accounts
              {activeView === "Residents" && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView("Admins")}
              className={`relative whitespace-nowrap pb-2 text-xs transition ${
                activeView === "Admins"
                  ? "font-bold text-gray-950"
                  : "font-medium text-gray-500"
              }`}
            >
              Admin Accounts
              {activeView === "Admins" && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
              )}
            </button>
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