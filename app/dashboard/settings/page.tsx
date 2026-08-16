"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import gsap from "gsap";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  logo_url: string | null;

  cash_enabled: boolean;
  upi_enabled: boolean;
  card_enabled: boolean;
  upi_id: string | null;
  upi_qr_url: string | null;
};

export default function RestaurantSettings() {
  const router = useRouter();
  const supabase = createClient();

  const pageRef =
    useRef<HTMLDivElement>(null);

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  // Restaurant information
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] =
    useState("");
  const [logoUrl, setLogoUrl] =
    useState("");

  // Payment settings
  const [cashEnabled, setCashEnabled] =
    useState(true);

  const [upiEnabled, setUpiEnabled] =
    useState(true);

  const [cardEnabled, setCardEnabled] =
    useState(true);

  const [upiId, setUpiId] =
    useState("");

  const [upiQrUrl, setUpiQrUrl] =
    useState("");

  const [upiQrFile, setUpiQrFile] =
    useState<File | null>(null);

  const [upiQrPreview, setUpiQrPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingQr, setUploadingQr] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadRestaurant();
  }, []);

  useLayoutEffect(() => {
    if (
      loading ||
      !pageRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".settings-reveal",
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading]);

  async function loadRestaurant() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const {
      data,
      error: loadError,
    } = await supabase
      .from("restaurants")
      .select(
        `
        id,
        name,
        slug,
        phone,
        address,
        description,
        logo_url,
        cash_enabled,
        upi_enabled,
        card_enabled,
        upi_id,
        upi_qr_url
        `
      )
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();

    if (loadError) {
      console.error(loadError);
      setError(loadError.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setError(
        "Restaurant not found."
      );
      setLoading(false);
      return;
    }

    setRestaurant(data);

    setName(data.name || "");
    setSlug(data.slug || "");
    setPhone(data.phone || "");
    setAddress(data.address || "");
    setDescription(
      data.description || ""
    );
    setLogoUrl(
      data.logo_url || ""
    );

    setCashEnabled(
      data.cash_enabled ?? true
    );

    setUpiEnabled(
      data.upi_enabled ?? true
    );

    setCardEnabled(
      data.card_enabled ?? true
    );

    setUpiId(
      data.upi_id || ""
    );

    setUpiQrUrl(
      data.upi_qr_url || ""
    );

    setUpiQrPreview(
      data.upi_qr_url || ""
    );

    setLoading(false);
  }

  function handleQrFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "QR image must be smaller than 5 MB."
      );
      return;
    }

    setError("");
    setMessage("");

    setUpiQrFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setUpiQrPreview(
      previewUrl
    );
  }

  async function uploadUpiQr() {
    if (
      !restaurant ||
      !upiQrFile
    ) {
      return upiQrUrl;
    }

    setUploadingQr(true);

    try {
      const fileExtension =
        upiQrFile.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "png";

      const filePath =
        `${restaurant.id}/upi-qr-${Date.now()}.${fileExtension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("menu-images")
        .upload(
          filePath,
          upiQrFile,
          {
            cacheControl: "3600",
            upsert: true,
            contentType:
              upiQrFile.type,
          }
        );

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicUrlData,
      } =
        supabase.storage
          .from("menu-images")
          .getPublicUrl(
            filePath
          );

      return publicUrlData
        .publicUrl;
    } catch (uploadError) {
      console.error(
        "UPI QR upload error:",
        uploadError
      );

      throw new Error(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload UPI QR."
      );
    } finally {
      setUploadingQr(false);
    }
  }

  async function saveChanges(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!restaurant) return;

    setSaving(true);
    setMessage("");
    setError("");

    const cleanName =
      name.trim();

    const cleanSlug =
      slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

    const cleanUpiId =
      upiId.trim();

    if (!cleanName) {
      setError(
        "Restaurant name is required."
      );
      setSaving(false);
      return;
    }

    if (!cleanSlug) {
      setError(
        "Restaurant slug is required."
      );
      setSaving(false);
      return;
    }

    if (
      upiEnabled &&
      !cleanUpiId
    ) {
      setError(
        "Please enter your UPI ID or turn UPI off."
      );
      setSaving(false);
      return;
    }

    try {
      let finalUpiQrUrl =
        upiQrUrl;

      if (upiQrFile) {
        finalUpiQrUrl =
          await uploadUpiQr();
      }

      const {
        data,
        error: updateError,
      } = await supabase
        .from("restaurants")
        .update({
          name: cleanName,
          slug: cleanSlug,
          phone:
            phone.trim() || null,
          address:
            address.trim() || null,
          description:
            description.trim() || null,
          logo_url:
            logoUrl.trim() || null,

          cash_enabled:
            cashEnabled,

          upi_enabled:
            upiEnabled,

          card_enabled:
            cardEnabled,

          upi_id:
            cleanUpiId || null,

          upi_qr_url:
            finalUpiQrUrl || null,
        })
        .eq(
          "id",
          restaurant.id
        )
        .select(
          `
          id,
          name,
          slug,
          phone,
          address,
          description,
          logo_url,
          cash_enabled,
          upi_enabled,
          card_enabled,
          upi_id,
          upi_qr_url
          `
        )
        .single();

      if (updateError) {
        throw updateError;
      }

      setRestaurant(data);

      setName(data.name || "");
      setSlug(data.slug || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setDescription(
        data.description || ""
      );
      setLogoUrl(
        data.logo_url || ""
      );

      setCashEnabled(
        data.cash_enabled ?? true
      );

      setUpiEnabled(
        data.upi_enabled ?? true
      );

      setCardEnabled(
        data.card_enabled ?? true
      );

      setUpiId(
        data.upi_id || ""
      );

      setUpiQrUrl(
        data.upi_qr_url || ""
      );

      setUpiQrPreview(
        data.upi_qr_url || ""
      );

      setUpiQrFile(null);

      setMessage(
        "Restaurant and payment settings saved successfully."
      );

      window.setTimeout(() => {
        setMessage("");
      }, 4500);
    } catch (saveError) {
      console.error(
        "Save settings error:",
        saveError
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function toggleWithFeedback(
    setter: React.Dispatch<
      React.SetStateAction<boolean>
    >
  ) {
    setter((current) => !current);
    setMessage("");
    setError("");
  }

  if (loading) {
    return (
      <main className="min-h-[60vh]">
        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">

          <section className="rounded-[22px] border border-[#E9E9E7] bg-white p-6">
            <div className="h-7 w-52 animate-pulse rounded-lg bg-[#ECEDEA]" />
            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-[#ECEDEA]" />

            <div className="mt-8 space-y-5">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div key={index}>
                  <div className="h-3 w-28 animate-pulse rounded bg-[#ECEDEA]" />
                  <div className="mt-2 h-11 animate-pulse rounded-xl bg-[#F1F2F0]" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[22px] border border-[#E9E9E7] bg-white p-6">
            <div className="h-7 w-40 animate-pulse rounded-lg bg-[#ECEDEA]" />
            <div className="mt-6 h-44 animate-pulse rounded-2xl bg-[#F1F2F0]" />
          </section>

        </div>
      </main>
    );
  }

  if (error && !restaurant) {
    return (
      <main className="min-h-[60vh]">
        <div className="mx-auto max-w-xl rounded-[24px] border border-[#F0CACA] bg-white p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F0] text-3xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#1F1F1F]">
            Unable to load settings
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#B42318]">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-[#0C831F] px-5 py-3 text-sm font-bold text-white"
          >
            Try Again
          </button>

        </div>
      </main>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <main
      ref={pageRef}
      className="pb-10"
    >
      {/* PAGE INTRO */}

      <section className="settings-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-7">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex min-w-0 items-center gap-4">

            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="h-16 w-16 shrink-0 rounded-2xl border border-[#E9E9E7] bg-white object-contain p-1.5"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#E9F8E5] text-3xl">
                🍽️
              </div>
            )}

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#54B226]">
                Restaurant Settings
              </p>

              <h2 className="mt-1 truncate text-2xl font-bold text-[#1F1F1F] sm:text-3xl">
                {name || "Your Restaurant"}
              </h2>

              <p className="mt-1 text-sm text-[#6B7280]">
                Manage restaurant details, payments and your customer-facing information.
              </p>
            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2">

            <span className="rounded-full bg-[#E9F8E5] px-3 py-1.5 text-[10px] font-bold text-[#0C831F]">
              ● Settings
            </span>

          </div>

        </div>

      </section>

      {/* STATUS */}

      {(message || error) && (
        <div
          className={`settings-reveal mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            error
              ? "border-[#F1C4C4] bg-[#FFF3F3] text-[#B42318]"
              : "border-[#CDE8C5] bg-[#EAF8E5] text-[#0C831F]"
          }`}
        >
          {error
            ? error
            : `✓ ${message}`}
        </div>
      )}

      <form
        onSubmit={saveChanges}
        className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
      >

        {/* RESTAURANT INFORMATION */}

        <section className="settings-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-6">

          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#54B226]">
                General
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#1F1F1F]">
                Restaurant Information
              </h3>

              <p className="mt-1 text-sm text-[#6B7280]">
                This information can be shown to customers.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F8F1]">
              🏪
            </div>

          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Restaurant Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Royal Spice"
                className="h-12 w-full rounded-xl border border-[#E1E5E2] bg-white px-4 text-sm font-medium text-[#1F1F1F] outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Restaurant Slug
              </label>

              <input
                type="text"
                value={slug}
                onChange={(event) =>
                  setSlug(
                    event.target.value
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )
                  )
                }
                placeholder="royal-spice"
                className="h-12 w-full rounded-xl border border-[#E1E5E2] bg-white px-4 text-sm font-medium text-[#1F1F1F] outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
              />

              <p className="mt-2 text-[11px] text-[#9CA3AF]">
                Used as your restaurant's public slug.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="9999999999"
                className="h-12 w-full rounded-xl border border-[#E1E5E2] bg-white px-4 text-sm font-medium text-[#1F1F1F] outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Address
              </label>

              <textarea
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value
                  )
                }
                placeholder="Restaurant address"
                rows={3}
                className="w-full resize-none rounded-xl border border-[#E1E5E2] bg-white px-4 py-3 text-sm font-medium text-[#1F1F1F] outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Tell customers about your restaurant..."
                rows={4}
                className="w-full resize-none rounded-xl border border-[#E1E5E2] bg-white px-4 py-3 text-sm font-medium text-[#1F1F1F] outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Logo URL
              </label>

              <input
                type="url"
                value={logoUrl}
                onChange={(event) =>
                  setLogoUrl(
                    event.target.value
                  )
                }
                placeholder="https://..."
                className="h-12 w-full rounded-xl border border-[#E1E5E2] bg-white px-4 text-sm font-medium text-[#1F1F1F] outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
              />

              <p className="mt-2 text-[11px] text-[#9CA3AF]">
                Paste a public image URL for your restaurant logo.
              </p>
            </div>

          </div>

        </section>

        {/* PAYMENT */}

        <section className="settings-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-6">

          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#54B226]">
                Payments
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#1F1F1F]">
                Payment Methods
              </h3>

              <p className="mt-1 text-sm text-[#6B7280]">
                Choose what customers can use to pay.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F8F1]">
              💳
            </div>

          </div>

          <div className="mt-6 space-y-3">

            {/* CASH */}

            <div className="rounded-2xl border border-[#E9E9E7] bg-[#FAFAF9] p-4">

              <div className="flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    💵
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#1F1F1F]">
                      Cash
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-[#6B7280]">
                      Accept cash at the table or counter.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  aria-label="Toggle cash payments"
                  aria-pressed={
                    cashEnabled
                  }
                  onClick={() =>
                    toggleWithFeedback(
                      setCashEnabled
                    )
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full ${
                    cashEnabled
                      ? "bg-[#0C831F]"
                      : "bg-[#D1D5DB]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm ${
                      cashEnabled
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>

            </div>

            {/* UPI */}

            <div className="rounded-2xl border border-[#E9E9E7] bg-[#FAFAF9] p-4">

              <div className="flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    📱
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#1F1F1F]">
                      UPI
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-[#6B7280]">
                      Customers scan your restaurant QR.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  aria-label="Toggle UPI payments"
                  aria-pressed={
                    upiEnabled
                  }
                  onClick={() =>
                    toggleWithFeedback(
                      setUpiEnabled
                    )
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full ${
                    upiEnabled
                      ? "bg-[#0C831F]"
                      : "bg-[#D1D5DB]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm ${
                      upiEnabled
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>

              {upiEnabled && (
                <div className="mt-5 border-t border-[#E5E7EB] pt-5">

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    UPI ID
                  </label>

                  <input
                    type="text"
                    value={upiId}
                    onChange={(event) =>
                      setUpiId(
                        event.target.value
                      )
                    }
                    placeholder="royalspice@upi"
                    className="h-12 w-full rounded-xl border border-[#E1E5E2] bg-white px-4 text-sm font-medium outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
                  />

                  <p className="mt-2 text-[11px] text-[#9CA3AF]">
                    Example: royalspice@upi
                  </p>

                  <div className="mt-5">

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                      Restaurant UPI QR
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#BFDDB8] bg-[#F6FBF4] px-4 py-6 text-center hover:bg-[#EEF8EA]">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                        📷
                      </div>

                      <p className="mt-3 text-sm font-bold text-[#1F1F1F]">
                        {upiQrFile
                          ? "Choose another QR"
                          : "Upload UPI QR"}
                      </p>

                      <p className="mt-1 text-xs text-[#6B7280]">
                        PhonePe, Google Pay, Paytm or bank QR
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={
                          handleQrFileChange
                        }
                        className="hidden"
                      />

                    </label>

                  </div>

                  {upiQrPreview && (
                    <div className="mt-5 rounded-2xl border border-[#E9E9E7] bg-white p-4">

                      <div className="flex items-center justify-between gap-3">

                        <div>
                          <p className="text-sm font-bold text-[#1F1F1F]">
                            QR Preview
                          </p>

                          <p className="mt-0.5 text-xs text-[#6B7280]">
                            Customers will scan this QR to pay.
                          </p>
                        </div>

                        <span className="rounded-full bg-[#E9F8E5] px-2.5 py-1 text-[9px] font-bold text-[#0C831F]">
                          READY
                        </span>

                      </div>

                      <div className="mt-4 flex justify-center">

                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-[0_4px_14px_rgba(0,0,0,0.05)]">

                          <img
                            src={
                              upiQrPreview
                            }
                            alt="Restaurant UPI QR"
                            className="h-52 w-52 rounded-xl object-contain sm:h-56 sm:w-56"
                          />

                        </div>

                      </div>

                      {upiQrFile && (
                        <p className="mt-3 text-center text-xs font-semibold text-[#0C831F]">
                          New QR selected. Save Changes to upload it.
                        </p>
                      )}

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* CARD */}

            <div className="rounded-2xl border border-[#E9E9E7] bg-[#FAFAF9] p-4">

              <div className="flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                    💳
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#1F1F1F]">
                      Card
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-[#6B7280]">
                      Accept cards through your existing POS.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  aria-label="Toggle card payments"
                  aria-pressed={
                    cardEnabled
                  }
                  onClick={() =>
                    toggleWithFeedback(
                      setCardEnabled
                    )
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full ${
                    cardEnabled
                      ? "bg-[#0C831F]"
                      : "bg-[#D1D5DB]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm ${
                      cardEnabled
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* SAVE AREA */}

        <section className="settings-reveal lg:col-span-2">

          <div className="rounded-[22px] border border-[#DCEBD8] bg-[#F2FAEF] p-4 sm:p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-bold text-[#0C831F]">
                  Ready to save?
                </p>

                <p className="mt-1 text-xs leading-5 text-[#5B6B5A]">
                  Your changes will be applied to the restaurant immediately.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  saving ||
                  uploadingQr
                }
                className="flex min-w-[180px] items-center justify-center rounded-xl bg-[#0C831F] px-6 py-3.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(12,131,31,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingQr
                  ? "Uploading QR..."
                  : saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </section>

      </form>
    </main>
  );
}