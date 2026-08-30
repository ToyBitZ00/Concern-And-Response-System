"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  variant?: "public" | "staff";
  staffLabel?: string; // e.g. "Barangay Official" or "System Admin"
  onSignOut?: () => void;
};

export default function Navbar({ variant = "public", staffLabel, onSignOut }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const publicLinks = [
    { href: "/resident", label: "File a Report" },
    { href: "/resident?tab=track", label: "Track Status" },
  ];

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-(--color-surface)/80 backdrop-blur-md px-5 py-2.5 shadow-lg shadow-black/30">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="h-7 w-7 rounded-full bg-(--color-accent) grid place-items-center text-(--color-bg) font-(family-name:--font-display) font-bold text-sm">
              B
            </span>
            <span className="font-(family-name:--font-display) font-semibold text-sm leading-tight">
              Barangay Barangca
              <span className="block text-[10px] font-(family-name:--font-mono) font-normal text-(--color-muted) tracking-wide">
                WASTE RESPONSE SYSTEM
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-(--color-muted)">
            {variant === "public" &&
              publicLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`transition-colors hover:text-(--color-text) ${
                    pathname === l.href ? "text-(--color-accent)" : ""
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            {variant === "staff" && staffLabel && (
              <span className="text-(--color-text)">{staffLabel}</span>
            )}
          </nav>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {variant === "public" ? (
              <Link
                href="/login"
                className="text-xs font-medium px-4 py-2 rounded-full border border-white/15 hover:border-(--color-accent) hover:text-(--color-accent) transition-colors"
              >
                Staff Login
              </Link>
            ) : (
              <button
                onClick={onSignOut}
                className="text-xs font-medium px-4 py-2 rounded-full bg-(--color-danger)/15 text-(--color-danger) hover:bg-(--color-danger)/25 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden h-8 w-8 grid place-items-center rounded-full border border-white/10 shrink-0"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="sr-only">Menu</span>
            <div className="w-3.5 flex flex-col gap-[3px]">
              <span className="h-[1.5px] bg-(--color-text) rounded-full" />
              <span className="h-[1.5px] bg-(--color-text) rounded-full" />
              <span className="h-[1.5px] bg-(--color-text) rounded-full" />
            </div>
          </button>
        </div>

        {/* Mobile sheet */}
        {open && (
          <div className="sm:hidden mt-2 rounded-3xl border border-white/10 bg-(--color-surface)/95 backdrop-blur-md p-4 flex flex-col gap-1 shadow-lg shadow-black/30">
            {variant === "public" &&
              publicLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5"
                >
                  {l.label}
                </Link>
              ))}
            {variant === "public" ? (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-1 px-3 py-2.5 rounded-xl text-sm font-medium text-center border border-white/15 text-(--color-accent)"
              >
                Staff Login
              </Link>
            ) : (
              <>
                {staffLabel && <p className="px-3 py-1 text-xs text-(--color-muted)">{staffLabel}</p>}
                <button
                  onClick={onSignOut}
                  className="mt-1 px-3 py-2.5 rounded-xl text-sm font-medium text-center bg-(--color-danger)/15 text-(--color-danger)"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}