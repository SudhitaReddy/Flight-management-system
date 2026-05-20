"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase/client";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { useRouter } from "next/navigation";

export default function HomePage() {

  const [flights, setFlights] = useState<any[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<any[]>([]);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const router = useRouter();
  const cities = [

  ...new Set(

    flights.flatMap((flight) => [
      flight.origin,
      flight.destination,
    ])

  ),

];

  useEffect(() => {

    checkUser();

    fetchFlights();

  }, []);

  async function checkUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
    }
  }

  async function fetchFlights() {

    const { data, error } = await supabase
      .from("flights")
      .select("*");

    if (data) {
      setFlights(data);
      setFilteredFlights(data);
    }

    if (error) {
      console.log(error);
    }
  }

  function calculateDuration(
    departure: string,
    arrival: string
  ) {

    const depart = new Date(departure);
    const arrive = new Date(arrival);

    const diffMs = arrive.getTime() - depart.getTime();

    const hours = Math.floor(
      diffMs / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (diffMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hours}h ${minutes}m`;
  }

  function handleSearch() {

    const filtered = flights.filter((flight) =>

      flight.origin
        .toLowerCase()
        .includes(origin.toLowerCase())

      &&

      flight.destination
        .toLowerCase()
        .includes(destination.toLowerCase())
    );

    setFilteredFlights(filtered);
  }

  return (

    <>

      <Navbar />

      <main className="min-h-screen bg-gray-100 p-6">

        <div className="max-w-6xl mx-auto">

          <h1 className="text-4xl font-bold mb-6 text-black">
            Search Flights
          </h1>

          <div className="bg-white p-6 rounded-2xl shadow mb-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

             <input
            type="text"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            list="origin-cities"
            className="border p-3 rounded-lg text-black"
          />

          <datalist id="origin-cities">

            {cities.map((city) => (

              <option
                key={city}
                value={city}
              />

            ))}

          </datalist>

              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                list="destination-cities"
                className="border p-3 rounded-lg text-black"
              />

              <datalist id="destination-cities">

                {cities.map((city) => (

                  <option
                    key={city}
                    value={city}
                  />

                ))}

              </datalist>

              <button
                onClick={handleSearch}
                className="bg-black hover:bg-gray-800 text-white rounded-lg p-3"
              >
                Search Flights
              </button>

            </div>

          </div>

          <div className="grid gap-6">

            {filteredFlights.map((flight) => (

              <div
                key={flight.id}
                className="bg-white rounded-2xl shadow-lg p-6 border"
              >

                <div className="flex justify-between items-start flex-wrap gap-4">

                  <div>

                    <div className="flex items-center gap-3 mb-2">

                      <h2 className="text-2xl font-bold text-black">
                        {flight.flight_no}
                      </h2>

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        On Time
                      </span>

                    </div>

                    <p className="text-gray-500">
                      {flight.aircraft_type}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-3xl font-bold text-black">
                      ₹{flight.base_price}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Economy
                    </p>

                  </div>

                </div>

                <div className="grid md:grid-cols-3 gap-6 items-center mt-8">

                  <div>

                    <p className="text-3xl font-bold text-black">

                      {new Date(flight.departs_at)
                        .toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}

                    </p>

                    <p className="text-gray-500">
                      {flight.origin}
                    </p>

                  </div>

                  <div className="text-center">

                    <p className="text-gray-500 text-sm">

                      {calculateDuration(
                        flight.departs_at,
                        flight.arrives_at
                      )}

                    </p>

                    <div className="border-t-2 border-dashed my-2"></div>

                    <p className="text-sm text-gray-400">
                      Non-stop
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-3xl font-bold text-black">

                      {new Date(flight.arrives_at)
                        .toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}

                    </p>

                    <p className="text-gray-500">
                      {flight.destination}
                    </p>

                  </div>

                </div>

                <div className="flex justify-between items-center mt-8 flex-wrap gap-4">

                  <p className="text-sm text-gray-500">
                    Seats Available: 24
                  </p>

                  <Link href={`/booking/${flight.id}`}>

                    <button
                      className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl"
                    >
                      Book Flight
                    </button>

                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

    </>

  );
}