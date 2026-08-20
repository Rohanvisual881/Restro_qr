import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f7f9f1] text-[#172018]">
      <div className="min-h-screen w-full lg:grid lg:grid-cols-2">

        {/* =========================================================
            LEFT — SIGNUP
        ========================================================= */}
        <section className="relative flex min-h-screen min-w-0 flex-col px-5 py-6 sm:px-8 lg:px-10 xl:px-16">

          {/* Logo + Login */}
          <header className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="shrink-0 text-3xl font-black tracking-[-0.08em] text-[#0b8f2f]"
            >
              RESTRO
            </Link>

            <Link
              href="/login"
              className="shrink-0 text-right text-xs font-semibold text-[#516057] transition hover:text-[#0b8f2f] sm:text-sm"
            >
              Already have an account?{" "}
              <span className="font-black text-[#0b9f32]">
                Log in →
              </span>
            </Link>
          </header>

          {/* Signup content */}
          <div className="flex flex-1 items-center justify-center py-8 lg:justify-start lg:py-6">
            <div className="w-full max-w-[460px]">

              {/* Heading */}
              <div className="mb-5">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#bde8c7] bg-[#eaffef] px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#0dbb3f]" />

                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#087b29] sm:text-[11px]">
                    Get started
                  </span>
                </div>

                <h1 className="text-[38px] font-black leading-[0.98] tracking-[-0.055em] sm:text-[48px]">
                  Create your
                  <br />
                  <span className="text-[#0bb83d]">
                    restaurant account.
                  </span>
                </h1>

                <p className="mt-4 max-w-[430px] text-[14px] leading-6 text-[#69766d]">
                  Start managing your restaurant with QR ordering,
                  live kitchen updates and smarter operations.
                </p>
              </div>

              {/* Signup Card */}
              <div className="rounded-[24px] border border-[#dfe8df] bg-white p-5 shadow-[0_20px_60px_rgba(21,55,29,0.08)] sm:p-6">

                <form className="space-y-3.5">

                  {/* Name + Restaurant */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold text-[#334139]">
                        Full name
                      </span>

                      <input
                        type="text"
                        placeholder="Your name"
                        className="h-12 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold text-[#334139]">
                        Restaurant name
                      </span>

                      <input
                        type="text"
                        placeholder="Restaurant name"
                        className="h-12 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10"
                      />
                    </label>

                  </div>

                  {/* Email */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#334139]">
                      Email address
                    </span>

                    <input
                      type="email"
                      placeholder="you@restaurant.com"
                      className="h-12 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10"
                    />
                  </label>

                  {/* Phone */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#334139]">
                      Phone number
                    </span>

                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="h-12 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10"
                    />
                  </label>

                  {/* Password */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#334139]">
                      Password
                    </span>

                    <input
                      type="password"
                      placeholder="Create a password"
                      className="h-12 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10"
                    />
                  </label>

                  {/* Confirm password */}
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-[#334139]">
                      Confirm password
                    </span>

                    <input
                      type="password"
                      placeholder="Confirm your password"
                      className="h-12 w-full rounded-2xl border border-[#dce5dd] bg-[#f9fbf8] px-4 text-sm outline-none transition placeholder:text-[#9aa59d] focus:border-[#18ad3d] focus:bg-white focus:ring-4 focus:ring-[#18ad3d]/10"
                    />
                  </label>

                  {/* Terms */}
                  <label className="flex cursor-pointer items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#0caf37]"
                    />

                    <span className="text-[11px] leading-5 text-[#7b867e] sm:text-xs">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="font-bold text-[#0b9f32] hover:underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="font-bold text-[#0b9f32] hover:underline"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>

                  {/* Create account */}
                  <button
                    type="button"
                    className="mt-1 h-13 w-full rounded-2xl bg-[#0cae36] text-sm font-black text-white shadow-[0_10px_25px_rgba(12,174,54,0.22)] transition hover:-translate-y-0.5 hover:bg-[#099b30] active:translate-y-0"
                  >
                    Create account →
                  </button>

                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#e5ebe6]" />

                  <span className="text-[11px] font-medium text-[#9aa59d]">
                    or continue with
                  </span>

                  <div className="h-px flex-1 bg-[#e5ebe6]" />
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#dce5dd] bg-white text-sm font-bold text-[#27332b] transition hover:bg-[#f5f8f5]"
                  >
                    <span className="text-base">G</span>
                    Google
                  </button>

                  <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#dce5dd] bg-white text-sm font-bold text-[#27332b] transition hover:bg-[#f5f8f5]"
                  >
                    <span className="text-base">●</span>
                    Apple
                  </button>

                </div>

              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="pt-4 text-center text-xs text-[#9aa59d] lg:text-left">
            © 2026 RESTRO · Restaurant operating system
          </footer>

        </section>


        {/* =========================================================
            RIGHT — DESKTOP RESTAURANT VISUAL
        ========================================================= */}
        <section className="relative hidden min-h-screen min-w-0 overflow-hidden bg-[#e9f7e8] lg:block">

          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#c9f4cf]" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#d9f5c9]" />

          <div className="pointer-events-none absolute right-[12%] top-[28%] h-3 w-3 rounded-full bg-[#f5c928]" />

          <div className="pointer-events-none absolute left-[12%] bottom-[30%] h-2.5 w-2.5 rounded-full bg-[#20a84a]" />


          {/* Right heading */}
          <div className="absolute left-10 right-10 top-10 z-10 xl:left-14 xl:right-14 xl:top-14">

            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#0a9c31]">
              Built for restaurants
            </p>

            <h2 className="max-w-[560px] text-[40px] font-black leading-[0.98] tracking-[-0.05em] text-[#18231b] xl:text-5xl">
              From the first scan
              <br />
              to the{" "}
              <span className="text-[#0aae38]">
                final payment.
              </span>
            </h2>

            <p className="mt-4 max-w-[480px] text-sm leading-6 text-[#68756b]">
              Everything your restaurant needs to serve faster,
              stay organized and keep your kitchen moving.
            </p>

            {/* Feature pills */}
            <div className="mt-5 flex max-w-[560px] flex-wrap gap-2">

              <span className="rounded-full border border-white bg-white/80 px-3 py-2 text-[11px] font-bold text-[#435047] shadow-sm">
                QR ordering
              </span>

              <span className="rounded-full border border-white bg-white/80 px-3 py-2 text-[11px] font-bold text-[#435047] shadow-sm">
                Live kitchen
              </span>

              <span className="rounded-full border border-white bg-white/80 px-3 py-2 text-[11px] font-bold text-[#435047] shadow-sm">
                Easy payments
              </span>

              <span className="rounded-full border border-white bg-white/80 px-3 py-2 text-[11px] font-bold text-[#435047] shadow-sm">
                Analytics
              </span>

            </div>
          </div>


          {/* =======================================================
              MAIN VISUAL
          ======================================================= */}
          <div className="absolute left-1/2 top-[58%] w-[min(620px,88%)] -translate-x-1/2 -translate-y-1/2">

            {/* Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bff1c5] blur-3xl" />

            {/* Main card */}
            <div className="relative mx-auto h-[430px] w-[min(390px,100%)] rounded-[34px] border border-white/90 bg-white/80 shadow-[0_25px_70px_rgba(30,80,38,0.12)] backdrop-blur-xl xl:h-[460px] xl:w-[420px]">

              {/* Card dots */}
              <div className="absolute left-6 top-5 flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffb74d]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#78d987]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffcf67]" />
              </div>

              {/* Card title */}
              <div className="absolute left-6 top-12">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#7b877e]">
                  RESTRO KITCHEN
                </p>
              </div>


              {/* =================================================
                  CHEF SVG
              ================================================= */}
              <svg
                viewBox="0 0 500 500"
                className="absolute left-1/2 top-[50px] h-[315px] w-[315px] -translate-x-1/2 xl:top-[55px] xl:h-[340px] xl:w-[340px]"
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

                {/* Chef hat */}
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


              {/* Bottom counter */}
              <div className="absolute bottom-0 left-0 right-0 h-[78px] rounded-b-[34px] bg-[#29332b]">

                <div className="flex h-full items-center justify-center">
                  <span className="text-[10px] font-black tracking-[0.3em] text-white/45">
                    RESTRO KITCHEN
                  </span>
                </div>

              </div>


              {/* =================================================
                  NEW ORDER CARD
              ================================================= */}
              <div className="absolute right-[-24px] top-[60px] w-[175px] rounded-2xl border border-white bg-white p-4 shadow-[0_18px_40px_rgba(25,60,30,0.14)] xl:right-[-35px] xl:top-[70px]">

                <div className="flex items-center justify-between">

                  <p className="text-[9px] font-black uppercase tracking-wider text-[#77827a]">
                    New order
                  </p>

                  <span className="rounded-full bg-[#eaffef] px-2 py-1 text-[8px] font-black text-[#0a9f32]">
                    NEW
                  </span>

                </div>

                <p className="mt-3 text-base font-black text-[#172018]">
                  Table 12
                </p>

                <p className="mt-1 text-[11px] text-[#7b867e]">
                  3 items · ₹480
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eaf0ea]">
                  <div className="h-full w-[72%] rounded-full bg-[#0caf37]" />
                </div>

              </div>


              {/* =================================================
                  KITCHEN CARD
              ================================================= */}
              <div className="absolute bottom-[55px] left-[-24px] w-[185px] rounded-2xl border border-white bg-white p-4 shadow-[0_18px_40px_rgba(25,60,30,0.14)] xl:bottom-[65px] xl:left-[-35px]">

                <p className="text-[9px] font-black uppercase tracking-wider text-[#77827a]">
                  Kitchen
                </p>

                <div className="mt-3 flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fff2df] text-lg">
                    🔥
                  </div>

                  <div>
                    <p className="text-xs font-black text-[#172018]">
                      Busy kitchen
                    </p>

                    <p className="mt-0.5 text-[10px] font-bold text-[#ff9418]">
                      8 preparing
                    </p>
                  </div>

                </div>

              </div>

            </div>


            {/* ===================================================
                SMALL STATUS CARD
            =================================================== */}
            <div className="absolute bottom-[-45px] right-[-5px] w-[205px] rounded-2xl border border-white bg-white p-4 shadow-[0_18px_40px_rgba(25,60,30,0.14)] xl:bottom-[-55px] xl:right-[-20px]">

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


          {/* =======================================================
              BOTTOM STATS
          ======================================================= */}
          <div className="absolute bottom-7 left-8 right-8 rounded-[22px] border border-white/80 bg-white/75 p-4 shadow-[0_15px_45px_rgba(30,80,38,0.08)] backdrop-blur-xl xl:bottom-9 xl:left-12 xl:right-12 xl:p-5">

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


        {/* =========================================================
            MOBILE VISUAL
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#e9f7e8] px-5 py-14 lg:hidden">

          <div className="mx-auto max-w-md text-center">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0a9c31]">
              Built for restaurants
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
              From the first scan
              <br />
              to the{" "}
              <span className="text-[#0aae38]">
                final payment.
              </span>
            </h2>

            <div className="mt-8 rounded-[30px] border border-white bg-white/75 p-6 shadow-xl">

              <svg
                viewBox="0 0 500 500"
                className="mx-auto w-full max-w-[290px]"
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
                  fill="white"
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

              <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#f1f8ef] px-4 py-3 text-left">

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