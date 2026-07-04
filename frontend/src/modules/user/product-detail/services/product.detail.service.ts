import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { ProductResponse } from "../types/product-detail.type";

const ProductDetailService = {
  async getProductBySlug(slug: string) {
    const res = await apiGuest.get<ApiResponse<ProductResponse>>(
      `/api/v1/products`,
      { params: { slug } },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch product");
    }
    return res.data.data;
  },
};

export default ProductDetailService;
