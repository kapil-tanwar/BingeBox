import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import api from "../utils/api";

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  const { contentType } = useContentStore();

  useEffect(() => {
    let alive = true;
    // Clear first so a previous content type never flashes under the new one.
    setTrendingContent(null);

    const getTrendingContent = async () => {
      try {
        const res = await api.get(`/${contentType}/trending`);
        if (alive) setTrendingContent(res.data.content);
      } catch (error) {
        console.error("Failed to fetch trending content:", error);
        if (alive) setTrendingContent(null);
      }
    };

    getTrendingContent();
    return () => {
      alive = false;
    };
  }, [contentType]);

  return { trendingContent };
};
export default useGetTrendingContent;
