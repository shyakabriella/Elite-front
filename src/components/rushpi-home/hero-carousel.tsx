"use client";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Search,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { HomeProduct, HomeProductImage } from "@/lib/public-home-catalog";

import { homeProductImageUrl } from "@/lib/public-home-catalog";

type HeroCarouselProps = {
  products?: HomeProduct[];
};

const themes = [
  {
    background: "linear-gradient(110deg,#f7f8fa 0%,#fff4e6 52%,#ffd1a3 100%)",
    accent: "#f97316",
    text: "#111827",
  },
  {
    background: "linear-gradient(110deg,#eff7ff 0%,#dfefff 52%,#aed5ff 100%)",
    accent: "#2563eb",
    text: "#0f172a",
  },
  {
    background: "linear-gradient(110deg,#f4fbf7 0%,#e3f7eb 52%,#b7e7c7 100%)",
    accent: "#059669",
    text: "#0f172a",
  },
];

const countries = [
  ["🇬🇧", "United Kingdom"],
  ["🇪🇺", "Europe"],
  ["🇨🇳", "China"],
  ["🇯🇵", "Japan"],
  ["🇭🇰", "Hong Kong"],
  ["🇰🇷", "South Korea"],
  ["🇹🇷", "Turkey"],
];

function mediaImageUrl(media?: HomeProductImage | null): string | undefined {
  return (
    media?.urls?.original_optimized ??
    media?.renditions?.original_optimized?.url ??
    media?.urls?.detail ??
    media?.renditions?.detail?.url ??
    media?.urls?.card ??
    media?.renditions?.card?.url ??
    media?.url ??
    undefined
  );
}

function getProductImage(product: HomeProduct): string | undefined {
  const primary = mediaImageUrl(product.primary_image);

  if (primary) {
    return primary;
  }

  for (const media of product.media ?? []) {
    const image = mediaImageUrl(media);

    if (image) {
      return image;
    }
  }

  return homeProductImageUrl(product);
}

export default function HeroCarousel({ products = [] }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);

  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || products.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % products.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [playing, products.length]);

  if (products.length === 0) {
    return null;
  }

  function previous() {
    setCurrent((value) => (value === 0 ? products.length - 1 : value - 1));
  }

  function next() {
    setCurrent((value) => (value + 1) % products.length);
  }

  return (
    <section
      className="relative w-full max-w-full overflow-hidden bg-white pb-24 sm:pb-28"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) {
          return;
        }

        const end = event.changedTouches[0]?.clientX ?? touchStart.current;

        const distance = touchStart.current - end;

        if (Math.abs(distance) > 50) {
          if (distance > 0) {
            next();
          } else {
            previous();
          }
        }

        touchStart.current = null;
      }}
    >
      <div className="relative w-full overflow-hidden">
        <div
          className="flex w-full transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(-${current * 100}%,0,0)`,
          }}
        >
          {products.map((product, index) => {
            const theme = themes[index % themes.length];

            const image = getProductImage(product);

            return (
              <article
                key={product.public_id}
                className="relative min-w-full shrink-0 overflow-hidden"
                style={{
                  background: theme.background,
                }}
              >
                <div
                  className="
                      mx-auto
                      grid
                      min-h-[480px]
                      w-full
                      max-w-[1600px]
                      grid-cols-1
                      items-center
                      gap-6
                      px-5
                      pb-32
                      pt-16
                      sm:min-h-[500px]
                      sm:px-8
                      md:grid-cols-[1.05fr_.95fr]
                      md:gap-10
                      md:px-12
                      md:pb-28
                      lg:min-h-[560px]
                      lg:px-16
                      xl:px-20
                    "
                >
                  <div className="relative z-10 text-center md:text-left">
                    <p
                      className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] shadow-sm"
                      style={{
                        color: theme.accent,
                      }}
                    >
                      <ShoppingBag className="size-4" />

                      {product.category?.name ?? "Featured deal"}
                    </p>

                    <p className="mt-5 text-sm font-black uppercase tracking-[0.15em] text-slate-800 sm:text-base">
                      Unmissable
                    </p>

                    <h1
                      className="mt-1 text-[42px] font-black uppercase leading-[0.95] tracking-[-0.05em] sm:text-[54px] lg:text-[68px]"
                      style={{
                        color: theme.accent,
                      }}
                    >
                      Deals
                    </h1>

                    <p className="mt-1 text-xl font-black text-slate-950 sm:text-2xl lg:text-3xl">
                      Amazing Prices
                    </p>

                    <h2
                      className="mx-auto mt-4 line-clamp-2 max-w-[620px] text-xl font-black leading-tight md:mx-0 sm:text-2xl lg:text-[32px]"
                      style={{
                        color: theme.text,
                      }}
                    >
                      {product.name}
                    </h2>

                    <Link
                      href={`/products/${product.public_id}`}
                      className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-slate-950 px-7 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-500"
                    >
                      Shop Now
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>

                  <div className="relative flex min-h-[190px] items-center justify-center sm:min-h-[230px] md:min-h-[320px] lg:min-h-[390px]">
                    {image ? (
                      <Link
                        href={`/products/${product.public_id}`}
                        className="flex h-full w-full items-center justify-center"
                      >
                        <img
                          src={image}
                          alt={product.name}
                          className="
                              max-h-[210px]
                              max-w-[90%]
                              object-contain
                              drop-shadow-[0_24px_25px_rgba(0,0,0,.22)]
                              transition
                              duration-500
                              hover:scale-[1.03]
                              sm:max-h-[260px]
                              md:max-h-[340px]
                              lg:max-h-[390px]
                            "
                        />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {products.length > 1 ? (
          <div className="absolute right-4 top-4 z-30 flex gap-2 sm:right-7 sm:top-7">
            <button
              type="button"
              onClick={previous}
              className="grid size-10 place-items-center rounded-full bg-white text-slate-950 shadow-lg sm:size-12"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="grid size-10 place-items-center rounded-full bg-slate-950 text-white shadow-lg sm:size-12"
            >
              {playing ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </button>

            <button
              type="button"
              onClick={next}
              className="grid size-10 place-items-center rounded-full bg-white text-slate-950 shadow-lg sm:size-12"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="
          absolute
          bottom-0
          left-1/2
          z-40
          w-[calc(100%-24px)]
          max-w-[1000px]
          -translate-x-1/2
          overflow-hidden
          rounded-[22px]
          border
          border-slate-200
          bg-white
          shadow-[0_20px_50px_rgba(15,23,42,.18)]
          sm:w-[calc(100%-48px)]
        "
      >
        <form
          action="/products"
          method="GET"
          className="flex items-center gap-2 border-b border-slate-200 px-3 py-3 sm:px-6"
        >
          <input
            type="search"
            name="q"
            placeholder="Search premium products"
            className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none sm:h-12 sm:text-base"
          />

          <button
            type="submit"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-500 text-white sm:size-12"
          >
            <Search className="size-5" />
          </button>
        </form>

        <div className="flex items-center gap-3 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6">
          <span className="shrink-0 text-xs font-black text-slate-800 sm:text-sm">
            Order From
          </span>

          <ChevronLeft className="size-4 shrink-0 text-slate-400" />

          {countries.map(([flag, label]) => (
            <span
              key={label}
              title={label}
              className="flex h-9 min-w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-xl sm:h-10 sm:min-w-12 sm:text-2xl"
            >
              {flag}
            </span>
          ))}

          <ChevronRight className="size-4 shrink-0 text-slate-400" />
        </div>
      </div>
    </section>
  );
}
