'use client';

import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Activity,
  ArrowUpRight,
  ArrowUpDown,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  ImageIcon,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Search,
  Settings,
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

type ReportStatus = 'Pending' | 'Viewed' | 'Resolved' | 'Blocked';

type ResidentStatus = 'Verified' | 'Unverified' | 'Blocked';

type AdminSection = 'overview' | 'reports' | 'residents';
type AnalyticsRange = 'Month' | 'Week' | 'Year';
type ResidentSort =
  | 'Newest to Oldest'
  | 'Verified First'
  | 'Unverified First'
  | 'Blocked First';

type Report = {
  id: string;
  reference: string;
  resident: string;
  category: string;
  description: string;
  location: string;
  purok: string;
  sitio: string;
  street: string;
  landmark: string;
  status: ReportStatus;
  date: string;
  createdAt: string;
  resolvedAt?: string;
};

type Resident = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  age: number;
  purok: string;
  status: ResidentStatus;
  joined: string;
};

type AdminProfile = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  purok: string;
  street: string;
  age: string;
  role: string;
};

/* =========================================================
   LIVE DATA MAPPERS
========================================================= */

const mapReportStatus = (status?: string): ReportStatus => {
  switch (status) {
    case 'resolved':
      return 'Resolved';
    case 'in_progress':
      return 'Viewed';
    case 'rejected':
      return 'Blocked';
    default:
      return 'Pending';
  }
};

const mapResidentStatus = (status?: string): ResidentStatus => {
  switch (status) {
    case 'verified':
      return 'Verified';
    case 'rejected':
      return 'Blocked';
    default:
      return 'Unverified';
  }
};

const getDbReportUpdateStatus = (status: ReportStatus): 'pending' | 'in_progress' | 'resolved' | 'rejected' => {
  switch (status) {
    case 'Viewed':
      return 'in_progress';
    case 'Resolved':
      return 'resolved';
    case 'Blocked':
      return 'rejected';
    default:
      return 'pending';
  }
};

const getDbResidentUpdateStatus = (status: ResidentStatus): 'pending' | 'verified' | 'rejected' => {
  switch (status) {
    case 'Verified':
      return 'verified';
    case 'Blocked':
      return 'rejected';
    default:
      return 'pending';
  }
};

/* =========================================================
   CHART DATA
========================================================= */

const MONTHLY_REPORT_COUNTS = [6, 9, 11, 8, 12, 18, 15, 23, 31, 27, 34, 29];
const WEEKLY_REPORT_COUNTS = [5, 7, 6, 9, 4, 8, 10];
const YEARLY_REPORT_COUNTS = [84, 96, 112, 128, 147, 161];

const STATUS_GRADIENTS = {
  Pending: {
    from: '#fbbf24',
    to: '#d97706',
  },
  Viewed: {
    from: '#38bdf8',
    to: '#0284c7',
  },
  Resolved: {
    from: '#34d399',
    to: '#059669',
  },
  Blocked: {
    from: '#fb7185',
    to: '#dc2626',
  },
};

const PAGE_SIZE = 10;

const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  fullName: 'Barangay Official',
  email: 'official@barangca.gov.ph',
  phoneNumber: '0917 555 0188',
  address: 'Barangay Barangca, Candaba, Pampanga',
  purok: 'Purok 2',
  street: 'Municipal Road',
  age: '38',
  role: 'System Administrator',
};

const ADMIN_NAV_ITEMS = [
  {
    section: 'overview',
    label: 'Dashboard',
    icon: BarChart3,
  },
  {
    section: 'reports',
    label: 'Reports',
    icon: FileText,
  },
  {
    section: 'residents',
    label: 'Accounts',
    icon: Users,
  },
] as const;

/* =========================================================
   HELPERS
========================================================= */

function statusClass(status: ReportStatus) {
  switch (status) {
    case 'Resolved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';

    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-100';

    case 'Viewed':
      return 'bg-sky-50 text-sky-700 border-sky-100';

    case 'Blocked':
      return 'bg-red-50 text-red-700 border-red-100';

    default:
      return 'bg-slate-50 text-slate-700 border-slate-100';
  }
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function buildAnalyticsReports(
  range: AnalyticsRange,
  currentDate: Date
) {
  if (range === 'Week') {
    return WEEKLY_REPORT_COUNTS.map((reports, index) => ({
      month: `Day ${index + 1}`,
      reports,
    }));
  }

  if (range === 'Year') {
    return YEARLY_REPORT_COUNTS.map((reports, index) => ({
      month: String(currentDate.getFullYear() - 5 + index),
      reports,
    }));
  }

  return MONTHLY_REPORT_COUNTS.map((reports, index) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 11 + index,
      1
    );

    return {
      month: date.toLocaleString('en-US', { month: 'short' }),
      reports,
    };
  });
}

function ProfileInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value || 'Not provided'}
      </p>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Page() {
  const router = useRouter();

  const [activeSection, setActiveSection] =
    useState<AdminSection>('overview');

  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolvingReport, setResolvingReport] = useState<Report | null>(null);
  const [verifyingResident, setVerifyingResident] =
    useState<Resident | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);

  const [reportFilter, setReportFilter] = useState<
    'All' | ReportStatus
  >('All');
  const [reportSearch, setReportSearch] = useState('');
  const [analyticsRange, setAnalyticsRange] =
    useState<AnalyticsRange>('Month');

  const [residentFilter, setResidentFilter] = useState<
    'All' | ResidentStatus
  >('All');
  const [residentSort, setResidentSort] =
    useState<ResidentSort>('Verified First');

  const [reportPage, setReportPage] = useState(1);
  const [residentPage, setResidentPage] = useState(1);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [adminProfile, setAdminProfile] =
    useState<AdminProfile>(DEFAULT_ADMIN_PROFILE);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  const [showNotification, setShowNotification] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const fetchReports = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reports')
      .select(
        'id, reference_number, resident_id, category_id, description, purok, street, landmark, status, created_at, identity_verifications(full_name, email, phone, purok, age, status), waste_categories(name)'
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch reports:', {
        message: error.message,
        code: error.code,
        details: (error as any).details,
      });
      setReports([]);
      return;
    }

    console.log('Fetched reports:', data?.length ?? 0);

    const mappedReports: Report[] = (data ?? []).map((report: any) => {
      const resident = Array.isArray(report.identity_verifications)
        ? report.identity_verifications[0]
        : report.identity_verifications;
      const category = Array.isArray(report.waste_categories)
        ? report.waste_categories[0]
        : report.waste_categories;

      const createdAt = report.created_at
        ? new Date(report.created_at).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })
        : 'Unknown';

      return {
        id: report.id,
        reference: report.reference_number ?? 'N/A',
        resident: resident?.full_name ?? 'Unknown resident',
        category: category?.name ?? 'Uncategorized',
        description: report.description ?? 'No description provided.',
        location: report.purok ?? report.street ?? 'Unknown location',
        purok: report.purok ?? '',
        sitio: resident?.purok ?? '',
        street: report.street ?? '',
        landmark: report.landmark ?? '',
        status: mapReportStatus(report.status),
        date: report.created_at
          ? new Date(report.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Unknown',
        createdAt,
      };
    });

    setReports(mappedReports);
  };

  const fetchResidents = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('identity_verifications')
      .select('id, full_name, email, phone, age, purok, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch residents:', {
        message: error.message,
        code: error.code,
        details: (error as any).details,
      });
      setResidents([]);
      return;
    }

    console.log('Fetched residents:', data?.length ?? 0);

    const mappedResidents: Resident[] = (data ?? []).map((resident: any) => ({
      id: resident.id,
      name: resident.full_name ?? 'Unknown resident',
      email: resident.email ?? 'Not provided',
      phoneNumber: resident.phone ?? 'Not provided',
      age: resident.age ?? 0,
      purok: resident.purok ?? 'Not provided',
      status: mapResidentStatus(resident.status),
      joined: resident.created_at
        ? new Date(resident.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Unknown',
    }));

    setResidents(mappedResidents);
  };

  useEffect(() => {
    const syncSectionFromHash = () => {
      const sectionByHash: Record<string, AdminSection> = {
        '#dashboard': 'overview',
        '#reports': 'reports',
        '#residents': 'residents',
      };

      setActiveSection(sectionByHash[window.location.hash] ?? 'overview');
    };

    const loadAdminProfile = async () => {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, phone, role')
        .eq('id', user.id)
        .maybeSingle();

      setAdminProfile({
        fullName: data?.full_name ?? user.email ?? DEFAULT_ADMIN_PROFILE.fullName,
        email: data?.email ?? user.email ?? DEFAULT_ADMIN_PROFILE.email,
        phoneNumber: data?.phone ?? DEFAULT_ADMIN_PROFILE.phoneNumber,
        address: DEFAULT_ADMIN_PROFILE.address,
        purok: DEFAULT_ADMIN_PROFILE.purok,
        street: DEFAULT_ADMIN_PROFILE.street,
        age: DEFAULT_ADMIN_PROFILE.age,
        role: data?.role === 'superadmin' ? 'Super Administrator' : 'System Administrator',
      });
    };

    syncSectionFromHash();
    window.addEventListener('hashchange', syncSectionFromHash);

    void fetchReports();
    void fetchResidents();
    void loadAdminProfile();

    return () => {
      window.removeEventListener('hashchange', syncSectionFromHash);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const showAdminSection = (section: AdminSection) => {
    setActiveSection(section);

    const hashBySection: Record<AdminSection, string> = {
      overview: '#dashboard',
      reports: '#reports',
      residents: '#residents',
    };

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${hashBySection[section]}`
    );
  };

  const changeReportFilter = (filter: typeof reportFilter) => {
    setReportFilter(filter);
    setReportPage(1);
    setExpandedReport(null);
  };

  const changeReportSearch = (value: string) => {
    setReportSearch(value);
    setReportPage(1);
    setExpandedReport(null);
  };

  const changeResidentFilter = (filter: typeof residentFilter) => {
    setResidentFilter(filter);
    setResidentPage(1);
  };

  const changeResidentSort = (sort: ResidentSort) => {
    setResidentSort(sort);
    setResidentPage(1);
  };

  const markReportViewed = async (reportId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('reports')
      .update({ status: 'in_progress' })
      .eq('id', reportId);

    if (error) {
      console.error('Failed to update report:', error.message);
      return;
    }

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: 'Viewed',
            }
          : report
      )
    );
    setExpandedReport(null);
    setSelectedReport((report) =>
      report?.id === reportId
        ? {
            ...report,
            status: 'Viewed',
          }
        : report
    );
    setShowNotification(true);
  };

  const resolveReport = async (reportId: string) => {
    const resolvedAt = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const supabase = createClient();
    const { error } = await supabase
      .from('reports')
      .update({ status: 'resolved' })
      .eq('id', reportId);

    if (error) {
      console.error('Failed to resolve report:', error.message);
      return;
    }

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: 'Resolved',
              resolvedAt,
            }
          : report
      )
    );
    setExpandedReport(null);
    setSelectedReport((report) =>
      report?.id === reportId
        ? {
            ...report,
            status: 'Resolved',
            resolvedAt,
          }
        : report
    );
    setShowNotification(true);
  };

  const confirmResolveReport = () => {
    if (!resolvingReport) return;

    resolveReport(resolvingReport.id);
    setResolvingReport(null);
  };

  const blockResident = async (resident: Resident) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('identity_verifications')
      .update({ status: 'rejected' })
      .eq('id', resident.id);

    if (error) {
      console.error('Failed to reject resident:', error.message);
      return;
    }

    setResidents((currentResidents) =>
      currentResidents.map((item) =>
        item.id === resident.id
          ? {
              ...item,
              status: 'Blocked',
            }
          : item
      )
    );

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.resident === resident.name
          ? {
              ...report,
              status: 'Blocked',
              resolvedAt: undefined,
            }
          : report
      )
    );

    setSelectedReport((report) =>
      report?.resident === resident.name
        ? {
            ...report,
            status: 'Blocked',
            resolvedAt: undefined,
          }
        : report
    );
    setShowNotification(true);
  };

  const confirmResidentVerification = async () => {
    if (!verifyingResident) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('identity_verifications')
      .update({ status: 'verified' })
      .eq('id', verifyingResident.id);

    if (error) {
      console.error('Failed to verify resident:', error.message);
      return;
    }

    setResidents((currentResidents) =>
      currentResidents.map((resident) =>
        resident.id === verifyingResident.id
          ? {
              ...resident,
              status: 'Verified',
            }
          : resident
      )
    );
    setVerifyingResident(null);
    setShowNotification(true);
  };

  const updateProfileField = (
    field: keyof AdminProfile,
    value: string
  ) => {
    setAdminProfile((profile) => ({
      ...profile,
      [field]: value,
    }));
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = createClient();
    const { data: authData, error: userError } = await supabase.auth.getUser();

    if (userError || !authData.user) {
      setPasswordError('Unable to find your account. Please sign in again.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: adminProfile.fullName.trim() || 'Barangay Official',
        phone: adminProfile.phoneNumber.trim() || null,
      })
      .eq('id', authData.user.id);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPasswordError('');
    setProfileModalOpen(false);
    setShowNotification(true);
  };

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwordForm.currentPassword.trim()) {
      setPasswordError('Current password is required.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user?.email) {
      setPasswordError('Unable to verify user session.');
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authData.user.email,
      password: passwordForm.currentPassword,
    });

    if (signInError) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    });

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPasswordError('');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setSettingsModalOpen(false);
    setShowNotification(true);
  };

  const signOut = () => {
    setProfileMenuOpen(false);
    router.push('/login');
  };

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const reportStats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === 'Pending').length,
      viewed: reports.filter((r) => r.status === 'Viewed').length,
      resolved: reports.filter((r) => r.status === 'Resolved').length,
      blocked: reports.filter((r) => r.status === 'Blocked').length,
    };
  }, [reports]);

  const residentStats = useMemo(() => {
    return {
      total: residents.length,
      verified: residents.filter((r) => r.status === 'Verified').length,
      unverified: residents.filter((r) => r.status === 'Unverified').length,
      blocked: residents.filter((r) => r.status === 'Blocked').length,
    };
  }, [residents]);

  const donutData = useMemo(
    () => [
      {
        name: 'Pending',
        value: reportStats.pending,
      },
      {
        name: 'Viewed',
        value: reportStats.viewed,
      },
      {
        name: 'Resolved',
        value: reportStats.resolved,
      },
      {
        name: 'Blocked',
        value: reportStats.blocked,
      },
    ],
    [reportStats]
  );

  const monthlyReports = useMemo(
    () => buildAnalyticsReports(analyticsRange, currentDate),
    [analyticsRange, currentDate]
  );

  const currentPeriodLabel = useMemo(
    () =>
      currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    [currentDate]
  );

  const verifiedResidentNames = useMemo(
    () =>
      new Set(
        residents
          .filter((resident) => resident.status === 'Verified')
          .map((resident) => resident.name)
      ),
    [residents]
  );

  const filteredReports = useMemo(() => {
    const statusFilteredReports =
      reportFilter === 'All'
        ? reports
        : reports.filter((report) => report.status === reportFilter);

    const searchText = reportSearch.trim().toLowerCase();

    if (!searchText) return statusFilteredReports;

    return statusFilteredReports.filter((report) =>
      [
        report.reference,
        report.resident,
        report.category,
        report.description,
        report.location,
        report.purok,
        report.sitio,
        report.street,
        report.landmark,
        report.status,
        report.date,
        report.createdAt,
        report.resolvedAt ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchText)
    );
  }, [reportFilter, reportSearch, reports]);

  const totalReportPages = Math.max(
    1,
    Math.ceil(filteredReports.length / PAGE_SIZE)
  );

  const visibleReports = useMemo(() => {
    const start = (reportPage - 1) * PAGE_SIZE;

    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [filteredReports, reportPage]);

  const reportStart = filteredReports.length
    ? (reportPage - 1) * PAGE_SIZE + 1
    : 0;

  const reportEnd = Math.min(
    reportPage * PAGE_SIZE,
    filteredReports.length
  );

  const filteredResidents = useMemo(() => {
    const statusFilteredResidents =
      residentFilter === 'All'
        ? residents
        : residents.filter((resident) => resident.status === residentFilter);

    return [...statusFilteredResidents].sort((a, b) => {
      if (residentSort === 'Verified First') {
        return Number(b.status === 'Verified') - Number(a.status === 'Verified');
      }

      if (residentSort === 'Unverified First') {
        return Number(b.status === 'Unverified') - Number(a.status === 'Unverified');
      }

                  if (residentSort === 'Blocked First') {
                    return Number(b.status === 'Blocked') - Number(a.status === 'Blocked');
                  }

                  return Number(b.id) - Number(a.id);
    });
  }, [residentFilter, residentSort, residents]);

  const totalResidentPages = Math.max(
    1,
    Math.ceil(filteredResidents.length / PAGE_SIZE)
  );

  const visibleResidents = useMemo(() => {
    const start = (residentPage - 1) * PAGE_SIZE;

    return filteredResidents.slice(start, start + PAGE_SIZE);
  }, [filteredResidents, residentPage]);

  const residentStart = filteredResidents.length
    ? (residentPage - 1) * PAGE_SIZE + 1
    : 0;

  const residentEnd = Math.min(
    residentPage * PAGE_SIZE,
    filteredResidents.length
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#eef4f0] font-sans text-slate-900">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute -bottom-48 -right-40 h-[500px] w-[500px] rounded-full bg-green-400/10 blur-3xl" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-emerald-100/70 bg-white/90 shadow-sm shadow-emerald-950/5 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[76px] max-w-7xl flex-col gap-3 px-5 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-8 mobile-header-inner">

          {/* LOGO */}
          <button type="button" onClick={() => showAdminSection('overview')} className="group flex items-center gap-3 self-start lg:self-auto mobile-logo">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A859] text-white shadow-sm shadow-emerald-900/20 transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>

            <div className="text-left leading-none">
              <span className="block text-lg font-bold tracking-tight text-gray-950">
                eConcern
              </span>

              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#00A859]">
                Barangay Admin
              </span>
            </div>

          </button>

          {/* RIGHT NAV */}
          <div className="flex w-full items-center gap-4 lg:ml-auto lg:w-auto lg:gap-8">

            <nav className="desktop-nav flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl border border-emerald-100 bg-white/70 p-1 shadow-inner lg:flex-none">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const selected = activeSection === item.section;

                return (
                  <button
                    key={item.section}
                    type="button"
                    onClick={() => showAdminSection(item.section)}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-bold transition sm:px-4 ${
                      selected
                        ? 'bg-[#00A859] text-white shadow-sm'
                        : 'text-slate-500 hover:bg-white/80 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="hidden h-7 w-px bg-gray-200 lg:block" />

            <div className="relative block shrink-0">

              <button
                type="button"
                onClick={() =>
                  setProfileMenuOpen((isOpen) => !isOpen)
                }
                className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-white/80 sm:gap-3 sm:px-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-[#00A859] ring-1 ring-emerald-100 sm:h-9 sm:w-9">
                  <UserRound className="h-4 w-4" />
                </div>

                <div className="hidden text-left lg:block">
                  <p className="text-xs font-bold text-gray-900">
                    {adminProfile.fullName}
                  </p>

                  <p className="text-[10px] text-gray-400">
                    {adminProfile.role}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-12 z-[80] w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                  <div className="border-b border-slate-100 bg-emerald-50/60 px-4 py-4">
                    <p className="text-sm font-bold text-slate-950">
                      {adminProfile.fullName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {adminProfile.email}
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
                        setSettingsModalOpen(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-slate-600 transition hover:bg-emerald-50 hover:text-[#008F4B]"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>

                    <button
                      type="button"
                      onClick={signOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-red-500 transition hover:bg-red-50"
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

      {/* MOBILE APP NAVIGATION — mobile only; desktop UI is unchanged */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const selected = activeSection === item.section;
          return (
            <button
              key={item.section}
              type="button"
              onClick={() => showAdminSection(item.section)}
              className={`mobile-bottom-nav-item ${selected ? 'active' : ''}`}
              aria-current={selected ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-7 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8 mobile-main">
        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <div className="animate-fade-up mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mobile-page-header">
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

          <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-xl">
            <Calendar className="h-4 w-4 text-[#00A859]" />

            <span className="text-xs font-bold text-slate-600">
              {currentPeriodLabel}
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

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mobile-kpi-grid">
          {/* TOTAL REPORTS */}

          <button
            type="button"
            onClick={() => {
              changeReportFilter('All');
              showAdminSection('reports');
            }}
            className="group mobile-kpi-card animate-fade-up rounded-2xl border border-emerald-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(0,100,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
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
              changeReportFilter('Pending');
              showAdminSection('reports');
            }}
            className="group mobile-kpi-card animate-fade-up delay-100 rounded-2xl border border-amber-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(100,70,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl"
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
              changeReportFilter('Resolved');
              showAdminSection('reports');
            }}
            className="group mobile-kpi-card animate-fade-up delay-200 rounded-2xl border border-emerald-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(0,100,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
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
              changeResidentFilter('Verified');
              showAdminSection('residents');
            }}
            className="group mobile-kpi-card animate-fade-up delay-300 rounded-2xl border border-emerald-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(0,100,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
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
              changeResidentFilter('Unverified');
              showAdminSection('residents');
            }}
            className="group mobile-kpi-card animate-fade-up delay-400 rounded-2xl border border-emerald-100 bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(0,100,60,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
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

              <div className="mobile-chart-card animate-fade-up delay-200 rounded-2xl border border-emerald-100 bg-white/95 p-5 shadow-[0_4px_20px_rgba(0,100,60,0.04)] sm:p-6 lg:col-span-8 md:p-8">
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
                      Number of environmental reports received by selected period.
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1 rounded-xl border border-slate-200 bg-white p-1">
                    {(['Week', 'Month', 'Year'] as const).map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setAnalyticsRange(range)}
                        className={`h-8 rounded-lg px-3 text-[10px] font-bold transition ${
                          analyticsRange === range
                            ? 'bg-[#00A859] text-white shadow-sm'
                            : 'text-slate-500 hover:bg-emerald-50 hover:text-[#008F4B]'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[300px] w-full mobile-chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyReports}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="reportsBarGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#34d399"
                          />
                          <stop
                            offset="100%"
                            stopColor="#008F4B"
                          />
                        </linearGradient>
                      </defs>

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
                        fill="url(#reportsBarGradient)"
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

              <div className="mobile-donut-card animate-fade-up delay-300 flex flex-col rounded-2xl border border-emerald-100 bg-white/95 p-5 shadow-[0_4px_20px_rgba(0,100,60,0.04)] sm:p-6 lg:col-span-4 md:p-8">
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

                <div className="relative flex min-h-[300px] flex-1 items-center justify-center mobile-donut-area">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <defs>
                        {donutData.map((entry) => {
                          const gradient =
                            STATUS_GRADIENTS[
                              entry.name as keyof typeof STATUS_GRADIENTS
                            ];

                          return (
                            <linearGradient
                              key={entry.name}
                              id={`statusGradient-${entry.name.replace(
                                /\s+/g,
                                '-'
                              )}`}
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={gradient.from}
                              />
                              <stop
                                offset="100%"
                                stopColor={gradient.to}
                              />
                            </linearGradient>
                          );
                        })}
                      </defs>

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
                            fill={`url(#statusGradient-${entry.name.replace(
                              /\s+/g,
                              '-'
                            )})`}
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

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-4">
                  {donutData.map((item) => (
                    <div
                      key={item.name}
                      className="text-center"
                    >
                      <div className="mb-1 flex items-center justify-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${
                              STATUS_GRADIENTS[
                                item.name as keyof typeof STATUS_GRADIENTS
                              ].from
                            }, ${
                              STATUS_GRADIENTS[
                                item.name as keyof typeof STATUS_GRADIENTS
                              ].to
                            })`,
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

            <div className="mobile-recent animate-fade-up delay-400 mt-5 overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-[0_4px_20px_rgba(0,100,60,0.04)]">
              <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8">
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-[#008F4B] transition hover:bg-emerald-100"
                >
                  View All Reports
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col gap-3 px-5 py-4 transition hover:bg-emerald-50/30 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-[#00A859]">
                        {initials(report.resident)}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {report.reference}
                        </p>

                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          <p className="text-xs text-slate-500">
                            {report.resident} · {report.category}
                          </p>

                          {verifiedResidentNames.has(report.resident) && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </div>
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
          <div className="animate-fade-up overflow-hidden rounded-xl border border-emerald-100 bg-white/95 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Environmental Reports
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {filteredReports.length} of {reports.length} reports shown
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
                <div className="relative w-full md:w-80">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={reportSearch}
                    onChange={(event) =>
                      changeReportSearch(event.target.value)
                    }
                    placeholder="Search reports"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  />

                  {reportSearch && (
                    <button
                      type="button"
                      onClick={() => changeReportSearch('')}
                      className="absolute right-2 top-1/2 rounded-lg p-1 text-slate-300 transition -translate-y-1/2 hover:bg-slate-50 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* FILTER */}

                <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1">
                  {[
                    'All',
                    'Pending',
                    'Viewed',
                    'Resolved',
                    'Blocked',
                  ].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        changeReportFilter(filter as typeof reportFilter)
                      }
                      className={`h-9 shrink-0 rounded-lg px-3 text-[11px] font-bold transition ${
                        reportFilter === filter
                          ? 'bg-[#00A859] text-white shadow-sm'
                          : 'text-slate-500 hover:bg-emerald-50 hover:text-[#008F4B]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-h-[460px] divide-y divide-slate-100">
              {visibleReports.map((report) => {
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
                      className="flex w-full flex-col gap-3 px-5 py-5 text-left transition hover:bg-emerald-50/30 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-[#00A859]">
                          {initials(report.resident)}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {report.reference}
                          </p>

                          <div className="mt-0.5 flex flex-wrap items-center gap-2">
                            <p className="text-xs text-slate-500">
                              {report.resident} · {report.category}
                            </p>

                            {verifiedResidentNames.has(report.resident) && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2 className="h-3 w-3" />
                                Verified
                              </span>
                            )}
                          </div>
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
                      <div className="animate-fade-up border-t border-slate-100 bg-emerald-50/30 px-5 py-5 sm:px-6 md:px-8">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Resident
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-800">
                                {report.resident}
                              </p>

                              {verifiedResidentNames.has(report.resident) && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Verified
                                </span>
                              )}
                            </div>
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
                          {report.status === 'Pending' && (
                            <button
                              type="button"
                              onClick={() => markReportViewed(report.id)}
                              className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-sky-700"
                            >
                              Mark Viewed
                            </button>
                          )}

                          {report.status !== 'Resolved' &&
                            report.status !== 'Blocked' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setResolvingReport(report)
                                }
                                className="rounded-xl bg-[#00A859] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#008F4B]"
                              >
                                Mark Resolved
                              </button>
                            )}

                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
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

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8">
              <p className="text-xs font-semibold text-slate-500">
                Showing {reportStart}-{reportEnd} of {filteredReports.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setReportPage((page) => Math.max(1, page - 1))
                  }
                  disabled={reportPage === 1}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="min-w-16 text-center text-xs font-bold text-slate-500">
                  {reportPage}/{totalReportPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setReportPage((page) =>
                      Math.min(totalReportPages, page + 1)
                    )
                  }
                  disabled={reportPage === totalReportPages}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            RESIDENT ACCOUNTS
        ==================================================== */}

        {activeSection === 'residents' && (
          <div className="animate-fade-up overflow-hidden rounded-xl border border-emerald-100 bg-white/95 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/60 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Resident Verification
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {filteredResidents.length} of {residents.length} accounts shown
                </p>
              </div>

              <div className="flex w-full max-w-full items-center gap-2 overflow-x-auto md:w-auto">
                <div className="flex shrink-0 gap-1 rounded-xl border border-slate-200 bg-white p-1">
                  {['All', 'Verified', 'Unverified', 'Blocked'].map(
                    (filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() =>
                          changeResidentFilter(
                            filter as typeof residentFilter
                          )
                        }
                        className={`h-9 shrink-0 rounded-lg px-3 text-[11px] font-bold transition ${
                          residentFilter === filter
                            ? 'bg-[#00A859] text-white shadow-sm'
                            : 'text-slate-500 hover:bg-emerald-50 hover:text-[#008F4B]'
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <ArrowUpDown className="h-4 w-4 shrink-0 text-slate-400" />

                  <select
                    value={residentSort}
                    onChange={(event) =>
                      changeResidentSort(event.target.value as ResidentSort)
                    }
                    className="h-6 bg-transparent text-xs font-bold text-slate-600 outline-none"
                  >
                    <option>Newest to Oldest</option>
                    <option>Verified First</option>
                    <option>Unverified First</option>
                    <option>Blocked First</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="min-h-[460px] divide-y divide-slate-100">
              {visibleResidents.map((resident) => (
                <div
                  key={resident.id}
                  className="flex flex-col gap-4 px-6 py-5 transition hover:bg-emerald-50/30 sm:flex-row sm:items-center sm:justify-between md:px-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-[#00A859]">
                      {initials(resident.name)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">
                          {resident.name}
                        </p>

                        {resident.status === 'Verified' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Age {resident.age} · {resident.purok}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      Joined {resident.joined}
                    </span>

                    {resident.status === 'Unverified' && (
                      <button
                        type="button"
                        onClick={() =>
                          setVerifyingResident(resident)
                        }
                        className="rounded-xl bg-[#00A859] px-4 py-2 text-[11px] font-bold text-white transition hover:bg-[#008F4B]"
                      >
                        Verify
                      </button>
                    )}

                    {resident.status === 'Blocked' && (
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-700">
                        <X className="h-3.5 w-3.5" />
                        Blocked
                      </span>
                    )}

                    {resident.status !== 'Blocked' && (
                      <button
                        type="button"
                        onClick={() => blockResident(resident)}
                        className="rounded-xl bg-red-800 px-4 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-red-900"
                      >
                        Block
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

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
              <p className="text-xs font-semibold text-slate-500">
                Showing {residentStart}-{residentEnd} of {filteredResidents.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setResidentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={residentPage === 1}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="min-w-16 text-center text-xs font-bold text-slate-500">
                  {residentPage}/{totalResidentPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setResidentPage((page) =>
                      Math.min(totalResidentPages, page + 1)
                    )
                  }
                  disabled={residentPage === totalResidentPages}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================
          RESOLVE CONFIRMATION MODAL
      ====================================================== */}

      {resolvingReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
            <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                  Confirm Update
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Mark this report as resolved?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This will update the report status to Resolved and add the
                  resolved date and time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setResolvingReport(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-6">
              <DetailField
                label="Reference"
                value={resolvingReport.reference}
              />

              <DetailField
                label="Resident"
                value={resolvingReport.resident}
              />

              <DetailField
                label="Category"
                value={resolvingReport.category}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setResolvingReport(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmResolveReport}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A859] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#008F4B]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          REPORT DETAILS MODAL
      ====================================================== */}

      {selectedReport && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-full w-full max-w-4xl overflow-y-auto rounded-2xl border border-emerald-100 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                  Report Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {selectedReport.reference}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_320px]">
              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Full Name
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedReport.resident}
                      </p>

                      {verifiedResidentNames.has(selectedReport.resident) && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <DetailField
                    label="Category"
                    value={selectedReport.category}
                  />

                  <DetailField
                    label="Purok"
                    value={selectedReport.purok}
                  />

                  <DetailField
                    label="Sitio"
                    value={selectedReport.sitio}
                  />

                  <DetailField
                    label="Street"
                    value={selectedReport.street}
                  />

                  <DetailField
                    label="Landmark"
                    value={selectedReport.landmark}
                  />

                  <DetailField
                    label="Status"
                    value={selectedReport.status}
                  />

                  <DetailField
                    label="Created At"
                    value={selectedReport.createdAt}
                  />

                  {selectedReport.status === 'Resolved' && (
                    <DetailField
                      label="Resolved At"
                      value={selectedReport.resolvedAt}
                    />
                  )}
                </div>

                <div className="mt-5">
                  <DetailField
                    label="Description"
                    value={selectedReport.description}
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Submitted Report Picture
                </p>

                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 text-center">
                  <div>
                    <ImageIcon className="mx-auto h-10 w-10 text-[#00A859]" />

                    <p className="mt-3 text-xs font-bold text-slate-600">
                      Report photo preview
                    </p>

                    <p className="mx-auto mt-1 max-w-48 text-[11px] leading-5 text-slate-400">
                      Demo data placeholder for the submitted image.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B]"
              >
                Close
              </button>

              {selectedReport.status === 'Pending' && (
                <button
                  type="button"
                  onClick={() => markReportViewed(selectedReport.id)}
                  className="rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-sky-700"
                >
                  Mark Viewed
                </button>
              )}

              {selectedReport.status !== 'Resolved' &&
                selectedReport.status !== 'Blocked' && (
                  <button
                    type="button"
                    onClick={() => setResolvingReport(selectedReport)}
                    className="rounded-xl bg-[#00A859] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#008F4B]"
                  >
                    Mark Resolved
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          VERIFY RESIDENT MODAL
      ====================================================== */}

      {verifyingResident && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
            <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                  Confirm Verification
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Verify resident account
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setVerifyingResident(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2">
              <DetailField label="Name" value={verifyingResident.name} />
              <DetailField label="Email" value={verifyingResident.email} />
              <DetailField
                label="Phone Number"
                value={verifyingResident.phoneNumber}
              />
              <DetailField label="Age" value={verifyingResident.age} />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setVerifyingResident(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmResidentVerification}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A859] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#008F4B]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirm Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PROFILE MODAL
      ====================================================== */}

      {profileModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
          <div className="max-h-full w-full max-w-3xl overflow-y-auto rounded-2xl border border-emerald-100 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                  Profile
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Barangay Official
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveProfile} className="px-6 py-6">
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                  <Mail className="h-4 w-4 text-[#00A859]" />
                  <span className="truncate text-xs font-semibold text-slate-600">
                    {adminProfile.email}
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                  <Phone className="h-4 w-4 text-[#00A859]" />
                  <span className="truncate text-xs font-semibold text-slate-600">
                    {adminProfile.phoneNumber}
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                  <MapPin className="h-4 w-4 text-[#00A859]" />
                  <span className="truncate text-xs font-semibold text-slate-600">
                    {adminProfile.purok}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ProfileInput
                  label="Full Name"
                  value={adminProfile.fullName}
                  onChange={(value) =>
                    updateProfileField('fullName', value)
                  }
                />

                <ProfileInput
                  label="Email"
                  value={adminProfile.email}
                  onChange={(value) => updateProfileField('email', value)}
                  type="email"
                />

                <ProfileInput
                  label="Phone Number"
                  value={adminProfile.phoneNumber}
                  onChange={(value) =>
                    updateProfileField('phoneNumber', value)
                  }
                />

                <ProfileInput
                  label="Age"
                  value={adminProfile.age}
                  onChange={(value) => updateProfileField('age', value)}
                  type="number"
                />

                <ProfileInput
                  label="Address"
                  value={adminProfile.address}
                  onChange={(value) =>
                    updateProfileField('address', value)
                  }
                />

                <ProfileInput
                  label="Purok"
                  value={adminProfile.purok}
                  onChange={(value) => updateProfileField('purok', value)}
                />

                <ProfileInput
                  label="Street"
                  value={adminProfile.street}
                  onChange={(value) => updateProfileField('street', value)}
                />

                <ProfileInput
                  label="Role"
                  value={adminProfile.role}
                  onChange={(value) => updateProfileField('role', value)}
                />
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B]"
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
          SETTINGS MODAL
      ====================================================== */}

      {settingsModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/35 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-emerald-100 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00A859]">
                  Settings
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Change Password
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSettingsModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={savePassword} className="space-y-4 px-6 py-6">
              <ProfileInput
                label="Current Password"
                value={passwordForm.currentPassword}
                onChange={(value) =>
                  setPasswordForm((form) => ({
                    ...form,
                    currentPassword: value,
                  }))
                }
                type="password"
              />

              <ProfileInput
                label="New Password"
                value={passwordForm.newPassword}
                onChange={(value) =>
                  setPasswordForm((form) => ({
                    ...form,
                    newPassword: value,
                  }))
                }
                type="password"
              />

              <ProfileInput
                label="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(value) =>
                  setPasswordForm((form) => ({
                    ...form,
                    confirmPassword: value,
                  }))
                }
                type="password"
              />

              {passwordError && (
                <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {passwordError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-[#008F4B]"
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
          NOTIFICATION
      ====================================================== */}

      {showNotification && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-right mobile-notification">
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

      <footer className="relative z-10 mt-auto border-t border-emerald-100 bg-white/80 mobile-footer">
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

        /* =====================================================
           MOBILE APP VIEW ONLY
           These rules are scoped to screens 767px and below.
           Desktop/tablet styles remain unchanged.
        ====================================================== */
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 767px) {
          html, body {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }

          body {
            -webkit-tap-highlight-color: transparent;
          }

          .mobile-header-inner {
            min-height: 58px !important;
            height: 58px !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 8px !important;
            padding: 7px 12px !important;
          }

          .mobile-logo {
            gap: 8px !important;
          }

          .mobile-logo > div:first-child {
            width: 34px !important;
            height: 34px !important;
            border-radius: 10px !important;
          }

          .mobile-logo > div:first-child svg {
            width: 15px !important;
            height: 15px !important;
          }

          .mobile-logo span:first-child {
            font-size: 15px !important;
          }

          .mobile-logo span:last-child {
            margin-top: 2px !important;
            font-size: 8px !important;
          }

          .desktop-nav {
            display: none !important;
          }

          .mobile-header-inner > div:last-child {
            width: auto !important;
            flex: 0 0 auto !important;
            margin-left: auto !important;
          }

          .mobile-header-inner .h-7.w-px {
            display: none !important;
          }

          .mobile-header-inner .relative > button {
            min-height: 38px !important;
            padding: 3px !important;
          }

          .mobile-header-inner .relative > button > div:first-child {
            width: 34px !important;
            height: 34px !important;
          }

          .mobile-header-inner .relative > button > svg {
            width: 14px !important;
            height: 14px !important;
          }

          .mobile-main {
            padding: 14px 10px 88px !important;
          }

          .mobile-page-header {
            margin-bottom: 12px !important;
            gap: 8px !important;
          }

          .mobile-page-header > div:first-child > div:first-child {
            margin-bottom: 4px !important;
          }

          .mobile-page-header > div:first-child > div:first-child p {
            font-size: 8px !important;
            letter-spacing: .12em !important;
          }

          .mobile-page-header h1 {
            font-size: 21px !important;
            line-height: 1.15 !important;
          }

          .mobile-page-header h1 + p {
            display: none !important;
          }

          .mobile-page-header > div:last-child {
            width: 100% !important;
            justify-content: center !important;
            padding: 7px 9px !important;
            border-radius: 10px !important;
          }

          .mobile-page-header > div:last-child span {
            font-size: 9px !important;
          }

          .mobile-page-header > div:last-child svg {
            width: 13px !important;
            height: 13px !important;
          }

          .mobile-kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 7px !important;
            margin-bottom: 10px !important;
          }

          .mobile-kpi-card {
            min-height: 88px !important;
            padding: 10px !important;
            border-radius: 13px !important;
          }

          .mobile-kpi-card > div:first-child > div:first-child {
            width: 28px !important;
            height: 28px !important;
            border-radius: 8px !important;
          }

          .mobile-kpi-card > div:first-child > div:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }

          .mobile-kpi-card > div:first-child > svg {
            width: 12px !important;
            height: 12px !important;
          }

          .mobile-kpi-card p.mt-5 {
            margin-top: 7px !important;
            font-size: 9px !important;
          }

          .mobile-kpi-card p.text-3xl {
            margin-top: 0 !important;
            font-size: 20px !important;
            line-height: 1.1 !important;
          }

          .mobile-kpi-card p.text-\[11px\] {
            display: none !important;
          }

          .mobile-chart-card, .mobile-donut-card, .mobile-recent {
            border-radius: 13px !important;
          }

          .mobile-chart-card {
            padding: 11px !important;
          }

          .mobile-chart-card > div:first-child {
            margin-bottom: 6px !important;
            gap: 5px !important;
          }

          .mobile-chart-card h2, .mobile-donut-card h2 {
            font-size: 13px !important;
          }

          .mobile-chart-card p, .mobile-donut-card p {
            font-size: 9px !important;
            line-height: 1.35 !important;
          }

          .mobile-chart-card > div:first-child > div:last-child {
            gap: 0 !important;
          }

          .mobile-chart-card > div:first-child > div:last-child button {
            height: 25px !important;
            padding: 0 7px !important;
            font-size: 8px !important;
            border-radius: 7px !important;
          }

          .mobile-chart-area {
            height: 205px !important;
          }

          .mobile-chart-area .recharts-responsive-container {
            min-height: 0 !important;
          }

          .mobile-chart-area .recharts-cartesian-axis-tick-value {
            font-size: 9px !important;
          }

          .mobile-donut-card {
            padding: 11px !important;
          }

          .mobile-donut-area {
            min-height: 215px !important;
            height: 215px !important;
          }

          .mobile-donut-area .recharts-responsive-container {
            height: 215px !important;
          }

          .mobile-donut-area .recharts-pie-sector {
            outline: none;
          }

          .mobile-donut-card .text-3xl {
            font-size: 21px !important;
          }

          .mobile-donut-card .grid {
            gap: 5px !important;
            padding-top: 8px !important;
          }

          .mobile-donut-card .grid span {
            font-size: 8px !important;
          }

          .mobile-donut-card .grid p {
            font-size: 12px !important;
          }

          .mobile-recent {
            margin-top: 9px !important;
          }

          .mobile-recent > div:first-child {
            padding: 10px !important;
          }

          .mobile-recent > div:first-child h2 {
            font-size: 13px !important;
          }

          .mobile-recent > div:first-child button {
            width: 100% !important;
            padding: 7px 9px !important;
            font-size: 9px !important;
          }

          .mobile-recent .divide-y > div {
            padding: 9px 10px !important;
            gap: 6px !important;
          }

          .mobile-recent .divide-y > div > div:first-child {
            gap: 8px !important;
          }

          .mobile-recent .divide-y > div > div:first-child > div:first-child {
            width: 30px !important;
            height: 30px !important;
            border-radius: 8px !important;
            font-size: 9px !important;
          }

          .mobile-recent .divide-y p {
            font-size: 9px !important;
          }

          .mobile-recent .divide-y .text-\[11px\] {
            font-size: 8px !important;
          }

          .mobile-recent .divide-y span.rounded-full {
            padding: 3px 6px !important;
            font-size: 8px !important;
          }

          .mobile-footer {
            display: none !important;
          }

          .mobile-bottom-nav {
            position: fixed !important;
            left: 8px !important;
            right: 8px !important;
            bottom: 8px !important;
            z-index: 80 !important;
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 4px !important;
            padding: 5px !important;
            border: 1px solid rgba(0,168,89,.14) !important;
            border-radius: 16px !important;
            background: rgba(255,255,255,.94) !important;
            box-shadow: 0 12px 35px rgba(15,23,42,.14) !important;
            backdrop-filter: blur(18px) !important;
            -webkit-backdrop-filter: blur(18px) !important;
          }

          .mobile-bottom-nav-item {
            min-width: 0 !important;
            min-height: 50px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 2px !important;
            border: 0 !important;
            border-radius: 12px !important;
            background: transparent !important;
            color: #94a3b8 !important;
            font-size: 8px !important;
            font-weight: 800 !important;
            transition: .2s ease !important;
          }

          .mobile-bottom-nav-item.active {
            background: #00A859 !important;
            color: white !important;
            box-shadow: 0 5px 15px rgba(0,168,89,.22) !important;
          }

          .mobile-bottom-nav-item:active {
            transform: scale(.96);
          }

          .mobile-notification {
            left: 10px !important;
            right: 10px !important;
            bottom: 76px !important;
          }

          .mobile-notification > div {
            width: 100% !important;
            max-width: none !important;
            padding: 10px !important;
            border-radius: 13px !important;
          }

          /* Reports / Accounts pages */
          .mobile-main > div.animate-fade-up.rounded-xl {
            border-radius: 13px !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl > div:first-child {
            padding: 11px !important;
            gap: 8px !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl h2 {
            font-size: 15px !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl .min-h-\[460px\] {
            min-height: 0 !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl .divide-y > div > button {
            padding: 10px !important;
            gap: 7px !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl .divide-y > div > button > div:first-child > div:first-child {
            width: 32px !important;
            height: 32px !important;
            border-radius: 9px !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl .divide-y > div > button p {
            font-size: 9px !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl .divide-y > div > button .rounded-full {
            padding: 3px 6px !important;
            font-size: 8px !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl .divide-y > div > div.bg-emerald-50\/30 {
            padding: 10px !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl .border-t.bg-slate-50\/70 {
            padding: 9px 10px !important;
          }

          .mobile-main > div.animate-fade-up.rounded-xl .border-t.bg-slate-50\/70 button {
            height: 32px !important;
            padding: 0 10px !important;
            font-size: 9px !important;
          }

          /* Keep touch targets comfortable even though the visual UI is compact. */
          button, select, input {
            touch-action: manipulation;
          }

          input, select {
            font-size: 16px !important;
          }
        }

      `}</style>
    </div>
  );
}
