import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { type FC, startTransition, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { setCenterCoordinates } from "../store/actions";

interface State {
  isBusy: boolean;
  error: string | null;
}

const initialState: State = {
  isBusy: false,
  error: null,
};

const MyLocationButton: FC = () => {
  const dispatch = useDispatch();
  const [{ isBusy, error }, setState] = useState(initialState);

  const handleClick = useCallback(() => {
    startTransition(() => setState({ isBusy: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        dispatch(
          setCenterCoordinates([pos.coords.longitude, pos.coords.latitude]),
        );
        setState({ isBusy: false, error: null });
      },
      (err) => setState({ isBusy: false, error: err.message }),
      { maximumAge: 5000, timeout: 30000 },
    );
  }, [dispatch]);

  const handleSnackbarClose = useCallback(
    () => setState((state) => ({ ...state, error: null })),
    [],
  );

  return (
    <>
      <button
        title="現在地に移動"
        type="button"
        aria-busy={isBusy}
        disabled={isBusy}
        onClick={handleClick}
      >
        {isBusy ? (
          // TODO: ちょっと経っても結果が返ってこなかったらぐるぐるにしたい。一瞬で返ってくるとチラつく
          <CircularProgress size="0.8em" />
        ) : (
          <MyLocationIcon fontSize="inherit" />
        )}
      </button>
      {/* TODO: 共通の Global Snackbar をつくる */}
      {error &&
        createPortal(
          <Snackbar open autoHideDuration={5000} onClose={handleSnackbarClose}>
            <Alert
              onClose={handleSnackbarClose}
              severity="error"
              sx={{ width: "100%" }}
              elevation={6}
              variant="filled"
            >
              {error}
            </Alert>
          </Snackbar>,
          document.body,
        )}
    </>
  );
};

export default MyLocationButton;
