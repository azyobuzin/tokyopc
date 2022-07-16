import { yellow } from "@mui/material/colors";
import { Feature, Map, View } from "ol";
import { fromString } from "ol/color";
import { LineString, Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Fill, RegularShape, Stroke, Style, Text } from "ol/style";
import { FC, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { IMPERIAL_COORDINATES } from "../constants";
import { setCenterCoordinates } from "../store/actions";
import "ol/ol.css";
import classes from "./AppMap.module.css";

const AppMap: FC = () => {
  const mapRef = useRef<Map>();
  const dispatch = useDispatch();

  const initializeMap = useCallback(
    (el: HTMLDivElement | null) => {
      if (el == null) {
        mapRef.current = undefined;
        return;
      }

      const mapLayer = new TileLayer({
        source: new OSM(),
      });

      const lineFeature = new Feature(
        new LineString([
          [0, 0],
          [0, 0],
        ])
      );

      const centerStarFeature = new Feature(new Point(IMPERIAL_COORDINATES));

      // https://openlayers.org/en/latest/examples/regularshape.html
      centerStarFeature.setStyle(
        new Style({
          image: new RegularShape({
            fill: new Fill({ color: fromString(yellow[500] + "d0") }),
            stroke: new Stroke({
              color: fromString(yellow[700] + "d0"),
              width: 2,
            }),
            points: 5,
            radius: 24,
            radius2: 12,
            angle: 0,
          }),
          text: new Text({ text: "皇居" }),
        })
      );

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [lineFeature, centerStarFeature],
        }),
      });

      const map = new Map({
        layers: [mapLayer, vectorLayer],
        target: el,
        view: new View({
          projection: "EPSG:4326",
          center: IMPERIAL_COORDINATES,
          zoom: 12,
        }),
      });

      mapRef.current = map;

      map.getView().on("change:center", () => {
        if (mapRef.current !== map) {
          // 破棄されたMapのイベントなので無視する
          return;
        }

        const center = map.getView().getCenter();
        if (center) dispatch(setCenterCoordinates(center));
      });

      dispatch(setCenterCoordinates(IMPERIAL_COORDINATES));
    },
    [dispatch]
  );

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
