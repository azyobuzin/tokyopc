import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { FC, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { calcPolarCoordinates } from "../logics";
import { selectAddress, selectCenterCoordinates } from "../store/selectors";
import classes from "./App.module.css";
import AppMap from "./AppMap";
import TweetButton from "./TweetButton";

const App: FC = () => {
  return (
    <div className={classes.container}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            東京極座標
          </Typography>
          <AboutButton />
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
  const centerCoordinates = useSelector(selectCenterCoordinates);
  const address = useSelector(selectAddress);

  return (
    <Box display="flex" alignItems="end">
      <Box flex={1} padding={2}>
        <Typography variant="h6" noWrap component="div">
          極座標 {calcPolarCoordinates(centerCoordinates)}
        </Typography>
        <Typography variant="body2" noWrap component="div">
          {address ?? "住所..."}
        </Typography>
      </Box>
      <Box margin={2}>
        <TweetButton />
      </Box>
    </Box>
  );
};

const AboutButton: FC = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <IconButton size="large" color="inherit" onClick={handleOpen}>
        <InfoOutlinedIcon />
      </IconButton>
      <Dialog
        aria-labelledby="about-dialog-title"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="about-dialog-title">東京極座標について</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            「東京の地名覚えられないから皇居を原点とした極座標で示すべき」
          </Typography>
          <Typography gutterBottom>
            東京極座標は、東京周辺の場所を、皇居を原点とした極座標に変換するサービスです。
            結局東京のどこらへんだよ！の説明に困ったときに、ご利用ください。
          </Typography>
          <Typography variant="body2">
            <Link href="https://twitter.com/azyobuzin" target="_blank">
              作者: @azyobuzin
            </Link>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
