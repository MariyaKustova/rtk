import { configureStore } from "@reduxjs/toolkit";
import { rtkApi } from "@api/rtkApi";

export const store = configureStore({
  reducer: {
    [rtkApi.reducerPath]: rtkApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkApi.middleware),
});
