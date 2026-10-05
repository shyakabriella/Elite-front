"use client";

import type { DashboardRole } from "@/types/dashboard";
import { dashboardRoleInformation } from "@/config/dashboard-navigation";

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";
import Link from "next/link";

type DashboardNavbarProps = {
  onMenuClick: () => void;
  role: DashboardRole;
};

export default function DashboardNavbar({
  onMenuClick,
  role,
}: DashboardNavbarProps) {
  const roleInformation =
    dashboardRoleInformation[role];
  return (
    <header className="sticky top-0 z-30 border-b border-brand-steel/80 bg-white/90 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-4 sm:px-6 xl:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid size-11 shrink-0 place-items-center rounded-2xl border border-brand-steel bg-white text-brand-ink shadow-sm transition hover:border-brand-orange hover:bg-brand-mist hover:text-brand-ink lg:hidden"
          aria-label="Open dashboard menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden sm:block">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-ink">
            {roleInformation.label} dashboard
          </p>

          <p className="mt-1 text-sm font-semibold text-brand-ink/70">
            {roleInformation.description}
          </p>
        </div>

        <form className="mx-auto hidden w-full max-w-xl md:block">
          <label className="relative block">
            <span className="sr-only">
              Search dashboard
            </span>

            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-steel" />

            <input
              type="search"
              placeholder="Search products, orders, customers..."
              className="h-12 w-full rounded-full border border-brand-steel bg-brand-mist/80 pl-12 pr-5 text-sm text-brand-ink outline-none transition placeholder:text-brand-steel focus:border-brand-orange focus:bg-white focus:ring-4 focus:ring-brand-mist"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="relative grid size-11 place-items-center rounded-2xl border border-brand-steel bg-white text-brand-ink shadow-sm transition hover:border-brand-orange hover:bg-brand-mist hover:text-brand-ink"
            aria-label="Notifications"
          >
            <Bell className="size-5" />

            <span className="absolute right-2 top-2 size-2.5 rounded-full border-2 border-white bg-red-500" />
          </button>

          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl border border-brand-steel bg-white px-2 py-2 shadow-sm transition hover:border-brand-orange">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-ink to-brand-ink text-xs font-black text-white">
                RS
              </span>

              <span className="hidden min-w-0 text-left xl:block">
                <span className="block truncate text-sm font-black text-brand-ink">
                  {roleInformation.accountName}
                </span>

                <span className="block truncate text-xs text-brand-ink/70">
                  {roleInformation.label} account
                </span>
              </span>

              <ChevronDown className="hidden size-4 text-brand-ink/70 transition group-open:rotate-180 sm:block" />
            </summary>

            <div className="absolute right-0 top-[calc(100%+10px)] w-60 rounded-2xl border border-brand-steel bg-white p-2 shadow-2xl">
              <Link
                href="/seller/profile"
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist hover:text-brand-ink"
              >
                Seller profile
              </Link>

              <Link
                href="/seller/settings"
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist hover:text-brand-ink"
              >
                Account settings
              </Link>

              <Link
                href="/"
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist hover:text-brand-ink"
              >
                Open marketplace
              </Link>

              <div className="my-1 border-t border-brand-mist" />

              <Link
                href="/login"
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Sign out
              </Link>
            </div>
          </details>
        </div>
      </div>

      <div className="border-t border-brand-mist px-4 pb-3 pt-3 md:hidden">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-steel" />

          <input
            type="search"
            placeholder="Search dashboard..."
            className="h-11 w-full rounded-full border border-brand-steel bg-brand-mist pl-11 pr-4 text-sm outline-none focus:border-brand-orange focus:bg-white"
          />
        </label>
      </div>
    </header>
  );
}
