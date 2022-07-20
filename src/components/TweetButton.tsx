import { Button } from "@mui/material";
import { FC, useContext } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants";
import { HistoryContext } from "../contexts";
import { calcPolarCoordinates } from "../logics";
import { selectAddress } from "../store/selectors";

const TweetButton: FC = () => {
  const address = useSelector(selectAddress);
  const history = useContext(HistoryContext);

  let tweetLink = BASE_URL;

  if (address != null) {
    const tweetBody = `${address.address}
↓ 皇居からの極座標
${calcPolarCoordinates(address.coordinates)}
`;

    const [lng, lat] = address.coordinates;
    const permalink =
      BASE_URL +
      "/" +
      history.createHref({
        pathname: "/",
        search: new URLSearchParams([
          ["lng", String(lng)],
          ["lat", String(lat)],
        ]).toString(),
      });

    tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetBody
    )}&url=${encodeURIComponent(permalink)}&hashtags=${encodeURIComponent(
      "東京極座標"
    )}`;
  }

  return (
    <Button
      variant="contained"
      disabled={address == null}
      href={tweetLink}
      target="_blank"
      fullWidth
    >
      ツイート
    </Button>
  );
};

export default TweetButton;
