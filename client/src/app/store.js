// Redux Toolkit store configuration
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.js";
import magazineReducer from "./features/magazineSlice.js";
import articleReducer from "./features/articleSlice.js";
import bookmarkReducer from "./features/bookmarkSlice.js";
import subscriptionReducer from "./features/subscriptionSlice.js";
import searchReducer from "./features/searchSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    magazines: magazineReducer,
    articles: articleReducer,
    bookmarks: bookmarkReducer,
    subscription: subscriptionReducer,
    search: searchReducer,
  },
  // Allow non-serializable values (e.g. File objects in form payloads)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
