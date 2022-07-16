import type { Coordinate } from "ol/coordinate";
import { IMPERIAL_COORDINATES } from "./constants";

export function calcPolarCoordinates(location: Coordinate): string {
  // https://keisan.casio.jp/exec/system/1257670779
  const [x1, y1] = IMPERIAL_COORDINATES.map(toRad);
  const [x2, y2] = location.map(toRad);
  const r = 6378.137;
  const deltaX = x2 - x1;
  const d =
    r *
    Math.acos(
      Math.sin(y1) * Math.sin(y2) +
        Math.cos(y1) * Math.cos(y2) * Math.cos(deltaX)
    );
  const phi = d===0 ? 0 :
    (-Math.atan2(
      Math.sin(deltaX),
      Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(deltaX)
    ) *
      180) /
      Math.PI +
    90;
  return `(${distanceFormat.format(d)}, ${degreeFormat.format(phi)}°)`;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

const distanceFormat = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "kilometer",
});
const degreeFormat = new Intl.NumberFormat(undefined, {
  unit: "degree",
  maximumFractionDigits: 0,
});
