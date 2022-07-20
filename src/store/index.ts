import {
  Reducer,
  Store,
  configureStore,
  createReducer,
} from "@reduxjs/toolkit";
import deepEqual from "fast-deep-equal";
import { createEpicMiddleware } from "redux-observable";
import { IMPERIAL_COORDINATES } from "../constants";
import {
  AppAction,
  beginReverseGeocoding,
  beginSearchGeocode,
  clearAddress,
  clearSearchError,
  setAddress,
  setCenterCoordinates,
  setSearchResult,
} from "./actions";
import { rootEpic } from "./epics";
import { AppState, StoreDependencies } from "./types";

const initialState: AppState = {
  centerCoordinates: IMPERIAL_COORDINATES,
  userGivenAddress: "皇居",
  address: null,
  isGettingAddress: false,
  isSearching: false,
  searchError: null,
};

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setCenterCoordinates, (state, { payload }) => {
      if (deepEqual(state.centerCoordinates, payload)) return;
      state.centerCoordinates = payload;
      state.userGivenAddress = null;
    })
    .addCase(setAddress, (state, { payload }) => {
      state.address = payload;
      state.isGettingAddress = false;
    })
    .addCase(beginReverseGeocoding, (state) => {
      state.isGettingAddress = true;
    })
    .addCase(clearAddress, (state) => {
      state.address = null;
    })
    .addCase(beginSearchGeocode, (state) => {
      state.isSearching = true;
    })
    .addCase(setSearchResult, (state, { payload }) => {
      state.isSearching = false;

      if (payload.status === "Success") {
        state.centerCoordinates = payload.coordinates;
        state.userGivenAddress = payload.query;
        state.searchError = null;
      } else {
        state.searchError = payload.status;
      }
    })
    .addCase(clearSearchError, (state) => {
      state.searchError = null;
    })
);

export type AppStore = Store<AppState, AppAction>;

export function createStore(dependencies: StoreDependencies): AppStore {
  const epicMiddleware = createEpicMiddleware<
    AppAction,
    AppAction,
    AppState,
    StoreDependencies
  >({ dependencies });

  const store = configureStore({
    reducer: reducer as Reducer<AppState, AppAction>,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(epicMiddleware),
  });

  epicMiddleware.run(rootEpic);

  return store;
}
