import type { Pagination } from "@/types/pagination";
import type { ProductCard } from "@/types/product.card.type";
import { useQuery } from "@tanstack/react-query";
import ProductSearchService from "../services/product.search.service";
import type { ProductFilterOptions } from "../types/product.filter.options";

export const useProductSearch = (options?: ProductFilterOptions) => {
  return useQuery<Pagination<ProductCard>>({
    queryKey: ["products-search", options],
    queryFn: () => ProductSearchService.search(options),
  });
};
