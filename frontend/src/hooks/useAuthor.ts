import AuthorService from "@/services/authorService";
import type { AuthorRes } from "@/types/author";
import type { Pagination } from "@/types/pagination";
import type { options } from "@/types/status";
import { useQuery } from "@tanstack/react-query";

export const useAuthor   = () => {
  return useQuery<AuthorResponse[]>({
    queryKey: ["authors"],
    queryFn: AuthorService.getAuthors,
  });
};
export const useFilterAuthor = (options?: options) => {
  return useQuery<Pagination<AuthorRes>>({
    queryKey: ["authors", options],
    queryFn: () => AuthorService.filterAuthor(options),
  });
};


