"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

type Resident = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  purok: string;
  age: number;
  status: "Verified" | "Unverified";
  joined: string;
};

type Admin = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: "Barangay Official" | "Staff" | "Moderator";
  status: "Active" | "Inactive";
  joined: string;
};

/* =========================================================
   FAKE RESIDENT DATA
========================================================= */

const residents: Resident[] = [
  {
    id: 1,
    name: "Maria Santos",
    username: "maria.santos",
    email: "maria.santos@email.com",
    phone: "0917 123 4567",
    purok: "Purok 1",
    age: 34,
    status: "Verified",
    joined: "Aug 12, 2026",
  },
  {
    id: 2,
    name: "Juan Dela Cruz",
    username: "juan.delacruz",
    email: "juan.delacruz@email.com",
    phone: "0918 234 5678",
    purok: "Purok 2",
    age: 41,
    status: "Verified",
    joined: "Aug 14, 2026",
  },
  {
    id: 3,
    name: "Ana Reyes",
    username: "ana.reyes",
    email: "ana.reyes@email.com",
    phone: "0920 345 6789",
    purok: "Purok 3",
    age: 28,
    status: "Unverified",
    joined: "Aug 17, 2026",
  },
  {
    id: 4,
    name: "Carlos Mendoza",
    username: "carlos.mendoza",
    email: "carlos.mendoza@email.com",
    phone: "0921 456 7890",
    purok: "Purok 4",
    age: 36,
    status: "Verified",
    joined: "Aug 18, 2026",
  },
  {
    id: 5,
    name: "Sofia Garcia",
    username: "sofia.garcia",
    email: "sofia.garcia@email.com",
    phone: "0922 567 8901",
    purok: "Purok 2",
    age: 25,
    status: "Unverified",
    joined: "Aug 20, 2026",
  },
  {
    id: 6,
    name: "Pedro Aquino",
    username: "pedro.aquino",
    email: "pedro.aquino@email.com",
    phone: "0923 678 9012",
    purok: "Purok 5",
    age: 48,
    status: "Verified",
    joined: "Aug 21, 2026",
  },
  {
    id: 7,
    name: "Angela Flores",
    username: "angela.flores",
    email: "angela.flores@email.com",
    phone: "0924 789 0123",
    purok: "Purok 1",
    age: 31,
    status: "Unverified",
    joined: "Aug 23, 2026",
  },
  {
    id: 8,
    name: "Ramon Navarro",
    username: "ramon.navarro",
    email: "ramon.navarro@email.com",
    phone: "0925 890 1234",
    purok: "Purok 6",
    age: 52,
    status: "Verified",
    joined: "Aug 24, 2026",
  },
  {
    id: 9,
    name: "Elena Bautista",
    username: "elena.bautista",
    email: "elena.bautista@email.com",
    phone: "0926 901 2345",
    purok: "Purok 3",
    age: 39,
    status: "Verified",
    joined: "Aug 25, 2026",
  },
  {
    id: 10,
    name: "Mark Villanueva",
    username: "mark.villanueva",
    email: "mark.villanueva@email.com",
    phone: "0927 012 3456",
    purok: "Purok 4",
    age: 23,
    status: "Unverified",
    joined: "Aug 27, 2026",
  },
];

/* =========================================================
   FAKE ADMIN DATA
========================================================= */

const admins: Admin[] = [
  {
    id: 1,
    name: "Roberto Garcia",
    username: "roberto.garcia",
    email: "roberto.garcia@econcern.gov.ph",
    phone: "0917 345 6789",
    role: "Barangay Official",
    status: "Active",
    joined: "Aug 5, 2026",
  },
  {
    id: 2,
    name: "Liza Hernandez",
    username: "liza.hernandez",
    email: "liza.hernandez@econcern.gov.ph",
    phone: "0918 456 7890",
    role: "Staff",
    status: "Active",
    joined: "Aug 8, 2026",
  },
  {
    id: 3,
    name: "Daniel Ramos",
    username: "daniel.ramos",
    email: "daniel.ramos@econcern.gov.ph",
    phone: "0919 567 8901",
    role: "Moderator",
    status: "Active",
    joined: "Aug 10, 2026",
  },
  {
    id: 4,
    name: "Teresa Mendoza",
    username: "teresa.mendoza",
    email: "teresa.mendoza@econcern.gov.ph",
    phone: "0920 678 9012",
    role: "Staff",
    status: "Inactive",
    joined: "Aug 15, 2026",
  },
  {
    id: 5,
    name: "Miguel Santos",
    username: "miguel.santos",
    email: "miguel.santos@econcern.gov.ph",
    phone: "0921 789 0123",
    role: "Moderator",
    status: "Active",
    joined: "Aug 19, 2026",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

/* =========================================================
   PAGE
========================================================= */

export default function SuperAdminPage() {
  /* -------------------------------------------------------
     RESIDENT STATE
  ------------------------------------------------------- */

  const [residentSearch, setResidentSearch] = useState("");
  const [residentStatusFilter, setResidentStatusFilter] = useState("All");
  const [residentSortBy, setResidentSortBy] = useState("Newest");

  /* -------------------------------------------------------
     ADMIN STATE
  ------------------------------------------------------- */

  const [adminSearch, setAdminSearch] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState("All");
  const [adminRoleFilter, setAdminRoleFilter] = useState("All");
  const [adminSortBy, setAdminSortBy] = useState("Newest");

  /* -------------------------------------------------------
     RESIDENT COUNTS
  ------------------------------------------------------- */

  const verifiedCount = residents.filter(
    (resident) => resident.status === "Verified"
  ).length;

  const unverifiedCount = residents.filter(
    (resident) => resident.status === "Unverified"
  ).length;

  /* -------------------------------------------------------
     ADMIN COUNTS
  ------------------------------------------------------- */

  const activeAdminCount = admins.filter(
    (admin) => admin.status === "Active"
  ).length;

  const inactiveAdminCount = admins.filter(
    (admin) => admin.status === "Inactive"
  ).length;

  /* -------------------------------------------------------
     FILTERED RESIDENTS
  ------------------------------------------------------- */

  const filteredResidents = useMemo(() => {
    let data = residents.filter((resident) => {
      const searchValue = residentSearch.toLowerCase();

      const matchesSearch =
        resident.name.toLowerCase().includes(searchValue) ||
        resident.username.toLowerCase().includes(searchValue) ||
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
  }, [residentSearch, residentStatusFilter, residentSortBy]);

  /* -------------------------------------------------------
     FILTERED ADMINS
  ------------------------------------------------------- */

  const filteredAdmins = useMemo(() => {
    let data = admins.filter((admin) => {
      const searchValue = adminSearch.toLowerCase();

      const matchesSearch =
        admin.name.toLowerCase().includes(searchValue) ||
        admin.username.toLowerCase().includes(searchValue) ||
        admin.email.toLowerCase().includes(searchValue) ||
        admin.role.toLowerCase().includes(searchValue);

      const matchesStatus =
        adminStatusFilter === "All" ||
        admin.status === adminStatusFilter;

      const matchesRole =
        adminRoleFilter === "All" || admin.role === adminRoleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });

    if (adminSortBy === "Name") {
      data = [...data].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (adminSortBy === "Oldest") {
      data = [...data].reverse();
    }

    return data;
  }, [adminSearch, adminStatusFilter, adminRoleFilter, adminSortBy]);

  return (
    <div className="min-h-screen bg-[#F6FBF8] font-sans text-gray-900 selection:bg-emerald-200">
      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(20px);
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
            transform: translateY(-6px);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease-out both;
        }

        .animate-fade-right {
          animation: fadeRight 0.6s ease-out both;
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

        .delay-500 {
          animation-delay: 500ms;
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-6 lg:px-8">
          {/* LOGO */}

          <a href="/ensci4" className="group flex items-center gap-2.5">
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

          {/* RIGHT NAV */}

          <div className="ml-auto flex items-center gap-5 lg:gap-8">
            <nav className="hidden items-center gap-6 lg:flex">
              {/* RESIDENT ACCOUNTS */}

              <a
                href="/ensci5"
                className="relative py-2 text-sm font-semibold text-gray-950"
              >
                Resident Accounts

                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
              </a>

              {/* ADMIN ACCOUNTS */}

              <a
                href="/superadmin/admin-accounts"
                className="text-sm font-medium text-gray-500 transition hover:text-gray-950"
              >
                Admin Accounts
              </a>
            </nav>

            <div className="hidden h-7 w-px bg-gray-200 lg:block" />

            {/* PROFILE */}

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
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative overflow-hidden">
        {/* DECORATIVE BACKGROUND */}

        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-green-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
          {/* =================================================
              PAGE HEADER
          ================================================== */}

          <div className="animate-fade-up flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A859]">
                <ShieldCheck className="h-4 w-4" />

                System Administration
              </div>

              <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-gray-950 sm:text-4xl">
                Account Management
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                Manage resident and administrator accounts, review account
                status, and maintain accurate community records.
              </p>
            </div>

            {/* ACCOUNT SUMMARY */}

            <div className="animate-float flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                <Users className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Total Accounts
                </p>

                <p className="text-lg font-extrabold text-gray-950">
                  {residents.length + admins.length}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              ACCOUNT OVERVIEW CARDS
          ================================================== */}

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* RESIDENT ACCOUNTS */}

            <a
              href="#resident-accounts"
              className="animate-fade-up delay-100 group rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                  <Users className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-[#00A859]">
                  Resident Accounts
                </span>
              </div>

              <p className="mt-5 text-3xl font-extrabold text-gray-950">
                {residents.length}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Registered residents
              </p>
            </a>

            {/* ADMIN ACCOUNTS */}

            <a
              href="#admin-accounts"
              className="animate-fade-up delay-200 group rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-[#00A859]">
                  Admin Accounts
                </span>
              </div>

              <p className="mt-5 text-3xl font-extrabold text-gray-950">
                {admins.length}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                System administrators and staff
              </p>
            </a>
          </div>

          {/* =================================================
              RESIDENT ACCOUNTS
          ================================================== */}

          <section
            id="resident-accounts"
            className="animate-fade-up delay-300 mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_20px_60px_-35px_rgba(0,100,60,0.3)]"
          >
            {/* SECTION HEADER */}

            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-950">
                    Resident Accounts
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Review and manage registered residents.
                  </p>
                </div>

                {/* SEARCH */}

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

              {/* FILTERS */}

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
                      {/* RESIDENT */}

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#00A859]">
                            {getInitials(resident.name)}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {resident.name}
                            </p>

                            <p className="mt-0.5 text-[11px] text-gray-400">
                              @{resident.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}

                      <td className="px-6 py-5">
                        <p className="text-xs font-medium text-gray-700">
                          {resident.email}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          {resident.phone}
                        </p>
                      </td>

                      {/* LOCATION */}

                      <td className="px-6 py-5">
                        <p className="text-xs font-semibold text-gray-700">
                          {resident.purok}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          Age {resident.age}
                        </p>
                      </td>

                      {/* STATUS */}

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

                      {/* JOINED */}

                      <td className="px-6 py-5">
                        <span className="text-xs text-gray-500">
                          {resident.joined}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-600 opacity-0 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#00A859] group-hover:opacity-100"
                        >
                          View Details
                        </button>
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
                        {getInitials(resident.name)}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {resident.name}
                        </p>

                        <p className="mt-0.5 text-[11px] text-gray-400">
                          @{resident.username}
                        </p>
                      </div>
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

                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#00A859]"
                  >
                    View Resident Details
                  </button>
                </div>
              ))}
            </div>

            {/* EMPTY STATE */}

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
          </section>

          {/* =================================================
              ADMIN ACCOUNTS
          ================================================== */}

          <section
            id="admin-accounts"
            className="animate-fade-up delay-400 mt-10"
          >
            {/* ADMIN SECTION TITLE */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A859]">
                  <ShieldCheck className="h-4 w-4" />
                  Authorized Personnel
                </div>

                <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-gray-950">
                  Admin Accounts
                </h2>

                <p className="mt-1 max-w-xl text-xs leading-5 text-gray-400">
                  Manage barangay officials, staff, and moderators with
                  administrative access.
                </p>
              </div>
            </div>

            {/* ADMIN STATS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* TOTAL */}

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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

              {/* ACTIVE */}

              <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                    <UserCheck className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    ACTIVE
                  </span>
                </div>

                <p className="mt-5 text-3xl font-extrabold text-gray-950">
                  {activeAdminCount}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Active admin accounts
                </p>
              </div>

              {/* INACTIVE */}

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_15px_40px_-30px_rgba(0,80,50,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                    <XCircle className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500">
                    INACTIVE
                  </span>
                </div>

                <p className="mt-5 text-3xl font-extrabold text-gray-950">
                  {inactiveAdminCount}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Inactive admin accounts
                </p>
              </div>
            </div>

            {/* ADMIN TABLE */}

            <div className="mt-6 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_20px_60px_-35px_rgba(0,100,60,0.3)]">
              {/* TABLE HEADER */}

              <div className="border-b border-gray-100 p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-950">
                      Administrator Directory
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Review and manage authorized system personnel.
                    </p>
                  </div>

                  {/* SEARCH */}

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

                {/* FILTERS */}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <Filter className="h-3.5 w-3.5" />
                    Filter:
                  </div>

                  {/* STATUS */}

                  <div className="relative">
                    <select
                      value={adminStatusFilter}
                      onChange={(e) =>
                        setAdminStatusFilter(e.target.value)
                      }
                      className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-xs font-semibold text-gray-600 outline-none focus:border-[#00A859]"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* ROLE */}

                  <div className="relative">
                    <select
                      value={adminRoleFilter}
                      onChange={(e) =>
                        setAdminRoleFilter(e.target.value)
                      }
                      className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-xs font-semibold text-gray-600 outline-none focus:border-[#00A859]"
                    >
                      <option value="All">All Roles</option>
                      <option value="Barangay Official">
                        Barangay Official
                      </option>
                      <option value="Staff">Staff</option>
                      <option value="Moderator">Moderator</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* SORT */}

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

              {/* DESKTOP ADMIN TABLE */}

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
                    {filteredAdmins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="group transition-colors hover:bg-emerald-50/40"
                      >
                        {/* ADMIN */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#00A859]">
                              {getInitials(admin.name)}
                            </div>

                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {admin.name}
                              </p>

                              <p className="mt-0.5 text-[11px] text-gray-400">
                                @{admin.username}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}

                        <td className="px-6 py-5">
                          <p className="text-xs font-medium text-gray-700">
                            {admin.email}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            {admin.phone}
                          </p>
                        </td>

                        {/* ROLE */}

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1.5 text-[10px] font-bold ${
                              admin.role === "Barangay Official"
                                ? "bg-emerald-50 text-emerald-700"
                                : admin.role === "Staff"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {admin.role}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">
                          {admin.status === "Active" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1.5 text-[10px] font-bold text-gray-500">
                              <XCircle className="h-3.5 w-3.5" />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* JOINED */}

                        <td className="px-6 py-5">
                          <span className="text-xs text-gray-500">
                            {admin.joined}
                          </span>
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-600 opacity-0 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#00A859] group-hover:opacity-100"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE ADMIN CARDS */}

              <div className="divide-y divide-gray-100 md:hidden">
                {filteredAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    className="p-5 transition-colors hover:bg-emerald-50/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#00A859]">
                          {getInitials(admin.name)}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {admin.name}
                          </p>

                          <p className="mt-0.5 text-[11px] text-gray-400">
                            @{admin.username}
                          </p>
                        </div>
                      </div>

                      {admin.status === "Active" ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold text-gray-500">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
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
                          Role
                        </p>

                        <p className="mt-1 text-[11px] font-medium text-gray-700">
                          {admin.role}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 text-[11px] font-medium text-gray-700">
                          {admin.phone}
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

                    <button
                      type="button"
                      className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#00A859]"
                    >
                      View Admin Details
                    </button>
                  </div>
                ))}
              </div>

              {/* ADMIN EMPTY STATE */}

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
            </div>
          </section>

          {/* =================================================
              SECURITY FOOTNOTE
          ================================================== */}

          <div className="mt-7 flex items-center justify-center gap-2 text-center text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-[#00A859]" />

            Account information is restricted to authorized barangay
            personnel.
          </div>
        </div>
      </main>

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