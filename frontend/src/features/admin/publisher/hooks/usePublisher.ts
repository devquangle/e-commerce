
import type { PublisherRequest, PublisherResponse } from "../types/publisher.type";
import type { Pagination } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";
import type { options } from "@/types/options.type";
import PublisherService from "../services/publisher.service";

export const usePublisher = () => {
  return useQuery<PublisherResponse[]>({
    queryKey: ["publishers"],
    queryFn: PublisherService.fetchPublisher,
  });
};
export const useFilterPublisher = (options?: options) => {
  return useQuery<Pagination<PublisherResponse>>({
    queryKey: ["publishers-filter", options],
    queryFn: () => PublisherService.filterPublisher(options),
  });
};

export const useCreatePublisher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PublisherRequest) => PublisherService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers-filter"] });

      showSuccessToast("Thêm mới nhà xuất bản thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm nhà xuất bản.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useUpdatePublisher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id,req}:{id:number,req: PublisherRequest}) => PublisherService.update(id,req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers-filter"] });

      showSuccessToast("Cập nhật nhà xuất bản thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật nhà xuất bản.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useDeletePublisher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => PublisherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publishers-filter"] });
      showSuccessToast("Xóa nhà xuất bản thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi xóa nhà xuất bản.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};