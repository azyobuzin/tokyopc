import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";
import { useSelector } from "react-redux";
import { selectAddress, selectPolarCoordinates } from "../store";
import classes from "./App.module.css";
import AppMap from "./AppMap";

const App: FC = () => {
  return (
    <div className={classes.container}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            東京極座標
          </Typography>
        </Toolbar>
      </AppBar>
      <Box height="100%">
        <AppMap />
      </Box>
      <Footer />
    </div>
  );
};

export default App;

const Footer: FC = () => {
  const polarCoordinates = useSelector(selectPolarCoordinates);
  const address = useSelector(selectAddress);

  return (
    <Box display="flex" alignItems="end">
      <Box flex={1} padding={2}>
        <Typography variant="h6" noWrap component="div">
          極座標 {polarCoordinates}
        </Typography>
        <Typography variant="body2" noWrap component="div">
          {address ?? "住所..."}
        </Typography>
      </Box>
      <Box margin={2}>
        <Button variant="contained" disabled={address == null}>
          ツイート
        </Button>
      </Box>
    </Box>
  );
};
