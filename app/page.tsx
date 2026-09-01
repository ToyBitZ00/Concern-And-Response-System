import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Flower2,
  Leaf,
  MapPin,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Sprout,
  TreePine,
} from "lucide-react";

export default function App() {
  return (
    <div
      id="home"
      className="min-h-screen overflow-hidden bg-[#F6FBF8] font-sans text-gray-900 selection:bg-emerald-200"
    >
      {/* =====================================================
          GLOBAL ANIMATIONS
      ====================================================== */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(30px);
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
            transform: translateY(-10px);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.85;
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 75%;
          }
        }

        @keyframes leafFall {
          0% {
            opacity: 0;
            transform: translate3d(0, -120px, 0) rotate(0deg);
          }
          14% {
            opacity: 0;
            transform: translate3d(18px, -40px, 0) rotate(45deg);
          }
          22% {
            opacity: 0.75;
          }
          50% {
            transform: translate3d(36px, 45vh, 0) rotate(145deg);
          }
          90% {
            opacity: 0.65;
          }
          100% {
            opacity: 0;
            transform: translate3d(-24px, 92vh, 0) rotate(310deg);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.8s ease-out both;
        }

        .animate-fade-right {
          animation: fadeRight 0.9s ease-out both;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: floatSlow 5s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulseSoft 3s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 1.5s ease-out 0.8s both;
        }

        .falling-leaf {
          animation-name: leafFall;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          filter: drop-shadow(0 8px 12px rgba(0, 90, 45, 0.12));
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

        .delay-500 {
          animation-delay: 500ms;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-7xl items-center px-6 lg:px-8">

          {/* LOGO */}
          <a
            href="/"
            className="group flex items-center gap-2.5"
          >
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

          {/* RIGHT SIDE NAVIGATION */}
          <div className="ml-auto flex items-center gap-5 lg:gap-8">

            {/* NAV LINKS */}
            <nav className="hidden items-center gap-6 lg:flex">

              <a
                href="/"
                className="relative py-2 text-sm font-semibold text-gray-950 transition-colors hover:text-[#00A859]"
              >
                Home

                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#00A859]" />
              </a>

              <a
                href="/#how-it-works"
                className="group relative py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-950"
              >
                How It Works

                <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-[#00A859] transition-all duration-300 group-hover:w-full" />
              </a>

              <a
                href="/#awareness"
                className="group relative py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-950"
              >
                Awareness

                <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-[#00A859] transition-all duration-300 group-hover:w-full" />
              </a>

            </nav>

            {/* DIVIDER */}
            <div className="hidden h-7 w-px bg-gray-200 lg:block" />

            {/* ADMIN LOGIN */}
            <a
              href="/login"
              className="hidden text-sm font-semibold text-gray-600 transition-colors hover:text-gray-950 sm:block"
            >
              Admin Login
            </a>

            {/* REPORT BUTTON */}
            <a
              href="/resident"
              className="group inline-flex items-center gap-2 rounded-full bg-[#00A859] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#008F4B] hover:shadow-lg hover:shadow-emerald-900/20"
            >
              Submit Report

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <main>

        <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-16 lg:grid-cols-12 lg:px-8 lg:py-24">

          {/* Background Decoration */}
          <div className="pointer-events-none absolute left-[-180px] top-[-150px] h-[400px] w-[400px] rounded-full bg-emerald-100/50 blur-3xl" />

          {/* Falling Leaves */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {[
              {
                Icon: Leaf,
                left: "8%",
                size: "34px",
                duration: "9s",
                delay: "0s",
                color: "#00A859",
              },
              {
                Icon: Sprout,
                left: "22%",
                size: "28px",
                duration: "11s",
                delay: "1.2s",
                color: "#4CAF50",
              },
              {
                Icon: TreePine,
                left: "42%",
                size: "38px",
                duration: "10s",
                delay: "2.4s",
                color: "#2E9B5F",
              },
              {
                Icon: Flower2,
                left: "63%",
                size: "30px",
                duration: "12s",
                delay: "0.8s",
                color: "#73C995",
              },
              {
                Icon: Leaf,
                left: "82%",
                size: "42px",
                duration: "10.5s",
                delay: "3.1s",
                color: "#00A859",
              },
              {
                Icon: Sprout,
                left: "92%",
                size: "26px",
                duration: "13s",
                delay: "4.2s",
                color: "#39AA68",
              },
            ].map(({ Icon, ...leaf }) => (
              <Icon
                key={leaf.left}
                className="falling-leaf absolute -top-24"
                style={{
                  left: leaf.left,
                  width: leaf.size,
                  height: leaf.size,
                  color: leaf.color,
                  animationDuration: leaf.duration,
                  animationDelay: leaf.delay,
                }}
              />
            ))}
          </div>

          {/* =================================================
              LEFT CONTENT
          ================================================== */}
          <div className="relative z-10 lg:col-span-7">

            {/* Location */}
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700">

              <MapPin className="h-3.5 w-3.5" />

              Barangay Barangca

              <span className="h-1 w-1 rounded-full bg-emerald-500" />

              Candaba, Pampanga
            </div>

            {/* Heading */}
            <h1 className="animate-fade-up delay-100 mt-7 max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-[-0.045em] text-gray-950 sm:text-6xl lg:text-[4.6rem]">
              Cleaner surroundings start with{" "}
              <span className="text-[#00A859]">
                one report.
              </span>
            </h1>

            {/* Description */}
            <p className="animate-fade-up delay-200 mt-7 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Help keep our community clean by reporting improper waste
              disposal directly to the barangay. Track every report from
              submission to resolution.
            </p>

            {/* Buttons */}
            <div className="animate-fade-up delay-300 mt-9 flex flex-wrap items-center gap-4">

              <a
                href="/resident"
                className="group inline-flex items-center gap-2 rounded-full bg-[#00A859] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-700/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#008F4B] hover:shadow-xl"
              >
                Submit a Report

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50"
              >
                How It Works
              </a>

            </div>

            {/* Trust Indicators */}
            <div className="animate-fade-up delay-500 mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00A859]" />
                Direct barangay reporting
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#00A859]" />
                Community focused
              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT HERO VISUAL
          ================================================== */}
          <div className="animate-fade-right relative lg:col-span-5">

            {/* Floating Decoration */}
            <div className="animate-float absolute -right-4 -top-5 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white text-[#00A859] shadow-xl">
              <Leaf className="h-6 w-6" />
            </div>

            <div className="animate-float-slow absolute -bottom-5 -left-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white text-[#00A859] shadow-lg">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            {/* Main Card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-[#DDF7E9] via-[#ECFAF2] to-white p-5 shadow-[0_25px_70px_-30px_rgba(0,120,70,0.3)]">

              {/* Glow */}
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />

              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-green-200/40 blur-3xl" />

              {/* Illustration */}
              <div className="relative flex h-[390px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/60">

                {/* Sun */}
                <div className="animate-pulse-soft absolute right-10 top-10 h-14 w-14 rounded-full bg-amber-200/80" />

                {/* Clouds */}
                <div className="absolute left-10 top-16 h-4 w-20 rounded-full bg-white/70" />
                <div className="absolute left-16 top-12 h-6 w-12 rounded-full bg-white/70" />

                {/* Back Hill */}
                <div className="absolute bottom-0 left-[-10%] h-44 w-[75%] rounded-[50%] bg-[#A9DFBD]" />

                {/* Front Hill */}
                <div className="absolute bottom-[-20px] right-[-10%] h-52 w-[75%] rounded-[50%] bg-[#73C995]" />

                {/* Ground */}
                <div className="absolute bottom-0 h-24 w-full bg-[#3BAA6A]" />

                {/* LEFT TREE */}
                <div className="absolute bottom-16 left-10">

                  <div className="mx-auto h-28 w-5 rounded-full bg-[#795548]" />

                  <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-[#2E9B5F]" />

                  <div className="absolute -right-7 -top-5 h-20 w-20 rounded-full bg-[#39AA68]" />

                </div>

                {/* RIGHT TREE */}
                <div className="absolute bottom-14 right-12">

                  <div className="mx-auto h-24 w-4 rounded-full bg-[#795548]" />

                  <div className="absolute -left-8 -top-9 h-20 w-20 rounded-full bg-[#2E9B5F]" />

                  <div className="absolute -right-6 -top-3 h-16 w-16 rounded-full bg-[#43B96F]" />

                </div>

                {/* =================================================
                    REPORT STATUS CARD
                ================================================== */}
                <div className="animate-float relative z-10 w-[82%] max-w-sm rounded-2xl border border-white bg-white p-5 shadow-2xl shadow-emerald-900/10">

                  {/* Header */}
                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Community Report
                      </p>

                      <h3 className="mt-1 font-bold text-gray-900">
                        Improper Waste Disposal
                      </h3>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859]">
                      <Leaf className="h-5 w-5" />
                    </div>

                  </div>

                  {/* Status */}
                  <div className="mt-4 flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-[#00A859]" />

                    <span className="text-xs font-semibold text-emerald-700">
                      Under Review
                    </span>

                  </div>

                  {/* Progress */}
                  <div className="mt-4 rounded-xl bg-gray-50 p-3">

                    <div className="flex items-center gap-3">

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">

                        <div className="animate-progress h-full rounded-full bg-[#00A859]" />

                      </div>

                      <span className="text-xs font-bold text-emerald-700">
                        75%
                      </span>

                    </div>

                    <div className="mt-2 flex justify-between text-[10px] text-gray-400">
                      <span>Submitted</span>
                      <span>Review</span>
                      <span>Resolved</span>
                    </div>

                  </div>

                  {/* Location */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-[#00A859]" />
                    Barangay Barangca
                  </div>

                </div>
              </div>

              {/* Bottom Caption */}
              <div className="relative mt-4 flex items-center justify-between px-1">

                <div>
                  <p className="text-xs font-bold text-emerald-700">
                    Building a cleaner community
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Every report makes a difference.
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00A859] text-white shadow-sm">
                  <Leaf className="h-4 w-4" />
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}
        <section
          id="how-it-works"
          className="border-y border-gray-100 bg-white"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

            {/* Heading */}
            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#00A859]">
                Simple process
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Report. Track. Improve.
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                eConcern connects residents with the barangay to make
                environmental reporting simple, transparent, and actionable.
              </p>

            </div>

            {/* Steps */}
            <div className="mt-12 grid gap-5 md:grid-cols-3">

              {[
                {
                  number: "01",
                  icon: Leaf,
                  title: "Submit a Report",
                  text: "Tell us where the problem is and provide the details needed by the barangay.",
                },
                {
                  number: "02",
                  icon: ShieldCheck,
                  title: "Barangay Reviews",
                  text: "Your report is reviewed and assigned for appropriate action.",
                },
                {
                  number: "03",
                  icon: BarChart3,
                  title: "Track Progress",
                  text: "Follow the status of your report until the concern is resolved.",
                },
              ].map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="group relative rounded-2xl border border-gray-100 bg-[#F8FCFA] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-100 hover:bg-white hover:shadow-xl"
                  >

                    {/* Number */}
                    <div className="flex items-center justify-between">

                      <span className="text-sm font-bold text-[#00A859]">
                        {step.number}
                      </span>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#00A859] transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>

                    </div>

                    <h3 className="mt-6 text-lg font-bold text-gray-950">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {step.text}
                    </p>

                  </div>
                );
              })}

            </div>
          </div>
        </section>

        {/* =====================================================
            AWARENESS CTA
        ====================================================== */}
        <section
          id="awareness"
          className="bg-[#F6FBF8]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

            <div className="relative overflow-hidden rounded-[2rem] bg-[#073B25] px-7 py-12 text-white sm:px-10 lg:px-14">

              {/* Background Decorations */}
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-green-300/10 blur-3xl" />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div className="max-w-2xl">

                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
                    Community awareness
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    A cleaner barangay starts with everyone.
                  </h2>

                  <p className="mt-4 leading-7 text-emerald-50/70">
                    Your report can help identify environmental concerns,
                    improve response times, and create a cleaner community
                    for everyone.
                  </p>

                </div>

                <a
                  href="/resident"
                  className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#073B25] transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-50 hover:shadow-lg lg:self-center"
                >
                  Make a Report

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-gray-100 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00A859] text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>

            <div>
              <span className="font-bold text-gray-900">
                eConcern
              </span>

              <p className="text-[11px] text-gray-400">
                Cleaner communities, together.
              </p>
            </div>

          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} eConcern · Barangay Barangca,
            Candaba, Pampanga
          </p>

        </div>
      </footer>
    </div>
  );
}
