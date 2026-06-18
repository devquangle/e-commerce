import genreService from "@/services/genreService";
import type { GenreRequest, GenreResponse } from "@/types/genre";
import type { options } from "@/types/options.type";
import type { Pagination } from "@/types/pagination";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGenre = () => {
  return useQuery<GenreResponse[]>({
    queryKey: ["genres"],
    queryFn: genreService.fetchGenre,
  });
};

export const useFilterGenre = (options?: options) => {
  return useQuery<Pagination<GenreResponse>>({
    queryKey: ["genres-filter", options],
    queryFn: () => genreService.filterGenre(options),
  });
};

export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => genreService.createGenre(formData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });
    },
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GenreRequest }) =>
      genreService.updateGenre(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });
    },
  });
};

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => genreService.deleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });
    },
  });
};
export const useImportGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => genreService.importGenre(formData),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });

      const serverMessage = response?.message || "Import file thành công.";
      showSuccessToast(serverMessage);

    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm tác giả.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};
