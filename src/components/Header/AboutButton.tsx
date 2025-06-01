import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { type FC, useCallback, useState } from "react";

const AboutButton: FC = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleOpen}
        aria-label="東京極座標について"
      >
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
            <Link
              href="https://twitter.com/azyobuzin"
              target="_blank"
              rel="noopener"
            >
              作者: @azyobuzin
            </Link>
            {' / '}
            <Link
              href="https://github.com/azyobuzin/tokyopc"
              target="_blank"
              rel="noopener"
            >
              GitHub
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

export default AboutButton;
