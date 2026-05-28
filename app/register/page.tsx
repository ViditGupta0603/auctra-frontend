"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import api from "@/lib/api";

export default function RegisterPage() {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      name: "",

      email: "",

      password: "",

      confirmPassword:
        "",

      age: "",
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
        /**
         * VALIDATIONS
         */

        if (
          !formData.email.endsWith(
            "@gmail.com"
          )
        ) {
          alert(
            "Only Gmail accounts allowed"
          );

          return;
        }

        if (
          formData.password
            .length < 8
        ) {
          alert(
            "Password must be at least 8 characters"
          );

          return;
        }

        if (
          formData.password !==
          formData.confirmPassword
        ) {
          alert(
            "Passwords do not match"
          );

          return;
        }

        if (
          Number(
            formData.age
          ) < 18
        ) {
          alert(
            "Only 18+ users allowed"
          );

          return;
        }

        setLoading(true);

        try{  
        const response =
          await api.post(
            "/auth/register",
            {
              name:
                formData.name,

              email:
                formData.email,

              password:
                formData.password,

              age: Number(
                formData.age
              ),
            }
          );
          
        alert(
          response.data
            .message
        );
        } catch(error) {
          console.error(error);
        }

        router.push(
          "/login"
        );
      } catch (error: any) {
        console.error(error);

        alert(
          error?.response
            ?.data?.message ||
            "Registration failed"
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
            Create your account
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >
          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
            required
            className="w-full h-14 bg-[#06111F] border border-white/10 rounded-2xl px-5 outline-none focus:border-cyan-500 text-white"
          />

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

          {/* AGE */}
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={
              formData.age
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

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              value={
                formData.confirmPassword
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
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? (
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
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        {/* LOGIN */}
        <p className="text-center text-gray-400 mt-6">
          Already have an
          account?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}