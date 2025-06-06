import type { Loader } from "@googlemaps/js-api-loader";
import deepEqual from "fast-deep-equal";
import type { History } from "history";
import type { Coordinate } from "ol/coordinate";
import type { Epic } from "redux-observable";
import {
  EMPTY,
  concat,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  merge,
  mergeMap,
  of,
  switchMap,
  tap,
  timer,
} from "rxjs";
import {
  type AppAction,
  beginReverseGeocoding,
  clearAddress,
  setAddress,
} from "../actions";
import { selectCenterCoordinates } from "../selectors";
import type { AddressResult, AppState } from "../types";

const reverseGeocodingEpic: Epic<
  AppAction,
  AppAction,
  AppState,
  { googleApiLoader: Loader; history?: History }
> = (_action$, state$, { googleApiLoader, history }) => {
  // 座標が変更されたら、スロットリングしながら住所を求める
  const getAddressPipeline = state$.pipe(
    map(selectCenterCoordinates),
    distinctUntilChanged(deepEqual),
    debounceTime(400),
    tap((location) => updateBrowserLocation(location, history)),
    switchMap((location) =>
      state$.pipe(
        first((state) => !state.isGettingAddress),
        mergeMap(() =>
          concat(
            of<AppAction>(beginReverseGeocoding()),
            (async (): Promise<AppAction> =>
              setAddress(await getAddress(location, googleApiLoader)))(),
          ),
        ),
      ),
    ),
  );

  // 2秒以内に住所を取得できなかったら、住所表示をクリアする
  const clearAddressPipeline = state$.pipe(
    map(
      (state) =>
        state.address == null ||
        deepEqual(state.address.coordinates, state.centerCoordinates),
    ),
    distinctUntilChanged(),
    switchMap((addressUpToDate) =>
      addressUpToDate ? EMPTY : timer(2000).pipe(map(() => clearAddress())),
    ),
  );

  return merge(getAddressPipeline, clearAddressPipeline);
};

export default reverseGeocodingEpic;

async function getAddress(
  coordinates: Coordinate,
  googleApiLoader: Loader,
): Promise<AddressResult | null> {
  try {
    const { Geocoder } = await googleApiLoader.importLibrary("geocoding");

    const result = (
      await new Geocoder().geocode({
        location: { lng: coordinates[0], lat: coordinates[1] },
      })
    ).results[0];

    if (import.meta.env.DEV) {
      console.log(result);
    }

    if (result) {
      return { address: formatAddress(result.address_components), coordinates };
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
  components: google.maps.GeocoderAddressComponent[],
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
        ),
    )
    .map((x) => x.short_name)
    .reverse()
    .join("");
}

function updateBrowserLocation(
  [lng, lat]: Coordinate,
  history: History | undefined,
): void {
  if (!history) return;
  const params = new URLSearchParams(history.location.search);
  params.set("lng", String(lng));
  params.set("lat", String(lat));
  history.replace({ search: params.toString() });
}
