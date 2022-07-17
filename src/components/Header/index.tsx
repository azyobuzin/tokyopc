import { AppBar, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import AboutButton from "./AboutButton";
import GeoSearchBox from "./GeoSearchBox";

const Header: FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} noWrap>
          東京極座標
        </Typography>
        <GeoSearchBox />
        <AboutButton />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
