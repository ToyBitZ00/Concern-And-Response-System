"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

export default function AdminPage() {
  const supabase = createClient();
  const [reports, setReports] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("reports")
      .select("*, profiles(full_name, address, is_verified)")
      .order("created_at", { ascending: false });
    setReports(data ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string, notes?: string) {
    await supabase.from("reports").update({ status, official_notes: notes, updated_at: new Date().toISOString() }).eq("id", id);
    load();
  }

  const filtered = filter === "All" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-1">Barangay Official Panel</h1>
      <p className="text-sm text-zinc-500 mb-6">Review and respond to resident reports</p>

      <div className="flex gap-2 mb-4">
        {["All", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-sm px-3 py-1.5 rounded-full border ${filter === s ? "bg-black text-white" : ""}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <p className="text-sm text-zinc-400">Loading...</p> : (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <div key={r.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{r.category}</p>
                  <p className="text-sm text-zinc-500">{r.description}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {r.profiles?.full_name} — {r.profiles?.address}{" "}
                    {r.profiles?.is_verified
                      ? <span className="text-green-600">(Verified)</span>
                      : <span className="text-amber-600">(Unverified)</span>}
                  </p>
                </div>
                <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value, r.official_notes)}
                  className="border rounded px-2 py-1 text-sm">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              {r.photo_url && (
                <img src={r.photo_url} alt="report" className="rounded max-h-40 mb-2" />
              )}
              <textarea
                placeholder="Add a note for this resident..."
                defaultValue={r.official_notes ?? ""}
                onBlur={(e) => updateStatus(r.id, r.status, e.target.value)}
                className="border rounded px-3 py-2 text-sm w-full"
                rows={2}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}