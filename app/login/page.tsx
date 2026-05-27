"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
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

  const handleLogin = async () => {
    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#06111F] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0B1727] border border-white/10 rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          Auctra
        </h1>

        <p className="text-gray-400 mb-8">
          Login to your account
        </p>

        <div className="space-y-4">
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
            onClick={handleLogin}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 rounded-xl"
          >
            Login
          </button>
        </div>

        <p className="text-gray-400 mt-6 text-center">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-cyan-400"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}