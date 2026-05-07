import genreService from "@/services/genreService";
import type { GenreRequest, GenreResponse } from "@/types/genre";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGenre = () => {
  return useQuery<GenreResponse[]>({
    queryKey: ["genres"],
    queryFn: genreService.getGenres,
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
