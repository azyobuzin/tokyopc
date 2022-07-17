import type { Coordinate } from "ol/coordinate";
import { IMPERIAL_COORDINATES } from "./constants";

export function calcPolarCoordinates(location: Coordinate): string {
  // https://keisan.casio.jp/exec/system/1257670779
  const [x1, y1] = IMPERIAL_COORDINATES.map(toRad);
  const [x2, y2] = location.map(toRad);
  let d = 0;
  let phi = 0;
  if (x1 !== x2 && y1 !== y2) {
    const r = 6378.137;
    const deltaX = x2 - x1;
    d =
      r *
      Math.acos(
        Math.sin(y1) * Math.sin(y2) +
          Math.cos(y1) * Math.cos(y2) * Math.cos(deltaX)
      );
    phi =
      -Math.atan2(
        Math.sin(deltaX),
        Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(deltaX)
      ) +
      Math.PI / 2;
    // -180°～180°に正規化
    phi = Math.atan2(Math.sin(phi), Math.cos(phi)) * (180 / Math.PI);
  }
  return `(${distanceFormat.format(d)}, ${degreeFormat.format(phi)}°)`;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

const distanceFormat = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "kilometer",
  maximumSignificantDigits: 3,
});
const degreeFormat = new Intl.NumberFormat(undefined, {
  unit: "degree",
  maximumFractionDigits: 0,
});
