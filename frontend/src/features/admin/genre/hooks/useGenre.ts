

import type { Pagination } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";

import GenreService from "../services/genre.service";
import type { GenreRequest, GenreResponse } from "../types/genre.type";
import type { options } from "@/types/options.type";

export const useGenre = () => {
  return useQuery<GenreResponse[]>({
    queryKey: ["genres"],
    queryFn: GenreService.fetchGenre,
  });
};
export const useFilterGenre = (options?: options) => {
  return useQuery<Pagination<GenreResponse>>({
    queryKey: ["genres-filter", options],
    queryFn: () => GenreService.filterGenre(options),
  });
};

export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: GenreRequest) => GenreService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });

      showSuccessToast("Thêm mới thể loại thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm thể loại.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id,req}:{id:number,req: GenreRequest}) => GenreService.update(id,req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });

      showSuccessToast("Cập nhật thể loại thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật thể loại.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => GenreService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });
      showSuccessToast("Xóa thể loại thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi xóa thể loại.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};export const useImportGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => GenreService.importGenre(formData),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["genres-filter"] });

      const serverMessage = response?.message || "Import file thành công.";
      showSuccessToast(serverMessage);

    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi import thể loại.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};