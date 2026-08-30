"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr || !data.user) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    const { data: staff } = await supabase
      .from("staff")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (!staff) {
      setError("No staff record found for this account.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    router.push(staff.role === "superadmin" ? "/superadmin" : "/admin");
  }

  return (
    <div className="max-w-sm mx-auto p-6 mt-20">
      <h1 className="text-xl font-semibold mb-1">Staff Login</h1>
      <p className="text-sm text-zinc-500 mb-6">Barangay officials and system administrators</p>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input required type="email" placeholder="Email" className="border rounded px-3 py-2"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" className="border rounded px-3 py-2"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="bg-black text-white rounded-full py-2.5 font-medium disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}