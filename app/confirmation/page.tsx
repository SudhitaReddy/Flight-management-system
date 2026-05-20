"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function ConfirmationContent() {

  const searchParams = useSearchParams();

  const pnr = searchParams.get("pnr");
  const name = searchParams.get("name");
  const seat = searchParams.get("seat");

  return (

    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">

        <h1 className="text-4xl font-bold text-green-600 mb-6">
          Booking Confirmed 🎉
        </h1>

        <p className="text-gray-500 mb-8">
          Your flight reservation has been successfully confirmed.
        </p>

        <div className="space-y-4 border rounded-2xl p-6 bg-gray-50">

          <p className="text-black text-lg">
            <strong>PNR:</strong> {pnr}
          </p>

          <p className="text-black text-lg">
            <strong>Passenger:</strong> {name}
          </p>

          <p className="text-black text-lg">
            <strong>Seat:</strong> {seat}
          </p>

          <p className="text-black text-lg">
            <strong>Status:</strong>

            <span className="text-green-600 font-semibold ml-2">
              Confirmed
            </span>

          </p>

        </div>

        <div className="flex gap-4 mt-8 flex-wrap">

          <Link
            href="/"
            className="flex-1"
          >

            <button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold">
              Return Home
            </button>

          </Link>

          <Link
            href="/my-bookings"
            className="flex-1"
          >

            <button className="w-full bg-gray-200 hover:bg-gray-300 text-black py-3 rounded-xl font-semibold">
              My Bookings
            </button>

          </Link>

        </div>

      </div>

    </main>

  );
}

export default function ConfirmationPage() {

  return (

    <Suspense fallback={<div>Loading...</div>}>

      <ConfirmationContent />

    </Suspense>

  );
}