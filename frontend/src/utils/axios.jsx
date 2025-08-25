import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  headers: {
    accept: "application/json",
    Authorization:
      // `Bearer` + tmdbApiKey,
      `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOTVkMjY2OWQ1ZmMyZmNiZDg2NGE0OGE2ZmJmNThkNyIsIm5iZiI6MTcyMzkxODU5My4wOTEzNzYsInN1YiI6IjY2YzBkMGQyN2JjOTQ5ODZmNDkyMTk2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.e7s-jNvNlOI5-HvNqagfPsUD-AteZu3xRW2fys1rsvE`,
  },
});

export default instance;
