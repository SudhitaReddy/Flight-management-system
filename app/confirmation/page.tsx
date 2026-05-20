"use client";

import { useSearchParams } from "next/navigation";

export default function ConfirmationPage() {

  const searchParams = useSearchParams();

  const pnr = searchParams.get("pnr");
  const name = searchParams.get("name");
  const seat = searchParams.get("seat");

  return (

    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow max-w-xl w-full">

        <h1 className="text-3xl font-bold text-green-600 mb-6">
          Booking Confirmed 🎉
        </h1>

        <div className="space-y-4">

          <p className="text-black">
            <strong>PNR:</strong> {pnr}
          </p>

          <p className="text-black">
            <strong>Passenger:</strong> {name}
          </p>

          <p className="text-black">
            <strong>Seat:</strong> {seat}
          </p>

        </div>

      </div>

    </main>

  );
}