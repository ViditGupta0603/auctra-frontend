"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import api from "@/lib/api";

export default function LoginPage() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const verified =
    searchParams.get(
      "verified"
    );

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      email: "",

      password: "",
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        const response =
          await api.post(
            "/auth/login",
            formData
          );

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

        router.push("/");
      } catch (error: any) {
        console.error(error);

        alert(
          error?.response
            ?.data?.message ||
            "Login failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#06111F] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#0B1727] border border-white/5 rounded-3xl p-8 shadow-2xl">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://i.postimg.cc/xjPJL9LD/image-removebg-preview.png"
            alt="Auctra"
            className="h-20 object-contain"
          />

          <p className="text-gray-400 mt-3">
            Login to your account
          </p>
        </div>

        {/* VERIFIED MESSAGE */}
        {verified && (
          <div className="mb-5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl p-4 text-sm">
            Email verified successfully.
            You can now login.
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >
          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Gmail Address"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            required
            className="w-full h-14 bg-[#06111F] border border-white/10 rounded-2xl px-5 outline-none focus:border-cyan-500 text-white"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              required
              className="w-full h-14 bg-[#06111F] border border-white/10 rounded-2xl px-5 pr-14 outline-none focus:border-cyan-500 text-white"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOff
                  size={20}
                />
              ) : (
                <Eye
                  size={20}
                />
              )}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold rounded-2xl transition"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* REGISTER */}
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}