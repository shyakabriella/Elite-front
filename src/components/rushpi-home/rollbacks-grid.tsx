import { Heart } from "lucide-react";
import Link from "next/link";

import type { HomeProduct } from "@/lib/public-home-catalog";

import {
  formatHomePrice,
  homeProductImageUrl,
  homeSellerName,
} from "@/lib/public-home-catalog";

type RollbacksGridProps = {
  products?: HomeProduct[];
};

function getModuleTitle(products: HomeProduct[]): string {
  const searchableText = products
    .map((product) =>
      [product.name, product.category?.name, product.brand?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    )
    .join(" ");

  const phoneCount = products.filter((product) =>
    /iphone|phone|smartphone|galaxy|xperia|pixel|mobile/.test(
      [product.name, product.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    ),
  ).length;

  const computerCount = products.filter((product) =>
    /laptop|computer|desktop|macbook|thinkpad|notebook|pc/.test(
      [product.name, product.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    ),
  ).length;

  const accessoryCount = products.filter((product) =>
    /charger|cable|case|headphone|earphone|accessor|adapter/.test(
      [product.name, product.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    ),
  ).length;

  if (phoneCount >= 3) {
    return "Smartphone savings";
  }

  if (computerCount >= 2) {
    return "Computers & laptop deals";
  }

  if (accessoryCount >= 2) {
    return "Tech accessories for less";
  }

  if (phoneCount > 0 && computerCount > 0) {
    return "Phones & computer deals";
  }

  if (/television|tv|audio|speaker/.test(searchableText)) {
    return "Entertainment technology deals";
  }

  return "Featured technology deals";
}

function chunkProducts<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export default function RollbacksGrid({ products = [] }: RollbacksGridProps) {
  const groups = chunkProducts(products, 4);

  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-12 w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-3">
        <h2 className="text-[28px] font-black tracking-[-0.035em] text-slate-950 sm:text-[34px] lg:text-[38px]">
          Rollbacks &amp; more
        </h2>

        <Link
          href="/products"
          className="shrink-0 text-sm font-bold text-slate-900 underline decoration-2 underline-offset-4 transition-colors hover:text-[#0754d8] sm:text-base"
        >
          View all
        </Link>
      </div>

      <div
        className="
          rollback-scroll
          grid
          grid-cols-1
          gap-5
          pb-5
          md:grid-cols-2
          lg:grid-cols-none
          lg:auto-cols-[540px]
          lg:grid-flow-col
          lg:overflow-x-auto
          lg:overscroll-x-contain
          lg:snap-x
          lg:snap-mandatory
          lg:scroll-smooth
          xl:auto-cols-[560px]
          2xl:auto-cols-[575px]
        "
      >
        {groups.map((group, groupIndex) => (
          <section
            key={groupIndex}
            style={{
              animationDelay: `${groupIndex * 70}ms`,
            }}
            className="
                rollback-module
                min-w-0
                rounded-[26px]
                border
                border-slate-200
                bg-[#f5f5f5]
                p-4
                shadow-sm
                sm:p-5
                lg:snap-start
                lg:p-6
              "
          >
            <div className="flex min-h-[54px] items-start justify-between gap-4">
              <h3 className="max-w-[360px] text-[20px] font-black leading-[1.15] tracking-[-0.025em] text-slate-950 sm:text-[22px] lg:text-[24px]">
                {getModuleTitle(group)}
              </h3>

              <Link
                href="/products"
                className="shrink-0 pt-1 text-xs font-bold text-slate-800 underline underline-offset-4 transition-colors hover:text-[#0754d8] sm:text-sm"
              >
                View all
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
              {group.map((product) => {
                const image = homeProductImageUrl(product);

                const character = product.public_id
                  .split("")
                  .reduce((total, value) => total + value.charCodeAt(0), 0);

                const clearance = character % 3 === 0;

                return (
                  <Link
                    key={product.public_id}
                    href={`/products/${product.public_id}`}
                    className="
                          group/card
                          min-w-0
                          overflow-hidden
                          rounded-[20px]
                          border
                          border-slate-200
                          bg-white
                          p-3
                          shadow-sm
                          transition
                          duration-300
                          ease-out
                          hover:-translate-y-1
                          hover:shadow-lg
                          sm:p-4
                        "
                  >
                    <div className="flex h-9 items-start justify-between gap-2">
                      <span
                        className={[
                          "inline-flex rounded-md px-2.5 py-1 text-[10px] font-black leading-none sm:text-[11px]",
                          clearance
                            ? "bg-yellow-300 text-slate-950"
                            : "bg-red-600 text-white",
                        ].join(" ")}
                      >
                        {clearance ? "Clearance" : "Rollback"}
                      </span>

                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 transition duration-300 group-hover/card:border-red-200 group-hover/card:text-red-500">
                        <Heart className="size-[18px]" />
                      </span>
                    </div>

                    <div
                      className="
                            mt-3
                            flex
                            h-[145px]
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-[16px]
                            bg-[#fafafa]
                            sm:h-[165px]
                            lg:h-[180px]
                            xl:h-[190px]
                          "
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          loading="lazy"
                          className="
                                h-[92%]
                                w-[92%]
                                object-contain
                                object-center
                                transition-transform
                                duration-500
                                ease-out
                                group-hover/card:scale-[1.06]
                              "
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          No image
                        </span>
                      )}
                    </div>

                    <div className="mt-4 min-w-0">
                      <p className="line-clamp-2 min-h-[38px] break-words text-[15px] font-black leading-[1.2] tracking-[-0.02em] text-green-700 sm:text-[16px] lg:text-[17px]">
                        {formatHomePrice(product)}
                      </p>

                      <p className="mt-2 line-clamp-2 min-h-[44px] text-[13px] font-bold leading-[1.45] text-slate-800 sm:text-[14px]">
                        {product.name}
                      </p>

                      {product.category?.name ? (
                        <p className="mt-2 truncate text-[10px] font-bold uppercase tracking-[0.04em] text-slate-400 sm:text-[11px]">
                          {product.category.name}

                          {product.brand?.name
                            ? ` · ${product.brand.name}`
                            : ""}
                        </p>
                      ) : null}

                      <p className="mt-1 truncate text-[10.5px] font-semibold text-slate-500 sm:text-[11px]">
                        {homeSellerName(product)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <style>{`
        @keyframes rollbackEnter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rollback-module {
          opacity: 0;
          animation: rollbackEnter 480ms
            cubic-bezier(0.2, 0.8, 0.2, 1)
            forwards;
        }

        /*
         * Mobile and tablet:
         * normal page flow.
         *
         * This is important because forcing horizontal
         * touch handling was interfering with vertical
         * scrolling on phones.
         */
        .rollback-scroll {
          touch-action: auto;
          overflow-x: visible;
        }

        @media (min-width: 1024px) {
          .rollback-scroll {
            touch-action: pan-x pan-y;
            scrollbar-width: thin;
            scrollbar-color:
              #94a3b8 transparent;
          }

          .rollback-scroll::-webkit-scrollbar {
            height: 6px;
          }

          .rollback-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .rollback-scroll::-webkit-scrollbar-thumb {
            border-radius: 999px;
            background: #94a3b8;
          }

          .rollback-scroll::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rollback-module {
            opacity: 1;
            animation: none;
          }

          .rollback-scroll {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </section>
  );
}
