"use client";

import {
  BadgeCheck,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  dashboardNavigation,
  dashboardRoleInformation,
} from "@/config/dashboard-navigation";
import type { DashboardRole } from "@/types/dashboard";

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
  role: DashboardRole;
};

export default function DashboardSidebar({
  open,
  onClose,
  role,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const navigation =
    dashboardNavigation[role];

  const roleInformation =
    dashboardRoleInformation[role];

  const isActive = (href: string): boolean => {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-brand-ink/50 backdrop-blur-sm lg:hidden"
          aria-label="Close dashboard navigation"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col",
          "bg-gradient-to-b from-[#263540] to-[#1c2832]",
          "text-white shadow-[20px_0_45px_rgba(15,23,42,0.14)]",
          "transition-transform duration-300 lg:translate-x-0",
          open
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/15 px-5">
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={onClose}
          >
            <span className="flex h-[62px] w-[180px] items-center overflow-hidden transition duration-300 group-hover:scale-[1.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/elitemart-logo.svg"
                alt="EliteMart"
                className="h-full w-full object-contain object-left"
              />
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="dashboard-sidebar-scroll flex-1 overflow-y-auto px-3 py-2">
          {navigation.map((group) => (
            <div
              key={group.title}
              className="mb-2 last:mb-0"
            >
              <p className="mb-1 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-brand-steel">
                {group.title}
              </p>

              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={[
                        "group flex items-center gap-2.5 rounded-xl px-3 py-1.5",
                        "text-sm font-bold transition duration-200",
                        active
                          ? "bg-white text-brand-ink shadow-lg"
                          : "text-brand-mist hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "grid size-8 shrink-0 place-items-center rounded-lg",
                          active
                            ? "bg-brand-mist text-brand-ink"
                            : "bg-white/10 text-brand-mist group-hover:bg-white/15",
                        ].join(" ")}
                      >
                        <Icon className="size-[17px]" />
                      </span>

                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>

                      {active && (
                        <span className="size-2 shrink-0 rounded-full bg-brand-ink" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          <Link
            href="/help"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm font-bold text-brand-mist transition hover:bg-white/10"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-white/10">
              <HelpCircle className="size-5" />
            </span>

            Help center
          </Link>
        </div>

        <div className="border-t border-white/15 p-3">
          <div className="mb-2 rounded-2xl bg-white/10 p-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-400 text-xs font-black text-emerald-950">
                {roleInformation.shortName}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-black">
                  {roleInformation.accountName}
                </p>

                <p className="truncate text-xs text-brand-steel">
                  {roleInformation.description}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-400/15 px-3 py-1.5 text-xs text-emerald-100">
              <BadgeCheck className="size-4" />
              {roleInformation.label} access
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm font-bold text-brand-mist transition hover:bg-red-500/20 hover:text-white"
          >
            <LogOut className="size-5" />
            Sign out
          </Link>
        </div>
      </aside>
    </>
  );
}
