import type { Loader } from "@googlemaps/js-api-loader";
import type { History } from "history";
import type { Coordinate } from "ol/coordinate";

export interface AppState {
  centerCoordinates: Coordinate;
  address: AddressResult | null;
  isGettingAddress: boolean;
  isSearching: boolean;
  searchError: "Error" | "NotFound" | null;
}

export interface AddressResult {
  address: string;
  // 取得した住所に対応する座標
  coordinates: Coordinate;
}

export type SearchResult =
  | {
      status: "Error" | "NotFound";
    }
  | { status: "Success"; coordinates: Coordinate };

export interface StoreDependencies {
  googleApiLoader: Loader;
  history?: History;
}
