import AuthorService from "@/services/authorService";
import type { AuthorReq, AuthorRes } from "@/types/author";
import type { Pagination } from "@/types/pagination";
import type { options } from "@/types/genre";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";

export const useAuthor = () => {
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

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: AuthorReq) => AuthorService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });

      showSuccessToast("Thêm mới tác giả thành công!");
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

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id,req}:{id:number,req: AuthorReq}) => AuthorService.update(id,req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });

      showSuccessToast("Cập nhật tác giả thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật tác giả.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};