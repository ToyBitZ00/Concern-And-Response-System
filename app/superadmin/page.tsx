"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SuperAdminPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, verified: 0, unverified: 0 });
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: reports } = await supabase.from("reports").select("status");
    const { data: profs } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

    setStats({
      total: reports?.length ?? 0,
      pending: reports?.filter((r) => r.status === "Pending").length ?? 0,
      resolved: reports?.filter((r) => r.status === "Resolved").length ?? 0,
      verified: profs?.filter((p) => p.is_verified).length ?? 0,
      unverified: profs?.filter((p) => !p.is_verified).length ?? 0,
    });
    setProfiles(profs ?? []);
  }

  async function toggleVerified(id: string, current: boolean) {
    await supabase.from("profiles").update({ is_verified: !current }).eq("id", id);
    load();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-1">System Administration</h1>
      <p className="text-sm text-zinc-500 mb-6">Performance overview and resident verification</p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          ["Total Reports", stats.total],
          ["Pending", stats.pending],
          ["Resolved", stats.resolved],
          ["Verified Users", stats.verified],
          ["Unverified Users", stats.unverified],
        ].map(([label, value]) => (
          <div key={label as string} className="border rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-medium mb-3">Resident Accounts</h2>
      <div className="flex flex-col gap-2">
        {profiles.map((p) => (
          <div key={p.id} className="border rounded-lg p-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">{p.full_name}</p>
              <p className="text-xs text-zinc-500">{p.address} — {p.email}</p>
            </div>
            <button onClick={() => toggleVerified(p.id, p.is_verified)}
              className={`text-xs px-3 py-1.5 rounded-full ${p.is_verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {p.is_verified ? "Verified" : "Mark Verified"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}