'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/wiki", label: "Wiki" },
  { href: "/ask", label: "Ask" },
  { href: "/templates", label: "Templates" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gaps", label: "Gaps" },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--border-col)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-lg text-[var(--text)]">DClaw Wiki</Link>
            <nav className="flex items-center gap-1 text-sm">
              {NAV_ITEMS.map(({ href, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={
                      isActive
                        ? "px-3 py-1.5 rounded-md font-medium bg-[var(--accent-col)] text-white transition-colors"
                        : "px-3 py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)] transition-colors"
                    }
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
