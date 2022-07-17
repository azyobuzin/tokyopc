import { createAction } from "@reduxjs/toolkit";
import type { Coordinate } from "ol/coordinate";

export const setCenterCoordinates = createAction<Coordinate>(
  "setCenterCoordinates"
);

export const setAddress = createAction<string | null>("setAddress");
