import { configureStore } from "@reduxjs/toolkit";
import counter from "../features/counter";
import post from "../features/post";
import products from "../features/products";
import cart from "../features/cart";

const store = configureStore({
  reducer: { counter, post, products, cart },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
