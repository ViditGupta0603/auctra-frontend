"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      await api.post(
        "/auth/register",
        formData
      );

      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#06111F] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0B1727] border border-white/10 rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          Auctra
        </h1>

        <p className="text-gray-400 mb-8">
          Create your account
        </p>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#06111F] border border-white/10 rounded-xl p-4 text-white"
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#06111F] border border-white/10 rounded-xl p-4 text-white"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-[#06111F] border border-white/10 rounded-xl p-4 text-white"
          />

          <button
            onClick={handleRegister}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 rounded-xl"
          >
            Register
          </button>
        </div>

        <p className="text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cyan-400"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}