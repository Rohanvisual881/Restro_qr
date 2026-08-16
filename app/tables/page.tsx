"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

type RestaurantTable = {
  id: string;
  table_number: number;
  qr_token: string;
  is_active: boolean;
};

export default function TablesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [restaurantId, setRestaurantId] =
    useState("");

  const [tables, setTables] =
    useState<RestaurantTable[]>([]);

  const [tableNumber, setTableNumber] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const {
      data: restaurant,
      error: restaurantError,
    } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();

    if (restaurantError) {
      setMessage(
        restaurantError.message
      );
      setLoading(false);
      return;
    }

    if (!restaurant) {
      router.push(
        "/dashboard/setup"
      );
      return;
    }

    setRestaurantId(
      restaurant.id
    );

    const {
      data: tableData,
      error: tableError,
    } = await supabase
      .from("restaurant_tables")
      .select(
        "id, table_number, qr_token, is_active"
      )
      .eq(
        "restaurant_id",
        restaurant.id
      )
      .order("table_number", {
        ascending: true,
      });

    if (tableError) {
      setMessage(
        tableError.message
      );
      setLoading(false);
      return;
    }

    setTables(
      tableData || []
    );

    setLoading(false);
  }

  async function addTable(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const number =
      Number(tableNumber);

    if (
      !tableNumber ||
      !Number.isInteger(number) ||
      number <= 0
    ) {
      setMessage(
        "Please enter a valid table number."
      );
      return;
    }

    const alreadyExists =
      tables.some(
        (table) =>
          table.table_number ===
          number
      );

    if (alreadyExists) {
      setMessage(
        `Table ${number} already exists.`
      );
      return;
    }

    setSaving(true);
    setMessage("");

    /*
    Generate a unique QR token.
    */

    const qrToken =
      crypto.randomUUID();

    const {
      error,
    } = await supabase
      .from("restaurant_tables")
      .insert({
        restaurant_id:
          restaurantId,

        table_number:
          number,

        qr_token:
          qrToken,

        is_active: true,
      });

    if (error) {
      setMessage(
        error.message
      );
      setSaving(false);
      return;
    }

    setTableNumber("");
    setSaving(false);

    await loadTables();
  }

  async function deleteTable(
    tableId: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this table?"
      );

    if (!confirmed) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("restaurant_tables")
      .delete()
      .eq("id", tableId);

    if (error) {
      setMessage(
        error.message
      );
      return;
    }

    await loadTables();
  }

  function getMenuUrl(
    qrToken: string
  ) {
    if (
      typeof window ===
      "undefined"
    ) {
      return "";
    }

    return `${window.location.origin}/menu/${qrToken}/browse`;
  }

  function downloadQR(
    table: RestaurantTable
  ) {
    const canvas =
      document.getElementById(
        `qr-${table.id}`
      ) as HTMLCanvasElement | null;

    if (!canvas) {
      return;
    }

    const link =
      document.createElement(
        "a"
      );

    link.download = `table-${table.table_number}-qr.png`;

    link.href =
      canvas.toDataURL(
        "image/png"
      );

    link.click();
  }

  function openQR(
    table: RestaurantTable
  ) {
    const url =
      getMenuUrl(
        table.qr_token
      );

    window.open(
      url,
      "_blank"
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>
          Loading tables...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      <div className="mx-auto max-w-6xl px-5 py-8">

        {/* HEADER */}

        <div className="flex flex-col gap-4 border-b border-gray-200 pb-7 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Restaurant Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Table Management
            </h1>

            <p className="mt-2 text-gray-600">
              Create tables and generate QR codes for customers.
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold shadow-sm"
          >
            ← Dashboard
          </button>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {message}
          </div>
        )}

        {/* ADD TABLE */}

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            Add Table
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter a table number to create its unique QR code.
          </p>

          <form
            onSubmit={addTable}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >

            <input
              type="number"
              min="1"
              value={tableNumber}
              onChange={(e) =>
                setTableNumber(
                  e.target.value
                )
              }
              placeholder="Table number e.g. 1"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
            />

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-black px-6 py-3 font-bold text-white disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "+ Add Table"}
            </button>

          </form>

        </section>

        {/* TABLES */}

        <section className="mt-6">

          <div className="mb-5">

            <h2 className="text-2xl font-bold">
              Your Tables
            </h2>

            <p className="text-gray-500">
              {tables.length}{" "}
              {tables.length === 1
                ? "table"
                : "tables"}{" "}
              created
            </p>

          </div>

          {tables.length === 0 ? (

            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                🪑
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No tables yet
              </h3>

              <p className="mt-2 text-gray-500">
                Add your first table above.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {tables.map(
                (table) => (

                  <div
                    key={table.id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >

                    <div className="flex items-center justify-between">

                      <h3 className="text-xl font-bold">
                        Table{" "}
                        {
                          table.table_number
                        }
                      </h3>

                      {table.is_active && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Active
                        </span>
                      )}

                    </div>

                    {/* QR */}

                    <div className="mt-6 flex justify-center rounded-2xl bg-white p-4">

                      <QRCodeCanvas
                        id={`qr-${table.id}`}
                        value={getMenuUrl(
                          table.qr_token
                        )}
                        size={220}
                        level="H"
                      />

                    </div>

                    <p className="mt-4 break-all text-center text-xs text-gray-400">
                      Scan to open Table{" "}
                      {
                        table.table_number
                      }{" "}
                      menu
                    </p>

                    {/* BUTTONS */}

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <button
                        onClick={() =>
                          openQR(
                            table
                          )
                        }
                        className="rounded-xl bg-black px-4 py-3 text-sm font-bold text-white"
                      >
                        Open QR
                      </button>

                      <button
                        onClick={() =>
                          downloadQR(
                            table
                          )
                        }
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold"
                      >
                        Download
                      </button>

                    </div>

                    <button
                      onClick={() =>
                        deleteTable(
                          table.id
                        )
                      }
                      className="mt-3 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600"
                    >
                      Delete Table
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}