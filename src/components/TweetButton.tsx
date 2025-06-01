import XIcon from "@mui/icons-material/X";
import { Fab } from "@mui/material";
import { type FC, useContext } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants";
import { HistoryContext } from "../contexts";
import { displayPolarCoordinates } from "../logics";
import {
  selectAddressPreferUserGiven,
  selectCoordinatesCorrespondingToAddress,
} from "../store/selectors";

const TweetButton: FC = () => {
  const coordinates = useSelector(selectCoordinatesCorrespondingToAddress);
  const address = useSelector(selectAddressPreferUserGiven);
  const history = useContext(HistoryContext);

  let tweetLink = BASE_URL;

  if (address != null) {
    const tweetBody = `${address} は、${displayPolarCoordinates(coordinates)}
`;

    const [lng, lat] = coordinates;
    const permalink = `${BASE_URL}/${history.createHref({
      pathname: "/",
      search: new URLSearchParams([
        ["lng", String(lng)],
        ["lat", String(lat)],
      ]).toString(),
    })}`;

    tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetBody,
    )}&url=${encodeURIComponent(permalink)}&hashtags=${encodeURIComponent(
      "東京極座標",
    )}`;
  }

  return (
    <Fab
      aria-label="Xでシェア"
      color="primary"
      disabled={address == null}
      href={tweetLink}
      target="_blank"
      size="medium"
      sx={{
        position: "absolute",
        bottom: "9rem",
        right: (theme) => theme.spacing(2),
      }}
    >
      <XIcon />
    </Fab>
  );
};

export default TweetButton;
