import productService, { type ProductFilterOptions } from "@/services/productService";
import type { ProductResponse } from "@/types/product.type";
import type { Pagination } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";

export const useFilterProduct = (options?: ProductFilterOptions) => {
  return useQuery<Pagination<ProductResponse>>({
    queryKey: ["products", options],
    queryFn: () => productService.filter(options),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSuccessToast("Xóa sản phẩm thành công!");
    },
    onError: (error: unknown) => {
      let errorMsg = "Đã xảy ra lỗi khi xóa sản phẩm.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || error.message || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      showErrorToast(errorMsg);
    },
  });
};
