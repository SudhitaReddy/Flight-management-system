"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";
export default function MyBookingsPage() {

  const [bookings, setBookings] = useState<any[]>([]);

  const router = useRouter();
  useEffect(() => {

  checkUser();

  fetchBookings();

}, []);

async function checkUser() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
  }
}

  async function cancelBooking(id: string) {

    const { error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    fetchBookings();
  }

  async function fetchBookings() {

   const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) return;

const { data: bookingsData, error } = await supabase
  .from("bookings")
  .select("*")
  .eq("user_id", user.id);

if (error) {
  console.log(error);
  return;
}

if (!bookingsData) {
  return;
}

    const updatedBookings = await Promise.all(

      bookingsData.map(async (booking) => {

        const { data: flight } = await supabase
          .from("flights")
          .select("*")
          .eq("id", booking.flight_id)
          .single();

        return {
          ...booking,
          flight,
        };
      })

    );

    setBookings(updatedBookings);
  }

  return (

    <main className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold text-black mb-6">
          My Bookings
        </h1>

        <div className="space-y-6">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >

              <div className="bg-black text-white p-4 flex justify-between items-center flex-wrap gap-4">

                <div>

                  <h2 className="text-xl font-bold">
                    {booking.flight?.flight_no}
                  </h2>

                  <p className="text-sm text-gray-300">
                    PNR: {booking.pnr_code}
                  </p>

                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                    booking.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {booking.status}
                </div>

              </div>

              <div className="p-6">

                <div className="grid md:grid-cols-3 gap-6">

                  <div>

                    <p className="text-gray-500 text-sm">
                      FROM
                    </p>

                    <h3 className="text-2xl font-bold text-black">
                      {booking.flight?.origin}
                    </h3>

                  </div>

                  <div className="flex items-center justify-center">

                    <div className="text-4xl">
                      ✈️
                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-gray-500 text-sm">
                      TO
                    </p>

                    <h3 className="text-2xl font-bold text-black">
                      {booking.flight?.destination}
                    </h3>

                  </div>

                </div>

                <div className="border-t mt-6 pt-6 grid md:grid-cols-4 gap-6">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Aircraft
                    </p>

                    <p className="font-semibold text-black">
                      {booking.flight?.aircraft_type}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Total Price
                    </p>

                    <p className="font-semibold text-black">
                      ₹{booking.total_price}
                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Travel Date
                    </p>

                    <p className="font-semibold text-black">

                      {booking.travel_date
                        ? booking.travel_date
                        : "Not Selected"}

                    </p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      Status
                    </p>

                    <p
                      className={`font-semibold capitalize ${
                        booking.status === "cancelled"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {booking.status}
                    </p>

                  </div>

                </div>

                {booking.status !== "cancelled" && (

                  <div className="border-t mt-6 pt-6 flex flex-wrap gap-4 items-center">

                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                    >
                      Cancel Booking
                    </button>

                    <div className="space-y-2">

                      <p className="text-gray-500 text-sm">
                        Reschedule Flight
                      </p>

                      <select
                        defaultValue={booking.travel_date || ""}
                        onChange={async (e) => {

                          await supabase
                            .from("bookings")
                            .update({
                              travel_date: e.target.value,
                            })
                            .eq("id", booking.id);

                          fetchBookings();

                          alert("Flight Rescheduled Successfully!");
                        }}
                        className="border p-2 rounded-lg text-black"
                      >

                        <option value="">
                          Select New Date
                        </option>

                        {booking.flight?.available_dates?.map((date: string) => (

                          <option
                            key={date}
                            value={date}
                          >
                            {date}
                          </option>

                        ))}

                      </select>

                    </div>

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );
}