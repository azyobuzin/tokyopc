import type { Coordinate } from "ol/coordinate";
import { IMPERIAL_COORDINATES } from "./constants";

export function displayPolarCoordinates(location: Coordinate): string {
  const coords = calcPolarCoordinates(location);
  return formatPolarCoordinates(coords);
}

export function calcPolarCoordinates(location: Coordinate): {
  distance: number;
  angle: number;
} {
  // https://keisan.casio.jp/exec/system/1257670779
  const [x1, y1] = IMPERIAL_COORDINATES.map(toRad);
  const [x2, y2] = location.map(toRad);
  let d = 0;
  let phi = 0;
  if (x1 !== x2 && y1 !== y2) {
    const r = 6378.137; // 地球の半径
    const deltaX = x2 - x1;
    d =
      r *
      Math.acos(
        Math.sin(y1) * Math.sin(y2) +
          Math.cos(y1) * Math.cos(y2) * Math.cos(deltaX),
      );
    phi =
      -Math.atan2(
        Math.sin(deltaX),
        Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(deltaX),
      ) +
      Math.PI / 2;
    // -180°～180°に正規化
    phi = Math.atan2(Math.sin(phi), Math.cos(phi)) * (180 / Math.PI);
  }
  return { distance: d, angle: phi };
}

export function getDirectionLabel(angle: number): string {
  // 22.5°ごとに16方向に分割
  const sectorIndex = Math.floor(((angle + 11.25 + 360) % 360) / 22.5);

  const directionLabels = [
    "東",
    "東北東",
    "北東",
    "北北東",
    "北",
    "北北西",
    "北西",
    "西北西",
    "西",
    "西南西",
    "南西",
    "南南西",
    "南",
    "南南東",
    "南東",
    "東南東",
  ];

  return directionLabels[sectorIndex];
}

function formatPolarCoordinates(coords: {
  distance: number;
  angle: number;
}): string {
  const direction = getDirectionLabel(coords.angle);
  return `皇居から ${distanceFormat.format(coords.distance)}, ${angleFormat.format(coords.angle)}° (${direction})`;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export const distanceFormat = new Intl.NumberFormat(undefined, {
  style: "unit",
  unit: "kilometer",
  maximumSignificantDigits: 3,
});

export const angleFormat = new Intl.NumberFormat(undefined, {
  unit: "degree",
  maximumFractionDigits: 0,
});
