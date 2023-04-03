import { Typography, styled } from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";
import { useSelector } from "react-redux";
import { calcPolarCoordinates } from "../logics";
import { selectAddress, selectCenterCoordinates } from "../store/selectors";
import AppMap from "./AppMap";
import Header from "./Header";
import TweetButton from "./TweetButton";

const App: FC = () => {
  return (
    <AppContainer>
      <Header />
      <Box height="100%">
        <AppMap />
      </Box>
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

const Footer: FC = () => {
  const centerCoordinates = useSelector(selectCenterCoordinates);
  const address = useSelector(selectAddress);

  return (
    <Box display="grid" gridTemplateColumns="1fr 8em" alignItems="end">
      <Box flex={1} padding={2} width="100%" overflow="hidden">
        <Typography variant="h6" noWrap component="div">
          極座標 {calcPolarCoordinates(centerCoordinates)}
        </Typography>
        <Typography variant="body2" noWrap component="div">
          {address?.address ?? "住所..."}
        </Typography>
      </Box>
      <Box margin={2}>
        <TweetButton />
      </Box>
    </Box>
  );
};
