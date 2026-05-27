export type Auction = {
  id: string;

  title: string;

  description: string;

  startingPrice: number;

  currentBid: number;

  imageUrl?: string;

  category: string;

  status: string;

  createdAt: string;

  endTime: string;
};