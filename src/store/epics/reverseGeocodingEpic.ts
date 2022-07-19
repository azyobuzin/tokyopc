import type { Loader } from "@googlemaps/js-api-loader";
import deepEqual from "fast-deep-equal";
import { Coordinate } from "ol/coordinate";
import { Epic } from "redux-observable";
import {
  concat,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  mergeMap,
  of,
  switchMap,
} from "rxjs";
import { AppAction, setAddress, setIsGettingAddress } from "../actions";
import { selectCenterCoordinates } from "../selectors";
import type { AppState } from "../types";

const reverseGeocodingEpic: Epic<
  AppAction,
  AppAction,
  AppState,
  { googleApiLoader: Loader }
> = (_action$, state$, { googleApiLoader }) => {
  return state$.pipe(
    map(selectCenterCoordinates),
    distinctUntilChanged(deepEqual),
    debounceTime(400),
    switchMap((location) =>
      state$.pipe(
        first((state) => !state.isGettingAddress),
        mergeMap(() =>
          concat(
            of<AppAction>(setIsGettingAddress(true)),
            (async (): Promise<AppAction> =>
              setAddress(await getAddress(location, googleApiLoader)))()
          )
        )
      )
    )
  );
};

export default reverseGeocodingEpic;

async function getAddress(
  location: Coordinate,
  googleApiLoader: Loader
): Promise<string | null> {
  try {
    const google = await googleApiLoader.load();

    const result = (
      await new google.maps.Geocoder().geocode({
        location: { lng: location[0], lat: location[1] },
      })
    ).results[0];

    if (import.meta.env.DEV) {
      console.log(result);
    }

    if (result) {
      return formatAddress(result.address_components);
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}

const allowedAddressType = new Set([
  "administrative_area_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "administrative_area_level_4",
  "administrative_area_level_5",
  "administrative_area_level_6",
  "administrative_area_level_7",
  "locality",
  "sublocality",
]);

function formatAddress(
  components: google.maps.GeocoderAddressComponent[]
): string {
  return components
    .filter(
      (x, i) =>
        x.types.includes("political") &&
        x.types.some((type) => allowedAddressType.has(type)) &&
        // 東京23区は区名が重複するので排除
        !(
          i > 0 &&
          x.types.includes("locality") &&
          components[i - 1].types.includes("sublocality_level_1") &&
          x.short_name === components[i - 1].short_name
        )
    )
    .map((x) => x.short_name)
    .reverse()
    .join("");
}
