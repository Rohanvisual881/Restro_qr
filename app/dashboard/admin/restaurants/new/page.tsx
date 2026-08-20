"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "");
}

export default function NewRestaurantPage() {
  const router = useRouter();
  const supabase = createClient();

  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const slug = makeSlug(restaurantName);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!restaurantName.trim()) {
      setError("Enter the restaurant name.");
      return;
    }

    if (!ownerName.trim()) {
      setError("Enter the owner's name.");
      return;
    }

    if (!ownerEmail.trim()) {
      setError("Enter the owner's email.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (!session?.access_token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        "/api/admin/restaurants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            restaurantName,
            ownerName,
            ownerEmail,
            phone,
            address,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Could not create restaurant."
        );
      }

      setSuccess(
        `Restaurant "${result.restaurant.name}" created successfully.`
      );

      // Clear form.
      setRestaurantName("");
      setOwnerName("");
      setOwnerEmail("");
      setPhone("");
      setAddress("");
      setPassword("");

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] px-4 py-6 text-[#172018] sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="flex items-center justify-between">

          <div>
            <p className="text-3xl font-black tracking-[-0.07em] text-[#0C831F]">
              KHAPIYO
            </p>

            <p className="mt-1 text-xs font-bold text-[#78837B]">
              Admin panel
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-[#DFE5E0] bg-white px-4 py-2.5 text-sm font-bold transition hover:bg-[#F1F4F1]"
          >
            ← Dashboard
          </button>

        </header>


        {/* Page heading */}
        <div className="mt-10">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0C831F]">
            Restaurant management
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            Add a restaurant.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#6B756D]">
            Create a restaurant and its owner account.
            KhaPiyo will automatically generate its unique
            restaurant address.
          </p>

        </div>


        {/* Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.65fr]">


          {/* Form */}
          <section className="rounded-[28px] border border-[#E3E8E3] bg-white p-6 shadow-[0_10px_40px_rgba(20,50,25,0.05)] sm:p-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Restaurant */}
              <div>

                <label className="mb-2 block text-xs font-black text-[#364139]">
                  Restaurant name
                </label>

                <input
                  value={restaurantName}
                  onChange={(e) =>
                    setRestaurantName(e.target.value)
                  }
                  placeholder="Royal Bites"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 text-sm outline-none transition placeholder:text-[#A0AAA3] focus:border-[#0C831F] focus:bg-white focus:ring-4 focus:ring-[#0C831F]/10"
                />

              </div>


              {/* Domain preview */}
              <div className="rounded-2xl border border-[#CBE8CF] bg-[#F0FAEE] p-5">

                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#708071]">
                  Restaurant address
                </p>

                <p className="mt-2 break-all text-xl font-black">

                  <span className="text-[#0C831F]">
                    {slug || "royalbites"}
                  </span>

                  <span className="text-[#69736C]">
                    .khapiyo.in
                  </span>

                </p>

                <p className="mt-2 text-xs text-[#718073]">
                  This will become the restaurant's KhaPiyo URL.
                </p>

              </div>


              {/* Owner */}
              <div className="border-t border-[#EEF1EE] pt-5">

                <p className="mb-4 text-sm font-black">
                  Owner account
                </p>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-xs font-bold text-[#364139]">
                      Owner name
                    </label>

                    <input
                      value={ownerName}
                      onChange={(e) =>
                        setOwnerName(e.target.value)
                      }
                      placeholder="Rahul Sharma"
                      disabled={loading}
                      className="h-13 w-full rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 text-sm outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
                    />

                  </div>


                  <div>

                    <label className="mb-2 block text-xs font-bold text-[#364139]">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      placeholder="98765 43210"
                      disabled={loading}
                      className="h-13 w-full rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 text-sm outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
                    />

                  </div>

                </div>

              </div>


              {/* Email */}
              <div>

                <label className="mb-2 block text-xs font-bold text-[#364139]">
                  Owner email
                </label>

                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) =>
                    setOwnerEmail(e.target.value)
                  }
                  placeholder="owner@royalbites.com"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 text-sm outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
                />

              </div>


              {/* Password */}
              <div>

                <label className="mb-2 block text-xs font-bold text-[#364139]">
                  Temporary password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Minimum 6 characters"
                  disabled={loading}
                  className="h-14 w-full rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 text-sm outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
                />

                <p className="mt-2 text-xs text-[#8A938D]">
                  Give this password to the restaurant owner.
                </p>

              </div>


              {/* Address */}
              <div>

                <label className="mb-2 block text-xs font-bold text-[#364139]">
                  Restaurant address
                </label>

                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Restaurant location"
                  rows={3}
                  disabled={loading}
                  className="w-full resize-none rounded-2xl border border-[#DDE5DE] bg-[#FAFCFA] px-4 py-3 text-sm outline-none focus:border-[#0C831F] focus:ring-4 focus:ring-[#0C831F]/10"
                />

              </div>


              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-[#F2C7C7] bg-[#FFF3F3] px-4 py-3">

                  <p className="text-sm font-semibold text-[#B42318]">
                    {error}
                  </p>

                </div>
              )}


              {/* Success */}
              {success && (
                <div className="rounded-2xl border border-[#BFE4C5] bg-[#ECF9EA] px-4 py-3">

                  <p className="text-sm font-bold text-[#0C831F]">
                    {success}
                  </p>

                  <p className="mt-1 text-xs text-[#5E7563]">
                    The restaurant account has been created.
                  </p>

                </div>
              )}


              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-2xl bg-[#0C831F] text-sm font-black text-white shadow-[0_12px_30px_rgba(12,131,31,0.20)] transition hover:-translate-y-0.5 hover:bg-[#096B19] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
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
          <aside className="h-fit rounded-[28px] bg-[#172018] p-6 text-white shadow-[0_15px_45px_rgba(20,50,25,0.12)] sm:p-8">

            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#65D16E]">
              Preview
            </p>

            <div className="mt-8">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E9F8E5] text-3xl">
                🍽️
              </div>

              <h2 className="mt-5 break-words text-3xl font-black tracking-[-0.04em]">
                {restaurantName || "Royal Bites"}
              </h2>

              <p className="mt-2 break-all text-sm text-white/45">
                {slug || "royalbites"}.khapiyo.in
              </p>

            </div>


            <div className="mt-8 space-y-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">
                  Owner
                </p>

                <p className="mt-1 text-sm font-bold">
                  {ownerName || "Restaurant owner"}
                </p>

              </div>


              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">
                  Login
                </p>

                <p className="mt-1 break-all text-sm font-bold">
                  {ownerEmail || "owner@restaurant.com"}
                </p>

              </div>


              <div className="rounded-2xl border border-[#65D16E]/20 bg-[#65D16E]/10 p-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-[#65D16E]">
                  KhaPiyo URL
                </p>

                <p className="mt-1 break-all text-sm font-black text-[#65D16E]">
                  {slug || "royalbites"}.khapiyo.in
                </p>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}