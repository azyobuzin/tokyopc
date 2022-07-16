import { CssBaseline } from "@mui/material";
import { StrictMode } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import { store } from "./store";

render(
  <StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById("root")!
);
