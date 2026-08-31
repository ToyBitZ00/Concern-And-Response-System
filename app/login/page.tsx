export default function LoginPage() {
  return (
    <main className="min-h-screen bg-green-600 p-0 sm:p-6">
      <div className="mx-auto flex min-h-screen max-w-6xl overflow-hidden bg-white shadow-2xl sm:min-h-[90vh] sm:rounded-2xl">
        
        {/* Login */}
        <section className="flex w-full items-center justify-center px-6 py-12 md:w-1/2">
          <div className="w-full max-w-sm">
            
            <div className="mb-10 text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Sign in to Ecoglobe
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Authorized personnel only
              </p>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm hover:bg-gray-50">
              Sign in with Google
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Email
                </label>

                <input
                  type="email"
                  className="w-full border-b border-gray-300 bg-transparent px-1 py-2 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Password
                </label>

                <input
                  type="password"
                  className="w-full border-b border-gray-300 bg-transparent px-1 py-2 outline-none focus:border-green-600"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700"
              >
                Log in
              </button>
            </form>
          </div>
        </section>

        {/* Decorative panel */}
        <section
          className="relative hidden bg-cover bg-center md:block md:w-1/2"
          style={{
            backgroundImage: "url('/images/login-landscape.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute bottom-12 left-10 right-10 text-white">
            <div className="text-2xl font-bold">✦ ecoglobe</div>

            <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight">
              Go green and reduce your carbon footprint.
            </h2>
          </div>
        </section>
      </div>
    </main>
  );
}