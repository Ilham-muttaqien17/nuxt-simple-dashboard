export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
  creationAt: string;
  updatedAt: string;
  category: Record<string, any>;
};
