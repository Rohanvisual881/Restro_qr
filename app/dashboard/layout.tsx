import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">

        <header className="overflow-hidden rounded-[22px] border border-[#E9E9E7] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]">

          {/* RESTAURANT HEADER */}

          <div className="bg-[#0C831F] px-5 py-5 text-white sm:px-7">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                  Restaurant Dashboard
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Royal Spice 👋
                </h1>

                <p className="mt-1 text-xs text-white/75 sm:text-sm">
                  Manage your restaurant, orders and payments.
                </p>

              </div>

              <div className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/90">
                ● Admin
              </div>

            </div>

          </div>

          {/* PERMANENT NAVIGATION */}

          <DashboardNav />

        </header>

        {/* PAGE CONTENT */}

        <div className="mt-5">
          {children}
        </div>

      </div>
    </div>
  );
}