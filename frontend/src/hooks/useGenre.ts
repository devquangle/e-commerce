import genreService from "@/services/genreService";
import type { GenreRequest, GenreResponse, options } from "@/types/genre";
import type { Pagination } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGenre = (options?: options) => {
  return useQuery<Pagination<GenreResponse>>({
    queryKey: ["genres", options],
    queryFn: () => genreService.getGenres(options),
    staleTime: 1000 * 30,
  });
};

export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenreRequest) => genreService.createGenre(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });
};
