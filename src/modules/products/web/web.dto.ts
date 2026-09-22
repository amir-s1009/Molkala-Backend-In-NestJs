export type ProductWebListItemDTO = {
  id: string;
  name: string;
  price: number;
  poster: string | null;
  category: string | null;
};

export type ProductWebDetailDTO = {
  id: string;
  name: string;
  price: number;
  poster: string | null;
  category: string | null;
  bio: string | null;
  isStock: boolean;
};
