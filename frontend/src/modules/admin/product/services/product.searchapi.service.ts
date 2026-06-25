import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { ProductSearchApiResponse } from "../types/product.searchapi.type";

const ProductSearchApiService = {
  async getUrlImages(name: string) {
    const res = await apiGuest.post<ApiResponse<ProductSearchApiResponse>>(
      "/public/book-images",
      {
        name,
      },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to book-images metadata");
    }

    return res.data.data;
  },
};

export default ProductSearchApiService;
