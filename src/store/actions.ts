import { PayloadActionCreator, createAction } from "@reduxjs/toolkit";
import type { Coordinate } from "ol/coordinate";
import type { SearchResult } from "./types";

// createAction の型推論をさせるためにカリー化
function action<T extends string>(
  type: T
): { payload<P>(): PayloadActionCreator<P, T> } {
  return { payload: <P>() => createAction<P, T>(type) };
}

export const setCenterCoordinates = action(
  "setCenterCoordinates"
).payload<Coordinate>();

export const setAddress = action("setAddress").payload<string | null>();

export const setIsGettingAddress = action(
  "setIsGettingAddress"
).payload<boolean>();

export const searchGeocode = action("searchGeocode").payload<string>();

export const setIsSearching = action("setIsSearching").payload<boolean>();

export const setSearchResult =
  action("setSearchResult").payload<SearchResult>();

export const clearSearchError = createAction("clearSerachError");

export type AppAction = ReturnType<
  | typeof clearSearchError
  | typeof searchGeocode
  | typeof setAddress
  | typeof setCenterCoordinates
  | typeof setIsGettingAddress
  | typeof setIsSearching
  | typeof setSearchResult
>;
