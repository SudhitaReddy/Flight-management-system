"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function AdminPage() {

  const [flights, setFlights] = useState<any[]>([]);

  const [flightNo, setFlightNo] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [price, setPrice] = useState("");

  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
const [totalBookings, setTotalBookings] = useState(0);
const [totalRevenue, setTotalRevenue] = useState(0);
const [cancelledBookings, setCancelledBookings] = useState(0);
  useEffect(() => {

  fetchFlights();

  fetchAnalytics();

}, []);

async function fetchAnalytics() {

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*");

  if (!bookings) return;

  setTotalBookings(bookings.length);

  const revenue = bookings.reduce(
    (sum, booking) => sum + booking.total_price,
    0
  );

  setTotalRevenue(revenue);

  const cancelled = bookings.filter(
    (booking) => booking.status === "cancelled"
  );

  setCancelledBookings(cancelled.length);
}

  async function fetchFlights() {

    const { data, error } = await supabase
      .from("flights")
      .select("*");

    if (data) {
      setFlights(data);
    }

    if (error) {
      console.log(error);
    }
  }

  async function addFlight() {

    const { error } = await supabase
      .from("flights")
      .insert([
        {
          flight_no: flightNo,
          origin,
          destination,
          aircraft_type: aircraft,
          base_price: Number(price),
          departs_at: departureTime,
          arrives_at: arrivalTime,
        },
      ]);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    alert("Flight Added!");

    setFlightNo("");
    setOrigin("");
    setDestination("");
    setAircraft("");
    setPrice("");
    setDepartureTime("");
    setArrivalTime("");

    fetchFlights();
  }

  async function deleteFlight(id: string) {

    await supabase
      .from("flights")
      .delete()
      .eq("id", id);

    fetchFlights();
  }

  return (

    <main className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-black mb-6">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">

  <div className="bg-white p-6 rounded-2xl shadow">

    <p className="text-gray-500">
      Total Flights
    </p>

    <h2 className="text-3xl font-bold text-black mt-2">
      {flights.length}
    </h2>

  </div>

  <div className="bg-white p-6 rounded-2xl shadow">

    <p className="text-gray-500">
      Total Bookings
    </p>

    <h2 className="text-3xl font-bold text-black mt-2">
      {totalBookings}
    </h2>

  </div>

  <div className="bg-white p-6 rounded-2xl shadow">

    <p className="text-gray-500">
      Revenue
    </p>

    <h2 className="text-3xl font-bold text-black mt-2">
      ₹{totalRevenue}
    </h2>

  </div>

  <div className="bg-white p-6 rounded-2xl shadow">

    <p className="text-gray-500">
      Cancelled
    </p>

    <h2 className="text-3xl font-bold text-red-500 mt-2">
      {cancelledBookings}
    </h2>

  </div>

</div>

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold text-black mb-4">
            Add Flight
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Flight Number"
              value={flightNo}
              onChange={(e) => setFlightNo(e.target.value)}
              className="border p-3 rounded-lg text-black"
            />

            <input
              type="text"
              placeholder="Origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="border p-3 rounded-lg text-black"
            />

            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border p-3 rounded-lg text-black"
            />

            <input
              type="text"
              placeholder="Aircraft Type"
              value={aircraft}
              onChange={(e) => setAircraft(e.target.value)}
              className="border p-3 rounded-lg text-black"
            />

            <input
              type="number"
              placeholder="Base Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-3 rounded-lg text-black"
            />

            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="border p-3 rounded-lg text-black"
            />

            <input
              type="datetime-local"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="border p-3 rounded-lg text-black"
            />

          </div>

          <button
            onClick={addFlight}
            className="mt-4 bg-black text-white px-6 py-3 rounded-lg"
          >
            Add Flight
          </button>

        </div>

        <div className="grid gap-4">

          {flights.map((flight) => (

            <div
              key={flight.id}
              className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
            >

              <div>

                <h2 className="text-xl font-bold text-black">
                  {flight.flight_no}
                </h2>

                <p className="text-black">
                  {flight.origin} → {flight.destination}
                </p>

                <p className="text-black">
                  ₹{flight.base_price}
                </p>

                <p className="text-gray-500 text-sm">
                  Departure:
                  {" "}
                  {new Date(flight.departs_at).toLocaleString()}
                </p>

                <p className="text-gray-500 text-sm">
                  Arrival:
                  {" "}
                  {new Date(flight.arrives_at).toLocaleString()}
                </p>

              </div>

              <button
                onClick={() => deleteFlight(flight.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      </div>

    </main>

  );
}