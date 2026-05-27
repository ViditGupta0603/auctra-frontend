import api from "@/lib/api";

export const getAuctions = async () => {
  const response = await api.get("/auctions");

  return response.data;
};

export const getAuctionById = async (
  id: string
) => {
  const response = await api.get(
    `/auctions/${id}`
  );

  return response.data;
};

export const placeBid = async (
  id: string,
  amount: number
) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    `/auctions/${id}/bid`,
    {
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};