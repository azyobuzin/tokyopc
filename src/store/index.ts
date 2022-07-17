import { AnyAction, configureStore, createReducer } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { IMPERIAL_COORDINATES } from "../constants";
import { setAddress, setCenterCoordinates } from "./actions";
import { reverseGeocodingEpic } from "./epics";
import { AppState } from "./types";

const initialState: AppState = {
  centerCoordinates: IMPERIAL_COORDINATES,
  address: null,
};

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setCenterCoordinates, (state, { payload }) => {
      state.centerCoordinates = payload;
    })
    .addCase(setAddress, (state, { payload }) => {
      state.address = payload;
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

epicMiddleware.run(reverseGeocodingEpic);
