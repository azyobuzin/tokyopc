import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  CircularProgress,
  InputBase,
  Snackbar,
  alpha,
  styled,
} from "@mui/material";
import { type FC, type FormEvent, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSearchError, searchGeocode } from "../../store/actions";
import { selectIsSearching, selectSearchError } from "../../store/selectors";

const GeoSearchBox: FC = () => {
  const isSearching = useSelector(selectIsSearching);
  const searchError = useSelector(selectSearchError);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (ev: FormEvent): void => {
      ev.preventDefault();
      const query = inputRef.current?.value;
      if (query && query.length > 0) {
        dispatch(searchGeocode(query));
      }
    },
    [dispatch],
  );

  const handleSnackbarClose = useCallback(
    () => dispatch(clearSearchError()),
    [dispatch],
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: formにrole="search"を指定するのは正しい使い方
    <Search onSubmit={handleSubmit} role="search">
      <SearchIconWrapper>
        {isSearching ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          <SearchIcon />
        )}
      </SearchIconWrapper>
      <StyledInputBase
        inputRef={inputRef}
        placeholder="地名で検索"
        inputMode="search"
        inputProps={{ enterKeyHint: "search" }}
      />
      {searchError && (
        <Snackbar open autoHideDuration={5000} onClose={handleSnackbarClose}>
          <Alert
            onClose={handleSnackbarClose}
            severity={searchError === "Error" ? "error" : "info"}
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            {errorMessages[searchError]}
          </Alert>
        </Snackbar>
      )}
    </Search>
  );
};

export default GeoSearchBox;

const errorMessages = {
  Error: "検索中にエラーが発生しました",
  NotFound: "入力された地名が見つかりませんでした",
} as const;

// https://mui.com/material-ui/react-app-bar/#app-bar-with-search-field
const Search = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "30vw",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
