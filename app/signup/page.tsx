"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {

      await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            email,
            phone,
          },
        ]);
    }

    alert("Account Created Successfully!");

    router.push("/login");
  }

  return (

    <main className="min-h-screen grid md:grid-cols-2">

      <div className="bg-black text-white flex flex-col justify-center p-12">

        <h1 className="text-5xl font-bold mb-6">
          SkyBook Airlines
        </h1>

        <p className="text-lg text-gray-300">
          Book flights, manage trips, and travel smarter.
        </p>

      </div>

      <div className="bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

          <h2 className="text-3xl font-bold text-black mb-6">
            Create Account
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-3 rounded-lg text-black"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-3 rounded-lg text-black"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg text-black"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg text-black"
            />

            <button
              onClick={handleSignup}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              Create Account
            </button>

          </div>

        </div>

      </div>

    </main>

  );
}