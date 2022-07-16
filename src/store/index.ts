import { configureStore, createReducer } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { IMPERIAL_COORDINATES } from "../constants";
import { calcPolarCoordinates } from "../logics";
import { setAddress, setPolarCoordinates } from "./actions";
import { setCenterCoordinatesEpic } from "./epics";

export interface AppState {
  polarCoordinates: string;
  address: string | null;
}

const initialState: AppState = {
  polarCoordinates: calcPolarCoordinates(IMPERIAL_COORDINATES),
  address: null,
};

export const selectPolarCoordinates = (state: AppState): string =>
  state.polarCoordinates;

export const selectAddress = (state: AppState): string | null => state.address;

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setPolarCoordinates, (state, { payload }) => {
      state.polarCoordinates = payload;
    })
    .addCase(setAddress, (state, { payload }) => {
      state.address = payload;
    })
);

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(epicMiddleware),
});

epicMiddleware.run(setCenterCoordinatesEpic);
