import { combineEpics } from "redux-observable";
import reverseGeocodingEpic from "./reverseGeocodingEpic";
import searchGeocodeEpic from "./searchGeocodeEpic";

export const rootEpic = combineEpics(reverseGeocodingEpic, searchGeocodeEpic);
