import { Box, Paper, Typography } from "@mui/material";
import type { FC, Ref } from "react";
import { useSelector } from "react-redux";
import {
  angleFormat,
  calcPolarCoordinates,
  distanceFormat,
  getDirectionLabel,
} from "../logics";
import { selectAddress, selectCenterCoordinates } from "../store/selectors";

const LocationCard: FC<{ ref?: Ref<HTMLDivElement> }> = ({ ref }) => {
  const centerCoordinates = useSelector(selectCenterCoordinates);
  const address = useSelector(selectAddress);
  const { distance, angle } = calcPolarCoordinates(centerCoordinates);
  const direction = getDirectionLabel(angle);

  return (
    <Paper
      ref={ref}
      elevation={6}
      sx={{
        // フローティングカード
        position: "absolute",
        bottom: (theme) => theme.spacing(2),
        right: (theme) => theme.spacing(2),
        width: (theme) => `calc(100% - ${theme.spacing(4)})`,
        maxWidth: "30rem",

        // コンテンツのGrid設定
        display: "grid",
        gap: 0.5,
        gridTemplateAreas: `
            "label label"
            "distance angle"
            "address direction"`,
        gridTemplateColumns: "1fr max-content",
        alignItems: "end",
        paddingBottom: 2,
      }}
    >
      <Box
        sx={{
          gridArea: "label",
          overflow: "hidden",
          paddingLeft: 2,
          paddingTop: 2,
        }}
      >
        <Typography
          component="span"
          variant="body2"
          color="textSecondary"
          noWrap
        >
          皇居から
        </Typography>
      </Box>
      <Box sx={{ gridArea: "distance", overflow: "hidden", paddingLeft: 2 }}>
        <Typography component="span" variant="h5" color="textPrimary" noWrap>
          {distanceFormat.format(distance)}
        </Typography>
      </Box>
      <Box
        sx={{
          gridArea: "angle",
          overflow: "hidden",
          paddingRight: 2,
          textAlign: "right",
        }}
      >
        <Typography component="span" variant="h5" color="textPrimary" noWrap>
          {`${angleFormat.format(angle)}°`}
        </Typography>
      </Box>
      <Box
        sx={{
          gridArea: "direction",
          overflow: "hidden",
          paddingRight: 2,
          textAlign: "right",
        }}
      >
        <Typography
          component="span"
          variant="body2"
          color="textSecondary"
          noWrap
        >
          {direction}
        </Typography>
      </Box>
      <Box sx={{ gridArea: "address", overflow: "hidden", paddingLeft: 2 }}>
        <Typography
          component="span"
          variant="body2"
          color="textSecondary"
          noWrap
        >
          {address?.address ?? "住所..."}
        </Typography>
      </Box>
    </Paper>
  );
};

export default LocationCard;
