import axios from "axios";

export const fetchFromTmdb = async (url) => {
  const tmdbToken = process.env.TMDB_API_KEY;
  const isBearer = tmdbToken && tmdbToken.startsWith("eyJ");
  const headers = isBearer
    ? { accept: "application/json", Authorization: "Bearer " + tmdbToken }
    : { accept: "application/json" };

  const options = { headers, params: {} };
  if (!isBearer && tmdbToken) {
    options.params.api_key = tmdbToken;
  }

  const response = await axios.get(url, options);

  if (response.status !== 200) {
    throw new Error("Failed to fetch data from TMDB" + response.statusText);
  }

  return response.data;
};
