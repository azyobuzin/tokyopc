import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import type { FC } from "react";
import { useSelector } from "react-redux";
import { angleFormat, calcPolarCoordinates, distanceFormat, getDirectionLabel } from "../logics";
import { selectAddress, selectCenterCoordinates } from "../store/selectors";
import TweetButton from "./TweetButton";

const Footer: FC = () => {
  const centerCoordinates = useSelector(selectCenterCoordinates);
  const address = useSelector(selectAddress);
  const { distance, angle } = calcPolarCoordinates(centerCoordinates);
  const direction = getDirectionLabel(angle);

  return (
    <Box sx={{
        alignItems: "end",
        display: "grid",
        gap: 0.5,
        gridTemplateAreas: `
            "label share"
            "distance angle"
            "address direction"`,
        gridTemplateColumns: "1fr max-content",
        paddingBottom: 2,
    }}>
        <Box sx={{ gridArea: "label", overflow: "hidden", paddingLeft: 2, paddingTop: 2 }}>
            <Typography variant="body1" color="textSecondary" noWrap>
                皇居から
            </Typography>
        </Box>
        <Box sx={{ gridArea: "distance", overflow: "hidden", paddingLeft: 2 }}>
            <Typography variant="h5" color="textPrimary" noWrap>
                 {distanceFormat.format(distance)}
            </Typography>
        </Box>
        <Box sx={{ gridArea: "angle", overflow: "hidden", paddingRight: 2, textAlign: "right" }}>
            <Typography variant="h5" color="textPrimary" noWrap>
                {`${angleFormat.format(angle)}°`}
            </Typography>
        </Box>
        <Box sx={{ gridArea: "direction", overflow: "hidden",paddingRight: 2,  textAlign: "right" }}>
            <Typography variant="body2" color="textSecondary" noWrap>
                {direction}
            </Typography>
        </Box>
        <Box sx={{ gridArea: "address", overflow: "hidden", paddingLeft: 2 }}>
            <Typography variant="body2" color="textSecondary" noWrap>
                {address?.address ?? "住所..."}
            </Typography>
        </Box>
        <Box sx={{ gridArea: "share", overflow: "hidden", paddingRight: 1, paddingTop: 1 }}>
            <TweetButton />
        </Box>
    </Box>
  );
};

export default Footer;
