import { configureStore } from "@reduxjs/toolkit";
import ProductSlice from "./productSlice";

const store = configureStore({
    reducer: {
        filters: ProductSlice,
    },
});

export default store;