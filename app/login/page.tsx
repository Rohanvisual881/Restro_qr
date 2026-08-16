"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F7F8F6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[430px]">
        {/* BRAND */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#54B226] shadow-lg shadow-green-200">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10h18" />
              <path d="M5 10v9" />
              <path d="M19 10v9" />
              <path d="M4 19h16" />
              <path d="M6 10 8 5h8l2 5" />
              <path d="M9 14h6" />
            </svg>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#1F1F1F]">
            Restro
          </h1>

          <p className="mt-1 text-sm text-[#6B7280]">
            Smart restaurant management
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-[#EAEAEA] bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.07)] sm:p-9">
          <div>
            <h2 className="text-[25px] font-bold tracking-tight text-[#1F1F1F]">
              Welcome back
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Login to manage your restaurant, menu, tables and orders.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-7 space-y-5">
            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#1F1F1F]"
              >
                Email address
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] pl-11 pr-4 text-sm text-[#1F1F1F] outline-none transition focus:border-[#54B226] focus:bg-white focus:ring-4 focus:ring-[#54B226]/10"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#1F1F1F]"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-semibold text-[#54B226] hover:text-[#0C831F]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="11"
                      rx="2"
                    />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] pl-11 pr-16 text-sm text-[#1F1F1F] outline-none transition focus:border-[#54B226] focus:bg-white focus:ring-4 focus:ring-[#54B226]/10"
                />
              </div>
            </div>

            {/* ERROR */}
            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                <svg
                  className="mt-0.5 shrink-0"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>

                <span>{message}</span>
              </div>
            )}

            {/* LOGIN */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#54B226] text-sm font-bold text-white shadow-[0_5px_15px_rgba(84,178,38,0.25)] transition hover:bg-[#0C831F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Logging in...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>

          {/* SIGNUP */}
          <div className="mt-7 border-t border-[#EEEEEE] pt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Don't have a restaurant account?
            </p>

            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="mt-2 text-sm font-bold text-[#54B226] hover:text-[#0C831F]"
            >
              Create your account →
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs text-[#9CA3AF]">
          © 2026 Restro · Restaurant management made simple
        </p>
      </div>
    </main>
  );
}