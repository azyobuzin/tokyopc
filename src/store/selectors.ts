import type { Coordinate } from "ol/coordinate";
import type { AppState } from "./types";

function stateSelector<T extends keyof AppState>(
  prop: T,
): (state: AppState) => AppState[T] {
  return (state) => state[prop];
}

export const selectCenterCoordinates = stateSelector("centerCoordinates");

export const selectAddress = stateSelector("address");

export const selectIsSearching = stateSelector("isSearching");

export const selectSearchError = stateSelector("searchError");

// 地名検索で得られた座標にあるとき、検索クエリを返す。そうでないならば、逆ジオコーディングで求めた住所を返す。
export const selectAddressPreferUserGiven = (
  state: AppState,
): string | undefined => state.userGivenAddress ?? state.address?.address;

// selectAddressPreferUserGiven が返す住所に対応する座標を返す。
export const selectCoordinatesCorrespondingToAddress = (
  state: AppState,
): Coordinate =>
  state.userGivenAddress || !state.address
    ? state.centerCoordinates
    : state.address.coordinates;
