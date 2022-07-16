import { Loader } from "@googlemaps/js-api-loader";
import deepEqual from "fast-deep-equal";
import { Epic } from "redux-observable";
import {
  debounceTime,
  defer,
  distinctUntilChanged,
  filter,
  map,
  merge,
  share,
  switchMap,
} from "rxjs";
import { calcPolarCoordinates } from "../logics";
import {
  setAddress,
  setCenterCoordinates,
  setPolarCoordinates,
} from "./actions";

const googleLoader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  libraries: [],
});

export const setCenterCoordinatesEpic: Epic = (action$) => {
  const location$ = action$.pipe(
    filter(setCenterCoordinates.match),
    map(
      (action) => (action as ReturnType<typeof setCenterCoordinates>).payload
    ),
    distinctUntilChanged(deepEqual),
    share()
  );

  const polarCoordinates$ = location$.pipe(
    map((location) => setPolarCoordinates(calcPolarCoordinates(location)))
  );

  const address$ = location$.pipe(
    debounceTime(400),
    switchMap((location) =>
      defer(async () => {
        await googleLoader.load();
        const result = (
          await new google.maps.Geocoder().geocode({
            location: { lng: location[0], lat: location[1] },
          })
        ).results[0];
        if (result == null) return null;
        if (import.meta.env.MODE === "development") console.log(result);
        return setAddress(formatAddress(result.address_components));
      })
    )
  );

  return merge(polarCoordinates$, address$);
};

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
