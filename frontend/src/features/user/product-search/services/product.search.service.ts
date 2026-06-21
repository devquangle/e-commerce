import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { Pagination } from "@/types/pagination";
import type { ProductCard } from "@/types/product.card.type";
import type { ProductFilterOptions } from "../types/product.filter.options";

const ProductSearchService = {
  async search(options?: ProductFilterOptions) {
    const params: any = { ...options };

    // Backend expects 0-indexed page, frontend uses 1-indexed
    if (params.page) {
      params.page = Math.max(0, params.page - 1);
    }

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
    console.log(res.data.data.items);
    

    return res.data.data;
  },
};

export default ProductSearchService;
