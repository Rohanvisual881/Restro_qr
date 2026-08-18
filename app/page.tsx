"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    ["📱", "QR Ordering", "Customers order directly from the table."],
    ["🔔", "Live Orders", "New orders reach staff instantly."],
    ["👨‍🍳", "Kitchen", "Keep preparation and order status clear."],
    ["🪑", "Tables", "Manage tables and QR codes simply."],
    ["🍽️", "Digital Menu", "Update products, prices and availability."],
    ["💳", "Payments", "Keep the payment journey connected."],
    ["📊", "Sales", "Understand orders and restaurant performance."],
    ["⚙️", "Settings", "Manage your restaurant from one place."],
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f8f3] text-[#101310]">
      <nav className="fixed left-1/2 top-4 z-50 w-[calc(100%-24px)] max-w-6xl -translate-x-1/2">
        <div className="flex h-16 items-center justify-between rounded-2xl border border-black/5 bg-white/90 px-4 shadow-xl shadow-black/5 backdrop-blur-xl sm:px-5">
          <a href="#" className="text-2xl font-black tracking-[-0.08em] text-[#0b7f21]">RESTRO</a>
          <div className="hidden items-center gap-8 text-sm font-semibold text-gray-500 md:flex">
            <a href="#how" className="transition hover:text-[#0b7f21]">How it works</a>
            <a href="#features" className="transition hover:text-[#0b7f21]">Features</a>
            <a href="#pricing" className="transition hover:text-[#0b7f21]">Pricing</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/login" className="rounded-xl px-2 py-3 text-xs font-bold text-gray-600 transition hover:bg-gray-100 hover:text-[#0b7f21] sm:px-4 sm:text-sm">
              Log in
            </a>
            <a href="/signup" className="rounded-xl bg-[#0b7f21] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 sm:px-5 sm:text-sm">
              Sign up free →
            </a>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden pt-28" style={{ "--mx": "0px", "--my": "0px" } as React.CSSProperties}>
        <div className="pointer-events-none absolute -left-56 top-24 h-[620px] w-[620px] rounded-full bg-[#dff4d8] blur-3xl" />
        <div className="pointer-events-none absolute right-[-180px] top-40 h-[520px] w-[520px] rounded-full bg-[#e9f2d9] blur-3xl" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#eaf8e5] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#0b7f21]">
              <span className="h-2 w-2 rounded-full bg-[#56c132]" /> Restaurant Operating System
            </div>
            <h1 className="max-w-3xl text-[clamp(48px,13vw,92px)] font-black leading-[0.88] tracking-[-0.08em] sm:text-[clamp(56px,8vw,92px)]">
              Make every<br />table <span className="text-[#0b7f21]">smart.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-500 sm:mt-7 sm:text-lg sm:leading-8">
              Let guests scan, order and pay from their table while your kitchen receives every order instantly.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="/signup" className="rounded-xl bg-[#0b7f21] px-6 py-4 text-center font-bold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1">Start Free →</a>
              <a href="#how" className="rounded-xl border border-black/10 bg-white px-6 py-4 text-center font-bold transition hover:-translate-y-1">See How It Works</a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-gray-400 sm:mt-8 sm:gap-5 sm:text-xs">
              <span>✓ QR Ordering</span><span>✓ Live Kitchen</span><span>✓ Digital Menu</span><span>✓ Sales Dashboard</span>
            </div>
          </div>

          <div className="relative mx-auto mt-2 h-[500px] w-full max-w-[540px] transition-transform duration-300 sm:h-[570px] lg:mt-0" style={{ transform: "translate3d(var(--mx), var(--my), 0)" }}>
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-white via-[#edf5e8] to-[#d7e5d1] shadow-2xl shadow-black/10" />

            <div className="absolute left-0 top-8 z-20 w-[190px] rounded-2xl sm:top-16 sm:w-52 border border-black/5 bg-white p-4 shadow-2xl">
              <div className="flex items-center justify-between"><span className="text-xs font-black">NEW ORDER</span><span className="h-2 w-2 rounded-full bg-[#56c132]" /></div>
              <p className="mt-2 text-xs text-gray-400">Table 12 · Just now</p>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between"><b>Paneer Tikka</b><span>₹220</span></div>
                <div className="flex justify-between"><b>Butter Naan</b><span>₹60</span></div>
                <div className="flex justify-between"><b>Cold Drink</b><span>₹50</span></div>
              </div>
              <div className="mt-4 rounded-lg bg-[#eaf8e5] px-3 py-2 text-center text-xs font-black text-[#0b7f21]">₹330 · Preparing</div>
            </div>

            <div className="absolute bottom-3 left-0 z-10 w-[215px] sm:bottom-10 sm:left-8 sm:w-[250px] rounded-3xl bg-[#0d110d] p-5 text-white shadow-2xl">
              <div className="flex items-center justify-between"><span className="text-xs font-bold text-gray-400">TODAY</span><span className="rounded-full bg-[#56c132]/20 px-2 py-1 text-[10px] font-black text-[#9bef88]">LIVE</span></div>
              <div className="mt-3 text-4xl font-black tracking-[-0.06em]">₹24,680</div>
              <div className="mt-1 text-xs text-gray-500">48 orders · 12 tables active</div>
              <div className="mt-6 flex items-end gap-2">
                {[35,52,44,68,56,82,72].map((h,i)=><div key={i} className="flex-1 rounded-t bg-[#56c132]" style={{height:`${h}px`}} />)}
              </div>
            </div>

            <div className="absolute right-0 top-5 z-30 h-[400px] w-[210px] rotate-[3deg] p-2 sm:right-8 sm:top-10 sm:h-[450px] sm:w-[235px] sm:rotate-[4deg] sm:p-3 rounded-[38px] border-[9px] border-[#111411] bg-white p-3 shadow-2xl">
              <div className="mx-auto h-5 w-24 rounded-b-xl bg-[#111411]" />
              <div className="mt-3 flex items-center justify-between sm:mt-4">
                <div><div className="text-[9px] text-gray-400">STORE MAGIC</div><div className="text-sm font-black">Good evening 👋</div></div>
                <div className="rounded-full bg-[#eaf8e5] px-2 py-1 text-[8px] font-black text-[#0b7f21]">TABLE 12</div>
              </div>
              <div className="mt-5 rounded-2xl bg-[#f4f7f1] p-3"><div className="text-[9px] font-black text-gray-400">YOUR TABLE MENU</div><div className="mt-1 text-sm font-black">Popular today</div></div>
              {[["Paneer Tikka","₹220"],["Butter Naan","₹60"],["Cold Drink","₹50"]].map(([name,price])=>(
                <div key={name} className="mt-3 flex items-center justify-between rounded-2xl border border-gray-100 p-3">
                  <div><div className="text-[10px] font-black">{name}</div><div className="mt-1 text-[9px] text-gray-400">{price}</div></div>
                  <button className="rounded-lg bg-[#0b7f21] px-3 py-2 text-[9px] font-black text-white">ADD</button>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#0b7f21] px-3 py-3 text-white"><span className="text-[10px] font-bold">3 items</span><span className="text-[11px] font-black">View Cart →</span></div>
            </div>

            <div className="absolute bottom-5 right-0 z-40 rounded-2xl sm:bottom-16 border border-black/5 bg-white px-4 py-3 shadow-xl">
              <div className="text-[10px] font-black text-gray-400">KITCHEN STATUS</div>
              <div className="mt-1 flex items-center gap-2 text-xs font-black"><span className="h-2 w-2 rounded-full bg-[#56c132]" />4 orders preparing</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white px-5 py-6 sm:px-6 sm:py-7">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-3 text-center text-[10px] font-bold text-gray-400 sm:gap-x-10 sm:text-sm">
          <span>NO HARDWARE REQUIRED</span><span>•</span><span>SET UP IN MINUTES</span><span>•</span><span>WORKS ON ANY PHONE</span><span>•</span><span>ONE SIMPLE SYSTEM</span>
        </div>
      </section>

      <section id="how" className="relative overflow-hidden px-5 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="pointer-events-none absolute left-1/2 top-32 hidden h-64 w-[900px] -translate-x-1/2 rounded-full border border-[#56c132]/10 md:block" />
          <p className="relative z-10 text-xs font-black uppercase tracking-[0.2em] text-[#0b7f21]">How it works</p>
          <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl md:text-7xl">Simple for guests.<br />Powerful for you.</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500 sm:mt-6 sm:text-lg sm:leading-8">A clean flow from the table to your kitchen and back to the customer.</p>
          <div className="relative mt-12 grid gap-4 sm:mt-16 sm:gap-5 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
            {[
              ["01","📱","Scan the QR","Guest scans the QR code on the table."],
              ["02","🍽️","Choose food","They browse your digital menu and add items."],
              ["03","🔔","Kitchen gets it","The order reaches your restaurant instantly."],
              ["04","✅","Serve & finish","Staff prepares, serves and completes the order."]
            ].map(([n,i,t,d], index) => (
              <div key={n} className="relative">
                {index < 3 && (
                  <div className="pointer-events-none absolute left-[calc(100%+1px)] top-[52px] z-0 hidden h-px w-5 bg-gradient-to-r from-[#56c132] to-[#b8dcae] md:block" />
                )}

                <div className="group relative z-10 h-full rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#56c132]/40 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-black text-[#0b7f21]">{n}</div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf8e5] text-sm font-black text-[#0b7f21]">{index + 1}</div>
                  </div>

                  <div className="mt-9 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1f8ee] text-4xl transition duration-300 group-hover:scale-110 group-hover:rotate-2">{i}</div>

                  <h3 className="mt-6 text-xl font-black">{t}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{d}</p>

                  {index < 3 && (
                    <div className="absolute -right-2 top-[46px] z-20 hidden h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#56c132] shadow-md md:flex">
                      <span className="text-[9px] font-black text-white">→</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b0e0b] px-5 py-20 text-white sm:px-6 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-10 sm:gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9bef88]">Restaurant control</p>
            <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.06em] md:text-6xl">See what’s happening.<br />At a glance.</h2>
            <p className="mt-6 text-lg leading-8 text-gray-400">Keep orders, tables and sales visible from one simple dashboard.</p>
            <div className="mt-8 space-y-3">
              {["Instant order notifications","Table and order status","Daily sales overview","Simple kitchen workflow"].map(x=><div key={x} className="flex items-center gap-3 text-sm font-bold text-gray-300"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#56c132] text-[#0b0e0b]">✓</span>{x}</div>)}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-[#151a15] p-4 shadow-2xl shadow-black/30 transition duration-300 hover:-translate-y-1">
            <div className="rounded-[24px] bg-[#f7f8f3] p-5 text-[#101310]">
              <div className="flex flex-wrap items-center justify-between gap-4"><div><div className="text-xs font-bold text-gray-400">OVERVIEW</div><div className="mt-1 text-2xl font-black">Good evening, Restaurant 👋</div></div><div className="rounded-xl bg-[#eaf8e5] px-3 py-2 text-xs font-black text-[#0b7f21]">Open</div></div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[["48","Orders today"],["12","Active tables"],["₹24,680","Sales today"]].map(([v,l])=><div key={l} className="rounded-2xl border border-black/5 bg-white p-4"><div className="text-2xl font-black">{v}</div><div className="mt-1 text-xs text-gray-400">{l}</div></div>)}
              </div>
              <div className="mt-5 rounded-2xl border border-black/5 bg-white p-4">
                <div className="flex items-center justify-between"><b className="text-sm">Live orders</b><span className="text-[10px] font-black text-[#0b7f21]">LIVE</span></div>
                <div className="mt-3 space-y-2">
                  {[["#104","Table 12","Preparing","₹610"],["#105","Table 04","Ready","₹420"],["#106","Table 08","New","₹850"],["#107","Table 02","Preparing","₹330"]].map(([id,table,status,total])=>(
                    <div key={id} className="flex items-center justify-between rounded-xl bg-[#f7f8f3] px-3 py-3 text-xs"><div><b>{id}</b><span className="ml-2 text-gray-400">{table}</span></div><span className="font-bold">{status}</span><b>{total}</b></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-5 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0b7f21]">Everything connected</p>
          <h2 className="mt-4 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] md:text-7xl">One system for the whole restaurant.</h2>
          <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([icon,title,text])=><div key={title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#56c132]/30 hover:shadow-xl"><div className="text-4xl">{icon}</div><h3 className="mt-6 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-500">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#eef5eb] px-5 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0b7f21]">Built to scale</p>
            <h2 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.06em] md:text-6xl">Every restaurant gets<br />its own space.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-500">Give each restaurant its own menu, tables, orders and dashboard while your platform stays organized.</p>
          </div>
          <div className="rounded-[32px] bg-[#0d110d] p-6 text-white shadow-2xl">
            {[["storemagic","storemagic.restro.in"],["royaldhaba","royaldhaba.restro.in"],["spicehub","spicehub.restro.in"],["pizzapalace","pizzapalace.restro.in"]].map(([name,domain])=><div key={domain} className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 px-5 py-4"><span className="text-sm font-bold">{name}</span><span className="text-xs font-black text-[#9bef88]">{domain}</span></div>)}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-5 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0b7f21]">Pricing</p>
          <h2 className="mt-4 text-5xl font-black tracking-[-0.06em] md:text-7xl">Start simple.</h2>
          <div className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-3">
            {[
              {name:"Starter",price:"₹499",features:["Digital Menu","QR Ordering","Live Orders","Restaurant Subdomain"]},
              {name:"Growth",price:"₹999",popular:true,features:["Everything in Starter","Payments","Order History","Analytics","Priority Support"]},
              {name:"Premium",price:"₹1,999",features:["Everything in Growth","Custom Domain","Advanced Analytics","Multiple Staff","Premium Support"]},
            ].map(plan=><div key={plan.name} className={`rounded-3xl border p-8 ${plan.popular?"border-[#0b7f21] bg-[#f0faed] shadow-xl":"border-black/5 bg-white"}`}>
              {plan.popular&&<div className="mb-5 inline-block rounded-full bg-[#0b7f21] px-3 py-1 text-[10px] font-black text-white">MOST POPULAR</div>}
              <h3 className="text-xl font-black">{plan.name}</h3><div className="mt-5 text-5xl font-black">{plan.price}<span className="text-sm text-gray-400">/month</span></div>
              <ul className="mt-8 space-y-3 text-sm text-gray-600">{plan.features.map(f=><li key={f}>✓ {f}</li>)}</ul>
              <a href="/signup" className={`mt-8 block rounded-xl px-5 py-4 text-center font-black ${plan.popular?"bg-[#0b7f21] text-white":"border border-black/10 bg-white"}`}>Get Started</a>
            </div>)}
          </div>
        </div>
      </section>

      <section className="px-5 pb-12 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-6xl rounded-[30px] bg-[#0b7f21] px-5 py-16 text-center text-white sm:rounded-[36px] sm:px-6 sm:py-24 md:px-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bff1b4]">RESTRO</p>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[0.9] tracking-[-0.07em] sm:text-5xl md:text-7xl">Turn every table into a smart table.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-green-100 sm:text-lg sm:leading-8">Give guests a faster ordering experience and give your team a simpler way to run the restaurant.</p>
          <a href="/signup" className="mt-9 inline-flex rounded-xl bg-white px-7 py-4 font-black text-[#0b7f21] shadow-xl transition hover:-translate-y-1">🚀 Start Your Restaurant</a>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-white px-5 pb-8 pt-16 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <a href="#" className="text-3xl font-black tracking-[-0.08em] text-[#0b7f21]">RESTRO</a>
              <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
                The simple restaurant operating system for QR ordering, digital menus,
                live kitchen orders and restaurant management.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/signup"
                  className="rounded-xl bg-[#0b7f21] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                >
                  Create account →
                </a>
                <a
                  href="/login"
                  className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-black text-gray-700 transition hover:-translate-y-0.5 hover:border-[#56c132]/40"
                >
                  Log in
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black">Product</h3>
              <div className="mt-5 space-y-3 text-sm text-gray-500">
                <a href="#how" className="block transition hover:text-[#0b7f21]">How it works</a>
                <a href="#features" className="block transition hover:text-[#0b7f21]">Features</a>
                <a href="#pricing" className="block transition hover:text-[#0b7f21]">Pricing</a>
                <a href="#features" className="block transition hover:text-[#0b7f21]">QR Ordering</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black">Company</h3>
              <div className="mt-5 space-y-3 text-sm text-gray-500">
                <a href="#" className="block transition hover:text-[#0b7f21]">About</a>
                <a href="#" className="block transition hover:text-[#0b7f21]">Contact</a>
                <a href="#" className="block transition hover:text-[#0b7f21]">Help Center</a>
                <a href="#" className="block transition hover:text-[#0b7f21]">Partner with us</a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black">Account</h3>
              <div className="mt-5 space-y-3 text-sm text-gray-500">
                <a href="/login" className="block transition hover:text-[#0b7f21]">Log in</a>
                <a href="/signup" className="block transition hover:text-[#0b7f21]">Sign up</a>
                <a href="/signup" className="block transition hover:text-[#0b7f21]">Start free</a>
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-black/5 pt-6">
            <div className="flex flex-col gap-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
              <span>© 2026 RESTRO. All rights reserved.</span>
              <div className="flex flex-wrap gap-5">
                <a href="#" className="transition hover:text-[#0b7f21]">Privacy</a>
                <a href="#" className="transition hover:text-[#0b7f21]">Terms</a>
                <a href="#" className="transition hover:text-[#0b7f21]">Refund Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}