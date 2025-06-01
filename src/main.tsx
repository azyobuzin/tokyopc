import { Loader } from "@googlemaps/js-api-loader";
import { CssBaseline } from "@mui/material";
import { createHashHistory } from "history";
import type { Coordinate } from "ol/coordinate";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./components/App";
import { HistoryContext } from "./contexts";
import { type AppStore, createStore } from "./store";
import { setCenterCoordinates } from "./store/actions";

const googleApiLoader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  libraries: ['geocoding']
});
const history = createHashHistory();
const store = createStore({ googleApiLoader, history });
setCenterCoordinatesFromParams(store);

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <CssBaseline />
      <Provider store={store}>
        <HistoryContext.Provider value={history}>
          <App />
        </HistoryContext.Provider>
      </Provider>
    </StrictMode>,
  );
} else {
  console.error("fatal: root element not found");
}

function setCenterCoordinatesFromParams(store: AppStore): void {
  const params = new URLSearchParams(history.location.search);
  let centerCoordinates: Coordinate | null = null;
  ["lng", "lat"].forEach((key, i) => {
    const paramStr = params.get(key);
    if (paramStr == null) return;
    const parsed = Number.parseFloat(paramStr);
    if (Number.isFinite(parsed)) {
      if (centerCoordinates == null)
        centerCoordinates = [...store.getState().centerCoordinates];
      centerCoordinates[i] = parsed;
    }
  });

  if (centerCoordinates != null)
    store.dispatch(setCenterCoordinates(centerCoordinates));
}
