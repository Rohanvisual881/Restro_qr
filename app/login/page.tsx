"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      console.log("RESTRO: Starting Supabase login...");
      console.log("RESTRO: Email:", cleanEmail);
      console.log(
        "RESTRO: Supabase URL exists:",
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
      );
      console.log(
        "RESTRO: Supabase publishable key exists:",
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
      );

      const loginPromise = supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      /*
       * Prevent the UI from being stuck forever if the browser
       * cannot complete the Supabase request.
       */
      const timeoutPromise = new Promise<{
        data: null;
        error: Error;
      }>((resolve) => {
        setTimeout(() => {
          resolve({
            data: null,
            error: new Error(
              "The Supabase request timed out. Check your Supabase URL, network connection, and environment variables."
            ),
          });
        }, 15000);
      });

      const result = await Promise.race([
        loginPromise,
        timeoutPromise,
      ]);

      const { data, error: loginError } = result;

      console.log("RESTRO: Login response:", {
        data,
        error: loginError,
      });

      if (loginError) {
        setError(loginError.message || "Unable to sign in.");
        setLoading(false);
        return;
      }

      if (!data?.session) {
        setError(
          "Login completed but no session was created. Please check your Supabase authentication settings."
        );
        setLoading(false);
        return;
      }

      console.log(
        "RESTRO: Login successful:",
        data.session.user.email
      );

      /*
       * Give the Supabase browser client a moment to persist
       * the session before navigating.
       */
      await new Promise((resolve) => setTimeout(resolve, 300));

      router.replace("/dashboard");
      router.refresh();

    } catch (err) {
      console.error("RESTRO: Login exception:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while signing in.");
      }

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9f1] text-[#172018]">
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">

        {/* =========================================================
            LEFT
        ========================================================= */}
        <section className="relative flex min-h-screen min-w-0 flex-col px-5 py-6 sm:px-8 lg:px-10 xl:px-16">

          {/* Header */}
          <header className="flex items-center justify-between gap-4">

            <Link
              href="/"
              className="shrink-0 text-3xl font-black tracking-[-0.08em] text-[#0b8f2f]"
            >
              RESTRO
            </Link>

            <Link
              href="/signup"
              className="shrink-0 text-right text-xs font-semibold text-[#516057] transition hover:text-[#0b8f2f] sm:text-sm"
            >
              Don't have an account?{" "}
              <span className="font-black text-[#0b9f32]">
                Sign up →
              </span>
            </Link>

          </header>


          {/* Login content */}
          <div className="flex flex-1 items-center justify-center py-10 lg:justify-start">

            <div className="w-full max-w-[460px]">

              {/* Heading */}
              <div className="mb-7">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#bde8c7] bg-[#eaffef] px-3 py-1.5">

                  <span className="h-2 w-2 rounded-full bg-[#0dbb3f]" />

                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#087b29] sm:text-[11px]">
                    Welcome back
                  </span>

                </div>

                <h1 className="text-[40px] font-black leading-[0.98] tracking-[-0.055em] sm:text-[50px]">
                  Run your
                  <br />
                  restaurant.
                  <br />
                  <span className="text-[#0bb83d]">
                    From one place.
                  </span>
                </h1>

                <p className="mt-5 max-w-[430px] text-[14px] leading-6 text-[#69766d]">
                  Sign in to manage orders, kitchen activity, payments,
                  tables and your restaurant.
                </p>

              </div>


              {/* Login card */}
              <div className="rounded-[26px] border border-[#dfe8df] bg-white p-5 shadow-[0_20px_60px_rgba(21,55,29,0.08)] sm:p-7">

                <form
                  onSubmit={handleLogin}
                  className="space-y-5"
                >

                  {/* Email */}
                  <label className="block">

                    <span className="mb-2 block text-xs font-bold text-[#334139]">
                      Email address
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@restaurant.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm text-[#172018] outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </label>


                  {/* Password */}
                  <label className="block">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-xs font-bold text-[#334139]">
                        Password
                      </span>

                      <button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          setError(
                            "Password reset is not connected yet."
                          )
                        }
                        className="text-xs font-bold text-[#0b9f32] hover:text-[#087b29]"
                      >
                        Forgot password?
                      </button>

                    </div>

                    <input
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm text-[#172018] outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </label>


                  {/* Error */}
                  {error && (
                    <div className="rounded-2xl border border-[#ffcaca] bg-[#fff3f3] px-4 py-3">

                      <p className="text-sm font-semibold leading-5 text-[#d83232]">
                        {error}
                      </p>

                    </div>
                  )}


                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-14 w-full rounded-2xl bg-[#0cae36] text-sm font-black text-white shadow-[0_10px_25px_rgba(12,174,54,0.22)] transition hover:-translate-y-0.5 hover:bg-[#099b30] active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">

                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Signing in...

                      </span>
                    ) : (
                      "Log in →"
                    )}
                  </button>

                </form>


                {/* Divider */}
                <div className="my-6 flex items-center gap-4">

                  <div className="h-px flex-1 bg-[#e5ebe6]" />

                  <span className="text-xs font-medium text-[#9aa59d]">
                    or continue with
                  </span>

                  <div className="h-px flex-1 bg-[#e5ebe6]" />

                </div>


                {/* Social */}
                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dce5dd] bg-white text-sm font-bold text-[#27332b] transition hover:bg-[#f5f8f5]"
                  >
                    <span className="text-base">
                      G
                    </span>
                    Google
                  </button>

                  <button
                    type="button"
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dce5dd] bg-white text-sm font-bold text-[#27332b] transition hover:bg-[#f5f8f5]"
                  >
                    <span className="text-base">
                      ●
                    </span>
                    Apple
                  </button>

                </div>


                {/* Signup */}
                <p className="mt-6 text-center text-sm text-[#7c877f]">

                  New to RESTRO?{" "}

                  <Link
                    href="/signup"
                    className="font-black text-[#0a9f32] hover:text-[#087b29]"
                  >
                    Create your account
                  </Link>

                </p>

              </div>

            </div>

          </div>


          {/* Footer */}
          <footer className="pt-5 text-center text-xs text-[#9aa59d] lg:text-left">
            © 2026 RESTRO · Restaurant operating system
          </footer>

        </section>


        {/* =========================================================
            RIGHT — DESKTOP VISUAL
        ========================================================= */}
        <section className="relative hidden min-h-screen min-w-0 overflow-hidden bg-[#e9f7e8] lg:block">

          {/* Background */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#c9f4cf]" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#d9f5c9]" />


          {/* Heading */}
          <div className="absolute left-10 right-10 top-10 z-10 xl:left-14 xl:right-14 xl:top-14">

            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#0a9c31]">
              Built for restaurants
            </p>

            <h2 className="max-w-[560px] text-[40px] font-black leading-[0.98] tracking-[-0.05em] text-[#18231b] xl:text-5xl">
              Your restaurant.
              <br />

              <span className="text-[#0aae38]">
                One smart system.
              </span>
            </h2>

            <p className="mt-4 max-w-[470px] text-sm leading-6 text-[#68756b]">
              From the first QR scan to the final payment,
              RESTRO keeps your restaurant moving.
            </p>

          </div>


          {/* Main visual */}
          <div className="absolute left-1/2 top-[57%] w-[min(620px,88%)] -translate-x-1/2 -translate-y-1/2">

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bff1c5] blur-3xl" />


            {/* Main card */}
            <div className="relative mx-auto h-[460px] w-[min(420px,100%)] rounded-[38px] border border-white/90 bg-white/80 shadow-[0_25px_70px_rgba(30,80,38,0.12)] backdrop-blur-xl">

              {/* Dots */}
              <div className="absolute left-6 top-6 flex gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-[#ffb74d]" />

                <span className="h-2.5 w-2.5 rounded-full bg-[#78d987]" />

                <span className="h-2.5 w-2.5 rounded-full bg-[#ffcf67]" />

              </div>


              <div className="absolute left-6 top-14">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7b877e]">
                  RESTRO KITCHEN
                </p>

              </div>


              {/* Chef SVG */}
              <svg
                viewBox="0 0 500 500"
                className="absolute left-1/2 top-[55px] h-[340px] w-[340px] -translate-x-1/2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >

                {/* Head */}
                <circle
                  cx="250"
                  cy="220"
                  r="58"
                  fill="#C98255"
                />

                {/* Hair */}
                <path
                  d="M194 216C188 170 210 145 250 145C290 145 315 170 307 216C294 193 278 183 250 184C223 184 207 196 194 216Z"
                  fill="#222923"
                />

                {/* Hat */}
                <path
                  d="M200 175C183 163 183 136 201 126C194 98 218 78 242 89C255 65 291 76 294 103C319 100 334 123 320 144C318 163 304 175 287 175H200Z"
                  fill="#FFFFFF"
                  stroke="#DCE4DE"
                  strokeWidth="3"
                />

                {/* Neck */}
                <path
                  d="M225 255H275V290C275 303 225 303 225 290V255Z"
                  fill="#C98255"
                />

                {/* Jacket */}
                <path
                  d="M177 306C192 285 213 276 250 276C287 276 308 285 323 306L342 405H158L177 306Z"
                  fill="#F7F8F3"
                  stroke="#D6DED7"
                  strokeWidth="3"
                />

                {/* Jacket seam */}
                <path
                  d="M250 282V403"
                  stroke="#D6DED7"
                  strokeWidth="3"
                />

                {/* Buttons */}
                <circle
                  cx="236"
                  cy="320"
                  r="4"
                  fill="#9BA59D"
                />

                <circle
                  cx="236"
                  cy="347"
                  r="4"
                  fill="#9BA59D"
                />

                <circle
                  cx="236"
                  cy="374"
                  r="4"
                  fill="#9BA59D"
                />

                {/* Left arm */}
                <path
                  d="M180 310C153 317 139 346 146 370L159 406L193 394L181 357L205 331L180 310Z"
                  fill="#F5F7F2"
                  stroke="#D6DED7"
                  strokeWidth="3"
                />

                {/* Right arm */}
                <path
                  d="M320 310C350 318 361 347 354 369L339 405L305 393L319 354L295 330L320 310Z"
                  fill="#F5F7F2"
                  stroke="#D6DED7"
                  strokeWidth="3"
                />

                {/* Pan */}
                <ellipse
                  cx="250"
                  cy="405"
                  rx="115"
                  ry="35"
                  fill="#202722"
                />

                <ellipse
                  cx="250"
                  cy="398"
                  rx="88"
                  ry="22"
                  fill="#101511"
                />

                {/* Handle */}
                <path
                  d="M355 400H420"
                  stroke="#252C27"
                  strokeWidth="22"
                  strokeLinecap="round"
                />

                {/* Food */}
                <ellipse
                  cx="218"
                  cy="397"
                  rx="19"
                  ry="11"
                  fill="#D98625"
                />

                <ellipse
                  cx="251"
                  cy="395"
                  rx="19"
                  ry="11"
                  fill="#A85428"
                />

                <ellipse
                  cx="282"
                  cy="396"
                  rx="18"
                  ry="11"
                  fill="#E6A52D"
                />

                {/* Green garnish */}
                <ellipse
                  cx="238"
                  cy="383"
                  rx="7"
                  ry="12"
                  fill="#32A94D"
                  transform="rotate(35 238 383)"
                />

                <ellipse
                  cx="267"
                  cy="381"
                  rx="7"
                  ry="12"
                  fill="#4ABB59"
                  transform="rotate(-35 267 381)"
                />

                {/* Fire */}
                <path
                  d="M238 433C222 449 229 469 250 471C271 469 278 449 262 433C258 444 250 448 250 448C250 448 243 441 238 433Z"
                  fill="#FFB52E"
                />

                <path
                  d="M245 451C240 459 244 465 250 466C256 465 260 459 255 451C253 456 250 458 250 458C250 458 247 455 245 451Z"
                  fill="#FF7A18"
                />

              </svg>


              {/* Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[78px] rounded-b-[38px] bg-[#29332b]">

                <div className="flex h-full items-center justify-center">

                  <span className="text-[10px] font-black tracking-[0.3em] text-white/45">
                    RESTRO KITCHEN
                  </span>

                </div>

              </div>


              {/* Live orders */}
              <div className="absolute right-[-25px] top-[70px] w-[180px] rounded-2xl border border-white bg-white p-4 shadow-[0_18px_40px_rgba(25,60,30,0.14)]">

                <div className="flex items-center justify-between">

                  <p className="text-[9px] font-black uppercase tracking-wider text-[#77827a]">
                    Live orders
                  </p>

                  <span className="h-2.5 w-2.5 rounded-full bg-[#19c64b]" />

                </div>

                <p className="mt-3 text-3xl font-black text-[#172018]">
                  24
                </p>

                <p className="mt-1 text-xs font-bold text-[#0cae36]">
                  +18% today
                </p>

              </div>


              {/* Kitchen */}
              <div className="absolute bottom-[60px] left-[-25px] w-[190px] rounded-2xl border border-white bg-white p-4 shadow-[0_18px_40px_rgba(25,60,30,0.14)]">

                <p className="text-[9px] font-black uppercase tracking-wider text-[#77827a]">
                  Kitchen
                </p>

                <div className="mt-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2df] text-xl">
                    🔥
                  </div>

                  <div>

                    <p className="text-xs font-black text-[#172018]">
                      Busy kitchen
                    </p>

                    <p className="mt-1 text-[10px] font-bold text-[#ff9418]">
                      8 preparing
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Revenue */}
            <div className="absolute bottom-[-45px] right-[-10px] w-[210px] rounded-2xl border border-white bg-white p-4 shadow-[0_18px_40px_rgba(25,60,30,0.14)]">

              <p className="text-[9px] font-black uppercase tracking-wider text-[#77827a]">
                Today's revenue
              </p>

              <div className="mt-2 flex items-end justify-between">

                <p className="text-xl font-black text-[#172018]">
                  ₹24.6K
                </p>

                <span className="text-[10px] font-black text-[#0caf37]">
                  ↑ 18%
                </span>

              </div>

            </div>

          </div>


          {/* Bottom stats */}
          <div className="absolute bottom-7 left-8 right-8 rounded-[22px] border border-white/80 bg-white/75 p-4 shadow-[0_15px_45px_rgba(30,80,38,0.08)] backdrop-blur-xl xl:bottom-9 xl:left-12 xl:right-12">

            <div className="grid grid-cols-3 gap-3">

              <div>

                <p className="text-xl font-black text-[#172018] xl:text-2xl">
                  24
                </p>

                <p className="mt-1 text-[10px] font-semibold text-[#78837b] xl:text-xs">
                  Live orders
                </p>

              </div>

              <div>

                <p className="text-xl font-black text-[#0caf37] xl:text-2xl">
                  12m
                </p>

                <p className="mt-1 text-[10px] font-semibold text-[#78837b] xl:text-xs">
                  Avg. prep time
                </p>

              </div>

              <div>

                <p className="text-xl font-black text-[#172018] xl:text-2xl">
                  ₹24.6K
                </p>

                <p className="mt-1 text-[10px] font-semibold text-[#78837b] xl:text-xs">
                  Today's revenue
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}