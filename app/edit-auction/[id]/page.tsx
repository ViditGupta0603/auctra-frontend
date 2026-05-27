"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  ImagePlus,
} from "lucide-react";

import Link from "next/link";

import Sidebar from "@/components/layout/Sidebar";

import api from "@/lib/api";

export default function EditAuctionPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      category: "",
      startingPrice: "",
      endTime: "",
      imageUrl: "",
    });

  /**
   * AUTH CHECK
   */
  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      router.push("/login");

      return;
    }

    setAuthLoading(false);

    fetchAuction();
  }, [router]);

  /**
   * FETCH AUCTION
   */
  const fetchAuction =
    async () => {
      try {
        const response =
          await api.get(
            `/auctions/${params.id}`
          );

        const auction =
          response.data;

        setFormData({
          title:
            auction.title,

          description:
            auction.description,

          category:
            auction.category ||
            "",

          startingPrice:
            String(
              auction.startingPrice
            ),

          endTime:
            new Date(
              auction.endTime
            )
              .toISOString()
              .slice(0, 16),

          imageUrl:
            auction.imageUrl ||
            "",
        });
      } catch (error) {
        console.error(error);

        alert(
          "Failed to load auction"
        );
      } finally {
        setLoading(false);
      }
    };

  /**
   * HANDLE INPUTS
   */
  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  /**
   * IMAGE UPLOAD
   */
  const handleImageUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      try {
        const file =
          e.target.files?.[0];

        if (!file) return;

        setUploadingImage(
          true
        );

        const data =
          new FormData();

        data.append(
          "image",
          file
        );

        const response =
          await api.post(
            "/upload/image",
            data,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setFormData(
          (prev) => ({
            ...prev,

            imageUrl:
              response.data
                .imageUrl,
          })
        );
      } catch (error) {
        console.error(error);

        alert(
          "Image upload failed"
        );
      } finally {
        setUploadingImage(
          false
        );
      }
    };

  /**
   * UPDATE AUCTION
   */
  const handleSubmit =
    async () => {
      try {
        setSaving(true);

        const token =
          localStorage.getItem(
            "token"
          );

        await api.patch(
          `/auctions/${params.id}`,
          {
            ...formData,

            startingPrice:
              Number(
                formData.startingPrice
              ),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "Auction updated and sent for re-approval"
        );

        router.push("/");
      } catch (error: any) {
        console.error(error);

        alert(
          error?.response
            ?.data?.error ||
            "Failed to update auction"
        );
      } finally {
        setSaving(false);
      }
    };

  /**
   * AUTH LOADING
   */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#06111F] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  /**
   * PAGE LOADING
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#06111F] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06111F] text-white flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 ml-[250px] overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {/* TOPBAR */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <Link href="/">
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-5">
                  <ArrowLeft size={18} />

                  Back to Dashboard
                </button>
              </Link>

              <h1 className="text-5xl font-bold tracking-tight">
                Edit Auction
              </h1>

              <p className="text-gray-400 mt-2">
                Update your auction
                details and submit
                for re-approval
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-[#0B1727] border border-white/5 rounded-3xl p-8 space-y-6">
            {/* TITLE */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Auction Title
              </label>

              <input
                name="title"
                placeholder="Auction title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 bg-[#06111F] border border-white/10 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Description
              </label>

              <textarea
                name="description"
                rows={5}
                placeholder="Auction description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                className="w-full bg-[#06111F] border border-white/10 rounded-2xl p-5 outline-none focus:border-cyan-500 transition resize-none"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Category
              </label>

              <select
                name="category"
                value={
                  formData.category
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 bg-[#06111F] border border-white/10 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
              >
                <option value="">
                  Select category
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Industrial">
                  Industrial
                </option>

                <option value="Vehicles">
                  Vehicles
                </option>

                <option value="Luxury">
                  Luxury
                </option>

                <option value="Art">
                  Art
                </option>
              </select>
            </div>

            {/* PRICE */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Starting Price
              </label>

              <input
                name="startingPrice"
                type="number"
                placeholder="Starting price"
                value={
                  formData.startingPrice
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 bg-[#06111F] border border-white/10 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* END TIME */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                End Time
              </label>

              <input
                name="endTime"
                type="datetime-local"
                value={
                  formData.endTime
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 bg-[#06111F] border border-white/10 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="text-sm text-gray-400 mb-3 block">
                Upload Image
              </label>

              <label className="w-full h-52 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 transition overflow-hidden bg-[#06111F]">
                {formData.imageUrl ? (
                  <img
                    src={
                      formData.imageUrl
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <ImagePlus
                      size={42}
                      className="text-cyan-400 mb-4"
                    />

                    <p className="text-white font-medium">
                      Upload Auction
                      Image
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      JPG, PNG or
                      WEBP
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                  className="hidden"
                />
              </label>

              {uploadingImage && (
                <p className="text-cyan-400 text-sm mt-3">
                  Uploading
                  image...
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={
                handleSubmit
              }
              disabled={
                saving ||
                uploadingImage
              }
              className="w-full h-14 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-2xl transition shadow-[0_0_25px_rgba(6,182,212,0.25)]"
            >
              {saving
                ? "Saving..."
                : "Update Auction"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}