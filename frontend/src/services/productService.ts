import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { ProductRequest, ProductResponse } from "@/types/product.type";
import type { Pagination } from "@/types/pagination";

export type ProductFilterOptions = {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
};

const productService = {
  async add(req: ProductRequest) {
    const res = await apiAuth.post<ApiResponse<ProductResponse>>(
      "/admin/products",
      req,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to add product");
    }
    return res.data.data;
  },

  async update(id: number, req: ProductRequest) {
    const res = await apiAuth.put<ApiResponse<ProductResponse>>(
      `/admin/products/${id}`,
      req,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to update product");
    }
    return res.data.data;
  },

  async getById(id: number) {
    const res = await apiAuth.get<ApiResponse<ProductResponse>>(
      `/admin/products/${id}`,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch product");
    }
    return res.data.data;
  },

  async filter(options?: ProductFilterOptions) {
    const res = await apiAuth.get<ApiResponse<Pagination<ProductResponse>>>(
      "/admin/products/filter",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch products");
    }
    return res.data.data;
  },

  async delete(id: number) {
    const res = await apiAuth.delete<ApiResponse<null>>(
      `/admin/products/${id}`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to delete product");
    }
    return res.data;
  },
};

export default productService;
