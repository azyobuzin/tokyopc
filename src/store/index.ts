import { AnyAction, configureStore, createReducer } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { IMPERIAL_COORDINATES } from "../constants";
import {
  clearSearchError,
  setAddress,
  setCenterCoordinates,
  setIsSearching,
  setSearchResult,
} from "./actions";
import { rootEpic } from "./epics";
import { AppState } from "./types";

const initialState: AppState = {
  centerCoordinates: IMPERIAL_COORDINATES,
  address: null,
  isSearching: false,
  searchError: null,
};

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setCenterCoordinates, (state, { payload }) => {
      state.centerCoordinates = payload;
    })
    .addCase(setAddress, (state, { payload }) => {
      state.address = payload;
    })
    .addCase(setIsSearching, (state, { payload }) => {
      state.isSearching = payload;
    })
    .addCase(setSearchResult, (state, { payload }) => {
      state.isSearching = false;

      if (payload.status === "Success") {
        state.centerCoordinates = payload.coordinates;
        state.searchError = null;
      } else {
        state.searchError = payload.status;
      }
    })
    .addCase(clearSearchError, (state) => {
      state.searchError = null;
    })
);

const epicMiddleware = createEpicMiddleware<
  AnyAction,
  AnyAction,
  AppState,
  unknown
>();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);
