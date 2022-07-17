import type { Coordinate } from "ol/coordinate";
import type { AppState } from "./types";

export const selectCenterCoordinates = (state: AppState): Coordinate =>
  state.centerCoordinates;

export const selectAddress = (state: AppState): string | null => state.address;

export const selectIsSearching = (state: AppState): boolean =>
  state.isSearching;

export const selectSearchError = (
  state: AppState
): "Error" | "NotFound" | null => state.searchError;
