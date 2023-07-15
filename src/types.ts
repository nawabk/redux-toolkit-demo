export interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export interface CartProduct {
  productId: number;
  count: number;
}
export interface Cart {
  total: number;
  products: CartProduct[];
}

export interface PopulatedCartProduct {
  id: number;
  count: number;
  title: string;
  totalPrice: number;
}

export enum Cart_Operation {
  ADD,
  REMOVE,
}
