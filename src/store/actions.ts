import { type PayloadActionCreator, createAction } from "@reduxjs/toolkit";
import type { Coordinate } from "ol/coordinate";
import type { AddressResult, SearchResult } from "./types";

// createAction の型推論をさせるためにカリー化
function action<T extends string>(
  type: T,
): { payload: <P>() => PayloadActionCreator<P, T> } {
  return { payload: <P>() => createAction<P, T>(type) };
}

// 現在の座標を設定する。これをトリガーに住所取得処理が起動する。
export const setCenterCoordinates = action(
  "setCenterCoordinates",
).payload<Coordinate>();

// 取得した住所をセットし、住所取得を完了する。
export const setAddress = action("setAddress").payload<AddressResult | null>();

// 住所取得処理が開始されたことをストアに設定する。
export const beginReverseGeocoding = createAction("beginReverseGeocoding");

// 住所をストアから消去する。
export const clearAddress = createAction("clearAddress");

// 指定されたペイロードの地名に対応する座標を検索する。
export const searchGeocode = action("searchGeocode").payload<string>();

// 地名検索処理が開始されたことをストアに設定する。
export const beginSearchGeocode = createAction("beginSearchGeocode");

// 取得した座標またはエラーをセットし、住所取得を完了する。
export const setSearchResult =
  action("setSearchResult").payload<SearchResult>();

// 地名検索エラーをストアから消去する。
export const clearSearchError = createAction("clearSerachError");

export type AppAction = ReturnType<
  | typeof beginReverseGeocoding
  | typeof beginSearchGeocode
  | typeof clearAddress
  | typeof clearSearchError
  | typeof searchGeocode
  | typeof setAddress
  | typeof setCenterCoordinates
  | typeof setSearchResult
>;
