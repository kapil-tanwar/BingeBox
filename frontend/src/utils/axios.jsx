import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    accept: "application/json",
    Authorization:
      // `Bearer` + tmdbApiKey,
      `Bearer REMOVED_SECRET,
  },
});

export default instance;
