'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Sparkles,
  Users,
  UserCheck,
  UserRound,
  UserX,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/* =========================================================
   TYPES
========================================================= */

type ReportStatus =
  | 'Pending'
  | 'Under Review'
  | 'Resolved'
  | 'Rejected';

type ResidentStatus = 'Verified' | 'Unverified';

type AdminSection = 'overview' | 'reports' | 'residents';

type Report = {
  id: string;
  reference: string;
  resident: string;
  category: string;
  location: string;
  status: ReportStatus;
  date: string;
};

type Resident = {
  id: string;
  name: string;
  age: number;
  purok: string;
  status: ResidentStatus;
  joined: string;
};

/* =========================================================
   FAKE DATA
========================================================= */

const REPORTS: Report[] = [
  {
    id: '1',
    reference: 'ECO-2026-0001',
    resident: 'Juan Dela Cruz',
    category: 'Clogged Drainage',
    location: 'Purok 2',
    status: 'Resolved',
    date: 'Aug 30, 2026',
  },
  {
    id: '2',
    reference: 'ECO-2026-0002',
    resident: 'Maria Santos',
    category: 'Illegal Dumping',
    location: 'Purok 4',
    status: 'Under Review',
    date: 'Aug 30, 2026',
  },
  {
    id: '3',
    reference: 'ECO-2026-0003',
    resident: 'Pedro Garcia',
    category: 'Uncollected Trash',
    location: 'Purok 1',
    status: 'Pending',
    date: 'Aug 29, 2026',
  },
  {
    id: '4',
    reference: 'ECO-2026-0004',
    resident: 'Ana Reyes',
    category: 'Clogged Drainage',
    location: 'Purok 3',
    status: 'Resolved',
    date: 'Aug 28, 2026',
  },
  {
    id: '5',
    reference: 'ECO-2026-0005',
    resident: 'Carlos Mendoza',
    category: 'Illegal Dumping',
    location: 'Purok 5',
    status: 'Rejected',
    date: 'Aug 27, 2026',
  },
  {
    id: '6',
    reference: 'ECO-2026-0006',
    resident: 'Liza Flores',
    category: 'Uncollected Trash',
    location: 'Purok 2',
    status: 'Under Review',
    date: 'Aug 26, 2026',
  },
  {
    id: '7',
    reference: 'ECO-2026-0007',
    resident: 'Mark Bautista',
    category: 'Clogged Drainage',
    location: 'Purok 1',
    status: 'Pending',
    date: 'Aug 25, 2026',
  },
  {
    id: '8',
    reference: 'ECO-2026-0008',
    resident: 'Sofia Navarro',
    category: 'Illegal Dumping',
    location: 'Purok 4',
    status: 'Resolved',
    date: 'Aug 24, 2026',
  },
  {
    id: '9',
    reference: 'ECO-2026-0009',
    resident: 'Ramon Cruz',
    category: 'Uncollected Trash',
    location: 'Purok 3',
    status: 'Rejected',
    date: 'Aug 23, 2026',
  },
  {
    id: '10',
    reference: 'ECO-2026-0010',
    resident: 'Grace Aquino',
    category: 'Clogged Drainage',
    location: 'Purok 5',
    status: 'Under Review',
    date: 'Aug 22, 2026',
  },
];

const RESIDENTS: Resident[] = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    age: 34,
    purok: 'Purok 2',
    status: 'Verified',
    joined: 'Aug 12, 2026',
  },
  {
    id: '2',
    name: 'Maria Santos',
    age: 28,
    purok: 'Purok 4',
    status: 'Verified',
    joined: 'Aug 11, 2026',
  },
  {
    id: '3',
    name: 'Pedro Garcia',
    age: 42,
    purok: 'Purok 1',
    status: 'Unverified',
    joined: 'Aug 10, 2026',
  },
  {
    id: '4',
    name: 'Ana Reyes',
    age: 31,
    purok: 'Purok 3',
    status: 'Verified',
    joined: 'Aug 9, 2026',
  },
  {
    id: '5',
    name: 'Carlos Mendoza',
    age: 39,
    purok: 'Purok 5',
    status: 'Unverified',
    joined: 'Aug 8, 2026',
  },
  {
    id: '6',
    name: 'Liza Flores',
    age: 26,
    purok: 'Purok 2',
    status: 'Verified',
    joined: 'Aug 7, 2026',
  },
  {
    id: '7',
    name: 'Mark Bautista',
    age: 36,
    purok: 'Purok 1',
    status: 'Verified',
    joined: 'Aug 6, 2026',
  },
  {
    id: '8',
    name: 'Sofia Navarro',
    age: 24,
    purok: 'Purok 4',
    status: 'Unverified',
    joined: 'Aug 5, 2026',
  },
];

/* =========================================================
   CHART DATA
========================================================= */

const MONTHLY_REPORTS = [
  { month: 'Mar', reports: 8 },
  { month: 'Apr', reports: 12 },
  { month: 'May', reports: 18 },
  { month: 'Jun', reports: 15 },
  { month: 'Jul', reports: 23 },
  { month: 'Aug', reports: 31 },
];

const STATUS_COLORS = {
  Pending: '#f59e0b',
  'Under Review': '#3b82f6',
  Resolved: '#10b981',
  Rejected: '#ef4444',
};

/* =========================================================
   HELPERS
========================================================= */

function statusClass(status: ReportStatus) {
  switch (status) {
    case 'Resolved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';

    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-100';

    case 'Under Review':
      return 'bg-blue-50 text-blue-700 border-blue-100';

    case 'Rejected':
      return 'bg-red-50 text-red-700 border-red-100';

    default:
      return 'bg-slate-50 text-slate-700 border-slate-100';
  }
}

function residentClass(status: ResidentStatus) {
  return status === 'Verified'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : 'bg-amber-50 text-amber-700 border-amber-100';
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/* =========================================================
   PAGE
========================================================= */

export default function Page() {
  const [activeSection, setActiveSection] =
    useState<AdminSection>('overview');

  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const [reportFilter, setReportFilter] = useState<
    'All' | ReportStatus
  >('All');

  const [residentFilter, setResidentFilter] = useState<
    'All' | ResidentStatus
  >('All');

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const syncSectionFromHash = () => {
      const sectionByHash: Record<string, AdminSection> = {
        '#dashboard': 'overview',
        '#reports': 'reports',
        '#residents': 'residents',
      };

      setActiveSection(sectionByHash[window.location.hash] ?? 'overview');
    };

    syncSectionFromHash();
    window.addEventListener('hashchange', syncSectionFromHash);

    return () => {
      window.removeEventListener('hashchange', syncSectionFromHash);
    };
  }, []);

  const showAdminSection = (section: AdminSection) => {
    setActiveSection(section);

    const hashBySection: Record<AdminSection, string> = {
      overview: '#dashboard',
      reports: '#reports',
      residents: '#residents',
    };

    window.history.replaceState(null, '', `/ensci4${hashBySection[section]}`);
  };

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const reportStats = useMemo(() => {
    return {
      total: REPORTS.length,
      pending: REPORTS.filter(
        (r) => r.status === 'Pending' || r.status === 'Under Review'
      ).length,
      resolved: REPORTS.filter((r) => r.status === 'Resolved').length,
      rejected: REPORTS.filter((r) => r.status === 'Rejected').length,
    };
  }, []);

  const residentStats = useMemo(() => {
    return {
      total: RESIDENTS.length,
      verified: RESIDENTS.filter((r) => r.status === 'Verified').length,
      unverified: RESIDENTS.filter((r) => r.status === 'Unverified').length,
    };
  }, []);

  const donutData = useMemo(
    () => [
      {
        name: 'Pending',
        value: reportStats.pending,
      },
      {
        name: 'Resolved',
        value: reportStats.resolved,
      },
      {
        name: 'Rejected',
        value: reportStats.rejected,
      },
    ],
    [reportStats]
  );

  const filteredReports = useMemo(() => {
    if (reportFilter === 'All') return REPORTS;

    return REPORTS.filter(
      (report) => report.status === reportFilter
    );
  }, [reportFilter]);

  const filteredResidents = useMemo(() => {
    if (residentFilter === 'All') return RESIDENTS;

    return RESIDENTS.filter(
      (resident) => resident.status === residentFilter
    );
  }, [residentFilter]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6FBF8] font-sans text-slate-900">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-3xl animate-pulse" />

        <div
          className="absolute -bottom-48 -right-40 h-[500px] w-[500px] rounded-full bg-green-400/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />

        <div
          className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-emerald-300/5 blur-3xl animate-pulse"
          style={{ animationDelay: '3s' }}
        />
      </div>

      {/* GRID */}

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-6 lg:px-8">

          {/* LOGO */}
          <button type="button" onClick={() => showAdminSection('overview')} className="group flex items-center gap-2.5">

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

          </button>

          {/* RIGHT NAV */}
          <div className="ml-auto flex items-center gap-5 lg:gap-8">

            <nav className="hidden items-center gap-6 lg:flex">

            <button
              type="button"
              onClick={() => showAdminSection('overview')}
              className={`relative py-2 text-sm transition ${
                activeSection === 'overview'
                  ? 'font-semibold text-gray-950'
                  : 'font-medium text-gray-500 hover:text-gray-950'
              }`}
            >
              Dashboard

              {activeSection === 'overview' && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => showAdminSection('reports')}
              className={`relative py-2 text-sm transition ${
                activeSection === 'reports'
                  ? 'font-semibold text-gray-950'
                  : 'font-medium text-gray-500 hover:text-gray-950'
              }`}
            >
              Reports

              {activeSection === 'reports' && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => showAdminSection('residents')}
              className={`relative py-2 text-sm transition ${
                activeSection === 'residents'
                  ? 'font-semibold text-gray-950'
                  : 'font-medium text-gray-500 hover:text-gray-950'
              }`}
            >
              Resident Accounts

              {activeSection === 'residents' && (
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
                  Barangay Official
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

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-6 lg:px-8">
        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <div className="animate-fade-up mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00A859]" />

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00A859]">
                System Administration
              </p>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Performance Overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor environmental reports, resident verification,
              and community activity for Barangay Barangca.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-xl">
            <Calendar className="h-4 w-4 text-[#00A859]" />

            <span className="text-xs font-bold text-slate-600">
              August 2026
            </span>

            <span className="h-1 w-1 rounded-full bg-emerald-400" />

            <span className="text-xs font-medium text-slate-400">
              Current Period
            </span>
          </div>
        </div>

        {/* ===================================================
            KPI CARDS
        ==================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* TOTAL REPORTS */}

          <button
            type="button"
            onClick={() => setActiveSection('reports')}
            className="group animate-fade-up rounded-2xl border border-emerald-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(0,100,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859] transition-colors group-hover:bg-[#00A859] group-hover:text-white">
                <FileText className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-[#00A859]" />
            </div>

            <p className="mt-5 text-xs font-semibold text-slate-500">
              Total Reports
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-950">
              {reportStats.total}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              All submitted reports
            </p>
          </button>

          {/* PENDING */}

          <button
            type="button"
            onClick={() => {
              setReportFilter('Pending');
              setActiveSection('reports');
            }}
            className="group animate-fade-up delay-100 rounded-2xl border border-amber-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(100,70,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                <Clock className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-amber-500" />
            </div>

            <p className="mt-5 text-xs font-semibold text-slate-500">
              Pending
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-950">
              {reportStats.pending}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Need attention
            </p>
          </button>

          {/* RESOLVED */}

          <button
            type="button"
            onClick={() => {
              setReportFilter('Resolved');
              setActiveSection('reports');
            }}
            className="group animate-fade-up delay-200 rounded-2xl border border-emerald-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(0,100,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859] transition-colors group-hover:bg-[#00A859] group-hover:text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-[#00A859]" />
            </div>

            <p className="mt-5 text-xs font-semibold text-slate-500">
              Resolved
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-950">
              {reportStats.resolved}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Successfully handled
            </p>
          </button>

          {/* VERIFIED */}

          <button
            type="button"
            onClick={() => {
              setResidentFilter('Verified');
              setActiveSection('residents');
            }}
            className="group animate-fade-up delay-300 rounded-2xl border border-emerald-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(0,100,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859] transition-colors group-hover:bg-[#00A859] group-hover:text-white">
                <UserCheck className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-[#00A859]" />
            </div>

            <p className="mt-5 text-xs font-semibold text-slate-500">
              Verified Users
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-950">
              {residentStats.verified}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Verified residents
            </p>
          </button>

          {/* UNVERIFIED */}

          <button
            type="button"
            onClick={() => {
              setResidentFilter('Unverified');
              setActiveSection('residents');
            }}
            className="group animate-fade-up delay-400 rounded-2xl border border-emerald-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(0,100,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <UserX className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-700" />
            </div>

            <p className="mt-5 text-xs font-semibold text-slate-500">
              Unverified Users
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-950">
              {residentStats.unverified}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Awaiting verification
            </p>
          </button>
        </div>

        {/* ===================================================
            DASHBOARD VIEW
        ==================================================== */}

        {activeSection === 'overview' && (
          <>
            {/* =================================================
                CHARTS
            ================================================== */}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* BAR GRAPH */}

              <div className="animate-fade-up delay-200 rounded-2xl border border-emerald-100 bg-white/95 p-6 shadow-[0_4px_20px_rgba(0,100,60,0.04)] lg:col-span-8 md:p-8">
                <div className="mb-7 flex items-start justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-[#00A859]" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00A859]">
                        Activity
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-950">
                      Reports Over Time
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Number of environmental reports received each month.
                    </p>
                  </div>

                  <div className="rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-[#008F4B]">
                    6 Months
                  </div>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={MONTHLY_REPORTS}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        vertical={false}
                        stroke="#e5e7eb"
                      />

                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: '#94a3b8',
                          fontWeight: 500,
                        }}
                        dy={12}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                        tick={{
                          fontSize: 12,
                          fill: '#94a3b8',
                          fontWeight: 500,
                        }}
                      />

                      <Tooltip
                        cursor={{
                          fill: '#ecfdf5',
                        }}
                        contentStyle={{
                          borderRadius: '14px',
                          border: '1px solid #d1fae5',
                          boxShadow:
                            '0 12px 30px rgba(15,23,42,0.08)',
                          fontWeight: '600',
                        }}
                      />

                      <Bar
                        dataKey="reports"
                        fill="#00A859"
                        radius={[7, 7, 0, 0]}
                        barSize={42}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DONUT GRAPH */}

              <div className="animate-fade-up delay-300 flex flex-col rounded-2xl border border-emerald-100 bg-white/95 p-6 shadow-[0_4px_20px_rgba(0,100,60,0.04)] lg:col-span-4 md:p-8">
                <div className="mb-3">
                  <div className="mb-1 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#00A859]" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00A859]">
                      Distribution
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-950">
                    Report Status
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Current status of all submitted reports.
                  </p>
                </div>

                <div className="relative flex min-h-[300px] flex-1 items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="45%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        animationBegin={100}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      >
                        {donutData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={
                              STATUS_COLORS[
                                entry.name as keyof typeof STATUS_COLORS
                              ]
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          borderRadius: '14px',
                          border: '1px solid #d1fae5',
                          boxShadow:
                            '0 12px 30px rgba(15,23,42,0.08)',
                          fontWeight: '600',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* CENTER */}

                  <div className="pointer-events-none absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-extrabold text-slate-950">
                      {reportStats.total}
                    </p>

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Reports
                    </p>
                  </div>
                </div>

                {/* LEGEND */}

                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  {donutData.map((item) => (
                    <div
                      key={item.name}
                      className="text-center"
                    >
                      <div className="mb-1 flex items-center justify-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[
                                item.name as keyof typeof STATUS_COLORS
                              ],
                          }}
                        />

                        <span className="text-[10px] font-semibold text-slate-500">
                          {item.name}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* =================================================
                RECENT REPORTS
            ================================================== */}

            <div className="animate-fade-up delay-400 mt-5 overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-[0_4px_20px_rgba(0,100,60,0.04)]">
              <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                    Latest Activity
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-950">
                    Recent Reports
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSection('reports')}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-[#008F4B] transition hover:bg-emerald-100"
                >
                  View All Reports
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {REPORTS.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col gap-3 px-6 py-4 transition hover:bg-emerald-50/30 sm:flex-row sm:items-center sm:justify-between md:px-8"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-[#00A859]">
                        {initials(report.resident)}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {report.reference}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {report.resident} · {report.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:justify-end">
                      <span className="text-[11px] font-medium text-slate-400">
                        {report.date}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-bold ${statusClass(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===================================================
            REPORTS PAGE
        ==================================================== */}

        {activeSection === 'reports' && (
          <div className="animate-fade-up rounded-2xl border border-emerald-100 bg-white/95 shadow-[0_4px_20px_rgba(0,100,60,0.04)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                  Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Environmental Reports
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Review and manage resident-submitted reports.
                </p>
              </div>

              {/* FILTER */}

              <div className="flex flex-wrap gap-2">
                {[
                  'All',
                  'Pending',
                  'Under Review',
                  'Resolved',
                  'Rejected',
                ].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() =>
                      setReportFilter(filter as typeof reportFilter)
                    }
                    className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                      reportFilter === filter
                        ? 'bg-[#00A859] text-white'
                        : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-[#008F4B]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredReports.map((report) => {
                const expanded = expandedReport === report.id;

                return (
                  <div key={report.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedReport(
                          expanded ? null : report.id
                        )
                      }
                      className="flex w-full flex-col gap-3 px-6 py-5 text-left transition hover:bg-emerald-50/30 sm:flex-row sm:items-center sm:justify-between md:px-8"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-[#00A859]">
                          {initials(report.resident)}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {report.reference}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {report.resident} · {report.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-medium text-slate-400">
                          {report.date}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${statusClass(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>

                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform ${
                            expanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {expanded && (
                      <div className="animate-fade-up border-t border-slate-100 bg-emerald-50/30 px-6 py-5 md:px-8">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Resident
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {report.resident}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Category
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {report.category}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Location
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {report.location}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {report.status !== 'Resolved' &&
                            report.status !== 'Rejected' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setShowNotification(true)
                                }
                                className="rounded-xl bg-[#00A859] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#008F4B]"
                              >
                                Update Report
                              </button>
                            )}

                          <button
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B]"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredReports.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <FileText className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    No reports found.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================
            RESIDENT ACCOUNTS
        ==================================================== */}

        {activeSection === 'residents' && (
          <div className="animate-fade-up rounded-2xl border border-emerald-100 bg-white/95 shadow-[0_4px_20px_rgba(0,100,60,0.04)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                  Resident Accounts
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Resident Verification
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Review resident accounts and verification status.
                </p>
              </div>

              <div className="flex gap-2">
                {['All', 'Verified', 'Unverified'].map(
                  (filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        setResidentFilter(
                          filter as typeof residentFilter
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                        residentFilter === filter
                          ? 'bg-[#00A859] text-white'
                          : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-[#008F4B]'
                      }`}
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredResidents.map((resident) => (
                <div
                  key={resident.id}
                  className="flex flex-col gap-4 px-6 py-5 transition hover:bg-emerald-50/30 sm:flex-row sm:items-center sm:justify-between md:px-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-[#00A859]">
                      {initials(resident.name)}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {resident.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Age {resident.age} · {resident.purok}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      Joined {resident.joined}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${residentClass(
                        resident.status
                      )}`}
                    >
                      {resident.status}
                    </span>

                    {resident.status === 'Unverified' && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowNotification(true)
                        }
                        className="rounded-xl bg-[#00A859] px-4 py-2 text-[11px] font-bold text-white transition hover:bg-[#008F4B]"
                      >
                        Verify
                      </button>
                    )}

                    {resident.status === 'Verified' && (
                      <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold text-slate-500 transition hover:border-red-200 hover:text-red-600"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredResidents.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <Users className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    No residents found.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* =====================================================
          NOTIFICATION
      ====================================================== */}

      {showNotification && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-right">
          <div className="flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_20px_60px_rgba(0,100,60,0.18)]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">
                Demo Action
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                This button is connected to fake data for now.
                Connect it to your Supabase update action later.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNotification(false)}
              className="text-slate-300 transition hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-10 border-t border-emerald-100 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00A859] text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>

            <div>
              <span className="font-bold text-slate-900">
                eConcern
              </span>

              <p className="text-[10px] text-slate-400">
                Barangay environmental management system.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} eConcern · Barangay
            Barangca, Candaba, Pampanga
          </p>
        </div>
      </footer>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(24px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.7s ease-out both;
        }

        .animate-fade-right {
          animation: fadeRight 0.5s ease-out both;
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

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #a7d9c0;
          border-radius: 999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #00a859;
        }
      `}</style>
    </div>
  );
}
