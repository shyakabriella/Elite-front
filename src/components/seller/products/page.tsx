"use client";

import {
  AlertCircle,
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Edit3,
  Filter,
  ImageOff,
  Loader2,
  MoreHorizontal,
  PackageCheck,
  PackagePlus,
  PackageSearch,
  RefreshCw,
  Search,
  Send,
  Store,
  TriangleAlert,
  Warehouse,
  X,
} from "lucide-react";
import Link from "next/link";
import ProductManager from "@/components/seller/products/ProductManager";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const API_ORIGIN = API_BASE_URL.replace(
  /\/api(?:\/.*)?$/i,
  "",
);

type ProductStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "suspended"
  | "archived";

type SellerProfile = {
  public_id: string;
  legal_business_name?: string | null;
  trading_name?: string | null;
  status?: string | null;
};

type ProductVariantPrice = {
  currency?: string | null;
  selling_price?: number | string | null;
  compare_at_price?: number | string | null;
};

type ProductVariant = {
  public_id: string;
  sku?: string | null;
  name?: string | null;
  is_default?: boolean;
  is_active?: boolean;
  price?: ProductVariantPrice | null;
  available_quantity?: number | null;
  is_in_stock?: boolean;
};

type ProductMedia = {
  public_id?: string;
  url?: string | null;
  path?: string | null;
  alt_text?: string | null;
};

type CatalogOption = {
  public_id: string;
  name: string;
  label?: string | null;
};

type FormOptionsData = {
  categories?: CatalogOption[];
  brands?: CatalogOption[];
};

type Product = {
  public_id: string;
  name: string;
  slug?: string | null;
  short_description?: string | null;
  description?: string | null;
  condition?: string | null;
  warranty_months?: number | null;
  status: ProductStatus;

  category?: {
    public_id?: string;
    name?: string | null;
    slug?: string | null;
  } | null;

  brand?: {
    public_id?: string;
    name?: string | null;
    slug?: string | null;
  } | null;

  variants?: ProductVariant[];

  primary_media?: ProductMedia | null;

  media?: ProductMedia[];

  counts?: {
    variants?: number;
    media?: number;
    moderation_reviews?: number;
  };

  availability?: {
    has_active_variant?: boolean;
    has_sellable_variant?: boolean;
    has_inventory?: boolean;
    has_available_stock?: boolean;
  };

  publication_readiness?: {
    is_ready?: boolean;
    can_submit?: boolean;
    errors?: unknown;
  };

  actions?: {
    can_edit?: boolean;
    can_submit_for_review?: boolean;
    can_manage_variants?: boolean;
    can_manage_pricing?: boolean;
    can_manage_inventory?: boolean;
    can_manage_media?: boolean;
    can_manage_return_policy?: boolean;
    can_archive?: boolean;
  };

  moderation?: {
    submitted_at?: string | null;
    approved_at?: string | null;
    rejected_at?: string | null;
    rejection_reason?: string | null;
    suspended_at?: string | null;
    suspension_reason?: string | null;
    archived_at?: string | null;
  };

  updated_at?: string | null;
};

type PaginationMeta = {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number | null;
  to?: number | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
};

const STATUS_OPTIONS: Array<{
  value: "all" | ProductStatus;
  label: string;
}> = [
  {
    value: "all",
    label: "All products",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "pending_review",
    label: "Pending review",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "suspended",
    label: "Suspended",
  },
  {
    value: "archived",
    label: "Archived",
  },
];

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("rushpi_token") ??
    sessionStorage.getItem("rushpi_token")
  );
}

function getApiMessage(
  payload: unknown,
  fallback: string,
): string {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload
  ) {
    const message = (
      payload as {
        message?: unknown;
      }
    ).message;

    if (
      typeof message === "string" &&
      message.trim()
    ) {
      return message;
    }
  }

  if (
    payload &&
    typeof payload === "object" &&
    "errors" in payload
  ) {
    const errors = (
      payload as {
        errors?: Record<
          string,
          unknown
        >;
      }
    ).errors;

    if (errors) {
      for (
        const value of Object.values(
          errors,
        )
      ) {
        if (
          Array.isArray(value) &&
          typeof value[0] ===
            "string"
        ) {
          return value[0];
        }
      }
    }
  }

  return fallback;
}

async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...init,

      headers: {
        Accept: "application/json",

        ...(init.body
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...(init.headers ?? {}),
      },

      cache: "no-store",
    },
  );

  let payload: unknown = null;

  try {
    payload =
      await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      getApiMessage(
        payload,
        `Request failed with HTTP ${response.status}.`,
      ),
    );
  }

  return payload as T;
}

function extractRows<T>(
  payload: unknown,
): T[] {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload
  ) {
    const data = (
      payload as {
        data?: unknown;
      }
    ).data;

    if (Array.isArray(data)) {
      return data as T[];
    }

    if (
      data &&
      typeof data === "object" &&
      "data" in data &&
      Array.isArray(
        (
          data as {
            data?: unknown;
          }
        ).data,
      )
    ) {
      return (
        data as {
          data: T[];
        }
      ).data;
    }
  }

  return [];
}

function extractMeta(
  payload: unknown,
): PaginationMeta {
  if (
    payload &&
    typeof payload === "object" &&
    "meta" in payload
  ) {
    return (
      payload as {
        meta?: PaginationMeta;
      }
    ).meta ?? {};
  }

  return {};
}

function sellerName(
  profile: SellerProfile | null,
): string {
  return (
    profile?.trading_name ??
    profile?.legal_business_name ??
    "Seller account"
  );
}

function statusLabel(
  status: ProductStatus,
): string {
  return (
    STATUS_OPTIONS.find(
      (option) =>
        option.value === status,
    )?.label ?? status
  );
}

function statusClassName(
  status: ProductStatus,
): string {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "pending_review":
      return "border-brand-steel bg-brand-mist text-brand-ink";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    case "suspended":
      return "border-brand-orange bg-brand-mist text-brand-orange";

    case "archived":
      return "border-brand-steel bg-brand-mist text-brand-ink/70";

    default:
      return "border-brand-orange bg-brand-mist text-brand-orange";
  }
}

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    },
  ).format(date);
}

function defaultVariant(
  product: Product,
): ProductVariant | null {
  const variants =
    product.variants ?? [];

  return (
    variants.find(
      (variant) =>
        variant.is_default,
    ) ??
    variants[0] ??
    null
  );
}

function formatPrice(
  product: Product,
): string {
  const variant =
    defaultVariant(product);

  const price =
    variant?.price?.selling_price;

  if (
    price === null ||
    price === undefined
  ) {
    return "No price";
  }

  const currency =
    variant?.price?.currency ??
    "RWF";

  const numericPrice =
    Number(price);

  if (
    !Number.isFinite(
      numericPrice,
    )
  ) {
    return `${price} ${currency}`;
  }

  try {
    return new Intl.NumberFormat(
      "en-RW",
      {
        style: "currency",
        currency,
        maximumFractionDigits:
          currency === "RWF"
            ? 0
            : 2,
      },
    ).format(numericPrice);
  } catch {
    return `${numericPrice} ${currency}`;
  }
}

function formatComparePrice(
  product: Product,
): string | null {
  const variant =
    defaultVariant(product);

  const compare =
    variant?.price
      ?.compare_at_price;

  if (
    compare === null ||
    compare === undefined
  ) {
    return null;
  }

  const numeric =
    Number(compare);

  if (
    !Number.isFinite(numeric) ||
    numeric <= 0
  ) {
    return null;
  }

  const currency =
    variant?.price?.currency ??
    "RWF";

  try {
    return new Intl.NumberFormat(
      "en-RW",
      {
        style: "currency",
        currency,
        maximumFractionDigits:
          currency === "RWF"
            ? 0
            : 2,
      },
    ).format(numeric);
  } catch {
    return `${numeric} ${currency}`;
  }
}

function availableStock(
  product: Product,
): number {
  return (
    product.variants ?? []
  ).reduce(
    (
      total,
      variant,
    ) =>
      total +
      Math.max(
        Number(
          variant
            .available_quantity ??
            0,
        ),
        0,
      ),
    0,
  );
}

function readinessErrorCount(
  product: Product,
): number {
  const errors =
    product
      .publication_readiness
      ?.errors;

  if (Array.isArray(errors)) {
    return errors.length;
  }

  if (
    errors &&
    typeof errors === "object"
  ) {
    return Object.keys(
      errors,
    ).length;
  }

  return 0;
}

function resolveProductImage(
  product: Product,
): string | null {
  const raw =
    product.primary_media?.url ??
    product.media?.find(
      (media) =>
        media.url,
    )?.url ??
    product.primary_media?.path ??
    product.media?.find(
      (media) =>
        media.path,
    )?.path ??
    null;

  if (!raw) {
    return null;
  }

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://")
  ) {
    return raw;
  }

  if (raw.startsWith("/")) {
    return `${API_ORIGIN}${raw}`;
  }

  if (
    raw.startsWith("storage/")
  ) {
    return `${API_ORIGIN}/${raw}`;
  }

  return `${API_ORIGIN}/storage/${raw}`;
}

export default function SellerProductsPage() {
  const [
    profiles,
    setProfiles,
  ] =
    useState<SellerProfile[]>(
      [],
    );

  const [
    selectedProfileId,
    setSelectedProfileId,
  ] = useState("");

  const [
    products,
    setProducts,
  ] = useState<Product[]>(
    [],
  );

  const [
    meta,
    setMeta,
  ] =
    useState<PaginationMeta>(
      {},
    );

  const [
    loadingProfiles,
    setLoadingProfiles,
  ] = useState(true);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(false);

  const [
    busyProduct,
    setBusyProduct,
  ] =
    useState<string | null>(
      null,
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] =
    useState<
      "all" | ProductStatus
    >("all");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("");

  const [
    brandFilter,
    setBrandFilter,
  ] = useState("");

  const [
    categoryOptions,
    setCategoryOptions,
  ] = useState<CatalogOption[]>([]);

  const [
    brandOptions,
    setBrandOptions,
  ] = useState<CatalogOption[]>([]);

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    manageTarget,
    setManageTarget,
  ] =
    useState<Product | null>(
      null,
    );

  const [
    editTarget,
    setEditTarget,
  ] =
    useState<Product | null>(
      null,
    );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    archiveTarget,
    setArchiveTarget,
  ] =
    useState<Product | null>(
      null,
    );

  const approvedProfiles =
    useMemo(
      () =>
        profiles.filter(
          (profile) =>
            profile.status ===
            "approved",
        ),
      [profiles],
    );

  const selectedProfile =
    useMemo(
      () =>
        profiles.find(
          (profile) =>
            profile.public_id ===
            selectedProfileId,
        ) ?? null,
      [
        profiles,
        selectedProfileId,
      ],
    );

  const loadProfiles =
    useCallback(
      async () => {
        setLoadingProfiles(true);
        setErrorMessage("");

        try {
          const payload =
            await apiRequest<
              ApiEnvelope<
                SellerProfile[]
              >
            >(
              "/seller/profiles",
            );

          const rows =
            extractRows<SellerProfile>(
              payload,
            );

          setProfiles(rows);

          const approved =
            rows.filter(
              (profile) =>
                profile.status ===
                "approved",
            );

          setSelectedProfileId(
            (current) => {
              if (
                current &&
                approved.some(
                  (profile) =>
                    profile.public_id ===
                    current,
                )
              ) {
                return current;
              }

              return (
                approved[0]
                  ?.public_id ??
                ""
              );
            },
          );
        } catch (error) {
          setProfiles([]);

          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Seller profiles could not be loaded.",
          );
        } finally {
          setLoadingProfiles(
            false,
          );
        }
      },
      [],
    );

  const loadFormOptions =
    useCallback(
      async (
        sellerProfileId: string,
      ) => {
        if (!sellerProfileId) {
          setCategoryOptions([]);
          setBrandOptions([]);
          return;
        }

        try {
          const payload =
            await apiRequest<
              ApiEnvelope<FormOptionsData>
            >(
              `/seller/profiles/${encodeURIComponent(
                sellerProfileId,
              )}/products/form-options`,
            );

          const data =
            payload.data &&
            typeof payload.data === "object" &&
            !Array.isArray(payload.data)
              ? payload.data
              : null;

          setCategoryOptions(
            data?.categories ?? [],
          );

          setBrandOptions(
            data?.brands ?? [],
          );
        } catch {
          setCategoryOptions([]);
          setBrandOptions([]);
        }
      },
      [],
    );

  const loadProducts =
    useCallback(
      async (
        requestedPage = page,
        requestedSearch =
          search,
        requestedStatus =
          status,
        requestedCategory =
          categoryFilter,
        requestedBrand =
          brandFilter,
      ) => {
        if (
          !selectedProfileId
        ) {
          setProducts([]);
          setMeta({});
          return;
        }

        setLoadingProducts(
          true,
        );

        setErrorMessage("");

        try {
          const params =
            new URLSearchParams();

          params.set(
            "page",
            String(
              requestedPage,
            ),
          );

          /*
           * Card layout is more useful with more products visible.
           */
          params.set(
            "per_page",
            "20",
          );

          if (
            requestedSearch.trim()
          ) {
            params.set(
              "q",
              requestedSearch.trim(),
            );
          }

          if (
            requestedStatus !==
            "all"
          ) {
            params.set(
              "status",
              requestedStatus,
            );
          }

          if (
            requestedCategory
          ) {
            params.set(
              "category",
              requestedCategory,
            );
          }

          if (
            requestedBrand
          ) {
            params.set(
              "brand",
              requestedBrand,
            );
          }

          const payload =
            await apiRequest<
              ApiEnvelope<
                Product[]
              >
            >(
              `/seller/profiles/${encodeURIComponent(
                selectedProfileId,
              )}/products?${params.toString()}`,
            );

          setProducts(
            extractRows<Product>(
              payload,
            ),
          );

          setMeta(
            extractMeta(
              payload,
            ),
          );
        } catch (error) {
          setProducts([]);
          setMeta({});

          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Products could not be loaded.",
          );
        } finally {
          setLoadingProducts(
            false,
          );
        }
      },
      [
        brandFilter,
        categoryFilter,
        page,
        search,
        selectedProfileId,
        status,
      ],
    );

  useEffect(() => {
    const modalOpen =
      manageTarget !== null ||
      editTarget !== null ||
      archiveTarget !== null;

    if (!modalOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    archiveTarget,
    editTarget,
    manageTarget,
  ]);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  useEffect(() => {
    if (!selectedProfileId) {
      setCategoryOptions([]);
      setBrandOptions([]);
      return;
    }

    void loadFormOptions(
      selectedProfileId,
    );
  }, [
    loadFormOptions,
    selectedProfileId,
  ]);

  useEffect(() => {
    if (
      !selectedProfileId
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          void loadProducts(
            page,
            search,
            status,
            categoryFilter,
            brandFilter,
          );
        },
        search
          ? 300
          : 0,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    brandFilter,
    categoryFilter,
    loadProducts,
    page,
    search,
    selectedProfileId,
    status,
  ]);

  const readyOnPage =
    useMemo(
      () =>
        products.filter(
          (product) =>
            product
              .publication_readiness
              ?.is_ready,
        ).length,
      [products],
    );

  const noStockOnPage =
    useMemo(
      () =>
        products.filter(
          (product) =>
            availableStock(
              product,
            ) <= 0,
        ).length,
      [products],
    );

  function openEditModal(
    product: Product,
  ) {
    setManageTarget(null);
    setEditTarget(product);
  }

  async function submitForReview(
    product: Product,
  ) {
    if (
      !selectedProfileId
    ) {
      return;
    }

    setBusyProduct(
      product.public_id,
    );

    setManageTarget(null);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await apiRequest(
        `/seller/profiles/${encodeURIComponent(
          selectedProfileId,
        )}/products/${encodeURIComponent(
          product.public_id,
        )}/submit`,
        {
          method: "POST",
        },
      );

      setSuccessMessage(
        `"${product.name}" submitted for review.`,
      );

      await loadProducts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Product could not be submitted.",
      );
    } finally {
      setBusyProduct(null);
    }
  }

  async function archiveProduct() {
    if (
      !selectedProfileId ||
      !archiveTarget
    ) {
      return;
    }

    setBusyProduct(
      archiveTarget.public_id,
    );

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await apiRequest(
        `/seller/profiles/${encodeURIComponent(
          selectedProfileId,
        )}/products/${encodeURIComponent(
          archiveTarget.public_id,
        )}`,
        {
          method: "DELETE",
        },
      );

      setSuccessMessage(
        `"${archiveTarget.name}" archived successfully.`,
      );

      setArchiveTarget(
        null,
      );

      await loadProducts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Product could not be archived.",
      );
    } finally {
      setBusyProduct(null);
    }
  }

  const currentPage =
    meta.current_page ??
    page;

  const lastPage = Math.max(
    meta.last_page ?? 1,
    1,
  );

  const totalProducts =
    meta.total ??
    products.length;

  if (loadingProfiles) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-brand-ink" />

          <p className="text-sm text-brand-ink/70">
            Loading seller account...
          </p>
        </div>
      </div>
    );
  }

  if (
    approvedProfiles.length ===
    0
  ) {
    return (
      <div className="mx-auto max-w-3xl py-10">
        <div className="rounded-3xl border border-brand-orange bg-brand-mist p-8 text-center">
          <Store className="mx-auto h-10 w-10 text-brand-orange" />

          <h1 className="mt-4 text-2xl font-bold text-brand-ink">
            Product management is
            not available yet
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-brand-ink/70">
            Your seller business
            must be approved before
            products can be created
            and managed.
          </p>

          <Link
            href="/seller/verification"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-brand-ink px-4 text-sm font-semibold text-white"
          >
            Check verification
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
            <PackageSearch className="h-4 w-4" />
            Seller store
          </div>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-brand-ink sm:text-3xl">
            Your listed products
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-ink/70">
            Browse your catalog visually,
            check price and stock, and
            manage every product from its
            card.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              void loadProducts()
            }
            disabled={
              loadingProducts
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-brand-steel bg-white px-4 text-sm font-semibold text-brand-ink shadow-sm transition hover:bg-brand-mist disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loadingProducts
                  ? "animate-spin"
                  : ""
              }`}
            />
            Refresh
          </button>

          <Link
            href="/seller/products/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-ink"
          >
            <PackagePlus className="h-4 w-4" />
            Add product
          </Link>
        </div>
      </header>

      {errorMessage ? (
        <MessageBox
          kind="error"
          message={
            errorMessage
          }
          onClose={() =>
            setErrorMessage(
              "",
            )
          }
        />
      ) : null}

      {successMessage ? (
        <MessageBox
          kind="success"
          message={
            successMessage
          }
          onClose={() =>
            setSuccessMessage(
              "",
            )
          }
        />
      ) : null}

      <section className="rounded-2xl border border-brand-steel bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-steel">
              Selling as
            </div>

            <div className="mt-1 text-base font-semibold text-brand-ink">
              {sellerName(
                selectedProfile,
              )}
            </div>
          </div>

          {approvedProfiles.length >
          1 ? (
            <select
              value={
                selectedProfileId
              }
              onChange={(
                event,
              ) => {
                setSelectedProfileId(
                  event.target
                    .value,
                );

                setCategoryFilter("");
                setBrandFilter("");
                setPage(1);
              }}
              className="h-10 min-w-64 rounded-xl border border-brand-steel bg-white px-3 text-sm font-medium text-brand-ink outline-none focus:border-brand-orange"
            >
              {approvedProfiles.map(
                (profile) => (
                  <option
                    key={
                      profile.public_id
                    }
                    value={
                      profile.public_id
                    }
                  >
                    {sellerName(
                      profile,
                    )}
                  </option>
                ),
              )}
            </select>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={PackageCheck}
          label="Products"
          value={
            totalProducts
          }
          hint="Products matching the current filter"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Ready on page"
          value={readyOnPage}
          hint="Ready for moderation or sale"
        />

        <SummaryCard
          icon={Warehouse}
          label="No stock on page"
          value={
            noStockOnPage
          }
          hint="Products needing inventory"
        />

        <SummaryCard
          icon={ClipboardCheck}
          label="Current status"
          value={
            status === "all"
              ? "All"
              : statusLabel(
                  status,
                )
          }
          hint="Active product filter"
        />
      </section>

      <section className="rounded-2xl border border-brand-steel bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-black text-brand-ink">
            <Filter className="h-4 w-4 text-brand-ink" />
            Filter your products
          </div>

          {search ||
          status !== "all" ||
          categoryFilter ||
          brandFilter ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("all");
                setCategoryFilter("");
                setBrandFilter("");
                setPage(1);
              }}
              className="text-xs font-black text-brand-ink hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_180px_220px_200px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-steel" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search name, SKU or description..."
              className="h-10 w-full rounded-xl border border-brand-steel bg-white pl-10 pr-3 text-sm text-brand-ink outline-none placeholder:text-brand-steel focus:border-brand-orange focus:ring-4 focus:ring-brand-mist"
            />
          </label>

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value as
                  | "all"
                  | ProductStatus,
              );
              setPage(1);
            }}
            className="h-10 rounded-xl border border-brand-steel bg-white px-3 text-sm font-medium text-brand-ink outline-none focus:border-brand-orange"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-brand-steel bg-white px-3 text-sm font-medium text-brand-ink outline-none focus:border-brand-orange"
          >
            <option value="">All categories</option>
            {categoryOptions.map((category) => (
              <option
                key={category.public_id}
                value={category.public_id}
              >
                {category.label ?? category.name}
              </option>
            ))}
          </select>

          <select
            value={brandFilter}
            onChange={(event) => {
              setBrandFilter(event.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-brand-steel bg-white px-3 text-sm font-medium text-brand-ink outline-none focus:border-brand-orange"
          >
            <option value="">All brands</option>
            {brandOptions.map((brand) => (
              <option
                key={brand.public_id}
                value={brand.public_id}
              >
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-3xl border border-brand-steel bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-black text-brand-ink">
              Product catalog
            </h2>

            <p className="mt-1 text-sm text-brand-ink/70">
              Images, price, stock,
              readiness and moderation
              status at a glance.
            </p>
          </div>

          <p className="text-sm font-semibold text-brand-ink/70">
            {totalProducts}{" "}
            {totalProducts === 1
              ? "product"
              : "products"}
          </p>
        </div>

        {loadingProducts ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-brand-ink/70">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading products...
            </div>
          </div>
        ) : products.length ===
          0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-mist text-brand-ink">
              <PackagePlus className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-brand-ink">
              No products found
            </h3>

            <p className="mt-1 max-w-md text-sm leading-6 text-brand-ink/70">
              Add your first
              product or change the
              current filters.
            </p>

            <Link
              href="/seller/products/new"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-brand-ink px-4 text-sm font-semibold text-white hover:bg-brand-ink"
            >
              <PackagePlus className="h-4 w-4" />
              Add product
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {products.map(
                (product) => {
                  const stock =
                    availableStock(
                      product,
                    );

                  const errorCount =
                    readinessErrorCount(
                      product,
                    );

                  const isReady =
                    Boolean(
                      product
                        .publication_readiness
                        ?.is_ready,
                    );

                  const imageUrl =
                    resolveProductImage(
                      product,
                    );

                  const comparePrice =
                    formatComparePrice(
                      product,
                    );

                  return (
                    <article
                      key={
                        product.public_id
                      }
                      className="group relative flex h-[290px] flex-col overflow-hidden rounded-2xl border border-brand-steel bg-white transition hover:-translate-y-0.5 hover:border-brand-steel hover:shadow-lg hover:shadow-brand-steel/60"
                    >
                      <div className="relative h-[115px] shrink-0 overflow-hidden bg-brand-mist">
                        {imageUrl ? (
                          <img
                            src={
                              imageUrl
                            }
                            alt={
                              product
                                .primary_media
                                ?.alt_text ??
                              product.name
                            }
                            className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-2 text-brand-steel">
                            <ImageOff className="h-10 w-10" />

                            <span className="text-xs font-semibold">
                              No product
                              image
                            </span>
                          </div>
                        )}

                        <div className="absolute left-2 top-2">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black shadow-sm ${statusClassName(
                              product.status,
                            )}`}
                          >
                            {statusLabel(
                              product.status,
                            )}
                          </span>
                        </div>

                        <div className="absolute right-2 top-2">
                          <button
                            type="button"
                            aria-label={`Manage ${product.name}`}
                            onClick={() =>
                              setManageTarget(
                                product,
                              )
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/95 text-brand-ink shadow-md backdrop-blur transition hover:bg-white hover:text-brand-ink"
                          >
                            {busyProduct ===
                            product.public_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold uppercase tracking-wide text-brand-steel">
                              {product
                                .brand
                                ?.name ??
                                "No brand"}
                            </p>

                            <Link
                              href={
                                product
                                  .actions
                                  ?.can_edit
                                  ? `/seller/products/${product.public_id}/edit`
                                  : "/seller/products"
                              }
                              className="mt-0.5 line-clamp-1 block text-sm font-black leading-5 text-brand-ink transition hover:text-brand-ink"
                            >
                              {
                                product.name
                              }
                            </Link>
                          </div>

                          <span className="shrink-0 rounded-full bg-brand-mist px-2 py-0.5 text-[10px] font-bold text-brand-ink/70">
                            {product
                              .condition
                              ? product.condition.replace(
                                  /_/g,
                                  " ",
                                )
                              : "Product"}
                          </span>
                        </div>

                        <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-brand-ink/70">
                          {product
                            .short_description ??
                            product
                              .category
                              ?.name ??
                            "Marketplace product"}
                        </p>

                        <div className="mt-2">
                          <p className="text-sm font-black text-brand-ink">
                            {formatPrice(
                              product,
                            )}
                          </p>

                          {comparePrice ? (
                            <p className="mt-0.5 text-[10px] font-semibold text-brand-steel line-through">
                              {
                                comparePrice
                              }
                            </p>
                          ) : null}
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="rounded-xl bg-brand-mist px-2 py-1.5">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-brand-ink/70">
                              <Warehouse className="h-3.5 w-3.5" />
                              Stock
                            </div>

                            <p
                              className={`mt-0.5 text-xs font-black ${
                                stock > 0
                                  ? "text-brand-ink"
                                  : "text-red-600"
                              }`}
                            >
                              {stock}
                            </p>
                          </div>

                          <div className="rounded-xl bg-brand-mist px-2 py-1.5">
                            <div className="text-[10px] font-bold text-brand-ink/70">
                              Setup
                            </div>

                            <p
                              className={`mt-0.5 text-xs font-black ${
                                isReady
                                  ? "text-emerald-700"
                                  : "text-brand-orange"
                              }`}
                            >
                              {isReady
                                ? "Ready"
                                : errorCount >
                                    0
                                  ? `${errorCount} issue${
                                      errorCount ===
                                      1
                                        ? ""
                                        : "s"
                                    }`
                                  : "Incomplete"}
                            </p>
                          </div>
                        </div>

                        {product.status ===
                          "rejected" &&
                        product
                          .moderation
                          ?.rejection_reason ? (
                          <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                            {
                              product
                                .moderation
                                .rejection_reason
                            }
                          </div>
                        ) : null}

                        <div className="mt-auto pt-2">
                          <div className="flex items-center justify-between gap-2 border-t border-brand-mist pt-2">
                            <span className="text-[10px] font-semibold text-brand-steel">
                              Updated{" "}
                              {formatDate(
                                product.updated_at,
                              )}
                            </span>

                            {product
                              .actions
                              ?.can_edit ? (
                              <Link
                                href={`/seller/products/${product.public_id}/edit`}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-brand-steel bg-white px-2.5 text-[11px] font-black text-brand-ink transition hover:border-brand-orange hover:text-brand-ink"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                Manage
                              </Link>
                            ) : (
                              <span className="text-xs font-bold text-brand-steel">
                                View only
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                },
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-brand-mist pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-brand-ink/70">
                Showing{" "}
                <span className="font-semibold text-brand-ink">
                  {meta.from ??
                    0}
                </span>{" "}
                –{" "}
                <span className="font-semibold text-brand-ink">
                  {meta.to ??
                    0}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-brand-ink">
                  {
                    totalProducts
                  }
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={
                    currentPage <=
                      1 ||
                    loadingProducts
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          1,
                          current -
                            1,
                        ),
                    )
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-brand-steel bg-white px-3 text-sm font-medium text-brand-ink hover:bg-brand-mist disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <span className="px-2 text-sm font-medium text-brand-ink/70">
                  Page{" "}
                  {
                    currentPage
                  }{" "}
                  of{" "}
                  {
                    lastPage
                  }
                </span>

                <button
                  type="button"
                  disabled={
                    currentPage >=
                      lastPage ||
                    loadingProducts
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.min(
                          lastPage,
                          current +
                            1,
                        ),
                    )
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-brand-steel bg-white px-3 text-sm font-medium text-brand-ink hover:bg-brand-mist disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {manageTarget ? (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-brand-ink/55 p-3 backdrop-blur-[2px] sm:p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setManageTarget(null);
            }
          }}
        >
            <div className="h-[calc(100dvh-24px)] max-h-[720px] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl sm:h-[calc(100dvh-32px)]">
              <div className="grid h-full min-h-0 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="min-h-0 overflow-y-auto border-b border-brand-mist bg-brand-mist p-4 lg:border-b-0 lg:border-r lg:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black ${statusClassName(
                      manageTarget.status,
                    )}`}
                  >
                    {statusLabel(
                      manageTarget.status,
                    )}
                  </span>

                  <button
                    type="button"
                    aria-label="Close product management"
                    onClick={() =>
                      setManageTarget(null)
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-steel bg-white text-brand-ink/70 transition hover:text-brand-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-brand-steel bg-white">
                  <div className="aspect-[4/3]">
                    {resolveProductImage(
                      manageTarget,
                    ) ? (
                      <img
                        src={
                          resolveProductImage(
                            manageTarget,
                          ) ?? ""
                        }
                        alt={
                          manageTarget
                            .primary_media
                            ?.alt_text ??
                          manageTarget.name
                        }
                        className="h-full w-full object-contain p-4"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-brand-steel">
                        <ImageOff className="h-10 w-10" />
                        <span className="text-xs font-semibold">
                          No product image
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-brand-steel">
                  {manageTarget.brand
                    ?.name ??
                    "No brand"}
                </p>

                <h2 className="mt-1 text-xl font-black leading-7 text-brand-ink">
                  {manageTarget.name}
                </h2>

                <p className="mt-1 text-sm text-brand-ink/70">
                  {manageTarget.category
                    ?.name ??
                    "No category"}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 lg:grid-cols-1">
                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-brand-steel">
                      Price
                    </p>
                    <p className="mt-1 text-sm font-black text-brand-ink">
                      {formatPrice(
                        manageTarget,
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-brand-steel">
                      Stock
                    </p>
                    <p
                      className={`mt-1 text-sm font-black ${
                        availableStock(
                          manageTarget,
                        ) > 0
                          ? "text-brand-ink"
                          : "text-red-600"
                      }`}
                    >
                      {availableStock(
                        manageTarget,
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-brand-steel">
                      Setup
                    </p>
                    <p
                      className={`mt-1 text-sm font-black ${
                        manageTarget
                          .publication_readiness
                          ?.is_ready
                          ? "text-emerald-700"
                          : "text-brand-orange"
                      }`}
                    >
                      {manageTarget
                        .publication_readiness
                        ?.is_ready
                        ? "Ready"
                        : `${readinessErrorCount(
                            manageTarget,
                          )} issue${
                            readinessErrorCount(
                              manageTarget,
                            ) === 1
                              ? ""
                              : "s"
                          }`}
                    </p>
                  </div>
                </div>
              </aside>

                <section className="flex min-h-0 flex-col">
                <div className="border-b border-brand-mist px-5 py-5 sm:px-6">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-ink">
                    Product management
                  </p>

                  <h3 className="mt-1 text-2xl font-black text-brand-ink">
                    Manage this product
                  </h3>

                  <p className="mt-1 text-sm text-brand-ink/70">
                    Update product information, price, inventory,
                    media and moderation from one place.
                  </p>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {manageTarget.actions
                      ?.can_edit ? (
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            manageTarget,
                          )
                        }
                        className="flex items-center gap-3 rounded-2xl border border-brand-steel bg-white p-4 text-left transition hover:border-brand-orange hover:bg-brand-mist/50"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-mist text-brand-ink">
                          <Edit3 className="h-5 w-5" />
                        </span>

                        <span>
                          <span className="block text-sm font-black text-brand-ink">
                            Edit product
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-brand-ink/70">
                            Edit product name, category, brand,
                            description, condition and warranty.
                          </span>
                        </span>
                      </button>
                    ) : null}

                    <Link
                      href={`/seller/products/${manageTarget.public_id}/edit#variants`}
                      onClick={() =>
                        setManageTarget(null)
                      }
                      className="flex items-center gap-3 rounded-2xl border border-brand-steel bg-white p-4 transition hover:border-brand-orange hover:bg-brand-mist/50"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-mist text-brand-ink">
                        <PackageCheck className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-black text-brand-ink">
                          Variants & price
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-brand-ink/70">
                          Manage SKU, product variation and selling price.
                        </span>
                      </span>
                    </Link>

                    <Link
                      href={`/seller/products/${manageTarget.public_id}/edit#inventory`}
                      onClick={() =>
                        setManageTarget(null)
                      }
                      className="flex items-center gap-3 rounded-2xl border border-brand-steel bg-white p-4 transition hover:border-brand-orange hover:bg-brand-mist/50"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-mist text-brand-orange">
                        <Warehouse className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-black text-brand-ink">
                          Inventory
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-brand-ink/70">
                          Adjust stock quantity and inventory settings.
                        </span>
                      </span>
                    </Link>

                    <Link
                      href={`/seller/products/${manageTarget.public_id}/edit#media`}
                      onClick={() =>
                        setManageTarget(null)
                      }
                      className="flex items-center gap-3 rounded-2xl border border-brand-steel bg-white p-4 transition hover:border-brand-orange hover:bg-brand-mist/50"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-mist text-brand-ink">
                        <ImageOff className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-black text-brand-ink">
                          Product images
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-brand-ink/70">
                          Upload, replace and organize product images.
                        </span>
                      </span>
                    </Link>

                    <Link
                      href={`/seller/products/${manageTarget.public_id}/edit#return-policy`}
                      onClick={() =>
                        setManageTarget(null)
                      }
                      className="flex items-center gap-3 rounded-2xl border border-brand-steel bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50/50"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                        <ClipboardCheck className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-black text-brand-ink">
                          Return policy
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-brand-ink/70">
                          Manage customer return eligibility and rules.
                        </span>
                      </span>
                    </Link>

                    {manageTarget.actions
                      ?.can_submit_for_review ? (
                      <button
                        type="button"
                        disabled={
                          busyProduct ===
                          manageTarget.public_id
                        }
                        onClick={() =>
                          void submitForReview(
                            manageTarget,
                          )
                        }
                        className="flex items-center gap-3 rounded-2xl border border-brand-steel bg-brand-mist p-4 text-left transition hover:bg-brand-mist disabled:opacity-60"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-ink text-white">
                          {busyProduct ===
                          manageTarget.public_id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Send className="h-5 w-5" />
                          )}
                        </span>
                        <span>
                          <span className="block text-sm font-black text-brand-ink">
                            Submit for review
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-brand-ink">
                            Send the completed product to administrator moderation.
                          </span>
                        </span>
                      </button>
                    ) : null}
                  </div>

                  {manageTarget.status ===
                    "rejected" &&
                  manageTarget.moderation
                    ?.rejection_reason ? (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-red-600">
                        Rejection reason
                      </p>
                      <p className="mt-2 text-sm leading-6 text-red-800">
                        {
                          manageTarget
                            .moderation
                            .rejection_reason
                        }
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-brand-mist px-5 py-4 sm:px-6">
                  <div>
                    {manageTarget.actions
                      ?.can_archive ? (
                      <button
                        type="button"
                        onClick={() => {
                          const product =
                            manageTarget;

                          setManageTarget(
                            null,
                          );

                          setArchiveTarget(
                            product,
                          );
                        }}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-black text-red-700 transition hover:bg-red-50"
                      >
                        <Archive className="h-4 w-4" />
                        Archive
                      </button>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setManageTarget(null)
                    }
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-brand-steel bg-white px-5 text-sm font-black text-brand-ink transition hover:bg-brand-mist"
                  >
                    Close
                  </button>
                </div>
              </section>
            </div>
            </div>
          </div>
        </ModalPortal>
      ) : null}

      {editTarget ? (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[1010] flex items-center justify-center overflow-hidden bg-brand-ink/60 p-3 backdrop-blur-[2px] sm:p-4"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setEditTarget(null);
              }
            }}
          >
            <div className="flex h-[calc(100dvh-24px)] max-h-[900px] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-brand-mist shadow-2xl sm:h-[calc(100dvh-32px)]">
              <div className="flex items-center justify-between gap-4 border-b border-brand-steel bg-white px-5 py-4 sm:px-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-ink">
                    Complete product editor
                  </p>

                  <h2 className="mt-1 text-xl font-black text-brand-ink">
                    Update {editTarget.name}
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Close editor"
                  onClick={() =>
                    setEditTarget(null)
                  }
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-steel bg-white text-brand-ink/70 transition hover:text-brand-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                <ProductManager
                  productId={
                    editTarget.public_id
                  }
                  embedded
                  onCancel={() =>
                    setEditTarget(null)
                  }
                  onSaved={() => {
                    const productName =
                      editTarget.name;

                    setEditTarget(null);

                    setSuccessMessage(
                      `"${productName}" updated successfully.`,
                    );

                    void loadProducts();
                  }}
                />
              </div>
            </div>
          </div>
        </ModalPortal>
      ) : null}

      {archiveTarget ? (
        <ModalPortal>
          <div className="fixed inset-0 z-[1020] flex items-center justify-center overflow-hidden bg-brand-ink/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Archive className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-brand-ink">
              Archive product?
            </h2>

            <p className="mt-2 text-sm leading-6 text-brand-ink/70">
              <span className="font-semibold text-brand-ink">
                {
                  archiveTarget.name
                }
              </span>{" "}
              will no longer be
              available as an
              active seller
              product.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={
                  busyProduct ===
                  archiveTarget.public_id
                }
                onClick={() =>
                  setArchiveTarget(
                    null,
                  )
                }
                className="inline-flex h-10 items-center justify-center rounded-xl border border-brand-steel bg-white px-4 text-sm font-semibold text-brand-ink hover:bg-brand-mist"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  busyProduct ===
                  archiveTarget.public_id
                }
                onClick={() =>
                  void archiveProduct()
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busyProduct ===
                archiveTarget.public_id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}

                Archive
              </button>
            </div>
            </div>
          </div>
        </ModalPortal>
      ) : null}
    </div>
  );
}

function ModalPortal({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  return createPortal(
    children,
    document.body,
  );
}

function MessageBox({
  kind,
  message,
  onClose,
}: {
  kind: "error" | "success";
  message: string;
  onClose: () => void;
}) {
  const success =
    kind === "success";

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      )}

      <div className="flex-1">
        {message}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1 hover:bg-black/5"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof PackageCheck;
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-steel bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-mist text-brand-ink">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink/70">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-brand-ink">
            {value}
          </p>

          <p className="mt-1 text-xs text-brand-ink/70">
            {hint}
          </p>
        </div>
      </div>
    </div>
  );
}