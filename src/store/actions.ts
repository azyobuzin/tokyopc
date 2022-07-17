import { createAction } from "@reduxjs/toolkit";
import type { Coordinate } from "ol/coordinate";
import type { SearchResult } from "./types";

export const setCenterCoordinates = createAction<Coordinate>(
  "setCenterCoordinates"
);

export const setAddress = createAction<string | null>("setAddress");

export const searchGeocode = createAction<string>("searchGeocode");

export const setIsSearching = createAction<boolean>("setIsSearching");

export const setSearchResult = createAction<SearchResult>("setSearchResult");

export const clearSearchError = createAction("clearSerachError");
