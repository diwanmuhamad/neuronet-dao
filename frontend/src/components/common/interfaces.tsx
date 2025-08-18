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

export interface FeaturedItem {
  title: string;
  price: string;
  category: string;
  image: string;
  size?: string;
  type?: string;
  rating?: number;
}
