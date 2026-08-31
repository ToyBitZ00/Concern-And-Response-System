import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />

      <section className="bg-green-50">
        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
          
          <div>
            <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              Barangay Barangca • Candaba, Pampanga
            </span>

            <h1 className="max-w-2xl text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
              Cleaner surroundings start with{" "}
              <span className="text-green-600">one report.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Report improper waste disposal concerns directly to the
              barangay and follow their progress from submission to resolution.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/resident"
                className="rounded-full bg-green-600 px-7 py-3 text-center font-semibold text-white hover:bg-green-700"
              >
                Submit a Report
              </Link>

              <a
                href="#how-it-works"
                className="rounded-full border border-green-200 bg-white px-7 py-3 text-center font-semibold text-green-700"
              >
                How It Works
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-xl">
            <img
              src="/images/hero-landscape.jpg"
              alt="Green landscape"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* More sections will go here */}
    </main>
  );
}