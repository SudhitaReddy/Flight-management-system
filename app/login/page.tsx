"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {

  console.log("Trying Login:", email, password);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password.trim(),
  });

  console.log("LOGIN DATA:", data);
  console.log("LOGIN ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Login Successful!");

  router.push("/");
}

  return (

    <main className="min-h-screen grid md:grid-cols-2">

      <div className="bg-black text-white flex flex-col justify-center p-12">

        <h1 className="text-5xl font-bold mb-6">
          SkyBook Airlines
        </h1>

        <p className="text-lg text-gray-300">
          Manage bookings, reschedule flights, and travel smarter.
        </p>

      </div>

      <div className="bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-3xl font-bold text-black mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-6">
            Login to continue your journey
          </p>

          <div className="space-y-4">

            <div>

              <label className="block text-black font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-lg text-black"
              />

            </div>

            <div>

              <label className="block text-black font-medium mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-3 rounded-lg text-black"
              />

            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg transition"
            >
              Login
            </button>

            <p className="text-center text-gray-600 mt-4">

                New user?

                <a
                    href="/signup"
                    className="text-black font-semibold ml-2"
                >
                    Create Account
                </a>

                </p>

          </div>

        </div>

      </div>

    </main>

  );
}