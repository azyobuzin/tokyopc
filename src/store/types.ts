import type { Coordinate } from "ol/coordinate";

export interface AppState {
  centerCoordinates: Coordinate;
  address: string | null;
}
