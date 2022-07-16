import { createAction } from "@reduxjs/toolkit";
import type { Coordinate } from "ol/coordinate";

export const setCenterCoordinates = createAction<Coordinate>(
  "setCenterCoordinates"
);

export const setPolarCoordinates = createAction<string>("setPolarCoordinates");

export const setAddress = createAction<string>("setAddress");
