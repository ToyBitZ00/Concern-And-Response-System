"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";   

const CATEGORIES = ["Clogged Drainage", "Illegal Dumping", "Uncollected Trash", "Other"];
const STEPS = ["Pending", "In Progress", "Resolved"];

export default function ResidentPage() {
  const supabase = createClient();
  const [tab, setTab] = useState<"file" | "track">("file");

  const [form, setForm] = useState({
    fullName: "", age: "", address: "", email: "", phone: "",
    category: CATEGORIES[0], description: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [lookup, setLookup] = useState({ email: "", phone: "" });
  const [reports, setReports] = useState<any[]>([]);
  const [looking, setLooking] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .upsert(
          {
            full_name: form.fullName,
            age: form.age ? Number(form.age) : null,
            address: form.address,
            email: form.email,
            phone: form.phone,
          },
          { onConflict: "email,phone" }
        )
        .select()
        .single();
      if (profileErr) throw profileErr;

      let photoUrl: string | null = null;
      if (photo) {
        const path = `${profile.id}/${Date.now()}-${photo.name}`;
        const { error: uploadErr } = await supabase.storage.from("report-photos").upload(path, photo);
        if (uploadErr) throw uploadErr;
        photoUrl = supabase.storage.from("report-photos").getPublicUrl(path).data.publicUrl;
      }

      const { data: report, error: reportErr } = await supabase
        .from("reports")
        .insert({ profile_id: profile.id, category: form.category, description: form.description, photo_url: photoUrl })
        .select()
        .single();
      if (reportErr) throw reportErr;

      setTrackingCode(report.tracking_code);
      setForm({ fullName: "", age: "", address: "", email: "", phone: "", category: CATEGORIES[0], description: "" });
      setPhoto(null);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLooking(true);
    setSearched(true);
    setReports([]);
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, is_verified")
      .eq("email", lookup.email)
      .eq("phone", lookup.phone)
      .single();
    if (profile) {
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false });
      setReports(data ?? []);
    }
    setLooking(false);
  }

  return (
    <div className="min-h-full flex flex-col">
      <Navbar variant="public" />

      <main className="flex-1 px-4 pb-20">
        {/* Hero */}
        <section className="relative max-w-3xl mx-auto pt-16 pb-10 text-center overflow-hidden">
          <div className="glow-blob h-72 w-72 -top-10 left-1/2 -translate-x-1/2" />
          <p className="relative font-(family-name:--font-mono) text-xs tracking-[0.2em] text-(--color-accent) uppercase mb-3">
            Barangay Barangca · Candaba, Pampanga
          </p>
          <h1 className="relative font-(family-name:--font-display) text-3xl sm:text-5xl font-semibold leading-tight">
            See something?<br />Say something.
          </h1>
          <p className="relative mt-4 text-(--color-muted) text-sm sm:text-base max-w-md mx-auto">
            Report clogged drainage, illegal dumping, or uncollected trash directly to
            barangay officials — no account required.
          </p>
        </section>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-1 p-1 rounded-full bg-(--color-surface) border border-white/5 mb-6">
            <button
              onClick={() => setTab("file")}
              className={`flex-1 text-sm font-medium py-2.5 rounded-full transition-colors ${
                tab === "file" ? "bg-(--color-accent) text-(--color-bg)" : "text-(--color-muted)"
              }`}
            >
              File New Report
            </button>
            <button
              onClick={() => setTab("track")}
              className={`flex-1 text-sm font-medium py-2.5 rounded-full transition-colors ${
                tab === "track" ? "bg-(--color-accent) text-(--color-bg)" : "text-(--color-muted)"
              }`}
            >
              Track My Reports
            </button>
          </div>

          {tab === "file" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <fieldset className="rounded-2xl border border-white/10 bg-(--color-surface) p-4 sm:p-5 flex flex-col gap-3">
                <legend className="px-1 text-xs font-(family-name:--font-mono) uppercase tracking-wide text-(--color-accent)">
                  Your Information
                </legend>
                <Input required placeholder="Full Name" value={form.fullName}
                  onChange={(v) => setForm({ ...form, fullName: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Age" type="number" value={form.age}
                    onChange={(v) => setForm({ ...form, age: v })} />
                  <Input required placeholder="Purok / Street" value={form.address}
                    onChange={(v) => setForm({ ...form, address: v })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input required type="email" placeholder="Email" value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })} />
                  <Input required placeholder="Phone Number" value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })} />
                </div>
                <p className="text-xs text-(--color-muted) leading-relaxed">
                  Your identity will be marked{" "}
                  <span className="text-(--color-warn) font-medium">unverified</span> until a
                  barangay official confirms it against these details.
                </p>
              </fieldset>

              <fieldset className="rounded-2xl border border-white/10 bg-(--color-surface) p-4 sm:p-5 flex flex-col gap-3">
                <legend className="px-1 text-xs font-(family-name:--font-mono) uppercase tracking-wide text-(--color-accent)">
                  Report Details
                </legend>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="rounded-xl bg-(--color-surface-2) border border-white/10 px-3 py-2.5 text-sm focus:border-(--color-accent) outline-none"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <textarea
                  required rows={4} placeholder="Describe the issue and nearby landmark"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-xl bg-(--color-surface-2) border border-white/10 px-3 py-2.5 text-sm focus:border-(--color-accent) outline-none resize-none"
                />
                <label className="flex items-center justify-between rounded-xl border border-dashed border-white/15 px-3 py-3 text-sm text-(--color-muted) cursor-pointer hover:border-(--color-accent) transition-colors">
                  <span>{photo ? photo.name : "Attach a photo (optional)"}</span>
                  <span className="text-(--color-accent) text-xs font-medium">Browse</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
                </label>
              </fieldset>

              {error && (
                <p className="text-sm text-(--color-danger) bg-(--color-danger)/10 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                disabled={submitting}
                className="rounded-full bg-(--color-accent) text-(--color-bg) font-semibold py-3.5 text-sm hover:bg-(--color-accent-deep) hover:text-(--color-text) transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>

              {trackingCode && (
                <div className="rounded-2xl border border-(--color-accent)/30 bg-(--color-accent)/10 p-4 text-sm">
                  <p className="text-(--color-muted) mb-1">Report submitted. Your tracking code:</p>
                  <p className="font-(family-name:--font-mono) text-lg text-(--color-accent) font-medium">{trackingCode}</p>
                </div>
              )}
            </form>
          )}

          {tab === "track" && (
            <div className="flex flex-col gap-5">
              <form onSubmit={handleLookup} className="rounded-2xl border border-white/10 bg-(--color-surface) p-4 sm:p-5 flex flex-col gap-3">
                <Input required type="email" placeholder="Email used when submitting" value={lookup.email}
                  onChange={(v) => setLookup({ ...lookup, email: v })} />
                <Input required placeholder="Phone number used when submitting" value={lookup.phone}
                  onChange={(v) => setLookup({ ...lookup, phone: v })} />
                <button
                  disabled={looking}
                  className="rounded-full bg-(--color-accent) text-(--color-bg) font-semibold py-3 text-sm hover:bg-(--color-accent-deep) hover:text-(--color-text) transition-colors disabled:opacity-50"
                >
                  {looking ? "Searching..." : "Find My Reports"}
                </button>
              </form>

              {searched && !looking && reports.length === 0 && (
                <p className="text-center text-sm text-(--color-muted) py-6">
                  No reports found for those details.
                </p>
              )}

              <div className="flex flex-col gap-4">
                {reports.map((r) => (
                  <ReportCard key={r.id} report={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Input({
  value, onChange, ...props
}: { value: string; onChange: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl bg-(--color-surface-2) border border-white/10 px-3 py-2.5 text-sm placeholder:text-(--color-muted) focus:border-(--color-accent) outline-none"
    />
  );
}

function ReportCard({ report }: { report: any }) {
  const stepIndex = report.status === "Rejected" ? -1 : STEPS.indexOf(report.status);
  return (
    <div className="rounded-2xl border border-white/10 bg-(--color-surface) p-4 sm:p-5">
      <div className="flex justify-between items-start gap-3 mb-4">
        <div>
          <p className="font-medium text-sm">{report.category}</p>
          <p className="text-xs text-(--color-muted) mt-0.5 line-clamp-2">{report.description}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      {report.status === "Rejected" ? (
        <p className="text-xs text-(--color-danger)">
          This report was rejected{report.official_notes ? `: ${report.official_notes}` : "."}
        </p>
      ) : (
        <div className="flex items-center gap-0 mb-4">
          {STEPS.map((step, i) => (
            <div key={step} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    i <= stepIndex ? "bg-(--color-accent)" : "bg-(--color-surface-2)"
                  }`}
                />
                <span className={`text-[10px] font-(family-name:--font-mono) uppercase tracking-wide ${
                  i <= stepIndex ? "text-(--color-accent)" : "text-(--color-muted)"
                }`}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-[2px] flex-1 -mt-4 ${i < stepIndex ? "vein-line" : "bg-(--color-surface-2)"}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {report.official_notes && report.status !== "Rejected" && (
        <p className="text-xs text-(--color-muted) bg-(--color-surface-2) rounded-lg px-3 py-2 mb-2">
          Official note: {report.official_notes}
        </p>
      )}
      <p className="text-[11px] font-(family-name:--font-mono) text-(--color-muted)">
        {report.tracking_code}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-(--color-warn)/15 text-(--color-warn)",
    "In Progress": "bg-(--color-accent)/15 text-(--color-accent)",
    Resolved: "bg-(--color-accent)/20 text-(--color-accent)",
    Rejected: "bg-(--color-danger)/15 text-(--color-danger)",
  };
  return (
    <span className={`shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full ${styles[status] ?? ""}`}>
      {status}
    </span>
  );
}