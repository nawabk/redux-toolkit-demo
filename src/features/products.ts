import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product } from "../types";
import { addToCart } from "./cart";

interface ProductsState {
  loading: boolean;
  list: Product[];
  error: string;
}

const initialState: ProductsState = {
  loading: false,
  list: [],
  error: "",
};

export const fetchProducts = createAsyncThunk<
  Product[],
  { signal: AbortSignal }
>(
  "products/fetchProducts",
  async ({ signal }, { rejectWithValue, getState }) => {
    try {
      const res = await fetch("http://localhost:5000/products", { signal });
      if (!res.ok) throw new Error("Something went wrong");
      const data = (await res.json()) as Product[];
      console.log(data);
      return data;
    } catch (e) {
      if (e instanceof Error) {
        return rejectWithValue(e.message);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<Product[]>) => {
        state.list = action.payload;
        state.loading = false;
        state.error = "";
      }
    );
    builder
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const updateProduct = action.payload[1];
        state.list.forEach((prod) => {
          if (prod.id === updateProduct.id)
            prod.quantity = updateProduct.quantity;
        });
      });
  },
});

export default productsSlice.reducer;
