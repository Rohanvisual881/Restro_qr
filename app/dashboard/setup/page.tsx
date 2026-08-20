"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^-+|-+$/g, "");
}

export default function RestaurantSetupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [restaurantName, setRestaurantName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // Check whether this user already owns a restaurant.
      const { data: existingRestaurant, error } =
        await supabase
          .from("restaurants")
          .select("id, slug")
          .eq("owner_id", user.id)
          .limit(1)
          .maybeSingle();

      if (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
        return;
      }

      if (existingRestaurant) {
        router.replace("/dashboard");
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, [router, supabase]);

  function handleRestaurantNameChange(value: string) {
    setRestaurantName(value);
    setSlug(createSlug(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = restaurantName.trim();
    const cleanSlug = slug.trim();

    if (!cleanName) {
      setError("Please enter your restaurant name.");
      return;
    }

    if (!cleanSlug) {
      setError("Please enter a valid restaurant name.");
      return;
    }

    setCreating(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        router.replace("/login");
        return;
      }

      // Make sure the logged-in user doesn't already have a restaurant.
      const { data: existingRestaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

      if (existingRestaurant) {
        router.replace("/dashboard");
        return;
      }

      // Check whether the subdomain is already taken.
      const { data: existingSlug, error: slugError } =
        await supabase
          .from("restaurants")
          .select("id")
          .eq("slug", cleanSlug)
          .limit(1)
          .maybeSingle();

      if (slugError) {
        throw new Error(slugError.message);
      }

      if (existingSlug) {
        setError(
          `"${cleanSlug}" is already taken. Please choose another restaurant name.`
        );
        setCreating(false);
        return;
      }

      // Create restaurant.
      const { data: restaurant, error: insertError } =
        await supabase
          .from("restaurants")
          .insert({
            name: cleanName,
            slug: cleanSlug,
            phone: phone.trim() || null,
            address: address.trim() || null,
            description: description.trim() || null,
            owner_id: user.id,

            // Default settings.
            cash_enabled: true,
            upi_enabled: true,
            card_enabled: true,

            upi_id: null,
            upi_qr_url: null,

            opening_time: "10:00",
            closing_time: "23:00",

            is_open: true,

            tax_enabled: false,
            tax_percentage: 0,
          })
          .select()
          .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      console.log("Restaurant created:", restaurant);

      setSuccess(
        `Restaurant created successfully. ${cleanName} is ready!`
      );

      setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 700);
    } catch (err) {
      console.error("Restaurant setup error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the restaurant."
      );

      setCreating(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#DCEED8] border-t-[#0C831F]" />

          <p className="text-sm font-semibold text-[#6B7280]">
            Checking your account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] px-4 py-6 text-[#1F1F1F] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black tracking-[-0.06em] text-[#0C831F]">
              KHAPIYO
            </p>

            <p className="mt-1 text-xs font-semibold text-[#6B7280]">
              Restaurant operating system
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold text-[#374151] transition hover:bg-[#F3F4F6]"
          >
            Back to Dashboard
          </button>
        </header>

        {/* Main */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.75fr]">

          {/* Form */}
          <section className="rounded-[24px] border border-[#E9E9E7] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-8">

            <div>
              <span className="inline-flex rounded-full bg-[#E9F8E5] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#0C831F]">
                Step 1
              </span>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Create your restaurant
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#6B7280]">
                Add your restaurant details. We'll create its unique
                KhaPiyo address automatically.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Restaurant name */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#374151]">
                  Restaurant name *
                </span>

                <input
                  value={restaurantName}
                  onChange={(event) =>
                    handleRestaurantNameChange(
                      event.target.value
                    )
                  }
                  placeholder="Royal Bites"
                  disabled={creating}
                  className="h-14 w-full rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 text-sm font-medium outline-none transition placeholder:text-[#A0AAA3] focus:border-[#0C831F] focus:bg-white focus:ring-4 focus:ring-[#0C831F]/10 disabled:opacity-60"
                />
              </label>

              {/* Domain preview */}
              <div className="rounded-2xl border border-[#CDE8D0] bg-[#F0FAEE] p-4">

                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#6B7C6D]">
                  Your KhaPiyo address
                </p>

                <div className="mt-2 break-all text-lg font-black text-[#172018] sm:text-xl">
                  <span className="text-[#0C831F]">
                    {slug || "yourrestaurant"}
                  </span>
                  <span className="text-[#6B7280]">
                    .khapiyo.in
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#718073]">
                  This address will identify your restaurant on KhaPiyo.
                </p>

              </div>

              {/* Phone */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#374151]">
                  Phone number
                </span>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="98765 43210"
                  disabled={creating}
                  className="h-14 w-full rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 text-sm outline-none transition placeholder:text-[#A0AAA3] focus:border-[#0C831F] focus:bg-white focus:ring-4 focus:ring-[#0C831F]/10 disabled:opacity-60"
                />
              </label>

              {/* Address */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#374151]">
                  Address
                </span>

                <textarea
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Restaurant address"
                  rows={3}
                  disabled={creating}
                  className="w-full resize-none rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 py-3 text-sm outline-none transition placeholder:text-[#A0AAA3] focus:border-[#0C831F] focus:bg-white focus:ring-4 focus:ring-[#0C831F]/10 disabled:opacity-60"
                />
              </label>

              {/* Description */}
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#374151]">
                  Short description
                </span>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Authentic Indian food, family dining..."
                  rows={3}
                  disabled={creating}
                  className="w-full resize-none rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 py-3 text-sm outline-none transition placeholder:text-[#A0AAA3] focus:border-[#0C831F] focus:bg-white focus:ring-4 focus:ring-[#0C831F]/10 disabled:opacity-60"
                />
              </label>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-[#F3C4C4] bg-[#FFF3F3] px-4 py-3">
                  <p className="text-sm font-semibold leading-5 text-[#B42318]">
                    {error}
                  </p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-2xl border border-[#BFE6C5] bg-[#EAF8E7] px-4 py-3">
                  <p className="text-sm font-semibold leading-5 text-[#0C831F]">
                    {success}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={creating}
                className="h-14 w-full rounded-2xl bg-[#0C831F] text-sm font-black text-white shadow-[0_10px_25px_rgba(12,131,31,0.20)] transition hover:-translate-y-0.5 hover:bg-[#096B19] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating restaurant...
                  </span>
                ) : (
                  "Create Restaurant →"
                )}
              </button>

            </form>
          </section>

          {/* Preview */}
          <aside className="rounded-[24px] border border-[#E9E9E7] bg-[#172018] p-6 text-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:p-8">

            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#67D26F]">
              Your restaurant
            </p>

            <div className="mt-8">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E9F8E5] text-3xl">
                🍽️
              </div>

              <h2 className="mt-5 break-words text-3xl font-black tracking-[-0.04em]">
                {restaurantName || "Royal Bites"}
              </h2>

              <p className="mt-2 break-all text-sm text-white/50">
                {slug || "royalbites"}.khapiyo.in
              </p>

            </div>

            <div className="mt-10 space-y-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs text-white/40">
                  Restaurant dashboard
                </p>

                <p className="mt-1 text-sm font-bold">
                  Orders · Menu · Tables
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs text-white/40">
                  Customer URL
                </p>

                <p className="mt-1 break-all text-sm font-bold text-[#67D26F]">
                  {slug || "royalbites"}.khapiyo.in
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs text-white/40">
                  Next
                </p>

                <p className="mt-1 text-sm font-bold">
                  Add menu & generate QR codes
                </p>
              </div>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}