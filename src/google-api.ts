import { Loader } from "@googlemaps/js-api-loader";

export const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  libraries: [],
});
