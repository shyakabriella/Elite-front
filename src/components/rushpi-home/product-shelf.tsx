"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import type { HomeProduct } from "@/lib/public-home-catalog";

import ProductCard from "./product-card";

type ProductShelfProps = {
  title: string;
  action?: string;
  products?: HomeProduct[];
  largeCards?: boolean;
};

export default function ProductShelf({
  title,
  action = "Shop all",
  products = [],
  largeCards = false,
}: ProductShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) {
    return null;
  }

  const move = (direction: "left" | "right") => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    container.scrollBy({
      left:
        direction === "right"
          ? container.clientWidth * 0.9
          : -container.clientWidth * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto mt-10 w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-3">
        <h2 className="text-[27px] font-black tracking-[-0.035em] text-slate-950 sm:text-[34px] lg:text-[38px]">
          {title}
        </h2>

        <Link
          href="/products"
          className="shrink-0 text-sm font-bold text-slate-900 underline underline-offset-4 sm:text-base"
        >
          {action}
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => move("left")}
          aria-label="Previous products"
          className="absolute -left-4 top-[35%] z-30 hidden h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition duration-300 hover:scale-110 hover:text-slate-950 lg:grid"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div
          ref={scrollRef}
          className={[
            "grid grid-flow-col overflow-x-auto scroll-smooth pb-5",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            largeCards
              ? [
                  "gap-4",
                  "auto-cols-[82%]",
                  "sm:auto-cols-[48%]",
                  "md:auto-cols-[340px]",
                  "lg:auto-cols-[calc((100%-60px)/4)]",
                  "lg:gap-5",
                ].join(" ")
              : [
                  "gap-5",
                  "auto-cols-[175px]",
                  "sm:auto-cols-[190px]",
                  "lg:auto-cols-[205px]",
                  "xl:auto-cols-[215px]",
                ].join(" "),
          ].join(" ")}
        >
          {products.map((product) => (
            <ProductCard
              key={product.public_id}
              product={product}
              large={largeCards}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => move("right")}
          aria-label="Next products"
          className="absolute -right-4 top-[35%] z-30 hidden h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition duration-300 hover:scale-110 hover:text-slate-950 lg:grid"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
