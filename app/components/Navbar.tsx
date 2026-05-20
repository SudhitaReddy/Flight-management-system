"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserEmail(user.email || "");
    }
  }

  async function handleLogout() {

    await supabase.auth.signOut();

    router.push("/login");
  }

  return (

    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">

      <div className="flex items-center gap-6">

        <Link
          href="/"
          className="text-2xl font-bold"
        >
          SkyBook Airlines
        </Link>

       <Link
            href="/"
            className="hover:text-gray-300"
            >
            Flights
            </Link>

            <Link
            href="/my-bookings"
            className="hover:text-gray-300"
            >
            My Bookings
            </Link>

            <Link
            href="/admin"
            className="hover:text-gray-300"
            >
            Admin
            </Link>


      </div>

      <div className="flex items-center gap-4">

        <p className="text-sm text-gray-300">
          {userEmail}
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}