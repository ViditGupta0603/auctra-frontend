"use client";

import { useState } from "react";

import api from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  onCreated: () => void;
};

export default function CreateAuctionModal({
  onCreated,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      startingPrice: "",
      endTime: "",
      imageUrl: "",
      category: "",
    });

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
   * CREATE AUCTION
   */
  const handleSubmit =
    async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          alert(
            "Please login first"
          );

          return;
        }

        await api.post(
          "/auctions",
          {
            title:
              formData.title,

            description:
              formData.description,

            category:
              formData.category,

            startingPrice:
              Number(
                formData.startingPrice
              ),

            endTime:
              new Date(
                formData.endTime
              ).toISOString(),

            imageUrl:
              formData.imageUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        onCreated();

        setOpen(false);

        setFormData({
          title: "",
          description: "",
          startingPrice: "",
          endTime: "",
          imageUrl: "",
          category: "",
        });

        alert(
          "Auction submitted for admin approval"
        );
      } catch (error: any) {
        console.error(error);

        alert(
          error?.response?.data
            ?.error ||
            "Failed to create auction"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <button className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-2 rounded-2xl text-black font-semibold shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          Create Auction
        </button>
      </DialogTrigger>

      <DialogContent className="bg-[#0B1727] border border-white/10 text-white max-w-xl rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold tracking-tight">
            Create New Auction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-5 pb-2">
          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Auction Title
            </label>

            <input
              name="title"
              placeholder="Enter auction title"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
              className="w-full h-14 bg-[#06111F] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe your auction item"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              rows={4}
              className="w-full bg-[#06111F] border border-white/5 rounded-2xl p-5 outline-none focus:border-cyan-500 transition resize-none"
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
              className="w-full h-14 bg-[#06111F] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
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
              placeholder="Enter starting price"
              value={
                formData.startingPrice
              }
              onChange={
                handleChange
              }
              className="w-full h-14 bg-[#06111F] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* END TIME */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Auction End Time
            </label>

            <input
              name="endTime"
              type="datetime-local"
              min={new Date()
                .toISOString()
                .slice(0, 16)}
              value={
                formData.endTime
              }
              onChange={
                handleChange
              }
              className="w-full h-14 bg-[#06111F] border border-white/5 rounded-2xl px-5 outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageUpload
              }
              className="w-full bg-[#06111F] border border-white/5 rounded-2xl p-4 file:bg-cyan-500 file:border-0 file:px-4 file:py-2 file:rounded-xl file:text-black file:font-semibold text-sm"
            />

            {uploadingImage ? (
              <div className="mt-4 text-cyan-400 text-sm">
                Uploading image...
              </div>
            ) : (
              formData.imageUrl && (
                <img
                  src={
                    formData.imageUrl
                  }
                  alt="Preview"
                  className="mt-4 w-full h-56 object-cover rounded-2xl border border-white/5"
                />
              )
            )}
          </div>

          {/* SUBMIT */}
          <button
            onClick={
              handleSubmit
            }
            disabled={
              loading ||
              uploadingImage
            }
            className="w-full h-14 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold rounded-2xl transition shadow-[0_0_20px_rgba(6,182,212,0.25)]"
          >
            {loading
              ? "Submitting..."
              : "Submit Auction"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}