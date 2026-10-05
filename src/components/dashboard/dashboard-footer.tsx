import {
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function DashboardFooter() {
  return (
    <footer className="border-t border-brand-steel bg-white px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2 text-sm text-brand-ink/70">
          <ShieldCheck className="size-5 text-emerald-600" />

          <span>
            Secure EliteMart Seller Center
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-brand-ink/70">
          <Link
            href="/help"
            className="hover:text-brand-ink"
          >
            Help center
          </Link>

          <Link
            href="/privacy"
            className="hover:text-brand-ink"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="hover:text-brand-ink"
          >
            Terms
          </Link>
        </div>

        <p className="text-xs text-brand-ink/70">
          © 2026 EliteMart
        </p>
      </div>
    </footer>
  );
}
