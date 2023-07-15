import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Cart, Cart_Operation, PopulatedCartProduct, Product } from "../types";
import { RootState } from "../store";

type CartState = {
  loading: boolean;
  data: Cart;
  error: string;
};

const initialState: CartState = {
  loading: false,
  data: { total: 0, products: [] },
  error: "",
};

export const fetchCartData = createAsyncThunk<Cart, { signal: AbortSignal }>(
  "cart/fetchCartData",
  async ({ signal }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/cart", { signal });
      if (!res.ok) return rejectWithValue("There is some problem loading cart");
      const data = (await res.json()) as Cart;
      return data;
    } catch (e) {
      return rejectWithValue("There is some problem loading cart");
    }
  }
);

export const addToCart = createAsyncThunk<
  [Cart, Product],
  { productId: number; operation: Cart_Operation }
>(
  "cart/addToCart",
  async ({ productId, operation }, { rejectWithValue, getState }) => {
    try {
      let increment = operation === Cart_Operation.ADD ? 1 : -1;
      const { products, cart } = getState() as RootState;
      const newTotal = cart.data.total + increment;
      let newProducts = cart.data.products.map((prod) => ({ ...prod }));
      const cartProduct = newProducts.find(
        (prod) => prod.productId === productId
      );
      const product = products.list.find((prod) => prod.id === productId);
      if (cartProduct) {
        cartProduct.count += increment;
        if (cartProduct.count === 0) {
          newProducts = newProducts.filter(
            (prod) => prod.productId !== cartProduct.productId
          );
        }
      } else {
        newProducts.push({
          productId,
          count: 1,
        });
      }

      if (product) {
        const updatedCart: Cart = {
          total: newTotal,
          products: newProducts,
        };
        const addToCartRequest = fetch("http://localhost:5000/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCart),
        });
        const updateProductRequest = fetch(
          `http://localhost:5000/products/${productId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantity: product.quantity - increment,
            }),
          }
        );

        const responses = await Promise.all([
          addToCartRequest,
          updateProductRequest,
        ]);
        const newCart = (await responses[0].json()) as Cart;
        const updatedProduct = (await responses[1].json()) as Product;
        return [newCart, updatedProduct];
      }
      return rejectWithValue("");
    } catch (e) {
      return rejectWithValue("");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart() {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.data = action.payload;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.data = action.payload[0];
      });
  },
});

const cartSelector = (state: RootState) => state.cart.data.products;
const productsSelector = (state: RootState) => state.products.list;

export const cartProductsSelector = createSelector(
  cartSelector,
  productsSelector,
  (products, productsList) => {
    const populatedProducts: PopulatedCartProduct[] = [];
    for (const product of products) {
      const productItem = productsList.find(
        (item) => product.productId === item.id
      );
      if (productItem)
        populatedProducts.push({
          id: productItem.id,
          count: product.count,
          title: productItem.title,
          totalPrice: product.count * productItem.price,
        });
    }
    return populatedProducts;
  }
);

export default cartSlice.reducer;
