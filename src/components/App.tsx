import { CircularProgress, Fade, styled } from "@mui/material";
import { Box } from "@mui/system";
import { type FC, Suspense, lazy } from "react";
import Header from "./Header";
import Footer from "./Footer";

const AppMap = lazy(() => import("./AppMap"));

const App: FC = () => {
  return (
    <AppContainer>
      <Header />
      <Suspense fallback={mapLoading}>
        <AppMap />
      </Suspense>
      <Footer />
    </AppContainer>
  );
};

export default App;

const AppContainer = styled("div")({
  display: "grid",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  gridTemplateRows: "auto 1fr auto",
});

const mapLoading = (
  <Box height="100%" display="flex" justifyContent="center" alignItems="center">
    <Fade in={true} style={{ transitionDelay: "1s" }}>
      <CircularProgress />
    </Fade>
  </Box>
);
