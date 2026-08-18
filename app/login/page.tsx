import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f9f1] text-[#172018]">
      <div className="min-h-screen lg:grid lg:grid-cols-2">

        {/* =========================================================
            LEFT — LOGIN
        ========================================================= */}
        <section className="relative flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-12 xl:px-20">

          {/* Logo + Signup */}
          <header className="flex items-center justify-between">
            <Link
              href="/"
              className="text-3xl font-black tracking-[-0.08em] text-[#0b8f2f]"
            >
              RESTRO
            </Link>

            <Link
              href="/signup"
              className="text-sm font-semibold text-[#516057] transition hover:text-[#0b8f2f]"
            >
              Create account →
            </Link>
          </header>

          {/* Login content */}
          <div className="flex flex-1 items-center justify-center py-12 lg:justify-start">
            <div className="w-full max-w-[460px]">

              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#bde8c7] bg-[#eaffef] px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#0dbb3f]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#087b29]">
                    RESTRO for restaurants
                  </span>
                </div>

                <h1 className="text-[42px] font-black leading-[0.98] tracking-[-0.055em] sm:text-[52px]">
                  Run your
                  <br />
                  restaurant.
                  <br />
                  <span className="text-[#0bb83d]">From one place.</span>
                </h1>

                <p className="mt-5 max-w-[420px] text-[15px] leading-7 text-[#69766d]">
                  Sign in to manage orders, kitchen activity, payments,
                  tables and your restaurant — all from one simple system.
                </p>
              </div>

              {/* Login Card */}
              <div className="rounded-[26px] border border-[#dfe8df] bg-white p-5 shadow-[0_20px_60px_rgba(21,55,29,0.08)] sm:p-7">

                <form className="space-y-5">

                  {/* Email */}
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold text-[#334139]">
                      Email address
                    </span>

                    <input
                      type="email"
                      placeholder="you@restaurant.com"
                      className="h-14 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm text-[#172018] outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10"
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
                        className="text-xs font-bold text-[#0b9e32] hover:text-[#087b29]"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="h-14 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm text-[#172018] outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10"
                    />
                  </label>

                  {/* Login */}
                  <button
                    type="button"
                    className="h-14 w-full rounded-2xl bg-[#0cae36] text-sm font-black text-white shadow-[0_10px_25px_rgba(12,174,54,0.22)] transition hover:-translate-y-0.5 hover:bg-[#099b30] active:translate-y-0"
                  >
                    Log in →
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
                    <span className="text-base">G</span>
                    Google
                  </button>

                  <button
                    type="button"
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dce5dd] bg-white text-sm font-bold text-[#27332b] transition hover:bg-[#f5f8f5]"
                  >
                    <span className="text-base">●</span>
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
            RIGHT — RESTAURANT VISUAL
        ========================================================= */}
        <section className="relative hidden min-h-screen overflow-hidden bg-[#e9f7e8] lg:block">

          {/* Background shapes */}
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#c9f4cf]" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#d9f5c9]" />

          {/* Header text */}
          <div className="absolute left-14 top-14 z-10 max-w-[500px]">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#0a9c31]">
              Built for restaurants
            </p>

            <h2 className="text-5xl font-black leading-[0.98] tracking-[-0.05em] text-[#18231b]">
              Your restaurant.
              <br />
              <span className="text-[#0aae38]">
                One smart system.
              </span>
            </h2>

            <p className="mt-5 max-w-[430px] text-sm leading-6 text-[#68756b]">
              From the first QR scan to the final payment, RESTRO keeps
              your restaurant moving.
            </p>
          </div>

          {/* Main illustration */}
          <div className="absolute left-1/2 top-[52%] w-[620px] -translate-x-1/2 -translate-y-1/2">

            {/* Glow */}
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bff1c5] blur-3xl" />

            {/* Illustration card */}
            <div className="relative mx-auto h-[470px] w-[430px] rounded-[38px] border border-white/80 bg-white/75 shadow-[0_30px_80px_rgba(30,80,38,0.12)] backdrop-blur-xl">

              {/* Top dots */}
              <div className="absolute left-7 top-6 flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffb74d]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#78d987]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffcf67]" />
              </div>

              {/* Kitchen label */}
              <div className="absolute left-7 top-14">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7b877e]">
                  RESTRO KITCHEN
                </p>
              </div>

              {/* Chef SVG */}
              <svg
                viewBox="0 0 500 500"
                className="absolute left-1/2 top-[55px] h-[360px] w-[360px] -translate-x-1/2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Chef body */}
                <path
                  d="M155 355C155 305 190 275 250 275C310 275 345 305 345 355V405H155V355Z"
                  fill="#F8FAF6"
                  stroke="#D6DED7"
                  strokeWidth="3"
                />

                {/* Chef neck */}
                <path
                  d="M225 255H275V290C275 303 225 303 225 290V255Z"
                  fill="#C98255"
                />

                {/* Chef head */}
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

                {/* Chef hat */}
                <path
                  d="M200 175C183 163 183 136 201 126C194 98 218 78 242 89C255 65 291 76 294 103C319 100 334 123 320 144C318 163 304 175 287 175H200Z"
                  fill="#FFFFFF"
                  stroke="#DCE4DE"
                  strokeWidth="3"
                />

                {/* Jacket */}
                <path
                  d="M177 306C192 285 213 276 250 276C287 276 308 285 323 306L342 405H158L177 306Z"
                  fill="#F7F8F3"
                  stroke="#D6DED7"
                  strokeWidth="3"
                />

                {/* Jacket line */}
                <path
                  d="M250 282V403"
                  stroke="#D6DED7"
                  strokeWidth="3"
                />

                {/* Buttons */}
                <circle cx="236" cy="320" r="4" fill="#9BA59D" />
                <circle cx="236" cy="347" r="4" fill="#9BA59D" />
                <circle cx="236" cy="374" r="4" fill="#9BA59D" />

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

                {/* Pan handle */}
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
                  transform="rotate(15 218 397)"
                />

                <ellipse
                  cx="251"
                  cy="395"
                  rx="19"
                  ry="11"
                  fill="#A85428"
                  transform="rotate(-10 251 395)"
                />

                <ellipse
                  cx="282"
                  cy="396"
                  rx="18"
                  ry="11"
                  fill="#E6A52D"
                  transform="rotate(35 282 396)"
                />

                {/* Flame */}
                <path
                  d="M238 433C222 449 229 469 250 471C271 469 278 449 262 433C258 444 250 448 250 448C250 448 243 441 238 433Z"
                  fill="#FFB52E"
                />

                <path
                  d="M245 451C240 459 244 465 250 466C256 465 260 459 255 451C253 456 250 458 250 458C250 458 247 455 245 451Z"
                  fill="#FF7A18"
                />
              </svg>

              {/* Kitchen counter */}
              <div className="absolute bottom-0 left-0 right-0 h-[92px] rounded-b-[38px] bg-[#29332b]">
                <div className="flex h-full items-center justify-center">
                  <span className="text-[11px] font-black tracking-[0.3em] text-white/45">
                    RESTRO KITCHEN
                  </span>
                </div>
              </div>

              {/* Live orders card */}
              <div className="absolute -right-24 top-16 w-[190px] rounded-2xl border border-white bg-white p-4 shadow-[0_18px_40px_rgba(25,60,30,0.14)]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#77827a]">
                    Live orders
                  </p>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#19c64b]" />
                </div>

                <p className="mt-3 text-3xl font-black text-[#172018]">
                  24
                </p>

                <p className="mt-1 text-xs font-bold text-[#12a43a]">
                  +18% today
                </p>
              </div>

              {/* Kitchen card */}
              <div className="absolute -left-28 bottom-20 w-[205px] rounded-2xl border border-white bg-white p-4 shadow-[0_18px_40px_rgba(25,60,30,0.14)]">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#77827a]">
                  Kitchen
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2df] text-xl">
                    🔥
                  </div>

                  <div>
                    <p className="text-sm font-black text-[#172018]">
                      Busy kitchen
                    </p>

                    <p className="text-xs font-bold text-[#ff9418]">
                      8 preparing
                    </p>
                  </div>
                </div>
              </div>

              {/* Revenue card */}
              <div className="absolute -bottom-16 right-[-45px] w-[220px] rounded-2xl border border-white bg-white p-5 shadow-[0_18px_40px_rgba(25,60,30,0.14)]">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#77827a]">
                  Today's revenue
                </p>

                <div className="mt-2 flex items-end justify-between">
                  <p className="text-2xl font-black text-[#172018]">
                    ₹24.6K
                  </p>

                  <span className="text-xs font-black text-[#0cae36]">
                    ↑ 18%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="absolute bottom-10 left-14 right-14 rounded-[24px] border border-white/80 bg-white/70 p-5 shadow-[0_15px_45px_rgba(30,80,38,0.08)] backdrop-blur-xl">
            <div className="grid grid-cols-3 gap-5">

              <div>
                <p className="text-2xl font-black text-[#172018]">
                  24
                </p>
                <p className="mt-1 text-xs font-semibold text-[#78837b]">
                  Live orders
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-[#0caf37]">
                  12m
                </p>
                <p className="mt-1 text-xs font-semibold text-[#78837b]">
                  Avg. prep time
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-[#172018]">
                  ₹24.6K
                </p>
                <p className="mt-1 text-xs font-semibold text-[#78837b]">
                  Today's revenue
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
            MOBILE VISUAL
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#e9f7e8] px-5 py-16 lg:hidden">

          <div className="mx-auto max-w-md text-center">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0a9c31]">
              Built for restaurants
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
              Your restaurant.
              <br />
              <span className="text-[#0aae38]">
                One smart system.
              </span>
            </h2>

            <div className="mt-10 rounded-[30px] border border-white bg-white/70 p-6 shadow-xl">

              <div className="mx-auto max-w-[300px]">

                <svg
                  viewBox="0 0 500 500"
                  className="w-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="250"
                    cy="220"
                    r="58"
                    fill="#C98255"
                  />

                  <path
                    d="M194 216C188 170 210 145 250 145C290 145 315 170 307 216C294 193 278 183 250 184C223 184 207 196 194 216Z"
                    fill="#222923"
                  />

                  <path
                    d="M200 175C183 163 183 136 201 126C194 98 218 78 242 89C255 65 291 76 294 103C319 100 334 123 320 144C318 163 304 175 287 175H200Z"
                    fill="#FFFFFF"
                    stroke="#DCE4DE"
                    strokeWidth="3"
                  />

                  <path
                    d="M177 306C192 285 213 276 250 276C287 276 308 285 323 306L342 405H158L177 306Z"
                    fill="#F7F8F3"
                    stroke="#D6DED7"
                    strokeWidth="3"
                  />

                  <path
                    d="M250 282V403"
                    stroke="#D6DED7"
                    strokeWidth="3"
                  />

                  <circle cx="236" cy="320" r="4" fill="#9BA59D" />
                  <circle cx="236" cy="347" r="4" fill="#9BA59D" />
                  <circle cx="236" cy="374" r="4" fill="#9BA59D" />

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

                  <path
                    d="M355 400H420"
                    stroke="#252C27"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />

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

                  <path
                    d="M238 433C222 449 229 469 250 471C271 469 278 449 262 433C258 444 250 448 250 448C250 448 243 441 238 433Z"
                    fill="#FFB52E"
                  />
                </svg>

              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f1f8ef] px-4 py-3 text-left">
                <div>
                  <p className="text-xs font-black">
                    Kitchen status
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#ff9418]">
                    🔥 8 preparing
                  </p>
                </div>

                <p className="text-xl font-black text-[#0caf37]">
                  24
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}