import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  // 1. Verify the caller is an authenticated superadmin
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "superadmin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // 2. Parse and validate input
  const body = await request.json();
  const { email, password, full_name } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // 3. Use the service-role client — server-only, never sent to browser
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: newUser, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip email verification since superadmin is vouching for them
    });

  if (createError || !newUser.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Failed to create user" },
      { status: 500 }
    );
  }

  // 4. Insert the profile row with role = admin
  const { error: profileError } = await adminClient.from("profiles").insert({
    id: newUser.user.id,
    full_name,
    email,
    role: "admin",
  });

  if (profileError) {
    // Roll back the auth user if the profile insert fails, so we don't
    // end up with an orphaned auth account with no profile
    await adminClient.auth.admin.deleteUser(newUser.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId: newUser.user.id });
}