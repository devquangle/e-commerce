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

export const useGenreAll = () => {
  return useQuery<GenreResponse[]>({
    queryKey: ["genres-all"],
    queryFn: genreService.getAllGenres,
  });
};


export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => genreService.createGenre(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GenreRequest }) =>
      genreService.updateGenre(id, data),
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
