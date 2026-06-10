import { useQuery } from "@tanstack/react-query";
import GoogleBookService from "@/services/googlebookService";
import type { GoogleBookResponse } from "@/types/googlebook";

export const useFilterGoogleBook = (query: string) => {
  return useQuery<GoogleBookResponse[]>({
    queryKey: ["googleBooks", query],
    queryFn: () => GoogleBookService.filter(query),
    enabled: !!query?.trim(),
  });
};
