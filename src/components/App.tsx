import { Box, CircularProgress, Fade, styled } from "@mui/material";
import { type FC, Suspense, lazy } from "react";
import Header from "./Header";
import LocationCard from "./LocationCard";
import TweetButton from "./TweetButton";

const AppMap = lazy(() => import("./AppMap"));

const App: FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AppContainer>
        <Header />
        <Suspense fallback={mapLoading}>
          <AppMap />
        </Suspense>
      </AppContainer>
      <LocationCard />
      <TweetButton />
    </Box>
  );
};

export default App;

const AppContainer = styled("div")({
  display: "grid",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  gridTemplateRows: "auto 1fr",
});

const mapLoading = (
  <Box
    sx={{
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Fade in={true} style={{ transitionDelay: "1s" }}>
      <CircularProgress />
    </Fade>
  </Box>
);
