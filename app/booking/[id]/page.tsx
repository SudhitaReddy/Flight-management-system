"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

export default function BookingPage() {

  const params = useParams();
  const router = useRouter();

  const [flight, setFlight] = useState<any>(null);

  const [fullName, setFullName] = useState("");
  const [passportNo, setPassportNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "China",
    "Singapore",
    "UAE",
    "Brazil",
    "South Africa",
    "Italy",
    "Russia",
  ];

  const seats = [
    "A1", "A2", "A3", "A4",
    "B1", "B2", "B3", "B4",
    "C1", "C2", "C3", "C4",
  ];

  const occupiedSeats = ["A2", "B3"];

  useEffect(() => {

    checkUser();

    fetchFlight();

  }, []);

  async function checkUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
    }
  }

  async function fetchFlight() {

    const { data, error } = await supabase
      .from("flights")
      .select("*")
      .eq("id", params.id)
      .single();

    if (data) {
      setFlight(data);
    }

    if (error) {
      console.log(error);
    }
  }

  async function handleBooking() {

    if (!selectedSeat) {
      alert("Please select a seat");
      return;
    }

    const pnrCode =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const { data: booking, error: bookingError } =
      await supabase
        .from("bookings")
        .insert([
          {
            user_id: user.id,
            flight_id: flight.id,
            status: "confirmed",
            total_price: flight.base_price,
            pnr_code: pnrCode,
          },
        ])
        .select()
        .single();

    if (bookingError) {
      console.log(bookingError);
      alert("Booking failed");
      return;
    }

    const { error: passengerError } =
      await supabase
        .from("passengers")
        .insert([
          {
            booking_id: booking.id,
            full_name: fullName,
            passport_no: passportNo,
            nationality: nationality,
          },
        ]);

    if (passengerError) {
      console.log(passengerError);
    }

    router.push(
      `/confirmation?pnr=${pnrCode}&name=${fullName}&seat=${selectedSeat}`
    );
  }

  return (

    <main className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-4xl font-bold text-black mb-8">
          Flight Booking
        </h1>

        <div className="bg-gray-50 p-6 rounded-2xl mb-8">

          <div className="flex justify-between items-center flex-wrap gap-4">

            <div>

              <h2 className="text-2xl font-bold text-black">
                {flight?.flight_no}
              </h2>

              <p className="text-gray-500">
                {flight?.aircraft_type}
              </p>

            </div>

            <div className="text-right">

              <p className="text-3xl font-bold text-black">
                ₹{flight?.base_price}
              </p>

              <p className="text-green-600 font-medium">
                On Time
              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center mt-8">

            <div>

              <p className="text-3xl font-bold text-black">

                {flight?.departs_at
                  ? new Date(flight.departs_at)
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                  : "--:--"}

              </p>

              <p className="text-gray-500">
                {flight?.origin}
              </p>

            </div>

            <div className="text-center">

              <div className="border-t-2 border-dashed my-2"></div>

              <p className="text-sm text-gray-400">
                Non-stop Flight
              </p>

            </div>

            <div className="text-right">

              <p className="text-3xl font-bold text-black">

                {flight?.arrives_at
                  ? new Date(flight.arrives_at)
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                  : "--:--"}

              </p>

              <p className="text-gray-500">
                {flight?.destination}
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-6">

          <div>

            <label className="block text-black font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter passenger full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-3 rounded-lg text-black"
            />

            <p className="text-sm text-gray-500 mt-1">
              Enter name exactly as shown on passport
            </p>

          </div>

          <div>

            <label className="block text-black font-medium mb-2">
              Passport Number
            </label>

            <input
              type="text"
              placeholder="Example: N4587291"
              value={passportNo}
              onChange={(e) => setPassportNo(e.target.value)}
              className="w-full border p-3 rounded-lg text-black"
            />

            <p className="text-sm text-gray-500 mt-1">
              Passport must be valid during travel
            </p>

          </div>

          <div>

            <label className="block text-black font-medium mb-2">
              Nationality
            </label>

            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full border p-3 rounded-lg text-black"
            >

              <option value="">
                Select Nationality
              </option>

              {countries.map((country) => (

                <option
                  key={country}
                  value={country}
                >
                  {country}
                </option>

              ))}

            </select>

            <p className="text-sm text-gray-500 mt-1">
              Choose passenger citizenship country
            </p>

          </div>

          <div className="mt-8">

            <h2 className="text-2xl font-bold text-black mb-6">
              Select Seat
            </h2>

            <div className="bg-white border p-6 rounded-2xl shadow">

              <div className="flex justify-center mb-6">

                <div className="bg-gray-200 px-8 py-3 rounded-full text-black font-semibold">
                  Cockpit
                </div>

              </div>

              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">

                {seats.map((seat, index) => {

                  const isOccupied =
                    occupiedSeats.includes(seat);

                  const isSelected =
                    selectedSeat === seat;

                  return (

                    <button
                      type="button"
                      key={seat}
                      disabled={isOccupied}
                      onClick={() => setSelectedSeat(seat)}
                      className={`

                        h-14 rounded-xl font-bold transition

                        ${isOccupied
                          ? "bg-red-200 text-red-700 cursor-not-allowed"
                          : isSelected
                          ? "bg-black text-white"
                          : "bg-gray-200 text-black hover:bg-gray-300"
                        }

                        ${(index + 1) % 2 === 0
                          ? "mr-6"
                          : ""
                        }

                      `}
                    >

                      {seat}

                    </button>

                  );
                })}

              </div>

              <div className="flex justify-center gap-6 mt-8 text-sm flex-wrap">

                <div className="flex items-center gap-2">

                  <div className="w-4 h-4 bg-gray-200 rounded"></div>

                  <span className="text-black">
                    Available
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <div className="w-4 h-4 bg-black rounded"></div>

                  <span className="text-black">
                    Selected
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <div className="w-4 h-4 bg-red-200 rounded"></div>

                  <span className="text-black">
                    Occupied
                  </span>

                </div>

              </div>

            </div>

          </div>

          <button
            onClick={handleBooking}
            className="bg-black hover:bg-gray-800 text-white px-6 py-4 rounded-xl w-full text-lg font-semibold"
          >
            Confirm Booking
          </button>

        </div>

      </div>

    </main>

  );
}