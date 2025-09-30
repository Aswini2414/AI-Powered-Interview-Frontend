import { combineReducers } from "redux";
import candidatesReducer from "./Slices/candidatesSlice";
import sessionReducer from "./Slices/sessionSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  candidates: candidatesReducer,
  session: sessionReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["session"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
