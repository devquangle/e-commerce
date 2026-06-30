import { apiAuth } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type {
  ProductRequest,
  ProductResponse,
  ProductDetailResponse,
} from "../types/product.type";
import type { options } from "@/types/options.type";
import type { Pagination } from "@/types/pagination";

const ProductService = {
  async fetchProduct() {
    const res = await apiAuth.get<ApiResponse<ProductResponse[]>>(
      "/api/v1/admin/products",
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch products failed");
    }
    return res.data.data;
  },
  async getById(id: number) {
    const res = await apiAuth.get<ApiResponse<ProductDetailResponse>>(
      `/api/v1/admin/products/${id}`,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch product");
    }
    return res.data.data;
  },
  async create(data: ProductRequest) {
    const res = await apiAuth.post<ApiResponse<ProductResponse>>(
      "/api/v1/admin/products",
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Add product failed");
    }
    return res.data.data;
  },

  async update(id: number, data: ProductRequest) {
    const res = await apiAuth.put<ApiResponse<ProductResponse>>(
      `/api/v1/admin/products/${id}`,
      data,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Update product failed");
    }
    return res.data.data;
  },

  async filterProduct(options?: options) {
    const res = await apiAuth.get<ApiResponse<Pagination<ProductResponse>>>(
      "/api/v1/admin/products/filter",
      { params: options },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch products failed");
    }
    console.log(res);
    return res.data.data;
  },

  async delete(id: number) {
    const res = await apiAuth.delete<ApiResponse<null>>(
      `/api/v1/admin/products/${id}`,
    );
    if (!res.data.success) {
      throw new Error(res.data.message || "Delete product failed");
    }
    return res.data;
  },
};

export default ProductService;
