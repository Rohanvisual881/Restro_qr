"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "📊",
  },
  {
    href: "/dashboard/menu",
    label: "Menu",
    icon: "🍽️",
  },
  {
    href: "/dashboard/tables",
    label: "Tables & QR",
    icon: "🪑",
  },
  {
    href: "/dashboard/orders",
    label: "Order History",
    icon: "📜",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: "⚙️",
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-t border-[#EEEEEE] p-3 sm:flex-wrap sm:p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      {links.map((link) => {

        const isActive =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(
                link.href
              );

        return (
          <Link
            key={link.href}
            href={link.href}
            className={[
              "flex shrink-0 items-center gap-1.5",
              "rounded-xl px-4 py-2.5",
              "text-sm font-bold",
              "whitespace-nowrap",
              "transition-all duration-150",

              isActive
                ? "bg-[#0C831F] text-white shadow-sm"
                : "border border-[#E5E7EB] bg-white text-[#1F1F1F] hover:border-[#BFDDB8] hover:bg-[#F7FBF6]",
            ].join(" ")}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        );
      })}

    </nav>
  );
}