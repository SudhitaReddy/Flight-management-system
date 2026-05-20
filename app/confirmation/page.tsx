"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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

        <div className="space-y-4">

          <p className="text-black text-lg">
            <strong>PNR:</strong> {pnr}
          </p>

          <p className="text-black text-lg">
            <strong>Passenger:</strong> {name}
          </p>

          <p className="text-black text-lg">
            <strong>Seat:</strong> {seat}
          </p>

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