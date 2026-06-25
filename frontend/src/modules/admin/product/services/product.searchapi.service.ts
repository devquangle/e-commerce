import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { ProductSearchApiResponse } from "../types/product.searchapi.type";

const ProductSearchApiService = {
  async getUrlImages(name: string) {
    const res = await apiGuest.get<ApiResponse<ProductSearchApiResponse>>(
      "/public/book-images",
      {
        params: { name },
      },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Failed to fetch book images");
    }

    return res.data.data;
  },
};

export default ProductSearchApiService;
