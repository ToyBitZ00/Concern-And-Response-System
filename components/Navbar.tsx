"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-green-700"
        >
          <span className="text-xl">✦</span>
          <span>ecoglobe</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm text-gray-700 hover:text-green-600">
            Home
          </Link>

          <a
            href="#how-it-works"
            className="text-sm text-gray-700 hover:text-green-600"
          >
            How It Works
          </a>

          <a
            href="#awareness"
            className="text-sm text-gray-700 hover:text-green-600"
          >
            Awareness
          </a>

          <Link
            href="/resident"
            className="rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Submit Report
          </Link>

          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-green-600"
          >
            Admin Login
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-gray-700 md:hidden"
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            <a href="#how-it-works" onClick={() => setOpen(false)}>
              How It Works
            </a>

            <a href="#awareness" onClick={() => setOpen(false)}>
              Awareness
            </a>

            <Link
              href="/resident"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-green-600 px-4 py-3 text-center font-medium text-white"
            >
              Submit Report
            </Link>

            <Link href="/login" onClick={() => setOpen(false)}>
              Admin Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}