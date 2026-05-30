"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";

export default function AdminRegister() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {

    setLoading(true);

    const res = await fetch(
      "http://localhost:8080/api/admin/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      }
    );

    // IMPORTANT
    const data = await res.json();

    // error check
    if (!res.ok) {
      setError(data.message);
      return;
    }

    // save token
    localStorage.setItem(
      "adminToken",
      data.token
    );

    // redirect
    router.push("/Admin/Dashboard");

  } catch (err) {

    console.log(err);

    setError("Server Error");

  } finally {

    setLoading(false);

  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <div className="w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-white">
        <div className="flex justify-center mb-6">
          <div className="bg-green-500 p-4 rounded-xl">
            <Shield size={35} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-1"> Register</h1>

        {error && (
          <p className="bg-red-500/20 border border-red-500 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative rounded-xl">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              name="name"
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-10 p-3 rounded bg-black/30 border border-gray-600"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-10 p-3 rounded bg-black/30 border border-gray-600"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-10 p-3 rounded bg-black/30 border border-gray-600"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 py-3 rounded font-semibold"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
