"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const supabase = createClient();

      const { error } = await supabase
        .from("restaurants")
        .select("id")
        .limit(1);

      if (error) {
        setStatus("Connection error: " + error.message);
      } else {
        setStatus("Supabase connected successfully! ✅");
      }
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold">
          Restaurant QR
        </h1>

        <p className="mt-4 text-gray-600">
          {status}
        </p>
      </div>
    </main>
  );
}