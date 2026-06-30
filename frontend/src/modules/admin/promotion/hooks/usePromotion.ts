import type { Pagination } from "@/types/pagination";
import type { PromotionFilter } from "../types/promotion.search.type";
import type {
  PromotionRequest,
  PromotionResponse,
  PromotionDetailResponse,
} from "../types/promotion.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PromotionService from "../services/promotion.service";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";

export const useSearchPromotion = (options?: PromotionFilter) => {
  return useQuery<Pagination<PromotionResponse>>({
    queryKey: ["promotion-search", options],
    queryFn: () => PromotionService.search(options),
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PromotionRequest) => PromotionService.create(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotion-search"] });
      showSuccessToast("Thêm chương trình khuyến mãi thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi thêm chương trình khuyến mãi.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};

export const useGetPromotionDetail = (id: number) => {
  return useQuery<PromotionDetailResponse>({
    queryKey: ["promotion-detail", id],
    queryFn: () => PromotionService.edit(id),
    enabled: !!id && !isNaN(id),
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, req }: { id: number; req: PromotionRequest }) =>
      PromotionService.update(id, req),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["promotion-search"] });
      queryClient.invalidateQueries({ queryKey: ["promotion-detail", id] });

      showSuccessToast("Cập nhật chương trình khuyến mãi thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi cập nhật chương trình khuyến mãi.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};
