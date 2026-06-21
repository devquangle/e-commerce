import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { Pagination } from "@/types/pagination";
import type { ProductCard } from "@/types/product.card.type";
import type { ProductFilterOptions } from "../types/product.filter.options";

const ProductSearchService = {
  async search(options?: ProductFilterOptions) {
    const params: any = { ...options };

    if (options?.genres && Array.isArray(options.genres)) {
      params.genres = options.genres.join(',');
    }
    if (options?.authors && Array.isArray(options.authors)) {
      params.authors = options.authors.join(',');
    }

    const res = await apiGuest.get<ApiResponse<Pagination<ProductCard>>>(
      "/api/v1/products/search",
      {
        params,
      },
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch products failed");
    }

    return res.data.data;
  },
};

export default ProductSearchService;
