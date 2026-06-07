import { useQuery } from "@tanstack/react-query";
import wikipediaService from "@/services/wikipediaService";

export const useWikipediaAuthor = (name: string, enabledFetch: boolean = true) => {
  // Loại bỏ khoảng trắng thừa
  const normalizedName = name?.trim();

  return useQuery({
    queryKey: ["wiki-author", normalizedName],
    queryFn: () => wikipediaService.fetchAuthor(normalizedName),
    enabled: typeof normalizedName === "string" && normalizedName.length > 0 && enabledFetch,
    retry: 1, 
  });
};