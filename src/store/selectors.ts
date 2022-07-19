import type { AppState } from "./types";

function stateSelector<T extends keyof AppState>(
  prop: T
): (state: AppState) => AppState[T] {
  return (state) => state[prop];
}

export const selectCenterCoordinates = stateSelector("centerCoordinates");

export const selectAddress = stateSelector("address");

export const selectIsSearching = stateSelector("isSearching");

export const selectSearchError = stateSelector("searchError");
