export interface User {
  principal: string;
  balance: number;
  firstName?: string;
  lastName?: string;
  bio?: string;
  rate?: number;
  createdAt: number;
  updatedAt: number;
}
