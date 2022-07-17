import { AnyAction } from "@reduxjs/toolkit";
import { Epic } from "redux-observable";
import { concatWith, defer, filter, of, switchMap } from "rxjs";
import { loader } from "../../google-api";
import { searchGeocode, setIsSearching, setSearchResult } from "../actions";
import { AppState } from "../types";

const searchGeocodeEpic: Epic<AnyAction, AnyAction, AppState, unknown> = (
  action$
) => {
  return action$.pipe(
    filter(searchGeocode.match),
    switchMap(({ payload: query }) =>
      of<AnyAction>(setIsSearching(true)).pipe(
        concatWith(
          defer(async () => {
            try {
              await loader.load();

              const results = (
                await new google.maps.Geocoder().geocode({
                  address: query,
                  region: "JP",
                })
              ).results;

              if (import.meta.env.DEV) {
                console.log(results);
              }

              if (results.length === 0) {
                return setSearchResult({ status: "NotFound" });
              }

              const location = results[0].geometry.location;
              return setSearchResult({
                status: "Success",
                coordinates: [location.lng(), location.lat()],
              });
            } catch (e) {
              if ((e as { code?: string }).code === "ZERO_RESULTS") {
                return setSearchResult({ status: "NotFound" });
              }

              console.error(e);
              return setSearchResult({ status: "Error" });
            }
          })
        )
      )
    )
  );
};

export default searchGeocodeEpic;
