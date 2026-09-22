export type CreateProductDTO = {
  name: string;
  stock: number;
  bio?: string;
  price: number;
  posterBase64?: string;
  isPublic: boolean;
  isPinned: boolean;
  categoryId?: string;
};

export type UpdateProductDTO = {
  id: string;
  name?: string;
  stock?: number;
  bio?: string | null;
  price?: number;
  posterBase64?: string | null;
  isPublic?: boolean;
  isPinned?: boolean;
  categoryId?: string | null;
};

export type ProductAdminListItemDTO = {
  id: string;
  name: string;
  price: number;
  poster: string | null;
  category: string | null;
};

export type ProductAdminDetailDTO = {
  id: string;
  name: string;
  price: number;
  poster: string | null;
  categoryId: string | null;
  bio: string | null;
  stock: number;
  isPinned: boolean;
  isPublic: boolean;
};
