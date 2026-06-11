import productService, { type ProductFilterOptions } from "@/services/productService";
import type { ProductRequest, ProductResponse } from "@/types/product.type";
import type { Pagination } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import axios from "axios";

// ─── Query: lấy danh sách phân trang ───────────────────────────────────────
export const useFilterProduct = (options?: ProductFilterOptions) => {
  return useQuery<Pagination<ProductResponse>>({
    queryKey: ["products", options],
    queryFn: () => productService.filter(options),
  });
};

// ─── Query: lấy chi tiết sản phẩm theo id ──────────────────────────────────
export const useProductById = (id: number | undefined) => {
  return useQuery<ProductResponse>({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id!),
    enabled: !!id,
  });
};

// ─── Mutation: thêm sản phẩm ───────────────────────────────────────────────
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: ProductRequest) => productService.add(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSuccessToast("Thêm sản phẩm thành công!");
    },
    onError: (error: unknown) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi thêm sản phẩm.";
      showErrorToast(msg);
    },
  });
};

// ─── Mutation: cập nhật sản phẩm ───────────────────────────────────────────
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, req }: { id: number; req: ProductRequest }) =>
      productService.update(id, req),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      showSuccessToast("Cập nhật sản phẩm thành công!");
    },
    onError: (error: unknown) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi cập nhật sản phẩm.";
      showErrorToast(msg);
    },
  });
};

// ─── Mutation: xóa sản phẩm ────────────────────────────────────────────────
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSuccessToast("Xóa sản phẩm thành công!");
    },
    onError: (error: unknown) => {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi xóa sản phẩm.";
      showErrorToast(msg);
    },
  });
};
