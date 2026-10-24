"use client";

import { Check, Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { HomeProduct } from "@/lib/public-home-catalog";

import {
  formatCondition,
  formatHomePrice,
  homeProductImageUrl,
  homeSellerName,
} from "@/lib/public-home-catalog";

import { addToCart } from "@/lib/cart";

export default function ProductCard({
  product,
  large = false,
}: {
  product: HomeProduct;
  large?: boolean;
}) {
  const image = homeProductImageUrl(product);

  const condition = formatCondition(product.condition);

  const isNewCondition = !condition || condition.toLowerCase() === "new";

  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    const numericPrice = Number(product.price?.minimum);

    addToCart({
      productId: product.public_id,
      name: product.name,
      image,
      price: Number.isFinite(numericPrice) ? numericPrice : undefined,
      currency: product.price?.currency ?? "RWF",
    });

    setJustAdded(true);

    window.setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  }

  return (
    <article
      className={["group min-w-0", large ? "rounded-[24px] bg-white" : ""].join(
        " ",
      )}
    >
      <div
        className={[
          "relative aspect-square overflow-hidden bg-[#f7f7f7]",
          large ? "rounded-[24px]" : "rounded-[18px]",
        ].join(" ")}
      >
        <Link
          href={`/products/${product.public_id}`}
          className={[
            "flex h-full w-full items-center justify-center",
            large ? "p-5 sm:p-6" : "p-2",
          ].join(" ")}
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              className={[
                "object-contain object-center transition-transform duration-500 ease-out",
                "group-hover:scale-[1.045]",
                large ? "h-[92%] w-[92%]" : "h-[94%] w-[94%]",
              ].join(" ")}
            />
          ) : (
            <span className="text-sm font-bold text-slate-400">No image</span>
          )}
        </Link>

        {!isNewCondition ? (
          <span
            className={[
              "absolute left-3 top-3 rounded-full bg-white/95 font-black text-slate-700 shadow-sm",
              large ? "px-3 py-1.5 text-xs" : "px-2 py-1 text-[10px]",
            ].join(" ")}
          >
            {condition}
          </span>
        ) : null}

        <button
          type="button"
          aria-label="Save product"
          className={[
            "absolute grid place-items-center rounded-full bg-white text-slate-600 shadow-md transition duration-300",
            "hover:scale-110 hover:text-red-500",
            large ? "right-4 top-4 h-11 w-11" : "right-2.5 top-2.5 size-9",
          ].join(" ")}
        >
          <Heart className={large ? "h-5 w-5" : "h-[18px] w-[18px]"} />
        </button>
      </div>

      <div className={large ? "px-1 pb-3 pt-4" : "pt-2"}>
        <p
          className={[
            "font-black leading-tight text-slate-950",
            large ? "text-[19px] sm:text-[21px]" : "text-[16px]",
          ].join(" ")}
        >
          {formatHomePrice(product)}
        </p>

        <Link
          href={`/products/${product.public_id}`}
          className={[
            "mt-2 line-clamp-2 block font-medium text-slate-700 hover:text-blue-700 hover:underline",
            large
              ? "min-h-[44px] text-[15px] leading-[1.45]"
              : "min-h-[32px] text-[12.5px] leading-[1.3]",
          ].join(" ")}
        >
          {product.name}
        </Link>

        {product.category?.name ? (
          <p
            className={[
              "mt-2 truncate font-bold uppercase tracking-[0.04em] text-slate-400",
              large ? "text-[11px]" : "text-[10px]",
            ].join(" ")}
          >
            {product.category.name}

            {product.brand?.name ? ` · ${product.brand.name}` : ""}
          </p>
        ) : null}

        <p
          className={[
            "mt-1 truncate font-semibold text-slate-500",
            large ? "text-xs" : "text-[10.5px]",
          ].join(" ")}
        >
          {homeSellerName(product)}
        </p>

        <button
          type="button"
          onClick={handleAdd}
          className={[
            "inline-flex items-center rounded-full border-2 font-black transition duration-300",
            large
              ? "mt-4 gap-2 px-5 py-2 text-sm"
              : "mt-2 gap-1.5 px-3.5 py-1 text-[13px]",
            justAdded
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-[#0754d8] text-[#0754d8] hover:bg-[#0754d8] hover:text-white",
          ].join(" ")}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add
            </>
          )}
        </button>
      </div>
    </article>
  );
}
