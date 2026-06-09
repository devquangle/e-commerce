import SeriesService from "@/services/seriesService";
import type { SeriesRequest, SeriesResponse } from "@/types/series";
import type { Pagination } from "@/types/pagination";
import type { options } from "@/types/genre";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";

export const useSeries = () => {
  return useQuery<SeriesResponse[]>({
    queryKey: ["series"],
    queryFn: SeriesService.fetchSeries,
  });
};

export const useFilterSeries = (options?: options) => {
  return useQuery<Pagination<SeriesResponse>>({
    queryKey: ["series", options],
    queryFn: () => SeriesService.filterSeries(options),
  });
};

export const useCreateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: SeriesRequest) => SeriesService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
      showSuccessToast("Thêm mới series thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm series.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useUpdateSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, req }: { id: number; req: SeriesRequest }) =>
      SeriesService.update(id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
      showSuccessToast("Cập nhật series thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật series.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useDeleteSeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SeriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
      showSuccessToast("Xóa series thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi xóa series.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};
