import type { Loader } from "@googlemaps/js-api-loader";
import type { Epic } from "redux-observable";
import { concat, filter, of, switchMap } from "rxjs";
import {
  type AppAction,
  beginSearchGeocode,
  searchGeocode,
  setSearchResult,
} from "../actions";
import type { AppState, SearchResult } from "../types";

const searchGeocodeEpic: Epic<
  AppAction,
  AppAction,
  AppState,
  { googleApiLoader: Loader }
> = (action$, _state$, { googleApiLoader }) => {
  return action$.pipe(
    filter(searchGeocode.match),
    switchMap(({ payload: query }) =>
      concat(
        of<AppAction>(beginSearchGeocode()),
        (async (): Promise<AppAction> =>
          setSearchResult(await doSearch(query, googleApiLoader)))(),
      ),
    ),
  );
};

export default searchGeocodeEpic;

async function doSearch(
  query: string,
  googleApiLoader: Loader,
): Promise<SearchResult> {
  try {
    const { Geocoder } = await googleApiLoader.importLibrary("geocoding")

    const results = (
      await new Geocoder().geocode({
        address: query,
        region: "JP",
      })
    ).results;

    if (import.meta.env.DEV) {
      console.log(results);
    }

    if (results.length === 0) {
      return { status: "NotFound" };
    }

    const location = results[0].geometry.location;
    return {
      status: "Success",
      query,
      coordinates: [location.lng(), location.lat()],
    };
  } catch (e) {
    if ((e as { code?: string }).code === "ZERO_RESULTS") {
      return { status: "NotFound" };
    }

    console.error(e);
    return { status: "Error" };
  }
}
