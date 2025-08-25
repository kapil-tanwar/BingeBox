import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import api from "../utils/api";

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null);
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrendingContent = async () => {
      try {
        const res = await api.get(`/${contentType}/trending`);
        setTrendingContent(res.data.content);
      } catch (error) {
        console.error("Failed to fetch trending content:", error);
        setTrendingContent(null);
      }
    };

    getTrendingContent();
  }, [contentType]);

  return { trendingContent };
};
export default useGetTrendingContent;
