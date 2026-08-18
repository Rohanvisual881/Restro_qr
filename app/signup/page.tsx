import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#07100a] text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex min-h-screen flex-col px-5 py-7 sm:px-10 lg:px-16 lg:py-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-black tracking-[-0.08em] text-[#22a83a]">
              RESTRO
            </Link>
            <Link href="/login" className="text-sm font-semibold text-white/60 hover:text-white">
              Already have an account? <span className="text-[#55c96a]">Log in</span>
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 items-center py-10">
            <div className="w-full">
              <div className="mb-7">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#55c96a]">
                  Get started
                </p>
                <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                  Create your
                  <span className="block text-[#55c96a]">restaurant account.</span>
                </h1>
                <p className="mt-4 text-sm leading-6 text-white/50">
                  Start managing your restaurant with QR ordering, live kitchen updates and smarter operations.
                </p>
              </div>

              <form className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full name"
                    className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#22a83a] focus:bg-white/[0.07]"
                  />
                  <input
                    type="text"
                    placeholder="Restaurant name"
                    className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#22a83a] focus:bg-white/[0.07]"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email address"
                  className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#22a83a] focus:bg-white/[0.07]"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#22a83a] focus:bg-white/[0.07]"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#22a83a] focus:bg-white/[0.07]"
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition placeholder:text-white/25 focus:border-[#22a83a] focus:bg-white/[0.07]"
                />

                <label className="flex gap-3 py-2 text-xs leading-5 text-white/45">
                  <input type="checkbox" className="mt-1 accent-[#22a83a]" />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="font-bold text-[#55c96a]">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="font-bold text-[#55c96a]">Privacy Policy</a>.
                  </span>
                </label>

                <button
                  type="button"
                  className="h-14 w-full rounded-2xl bg-[#12952b] text-sm font-black shadow-[0_12px_40px_rgba(18,149,43,0.22)] transition hover:-translate-y-0.5 hover:bg-[#18a936]"
                >
                  Create account →
                </button>
              </form>

              <div className="my-6 flex items-center gap-4 text-xs text-white/30">
                <div className="h-px flex-1 bg-white/10" />
                <span>or continue with</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="h-12 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold transition hover:bg-white/[0.08]">
                  Google
                </button>
                <button className="h-12 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold transition hover:bg-white/[0.08]">
                  Apple
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/25">© 2026 RESTRO · Restaurant operating system</p>
        </section>

        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <img
            src="/auth/restro-kitchen.png"
            alt="Chef plating food in a restaurant kitchen"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07100a] via-black/10 to-black/20" />

          <div className="absolute left-8 right-8 top-8 rounded-3xl border border-white/15 bg-black/40 p-6 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#55c96a]">Built for restaurants</p>
            <h2 className="mt-3 max-w-lg text-3xl font-black tracking-[-0.04em]">
              From the first scan to the final payment.
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {["QR ordering", "Live kitchen", "Easy payments", "Analytics"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white/75">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/15 bg-black/45 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/45">Kitchen status</p>
                <p className="mt-1 text-xl font-black text-[#ff9b2f]">Busy · 8 preparing</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-[#22a83a]/20 ring-1 ring-[#55c96a]/30" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
