"use client";

import {
  campaignLayoutGroups,
  campaignLayouts,
} from "@/config/homepage-campaign-layouts";
import type {
  CampaignLayoutType,
  CampaignProductSource,
  HomepageCampaignForm,
} from "@/types/homepage-campaign";

type CampaignProductSettingsProps = {
  form: HomepageCampaignForm;

  updateField: <K extends keyof HomepageCampaignForm>(
    key: K,
    value: HomepageCampaignForm[K],
  ) => void;
};

const productSources: Array<{
  value: CampaignProductSource;
  label: string;
}> = [
  {
    value: "newest",
    label: "Newest approved seller products",
  },
  {
    value: "discounted",
    label: "Discounted products",
  },
  {
    value: "category",
    label: "Products from one category",
  },
  {
    value: "brand",
    label: "Products from one brand",
  },
  {
    value: "seller",
    label: "Products from one seller",
  },
  {
    value: "manual",
    label: "Manually selected products",
  },
];

export function CampaignProductSettings({
  form,
  updateField,
}: CampaignProductSettingsProps) {
  const layout = form.layout_type ?? "banner_products";

  const source = form.product_source ?? "newest";

  const selectedLayout =
    campaignLayouts.find((item) => item.value === layout) ?? campaignLayouts[0];

  const showProducts = form.show_products ?? true;

  const SelectedIcon = selectedLayout.icon;

  function changeLayout(value: CampaignLayoutType) {
    updateField("layout_type", value);

    if (value === "full_banner") {
      updateField("show_products", false);
      return;
    }

    if (form.show_products === false) {
      updateField("show_products", true);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-brand-mist bg-brand-mist/40 p-4">
      <div>
        <p className="text-sm font-black text-brand-ink">Campaign layout</p>

        <p className="mt-1 text-xs leading-5 text-brand-ink/70">
          Choose how this campaign will appear on the homepage.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-brand-ink">
          Layout style
        </span>

        <select
          value={layout}
          onChange={(event) =>
            changeLayout(event.target.value as CampaignLayoutType)
          }
          className="h-12 w-full rounded-xl border border-brand-steel bg-white px-3 text-sm font-bold text-brand-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-mist"
        >
          {campaignLayoutGroups.map((group) => (
            <optgroup key={group} label={group}>
              {campaignLayouts
                .filter((item) => item.group === group)
                .map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>

      <div className="flex items-start gap-3 rounded-xl border border-brand-steel bg-white p-4 shadow-sm">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-ink text-white">
          <SelectedIcon className="size-5" />
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-black text-brand-ink">{selectedLayout.label}</p>

            <span className="rounded-full bg-brand-mist px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-brand-ink">
              {selectedLayout.group}
            </span>
          </div>

          <p className="mt-1 text-xs leading-5 text-brand-ink/70">
            {selectedLayout.description}
          </p>
        </div>
      </div>

      {layout !== "full_banner" ? (
        <>
          <label className="flex items-center justify-between gap-4 rounded-xl border border-brand-steel bg-white p-4">
            <span>
              <span className="block text-sm font-black text-brand-ink">
                Show seller products
              </span>

              <span className="mt-1 block text-xs leading-5 text-brand-ink/70">
                Load approved and available seller products automatically.
              </span>
            </span>

            <input
              type="checkbox"
              checked={showProducts}
              onChange={(event) =>
                updateField("show_products", event.target.checked)
              }
              className="size-5 accent-brand-ink"
            />
          </label>

          {showProducts ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-brand-ink">
                  Product source
                </span>

                <select
                  value={source}
                  onChange={(event) =>
                    updateField(
                      "product_source",
                      event.target.value as CampaignProductSource,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-brand-steel bg-white px-3 text-sm outline-none focus:border-brand-orange"
                >
                  {productSources.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-brand-ink">
                  Number of products
                </span>

                <input
                  type="number"
                  min="1"
                  max="24"
                  value={form.product_limit ?? "8"}
                  onChange={(event) =>
                    updateField("product_limit", event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-brand-steel bg-white px-3 text-sm outline-none focus:border-brand-orange"
                />
              </label>
            </div>
          ) : null}

          {showProducts && source === "category" ? (
            <IdentifierInput
              label="Category public ID"
              value={form.category_public_id ?? ""}
              placeholder="Paste the category public ID"
              onChange={(value) => updateField("category_public_id", value)}
            />
          ) : null}

          {showProducts && source === "brand" ? (
            <IdentifierInput
              label="Brand public ID"
              value={form.brand_public_id ?? ""}
              placeholder="Paste the brand public ID"
              onChange={(value) => updateField("brand_public_id", value)}
            />
          ) : null}

          {showProducts && source === "seller" ? (
            <IdentifierInput
              label="Seller public ID"
              value={form.seller_public_id ?? ""}
              placeholder="Paste the seller public ID"
              onChange={(value) => updateField("seller_public_id", value)}
            />
          ) : null}

          {showProducts && source === "manual" ? (
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-brand-ink">
                Product public IDs
              </span>

              <textarea
                value={(form.product_public_ids ?? []).join("\n")}
                placeholder="One product public ID per line"
                onChange={(event) =>
                  updateField(
                    "product_public_ids",
                    event.target.value
                      .split(/\n|,/)
                      .map((value) => value.trim())
                      .filter(Boolean),
                  )
                }
                rows={4}
                className="w-full rounded-xl border border-brand-steel bg-white px-3 py-3 text-sm outline-none focus:border-brand-orange"
              />
            </label>
          ) : null}
        </>
      ) : (
        <p className="rounded-xl border border-brand-steel bg-white p-3 text-xs leading-5 text-brand-ink/70">
          This layout displays only one large product-led campaign.
        </p>
      )}
    </div>
  );
}

function IdentifierInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-brand-ink">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-brand-steel bg-white px-3 text-sm outline-none focus:border-brand-orange"
      />
    </label>
  );
}
