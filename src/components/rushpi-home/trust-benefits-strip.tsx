"use client";

import {
  BadgeCheck,
  Banknote,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    title: "100% Authentic",
    description: "Shop directly from trusted and verified sellers.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Reliable delivery across Rwanda and beyond.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Safe and protected checkout every time.",
  },
  {
    icon: Banknote,
    title: "Money Back Guarantee",
    description: "Shop confidently with buyer protection.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Get help whenever you need it.",
  },
];

export default function TrustBenefitsStrip() {
  return (
    <section className="trust-strip border-y border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center justify-center gap-4">
          <span className="hidden h-px w-16 bg-gradient-to-r from-transparent to-emerald-500 sm:block" />

          <div className="trust-badge inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm font-black text-emerald-700 shadow-sm">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
              ★
            </span>
            Why Customers Choose EliteMart
          </div>

          <span className="hidden h-px w-16 bg-gradient-to-l from-transparent to-emerald-500 sm:block" />
        </div>

        <div className="trust-scroll flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="trust-item group flex min-w-[270px] flex-1 items-start gap-4 rounded-2xl border border-transparent bg-white px-4 py-4 transition duration-300 hover:-translate-y-1 hover:border-slate-200 hover:bg-slate-50 hover:shadow-md lg:min-w-0"
                style={{
                  animationDelay: `${index * 90}ms`,
                }}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 transition duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-950 sm:text-[15px]">
                    {benefit.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                    {benefit.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .trust-badge {
          animation: trustBadgeEnter 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .trust-item {
          opacity: 0;
          transform: translateY(18px);
          animation: trustItemEnter 650ms cubic-bezier(0.2, 0.8, 0.2, 1)
            forwards;
        }

        .trust-scroll {
          scrollbar-width: none;
        }

        .trust-scroll::-webkit-scrollbar {
          display: none;
        }

        @keyframes trustBadgeEnter {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes trustItemEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .trust-badge,
          .trust-item {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
