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
      defer(async () => [setAddress(JSON.stringify(location))])
    )
  );

  return merge(polarCoordinates$, address$);
};
