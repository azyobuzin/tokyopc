import { Button } from "@mui/material";
import { FC, useContext } from "react";
import { useSelector } from "react-redux";
import { HistoryContext } from "../contexts";
import { calcPolarCoordinates } from "../logics";
import { selectAddress, selectCenterCoordinates } from "../store/selectors";

const TweetButton: FC = () => {
  const centerCoordinates = useSelector(selectCenterCoordinates);
  const address = useSelector(selectAddress);
  const history = useContext(HistoryContext);

  let tweetBody = "";
  if (address != null) {
    tweetBody = `${address}
↓ 皇居からの極座標
${calcPolarCoordinates(centerCoordinates)}
`;
  }

  const permalink =
    "https://tokyopc.azyobuzi.net/" +
    history.createHref({
      pathname: "/",
      search: new URLSearchParams([
        ["lng", String(centerCoordinates[0])],
        ["lat", String(centerCoordinates[1])],
      ]).toString(),
    });

  const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetBody
  )}&url=${encodeURIComponent(permalink)}&hashtags=${encodeURIComponent(
    "東京極座標"
  )}`;

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
