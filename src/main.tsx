import { CssBaseline } from "@mui/material";
import { createHashHistory } from "history";
import { Coordinate } from "ol/coordinate";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./components/App";
import { HistoryContext } from "./contexts";
import { store } from "./store";
import { setCenterCoordinates } from "./store/actions";

const history = createHashHistory();
setCenterCoordinatesFromParams();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <HistoryContext.Provider value={history}>
        <App />
      </HistoryContext.Provider>
    </Provider>
  </StrictMode>
);

function setCenterCoordinatesFromParams(): void {
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
