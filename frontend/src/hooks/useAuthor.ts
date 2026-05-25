import AuthorService from "@/services/authorService";
import type { AuthorResponse } from "@/types/author";
import { useQuery } from "@tanstack/react-query";

export const useAuthor   = () => {
  return useQuery<AuthorResponse[]>({
    queryKey: ["authors"],
    queryFn: AuthorService.getAuthors,
  });
};


