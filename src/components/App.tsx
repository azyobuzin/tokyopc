import { Wrapper } from "@googlemaps/react-wrapper";
import { AppBar, Button, Skeleton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Subject,
  debounceTime,
  defer,
  distinctUntilChanged,
  switchMap,
} from "rxjs";
import { TOKYO_CENTER } from "../constants";
import classes from "./App.module.css";
import AppMap, { AppMapProps } from "./AppMap";

const App: FC = () => {
  return (
    <div className={classes.container}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            東京極座標
          </Typography>
        </Toolbar>
      </AppBar>
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
        render={renderMapLoading}
        language="ja"
        region="JP"
      >
        <Content />
      </Wrapper>
    </div>
  );
};

export default App;

function renderMapLoading(): ReactElement {
  return (
    <>
      <Box height="100%">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      </Box>
      <Box padding={2}>
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
      </Box>
    </>
  );
}

const Content: FC = () => {
  const { handleChangeCenter, address, polarCoordinates } = useAppLogic();
  return (
    <>
      <Box height="100%">
        <AppMap onChangeCenter={handleChangeCenter} />
      </Box>
      <Box display="flex" alignItems="end">
        <Box flex={1} padding={2}>
          <Typography variant="h6" noWrap component="div">
            極座標 {polarCoordinates}
          </Typography>
          <Typography variant="body2" noWrap component="div">
            {address ?? "住所..."}
          </Typography>
        </Box>
        <Box margin={2}>
          <Button variant="contained">ツイート</Button>
        </Box>
      </Box>
    </>
  );
};

interface AppLogicResult {
  handleChangeCenter: AppMapProps["onChangeCenter"];
  address: string | null;
  polarCoordinates: string;
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
  "sublocality_level_2",
  "sublocality_level_3",
  "sublocality_level_4",
  "sublocality_level_5",
]);

function useAppLogic(): AppLogicResult {
  const subject = useRef<Subject<google.maps.LatLngLiteral>>();
  const [address, setAddress] = useState<string | null>(null);
  const [polarCoordinates, setPolarCoordinates] = useState<string>(
    calcPolarCoordinates(TOKYO_CENTER)
  );

  const handleChangeCenter = useCallback(
    (position: google.maps.LatLngLiteral) => {
      setPolarCoordinates(calcPolarCoordinates(position));

      if (subject.current == null) {
        subject.current = new Subject<google.maps.LatLngLiteral>();
        subject.current
          .pipe(
            distinctUntilChanged(
              (previous, current) =>
                previous.lat === current.lat && previous.lng === current.lng
            ),
            debounceTime(400),
            switchMap((location) =>
              defer(async () => {
                const result = (
                  await new google.maps.Geocoder().geocode({ location })
                ).results[0];
                console.log(result);
                return result?.address_components
                  .filter(
                    (x) =>
                      x.types.includes("political") &&
                      x.types.some((type) => allowedAddressType.has(type))
                  )
                  .map((x) => x.short_name)
                  .reverse()
                  .join("");
              })
            )
          )
          .subscribe({
            next: setAddress,
            error: (err) => {
              console.error(err);
            },
          });
      }

      subject.current.next(position);
    },
    []
  );

  // 初期値で実行
  useEffect(() => handleChangeCenter(TOKYO_CENTER), []);

  return { handleChangeCenter, address, polarCoordinates };
}

function calcPolarCoordinates(position: google.maps.LatLngLiteral): string {
  // https://keisan.casio.jp/exec/system/1257670779
  const { x: x1, y: y1 } = latLngLiteralToXY(TOKYO_CENTER);
  const { x: x2, y: y2 } = latLngLiteralToXY(position);
  const r = 6378.137;
  const deltaX = x2 - x1;
  const d =
    r *
    Math.acos(
      Math.sin(y1) * Math.sin(y2) +
        Math.cos(y1) * Math.cos(y2) * Math.cos(deltaX)
    );
  const phi =
    (Math.atan2(
      Math.sin(deltaX),
      Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(deltaX)
    ) *
      180) /
    Math.PI;
  return `(${d} km, ${phi}°)`;
}

function latLngLiteralToXY(position: google.maps.LatLngLiteral): {
  x: number;
  y: number;
} {
  return {
    x: (position.lng * Math.PI) / 180,
    y: (position.lat * Math.PI) / 180,
  };
}
