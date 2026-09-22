export type CartItemsListItemDTO = {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    category: string | null;
    poster: string | null;
  };
  qty: number;
};
