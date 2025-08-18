import { Comment } from "../comments/interfaces";

interface ItemBase {
  id: number;
  owner: string;
  title: string;
  description: string;
  price: number;
  itemType: string;
  category: string; // Added category field
  metadata: string;
  comments: Comment[];
  averageRating: number;
  totalRatings: number;
  createdAt: number;
  updatedAt: number;
  // On-chain verification fields
  contentHash: string;
  isVerified: boolean;
  licenseTerms: string;
  royaltyPercent: number;
  licensedWallets: string[];
}

export interface Item extends ItemBase {
  content: string;
}

export type ItemDetail = ItemBase;
