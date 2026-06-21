import { apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { Pagination } from "@/types/pagination";
import type { ProductCard } from "@/types/product.card.type";
import type { ProductFilterOptions } from "../types/product.filter.options";

const ProductSearchService = {
  async search(options?: ProductFilterOptions) {
    const res = await apiGuest.get<ApiResponse<Pagination<ProductCard>>>(
      "/products/search",
      {
        params: options,
      },
    );

    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Fetch products failed");
    }

    return res.data.data;
  },
};

export default ProductSearchService;
