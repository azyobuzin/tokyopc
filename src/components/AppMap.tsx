import { FC, useCallback, useRef } from "react";
import { TOKYO_CENTER } from "../constants";
import classes from "./Map.module.css";

export interface AppMapProps {
  onChangeCenter?: (coordinates: google.maps.LatLngLiteral) => void;
}

const AppMap: FC<AppMapProps> = ({ onChangeCenter }) => {
  const mapRef = useRef<google.maps.Map>();
  const onChangeCenterRef = useRef(onChangeCenter);
  onChangeCenterRef.current = onChangeCenter;

  const initializeMap = useCallback((el: HTMLDivElement | null) => {
    if (el == null) {
      mapRef.current = undefined;
      return;
    }

    const map = new google.maps.Map(el, {
      center: TOKYO_CENTER,
      streetViewControl: false,
      zoom: 12,
    });
    mapRef.current = map;

    // 皇居にマーカーを置く
    new google.maps.Marker({
      clickable: false,
      map,
      position: TOKYO_CENTER,
      title: "皇居",
    });

    // 皇居から画面中央への線
    const polyline = new google.maps.Polyline({
      clickable: false,
      map,
      strokeColor: "#c62828",
      strokeOpacity: 0.75,
      strokeWeight: 2,
    });

    map.addListener("center_changed", () => {
      if (map !== mapRef.current) {
        // アンマウントされたマップのイベントなので無視
        return;
      }

      const center = map.getCenter();
      if (center != null) {
        polyline.setPath([TOKYO_CENTER, center]);
        if (onChangeCenterRef.current != null) {
          onChangeCenterRef.current(center.toJSON());
        }
      }
    });
  }, []);

  return (
    <div className={classes.mapContainer}>
      <div ref={initializeMap} className={classes.map} />
      <div className={classes.centerMarker}>
        <svg width="100%" height="100%" viewBox="0 0 10 10">
          <line
            x1="0"
            y1="5"
            x2="10"
            y2="5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="5"
            y1="0"
            x2="5"
            y2="10"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};

export default AppMap;
