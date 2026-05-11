import genreService from "@/services/genreService";
import type { GenreRequest, GenreResponse, options } from "@/types/genre";
import type { Pagination } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGenre = (options?: options) => {
  return useQuery<Pagination<GenreResponse>>({
    queryKey: ["genres", options],
    queryFn: () => genreService.getGenres(options),
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

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => genreService.deleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });
};
