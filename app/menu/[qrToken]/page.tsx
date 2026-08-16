"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type TableInfo = {
  id: string;
  table_number: number;
  restaurant_id: string;
  is_active: boolean;
};

type Restaurant = {
  id: string;
  name: string;
};

export default function CustomerEntry({
  params,
}: {
  params: Promise<{ qrToken: string }>;
}) {
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [table, setTable] = useState<TableInfo | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTable() {
      try {
        const { qrToken } = await params;

        const supabase = createClient();

        const { data: tableData, error: tableError } = await supabase
          .from("restaurant_tables")
          .select("id, table_number, restaurant_id, is_active")
          .eq("qr_token", qrToken)
          .eq("is_active", true)
          .maybeSingle();

        if (tableError) {
          setError(tableError.message);
          setLoading(false);
          return;
        }

        if (!tableData) {
          setError("This table QR code is invalid or inactive.");
          setLoading(false);
          return;
        }

        setTable(tableData);

        const { data: restaurantData, error: restaurantError } =
          await supabase
            .from("restaurants")
            .select("id, name")
            .eq("id", tableData.restaurant_id)
            .maybeSingle();

        if (restaurantError) {
          setError(restaurantError.message);
          setLoading(false);
          return;
        }

        if (!restaurantData) {
          setError("Restaurant not found.");
          setLoading(false);
          return;
        }

        setRestaurant(restaurantData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
        setLoading(false);
      }
    }

    loadTable();
  }, []);

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (phone.trim() && phone.trim().length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!table || !restaurant) {
      setError("Restaurant information is missing.");
      return;
    }

    setSubmitting(true);

    sessionStorage.setItem(
      "restaurant_customer",
      JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        tableId: table.id,
        tableNumber: table.table_number,
        restaurantId: restaurant.id,
      })
    );

    const currentUrl = window.location.pathname;

    router.push(`${currentUrl}/browse`);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="rounded-xl bg-white p-8 shadow">
          <p className="text-gray-700">Loading restaurant...</p>
        </div>
      </main>
    );
  }

  if (error && !restaurant) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-4xl">⚠️</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Unable to open menu
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-black text-4xl">
            🍽️
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            {restaurant?.name}
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome! You are sitting at
          </p>

          <div className="mt-3 inline-block rounded-full bg-gray-100 px-5 py-2 font-bold text-gray-900">
            Table {table?.table_number}
          </div>
        </div>

        <form onSubmit={handleContinue} className="mt-8 space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Your Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800">
              Mobile Number
              <span className="ml-1 font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              placeholder="9876543210"
              maxLength={10}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-black px-5 py-3.5 font-semibold text-white disabled:opacity-50"
          >
            {submitting ? "Opening Menu..." : "View Menu"}
          </button>

        </form>

      </div>
    </main>
  );
}