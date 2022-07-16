import { Button } from "@mui/material";
import { FC } from "react";

interface TweetButtonProps {
  polarCoordinates: string;
  address: string | null;
}

const TweetButton: FC<TweetButtonProps> = ({ polarCoordinates, address }) => {
  let tweetBody = "";
  if (address != null) {
    tweetBody = `${address}
↓ 皇居からの極座標
${polarCoordinates}
`;
  }

  const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetBody
  )}&url=${encodeURIComponent(
    "https://tokyopc.azyobuzi.net"
  )}&hashtags=${encodeURIComponent("東京極座標")}`;

  return (
    <Button
      variant="contained"
      disabled={address == null}
      href={tweetLink}
      target="_blank"
    >
      ツイート
    </Button>
  );
};

export default TweetButton;
