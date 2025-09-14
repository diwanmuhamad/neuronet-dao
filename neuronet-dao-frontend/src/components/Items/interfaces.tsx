import { Comment } from "../comments/interfaces";

export interface License {
  id: number;
  itemId: number;
  buyer: string;
  createdAt: number;
  updatedAt: number;
  expiration?: number | null;
  licenseTerms: string;
  isActive: boolean;
}
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
  thumbnailImages: string[];
  // S3 storage fields
  contentFileKey: string;
  contentFileName: string;
  contentRetrievalUrl: string;
}

export interface Item extends ItemBase {
  content: string;
}

export type ItemDetail = ItemBase;
