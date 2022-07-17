import type { Coordinate } from "ol/coordinate";

export interface AppState {
  centerCoordinates: Coordinate;
  address: string | null;
  isSearching: boolean;
  searchError: "Error" | "NotFound" | null;
}

export type SearchResult =
  | {
      status: "Error" | "NotFound";
    }
  | { status: "Success"; coordinates: Coordinate };
